1. pip install scrapy
2. 代理部分在coindesk/middlewares.py， MyProxyMiddleWare或者ProxyMiddleWare
3. 代理开启在settings.py  DOWNLOADER_MIDDLEWARES
4. 运行命令：scrapy crawl coindesk_com
5. 并发设置可在spiders/coindesk_com.py中custom_settings进行调整
6. 结果保存为coindesk_com.csv
