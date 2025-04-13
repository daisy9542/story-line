"""
将 jsonl 数据加载到 MySQL 数据库
"""
import json
import mysql.connector
from datetime import datetime

from src.utils import get_config, get_latest_file

config = get_config()
HOST = config.get("host")
USER = config.get("user")
PASSWORD = config.get("password")
DATABASE = config.get("database")
PORT = config.get("port")
VALUABLE_USERS_DIR = "data/valuable_users/"
TWEETS_DIR = "data/tweets/"


def load_valuable_users(cursor):
    valuable_users_latest_file = get_latest_file(VALUABLE_USERS_DIR)
    with open(valuable_users_latest_file, 'r', encoding='utf-8') as f:
        for line in f:
            data = json.loads(line)
    
            # 转换时间戳
            created_time = datetime.fromtimestamp(data['created'] / 1000)
    
            # 插入数据
            cursor.execute('''
                INSERT INTO valuable_users (
                    id, username, name, verified, verified_type, followers,
                    bio, created, friends_count, statuses_count,
                    favourites_count, listed_count, media_count
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ''', (
                data['id'],
                data['username'],
                data['name'],
                data['verified'],
                data['verified_type'],
                data['followers'],
                data['bio'],
                created_time,
                data['friendsCount'],
                data['statusesCount'],
                data['favouritesCount'],
                data['listedCount'],
                data['mediaCount']
            ))
    
    
if __name__ == '__main__':
    # 连接数据库
    conn = mysql.connector.connect(
        host=HOST,
        user=USER,
        password=str(PASSWORD),
        database=DATABASE,
        port=PORT,
    )
    cursor = conn.cursor()
    
    load_valuable_users(cursor)  # 加载有价值用户
    
    conn.commit()
    cursor.close()
    conn.close()
