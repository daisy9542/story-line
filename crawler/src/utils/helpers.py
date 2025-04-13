from datetime import datetime
from typing import Union

import yaml
import os
import glob

from twscrape import TextLink, Place, SummaryCard, PollCard, BroadcastCard, AudiospaceCard


def get_verified_type(user):
    if hasattr(user, "verifiedType") and user.verifiedType:
        return user.verifiedType
    elif user.blue:
        return "blue"
    elif user.verified:
        return "legacy"
    else:
        return "none"


def get_worker_idx(user_id: int, concurrency: int) -> int:
    return hash(str(user_id)) % concurrency


def load_keywords(path: str) -> list[str]:
    with open(path, "r", encoding="utf-8") as f:
        return [line.strip() for line in f if line.strip()]


def get_time_tag() -> str:
    return datetime.now().strftime("%Y%m%d_%H%M%S")


def get_config(path: str = "config/settings.yaml") -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def get_latest_file(path: str, prefix: str = "", suffix: str = ".jsonl") -> str:
    """ 获取某目录下最新的文件，根据文件修改时间判断 """
    pattern = os.path.join(path, f"{prefix}*{suffix}")
    files = glob.glob(pattern)
    if not files:
        raise FileNotFoundError(f"⚠️ 未找到任何匹配文件：{pattern}")
    return max(files, key=os.path.getmtime)


def serialize_links(links: list[TextLink]):
    if not links:
        return []
    return [
        {
            "url": link.url,
            "text": link.text,
            "tcourl": link.tcourl,
        }
        for link in links
    ]


def serialize_place(place: Place):
    if place is None:
        return None
    return {
        "id": place.id,
        "full_name": place.fullName,
        "name": place.name,
        "type": place.type,
        "country": place.country,
        "country_code": place.countryCode,
    }


def serialize_card(card: Union[None, "SummaryCard", "PollCard", "BroadcastCard", "AudiospaceCard"]):
    if card is None:
        return None
    
    base = {
        "type": getattr(card, "_type", "unknown"),
        "url": getattr(card, "url", None),
    }
    
    if card._type == "summary":
        base.update({
            "title": getattr(card, "title", None),
            "description": getattr(card, "description", None),
            "vanity_url": getattr(card, "vanityUrl", None),
            "photo_url": getattr(getattr(card, "photo", None), "url", None),
            "video_url": getattr(getattr(card, "video", None), "url", None),
        })
    elif card._type == "poll":
        base.update({
            "options": [
                {
                    "label": getattr(option, "label", None),
                    "count": getattr(option, "count", None),
                    "position": getattr(option, "position", None),
                }
                for option in getattr(card, "options", [])
            ],
            "finished": getattr(card, "finished", None)
        })
    elif card._type == "broadcast":
        base.update({
            "title": getattr(card, "title", None),
            "photo_url": getattr(getattr(card, "photo", None), "url", None),
        })
    elif card._type == "audiospace":
        # already has "url"
        pass
    else:
        base.update({"raw": card.__dict__})  # fallback
    
    return base
