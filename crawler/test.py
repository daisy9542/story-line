import json
from pathlib import Path
from src.utils import get_latest_file

VALUABLE_USERS_DIR = "data/valuable_users/"
NEW_FOLLOWS_FILE = "data/follows/follows_by_valuable_20250401_171528.jsonl"  # 替换为你的实际路径

# 加载有价值用户 ID 集合
valuable_user_ids = set()
valuable_file = get_latest_file(VALUABLE_USERS_DIR)

with open(valuable_file, "r", encoding="utf-8") as f:
    for line in f:
        try:
            data = json.loads(line)
            valuable_user_ids.add(int(data["id"]))
        except Exception as e:
            print(f"解析有价值用户文件出错：{e}")

print(f"加载有价值用户数：{len(valuable_user_ids)}")

# 验证 NEW_FOLLOWS_FILE 中的 ID 是否都在有价值用户列表中
bad_entries = []

with open(NEW_FOLLOWS_FILE, "r", encoding="utf-8") as f:
    for line_num, line in enumerate(f, start=1):
        try:
            data = json.loads(line)
            main_user = int(data["id"])
            following = data.get("following", [])

            if main_user not in valuable_user_ids:
                bad_entries.append((line_num, main_user, "主用户不在有价值列表"))

            for fid in following:
                if fid not in valuable_user_ids:
                    bad_entries.append((line_num, fid, "关注对象不在有价值列表"))

        except Exception as e:
            print(f"[行 {line_num}] 解析失败：{e}")

# 打印异常情况
if bad_entries:
    print(f"\n发现 {len(bad_entries)} 个不在有价值列表的用户 ID：")
    for line_num, uid, msg in bad_entries:
        print(f"行 {line_num} - 用户 ID: {uid} - {msg}")
else:
    print("\n所有 ID 均在有价值用户列表中")
