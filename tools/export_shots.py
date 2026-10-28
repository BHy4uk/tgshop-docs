"""Експорт знімків Mini App для документації (замість docshots_export.py з репозиторію продукту).

    python tools/export_shots.py <insomnia.workshop>/tools/webapp-harness/out/docshots

Бере знімки сценарію docshots, зрізає порожню смугу над оболонкою (там у Telegram шапка),
кути не округлює (рамку iPhone малює сайт, див. hooks/phone_frame.py) і зберігає WebP у
docs/assets/shots/. Ручні PNG (np-api-key.png) не чіпає.
"""
import sys
from pathlib import Path

from PIL import Image

DEST = Path(__file__).resolve().parent.parent / "docs" / "assets" / "shots"
CUT_TOP_CSS = 98  # px у CSS-пікселях: смуга над оболонкою


def main() -> None:
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    src = Path(sys.argv[1])
    shots = sorted(src.glob("*--s.png"))
    if not shots:
        raise SystemExit(f"немає знімків у {src}: спершу запустіть сценарій docshots")
    total = 0
    for path in shots:
        name = path.name.split("--")[0]
        image = Image.open(path).convert("RGB")
        scale = image.width / 390
        image = image.crop((0, round(CUT_TOP_CSS * scale), image.width, image.height))
        out = DEST / f"{name}.webp"
        image.save(out, "WEBP", quality=90, method=6)
        total += out.stat().st_size
    print(f"{len(shots)} файлів, {total // 1024} КБ -> {DEST}")


if __name__ == "__main__":
    main()
