# -*- coding: utf-8 -*-
import re
from urllib.parse import urljoin
from ..items import CoindeskItem
import scrapy


class CoindeskComSpider(scrapy.Spider):

    # scrapy crawl coindesk_com

    # 断点续爬
    # scrapy crawl coindesk_com -s JOBDIR=crawls/coindesk_com-1

    name = 'coindesk_com'

    allowed_domains = ['coindesk.com']
    index_url = 'https://www.coindesk.com/'
    custom_settings = {
        'CONCURRENT_REQUESTS': 100,  # 多少个并发请求
        'DOWNLOAD_DELAY': 0.2,  # 请求间隔
        'DOWNLOAD_TIMEOUT': 30,
    }

    def start_requests(self):
        # 普通板块
        section_item = [
            'business',
            'markets',
            'tech',
            'policy',
            'latest-crypto-news',  # latest板块
        ]
        for section in section_item:
            link = f'https://www.coindesk.com/{section}'
            yield scrapy.Request(link, callback=self.parse_normal, meta={'section_type': section})
        # focus板块
        focus_link = 'https://www.coindesk.com/focus'
        yield scrapy.Request(focus_link, callback=self.parse_focus)

    def parse_normal(self, response):
        section = response.meta['section_type']
        # 首页的文章
        first_page_article = response.xpath('//h2/../@href').getall()
        for article_link in first_page_article:
            yield scrapy.Request(response.urljoin(article_link), callback=self.parse_detail)
        # api翻页
        if section != 'latest-crypto-news':
            last_id = re.search(r'self\.__next_f\.push\(\[1,"17:.*"_id\\":\\"(.*?)\\"', response.text)
            if not last_id:
                return
            last_id = last_id.group(1)
            last_display = re.search(r'self\.__next_f\.push\(\[1,"17:.*"displayDate\\":\\"(.*?)\\"', response.text).group(1)
            api_link = f'https://www.coindesk.com/api/v1/articles/section?size=16&lastId={last_id}&lastDisplayDate={last_display}&lang=en&section={section}'
        else:
            last_id = re.search(r'self\.__next_f\.push\(\[1,"6:.*"_id\\":\\"(.*?)\\"', response.text).group(1)
            if not last_id:
                return
            last_display = re.search(r'self\.__next_f\.push\(\[1,"6:.*"displayDate\\":\\"(.*?)\\"', response.text).group(1)
            api_link = f'https://www.coindesk.com/api/v1/articles/timeline?size=16&lastId={last_id}&lastDisplayDate={last_display}&lang=en'
        yield scrapy.Request(api_link, callback=self.parse_api, meta={'section_type': section})

    def parse_api(self, response):
        section = response.meta['section_type']
        article_list = response.json()['articles']
        if not article_list:
            return
        for item in article_list:
            item_link = item['pathname']
            article_link = urljoin(self.index_url, item_link)
            yield scrapy.Request(article_link, callback=self.parse_detail)
        # 翻页
        last_item = article_list[-1]
        last_id = last_item['_id']
        last_display = last_item['articleDates']['displayDate']
        if section != 'latest-crypto-news':
            next_page = f'https://www.coindesk.com/api/v1/articles/section?size=16&lastId={last_id}&lastDisplayDate={last_display}&lang=en&section={section}'
        else:
            next_page = f'https://www.coindesk.com/api/v1/articles/timeline?size=16&lastId={last_id}&lastDisplayDate={last_display}&lang=en'
        yield scrapy.Request(next_page, callback=self.parse_api, meta={'section_type': section})

    def parse_focus(self, response):
        # 首页的文章模块
        first_page_article = response.xpath('//h2/../@href').getall()
        for article_link in first_page_article:
            yield scrapy.Request(response.urljoin(article_link), callback=self.parse_focus_next)

    def parse_focus_next(self, response):
        # 首页的文章
        first_page_article = response.xpath('//h2/../@href').getall()
        for article_link in first_page_article:
            yield scrapy.Request(response.urljoin(article_link), callback=self.parse_detail)
        # 翻页
        pages = response.xpath('//span[contains(text(),"Page")]/..//a/@href').getall()
        for page in pages:
            yield scrapy.Request(response.urljoin(page), callback=self.parse_focus_next)

    def parse_detail(self, response):
        item = CoindeskItem()
        title = response.xpath('//h1/text()').get()
        pub_time = re.search(r'"datePublished":"(.*?)"', response.text).group(1)

        text_in_list = response.xpath('//div[@data-module-name="article-body"]//p//text()').getall()
        content = ' '.join([i for i in text_in_list])
        item['url'] = response.url
        item['title'] = title
        item['pub_time'] = pub_time
        item['content'] = content
        yield item
