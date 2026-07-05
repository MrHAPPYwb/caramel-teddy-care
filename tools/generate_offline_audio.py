"""Generate every finite speech line used by the game as local MP3 files."""

from __future__ import annotations

import asyncio
import hashlib
import json
import re
import sys
from pathlib import Path

import edge_tts


ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
OUT = ROOT / "assets" / "audio" / "voice"
MANIFEST = ROOT / "assets" / "audio" / "voice-manifest.js"

VOICES = {
    "pet|zh-CN": ("zh-CN-XiaoyiNeural", "+8%", "+18Hz"),
    "narrator|zh-CN": ("zh-CN-XiaoxiaoNeural", "-2%", "+0Hz"),
    "narrator|en-US": ("en-US-JennyNeural", "-3%", "+0Hz"),
}

PINYIN = {
    "b": "播",
    "p": "坡",
    "m": "摸",
    "f": "佛",
    "d": "得",
    "t": "特",
    "n": "讷",
    "l": "勒",
    "g": "哥",
    "k": "科",
    "h": "喝",
    "j": "鸡",
}

PET_LINES = {
    "我有点饿了，想吃一点小点心。",
    "我想洗香香，变成软软的小云朵。",
    "我有点想你，陪陪我好吗？",
    "我有点困了，想听晚安故事。",
    "我今天好开心，想和你一起玩！",
    "你来啦，我一直在等你～",
    "谢谢你喂我，我的肚子暖暖的。",
    "我洗香香啦，毛毛软软的。",
    "我今天漂亮吗？我好喜欢这个样子。",
    "陪我玩真开心，我想再玩一会儿。",
    "外面的风好舒服，我们下次还去散步。",
    "故事好软呀，我想抱着你睡觉。",
    "你摸摸我，我好开心呀。",
    "我会轻轻说话啦。",
    "我先安静陪你。",
}

ENGLISH_LINES = {
    "Hello, I am Teddy. Let us play and learn.",
    "Hello!",
    "dog",
    "I want a pink bow.",
    "I want milk.",
    "Touch Teddy’s ears.",
    "Listen. ball. b, ball. Choose ball.",
    "ball. b, ball.",
    "Put the ball in the box.",
    "The cat is on the bed.",
    "Find yellow butterfly.",
    "Find blue bow.",
    "Find pink bow.",
    "Find bird.",
    "Find dog.",
    "Listen again.",
}

STATIC_ZH = {
    "你好，我是糖糖，我们一起学习吧。",
    "你只要照顾糖糖。第一，听糖糖想要什么。第二，看大图案。第三，帮糖糖做一个小动作。点错也没有关系，糖糖会提示你。",
    "糖糖说：",
    "糖糖说，",
    "看大图案帮我一下。",
    "听到什么就点对应的图案。",
    "这是汉语拼音，不按英语字母读。再听一次中文读音，再点泡泡。",
    "我们一起数一数，看哪个图案最合适。",
    "再听一次，看它长什么样。糖糖给你加油。",
    "请看卡片上的内容，帮糖糖选一选。",
    "哪一盘水果更多？",
    "请把星星球放到糖糖的左边。",
    "圆形饼干要进圆盒子，选哪个？",
    "6 个草莓要分给糖糖和小兔子，每人一样多，每人几个？",
    "糖糖晚上 8 点睡觉，选哪个钟表？",
    "小商店里焦糖饼干 5 星星币，糖糖有 8 个星星币，够买吗？",
    "把圆形玩具放进圆盒子，选圆形玩具。",
    "找到 mā 这个声调泡泡。",
    "小兔子想买“山”字饼干，请拿给它。",
    "魔法笔要点亮“横”这一笔。",
    "“月亮”应该和哪个图案做朋友？",
    "糖糖晚上看见弯弯的____像小船。",
    "看图说句子：我看见一只____。",
    "陪糖糖完成一个星星小任务。",
}


def item_names(source: str) -> set[str]:
    return set(re.findall(r"\{\s*id:'[^']+'\s*,\s*name:'([^']+)'", source))


def correct_answers() -> set[str]:
    return {
        *[str(i) for i in range(0, 13)],
        "左边",
        "圆",
        "🕗 8点",
        "够",
        "⚽",
        "mā",
        "山 ⛰️",
        "横 ー",
        "🌙",
        "月儿 🌙",
        "小鸟 🐦",
        "🐶 dog",
        "🎀 pink",
        "🥛 milk",
        "👂 ears",
        "Hello! 👋",
        "ball 🟡",
        "in 里面 📦⚽",
        "🐱 在床上",
        "完成",
        "日 ☀️",
        "月 🌙",
        "水 💧",
        "火 🔥",
        "田 🟫",
        "人 🧍",
        "口 👄",
    }


def standard_task_lines() -> set[str]:
    result = set(STATIC_ZH)
    for n in range(3, 10):
        result.add(f"糖糖想吃 {n} 块焦糖饼干，请帮它放到盘子里。")
    for total in range(5, 11):
        for have in range(1, total - 1):
            result.add(f"盘子里已经有 {have} 块饼干，糖糖想要 {total} 块，还差几块？")
    for sound in PINYIN.values():
        result.add(f"糖糖说：帮我找读作“{sound}”的小泡泡。")
    result.add("糖糖说：帮我找 mā，一声，像“妈妈”的“妈”。")
    for char in "日月山水火田人口":
        result.add(f"字宝宝捉迷藏：找到“{char}”。")
    return result


def walk_lines(source: str) -> set[str]:
    result: set[str] = set()
    event_pattern = re.compile(
        r"\{\s*icon:'[^']*',\s*place:'[^']*',\s*title:'([^']+)',\s*type:'([^']+)'"
    )
    for title, task_type in event_pattern.findall(source):
        if task_type.startswith("english"):
            continue
        if task_type == "math-count":
            match = re.search(r"(\d+)", title)
            n = int(match.group(1)) if match else (8 if "脚印" in title else 5)
            line = f"糖糖说：{title}。请点 {n}。"
        elif task_type == "math-missing":
            line = "糖糖说：盘子里有 2 块饼干，我想吃 5 块，还差几块？"
        elif task_type == "math-compare":
            line = "糖糖说：请帮我看看，哪边苹果更多？"
        elif task_type == "math-position":
            line = f"糖糖说：{title}。请选择“左边”。"
        elif task_type == "math-shape":
            line = f"糖糖说：{title}。请选择圆形。"
        elif task_type == "math-sort":
            line = f"糖糖说：{title}。请选择圆圆的球。"
        elif task_type == "math-share":
            line = f"糖糖说：{title}。6 个草莓分给我和朋友，每人几个？"
        elif task_type == "math-clock":
            line = f"糖糖说：{title}。请选择 8 点。"
        elif task_type == "math-shop":
            line = f"糖糖说：{title}。饼干 5 星星币，我有 8 个，够买吗？"
        elif task_type == "chinese-pinyin":
            line = f"糖糖说：{title}。帮我点掉读作“播”的小泡泡。"
        elif task_type == "chinese-tone":
            line = f"糖糖说：{title}。帮我找 mā。"
        elif task_type == "chinese-hanzi":
            quoted = re.search(r"“(.+?)”", title)
            answer = quoted.group(1) if quoted else ("水" if "水" in title else "日" if "日" in title else "山")
            line = f"糖糖说：{title}。请点“{answer}”。"
        elif task_type == "chinese-cookie":
            line = f"糖糖说：{title}。请选择山字饼干。"
        elif task_type == "chinese-stroke":
            line = f"糖糖说：{title}。请选择横。"
        elif task_type == "chinese-story":
            line = f"糖糖说：{title}。弯弯的什么像小船？"
        elif task_type == "chinese-sentence":
            line = f"糖糖说：{title}。我看见一只什么？"
        else:
            line = f"糖糖说：{title}。"
        result.add(line)
    return result


def narrator_lines(source: str) -> set[str]:
    result = standard_task_lines() | walk_lines(source)
    names = item_names(source)
    for name in names:
        result.add(f"买到{name}啦。糖糖好开心。")
        result.add(f"糖糖喜欢{name}")
        for coins in (3, 5):
            result.add(f"太棒啦！你帮糖糖完成了心愿，获得 {coins} 星星币和 {name}。")
    for answer in correct_answers():
        result.add(f"糖糖给你明显提示：找 “{answer}”。")
    for letter, sound in PINYIN.items():
        result.add(f"糖糖给你明显提示：找 {letter}，读作 {sound}。")
    return result


def clip_key(role: str, lang: str, text: str) -> str:
    return f"{role}|{lang}|{text}"


def filename(role: str, lang: str, text: str) -> str:
    digest = hashlib.sha1(clip_key(role, lang, text).encode("utf-8")).hexdigest()[:16]
    return f"{role}-{lang.lower()}-{digest}.mp3"


async def render_one(role: str, lang: str, text: str) -> tuple[str, str]:
    key = clip_key(role, lang, text)
    target = OUT / filename(role, lang, text)
    if target.exists() and target.stat().st_size > 1000:
        return key, f"./assets/audio/voice/{target.name}"
    voice, rate, pitch = VOICES[f"{role}|{lang}"]
    for attempt in range(4):
        try:
            communicate = edge_tts.Communicate(text=text, voice=voice, rate=rate, pitch=pitch)
            await communicate.save(str(target))
            if target.stat().st_size <= 1000:
                raise RuntimeError("generated audio is too small")
            return key, f"./assets/audio/voice/{target.name}"
        except Exception:
            if target.exists():
                target.unlink()
            if attempt == 3:
                raise
            await asyncio.sleep(1.5 * (attempt + 1))
    raise AssertionError("unreachable")


async def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    source = INDEX.read_text(encoding="utf-8")
    jobs = [
        *(("pet", "zh-CN", text) for text in sorted(PET_LINES)),
        *(("narrator", "zh-CN", text) for text in sorted(narrator_lines(source))),
        *(("narrator", "en-US", text) for text in sorted(ENGLISH_LINES)),
    ]
    semaphore = asyncio.Semaphore(6)

    async def run_job(number: int, job: tuple[str, str, str]) -> tuple[str, str]:
        async with semaphore:
            key, url = await render_one(*job)
            print(f"[{number}/{len(jobs)}] rendered", flush=True)
            return key, url

    rendered = await asyncio.gather(
        *(run_job(number, job) for number, job in enumerate(jobs, 1))
    )
    clips = dict(rendered)

    manifest = {
        "version": 1,
        "voices": {
            "petZh": "zh-CN-XiaoyiNeural",
            "narratorZh": "zh-CN-XiaoxiaoNeural",
            "narratorEn": "en-US-JennyNeural",
        },
        "dog": {
            "happy": ["./assets/audio/dog/dog-happy.mp3"],
            "hungry": ["./assets/audio/dog/dog-hungry.mp3"],
            "sleepy": ["./assets/audio/dog/dog-sleepy.mp3"],
            "alert": ["./assets/audio/dog/dog-alert.mp3"],
        },
        "fallback": {
            "pet|zh-CN": clips[clip_key("pet", "zh-CN", "你来啦，我一直在等你～")],
            "narrator|zh-CN": clips[clip_key("narrator", "zh-CN", "请看卡片上的内容，帮糖糖选一选。")],
            "narrator|en-US": clips[clip_key("narrator", "en-US", "Listen again.")],
        },
        "clips": dict(sorted(clips.items())),
    }
    MANIFEST.write_text(
        "window.TEDDY_AUDIO_MANIFEST = "
        + json.dumps(manifest, ensure_ascii=False, separators=(",", ":"))
        + ";\n",
        encoding="utf-8",
    )
    print(f"Generated {len(clips)} clips and {MANIFEST.relative_to(ROOT)}")


if __name__ == "__main__":
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(main())
