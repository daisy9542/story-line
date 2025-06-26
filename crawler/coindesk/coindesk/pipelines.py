# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
import csv

from itemadapter import ItemAdapter


class CoindeskPipeline:
    def __init__(self):
        self.conindesk_file = open('coindesk_com.csv', 'a', encoding='utf8', newline='')
        self.tag = ['url', 'title', 'pub_time', 'content']
        self.writer = csv.DictWriter(self.conindesk_file, fieldnames=self.tag)
        self.writer.writeheader()

    def process_item(self, item, spider):

        self.writer.writerow(item)
        return item

    def close_spider(self, spider):
        self.conindesk_file.close()
        pass