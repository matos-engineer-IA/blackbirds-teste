#!/usr/bin/env python3
"""Separa o spritesheet anexado de Nero em quadros com pés no chão.

Altura de corpo alvo: 144 px (cartola fora da medida).
"""

from __future__ import annotations

import shutil
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = (
    Path.home()
    / ".cursor"
    / "projects"
    / "c-Users-Jo-oGabrielBortotoDe-pixel-teste"
    / "assets"
)
OUT = ROOT / "public" / "assets" / "characters"
ART = ROOT / "art" / "source"

BODY_PX = 144
FRAME_W = 120
FRAME_H = 192
BG_LUMA = 18


def load_sheet() -> Image.Image:
    ART.mkdir(parents=True, exist_ok=True)
    matches = sorted(SRC_DIR.glob("*Pistoleiro*"))
    if not matches:
        raise SystemExit("spritesheet de Nero nao encontrado nos anexos")
    dest = ART / "nero-sheet.jpg"
    shutil.copy2(matches[0], dest)
    return Image.open(dest).convert("RGBA")


def luma(p: tuple[int, int, int, int]) -> float:
    r, g, b, _a = p
    return 0.3 * r + 0.59 * g + 0.11 * b


def mask(im: Image.Image) -> list[list[bool]]:
    w, h = im.size
    px = im.load()
    return [[luma(px[x, y]) > BG_LUMA for x in range(w)] for y in range(h)]


def components(on: list[list[bool]]) -> list[tuple[int, int, int, int]]:
    h = len(on)
    w = len(on[0])
    seen = [[False] * w for _ in range(h)]
    boxes: list[tuple[int, int, int, int]] = []
    for y in range(h):
        for x in range(w):
            if not on[y][x] or seen[y][x]:
                continue
            stack = [(x, y)]
            seen[y][x] = True
            minx = maxx = x
            miny = maxy = y
            count = 0
            while stack:
                cx, cy = stack.pop()
                count += 1
                minx = min(minx, cx)
                maxx = max(maxx, cx)
                miny = min(miny, cy)
                maxy = max(maxy, cy)
                for nx, ny in ((cx - 1, cy), (cx + 1, cy), (cx, cy - 1), (cx, cy + 1)):
                    if 0 <= nx < w and 0 <= ny < h and on[ny][nx] and not seen[ny][nx]:
                        seen[ny][nx] = True
                        stack.append((nx, ny))
            if count > 80:
                boxes.append((minx, miny, maxx + 1, maxy + 1))
    return attach_details(boxes)


def near(a: tuple[int, int, int, int], b: tuple[int, int, int, int], pad: int) -> bool:
    return not (a[2] + pad < b[0] or b[2] + pad < a[0] or a[3] + pad < b[1] or b[3] + pad < a[1])


def union(a: tuple[int, int, int, int], b: tuple[int, int, int, int]) -> tuple[int, int, int, int]:
    return (min(a[0], b[0]), min(a[1], b[1]), max(a[2], b[2]), max(a[3], b[3]))


def area(b: tuple[int, int, int, int]) -> int:
    return (b[2] - b[0]) * (b[3] - b[1])


def attach_details(boxes: list[tuple[int, int, int, int]]) -> list[tuple[int, int, int, int]]:
    larges = [b for b in boxes if area(b) > 5500 and (b[3] - b[1]) > 100]
    smalls = [b for b in boxes if b not in larges]
    attached = larges[:]
    for bit in smalls:
        best = None
        best_d = 40
        for i, host in enumerate(attached):
            if near(bit, host, 22):
                cx = abs((bit[0] + bit[2]) / 2 - (host[0] + host[2]) / 2)
                if cx < best_d:
                    best = i
                    best_d = cx
        if best is not None:
            attached[best] = union(attached[best], bit)
    # Bottom row slash connects punches: split any box wider than 280px.
    split: list[tuple[int, int, int, int]] = []
    for box in attached:
        w = box[2] - box[0]
        if w > 280:
            parts = max(2, round(w / 200))
            step = w / parts
            for i in range(parts):
                split.append((int(box[0] + i * step), box[1], int(box[0] + (i + 1) * step), box[3]))
        else:
            split.append(box)
    split = [b for b in split if (b[2] - b[0]) >= 88 and (b[3] - b[1]) >= 140]
    split.sort(key=lambda b: (b[1] // 140, b[0]))
    return split


def extract(im: Image.Image, box: tuple[int, int, int, int]) -> Image.Image:
    cut = im.crop(box)
    px = cut.load()
    w, h = cut.size
    for y in range(h):
        for x in range(w):
            if luma(px[x, y]) <= BG_LUMA:
                px[x, y] = (0, 0, 0, 0)
    # body height = feet to crown of head, ignoring isolated hat brim spikes by using
    # the 92nd percentile of opaque rows from the top of the torso cluster.
    return cut


def fit(cut: Image.Image) -> Image.Image:
    bbox = cut.getbbox()
    if not bbox:
        return Image.new("RGBA", (FRAME_W, FRAME_H), (0, 0, 0, 0))
    cut = cut.crop(bbox)
    # Scale so the opaque height minus top 14% (hat) equals BODY_PX.
    hat = int(cut.height * 0.14)
    body = max(1, cut.height - hat)
    scale = BODY_PX / body
    nw = max(1, int(cut.width * scale))
    nh = max(1, int(cut.height * scale))
    cut = cut.resize((nw, nh), Image.Resampling.NEAREST)
    canvas = Image.new("RGBA", (FRAME_W, FRAME_H), (0, 0, 0, 0))
    x = (FRAME_W - cut.width) // 2
    y = FRAME_H - cut.height
    canvas.paste(cut, (x, y), cut)
    return canvas


def main() -> None:
    im = load_sheet()
    boxes = components(mask(im))
    print("quadros detectados", len(boxes), boxes)
    frames = [fit(extract(im, box)) for box in boxes]
    if len(frames) < 8:
        raise SystemExit(f"poucos quadros: {len(frames)}")
    sheet = Image.new("RGBA", (FRAME_W * len(frames), FRAME_H), (0, 0, 0, 0))
    for i, frame in enumerate(frames):
        sheet.paste(frame, (i * FRAME_W, 0), frame)
    OUT.mkdir(parents=True, exist_ok=True)
    dest = OUT / "nero-sheet.png"
    sheet.save(dest, "PNG")
    print("wrote", dest, sheet.size, "frames", len(frames))
    meta = ROOT / "art" / "nero-frames.txt"
    meta.write_text(
        "\n".join(
            [
                f"frames={len(frames)}",
                f"frame={FRAME_W}x{FRAME_H}",
                f"body={BODY_PX}px (cartola excluida da medida)",
                "ordem aproximada: idle, idle, walk, walk, walk, jump, fall, melee1, melee2, aim, shoot",
            ]
        ),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
