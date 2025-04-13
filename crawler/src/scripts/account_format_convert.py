"""
将账号格式 (https://www.zhanghaoya.com/goods/1244876468522084354.html)
- 账号;密码;邮箱;邮箱密码;token;ct0;2FA链接
转换为 =>
- 账号:密码:邮箱:邮箱密码:auth_token=token; ct0=ct0
"""

input_file = "accounts/raw_accounts.txt"
output_file = "accounts/accounts.txt"

with open(input_file, "r", encoding="utf-8") as fin, open(output_file, "w", encoding="utf-8") as fout:
    for line in fin:
        line = line.strip()
        if not line or line.startswith("#"):  # 跳过空行或注释
            continue

        parts = line.split(";")
        if len(parts) < 6:
            print(f"格式错误：{line}")
            continue

        nickname, password, email, email_password, ct0, auth_token = parts[:6]

        formatted_line = f"{nickname}:{password}:{email}:{email_password}:auth_token={auth_token}; ct0={ct0}"
        fout.write(formatted_line + "\n")
