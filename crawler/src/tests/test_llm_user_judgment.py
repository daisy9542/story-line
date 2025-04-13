import asyncio
import json
from src.utils import call_llm

TESTSET_PATH = "data/llm_user_relevance_eval.jsonl"


def load_testset(path: str) -> list:
    with open(path, "r", encoding="utf-8") as f:
        return [json.loads(line) for line in f]


def build_prompt(bio: str, tweets: list[str]) -> str:
    return f"""请判断此用户是否从事与区块链 / Web3 / 加密货币相关的工作或研究。如果相关，仅返回 True，否则仅返回 False。

【用户简介】：
{bio}

【最近推文】：
{chr(10).join(f'- {t}' for t in tweets)}

请你只返回 True 或 False。
"""


async def run_testset():
    samples = load_testset(TESTSET_PATH)
    passed = 0
    failed = 0
    print(f"🧪 正在测试 {len(samples)} 条样例...\n")
    
    for i, sample in enumerate(samples):
        prompt = build_prompt(sample["bio"], sample["tweets"])
        try:
            result = await call_llm(prompt)
            pred = result.strip().lower() == "true"
        except Exception as e:
            print(f"❌ 样例 {i + 1} 调用失败：{e}")
            failed += 1
            continue
        
        expected = sample["expected"]
        if pred == expected:
            print(f"✅ 样例 {i + 1} 通过")
            passed += 1
        else:
            print(f"❌ 样例 {i + 1} 错误，预测: {pred}，应为: {expected}")
            failed += 1
    
    print(f"\n✅ 测试完成！通过: {passed}，失败: {failed}，准确率: {passed / len(samples):.2%}")


if __name__ == "__main__":
    asyncio.run(run_testset())
