#!/usr/bin/env python3
"""Converte pinturas-fonte em pixel art de jogo.

As imagens de art/source (ou do cache do Cursor) são recortes cinematográficos.
Este script as transforma em PNG de paleta limitada, pixels nítidos, sem retângulos
procedurais no lugar de fachadas ou personagens.
"""

from __future__ import annotations

import shutil
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parent.parent
CURSOR_ASSETS = (
    Path.home()
    / ".cursor"
    / "projects"
    / "c-Users-Jo-oGabrielBortotoDe-pixel-teste"
    / "assets"
)
SOURCE = ROOT / "art" / "source"
OUT = ROOT / "public" / "assets"
PREVIEW = ROOT / "art" / "previews"

NERO_W, NERO_H = 80, 120
NPC_W, NPC_H = 52, 88
CHILD_W, CHILD_H = 40, 64
STREET_W, STREET_H = 1944, 360
SEGMENT_W = STREET_W // 2

PALETTE = [
    (12, 9, 8),
    (22, 16, 13),
    (36, 24, 18),
    (48, 32, 24),
    (68, 42, 28),
    (92, 56, 34),
    (118, 72, 42),
    (148, 92, 52),
    (176, 118, 64),
    (196, 148, 86),
    (214, 176, 108),
    (230, 198, 128),
    (238, 220, 176),
    (90, 48, 36),
    (128, 62, 44),
    (158, 78, 52),
    (84, 70, 56),
    (110, 96, 78),
    (142, 126, 102),
    (176, 158, 128),
    (48, 44, 40),
    (72, 66, 58),
    (102, 96, 86),
    (38, 46, 52),
    (62, 74, 84),
    (92, 108, 118),
    (128, 142, 150),
    (28, 36, 30),
    (52, 64, 46),
    (18, 14, 12),
    (8, 7, 7),
    (210, 168, 72),
    (186, 128, 48),
    (120, 78, 32),
    (64, 28, 22),
    (40, 18, 16),
    (24, 38, 48),
    (16, 22, 28),
]

CROPS = {
    "nero-idle.jpg": (0.17, 0.0, 0.83, 1.0),
    "nero-walk.jpg": (0.15, 0.0, 0.85, 1.0),
    "nero-jump.jpg": (0.18, 0.0, 0.84, 0.98),
    "npc-ilda.jpg": (0.18, 0.03, 0.82, 0.995),
    "npc-worker.jpg": (0.22, 0.01, 0.78, 0.995),
    "npc-child.jpg": (0.20, 0.06, 0.80, 0.995),
    "npc-mechanic.jpg": (0.20, 0.01, 0.82, 0.995),
}


def ensure_dirs() -> None:
    SOURCE.mkdir(parents=True, exist_ok=True)
    PREVIEW.mkdir(parents=True, exist_ok=True)
    for rel in (
        "characters",
        "backgrounds",
        "fx",
        "ui",
        "painted",
    ):
        (OUT / rel).mkdir(parents=True, exist_ok=True)


def collect_sources() -> None:
    if CURSOR_ASSETS.exists():
        for src in CURSOR_ASSETS.glob("*.jpg"):
            dest = SOURCE / src.name
            if not dest.exists():
                shutil.copy2(src, dest)


def dist(a: tuple[int, int, int], b: tuple[int, int, int]) -> float:
    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2) ** 0.5


def nearest(color: tuple[int, int, int]) -> tuple[int, int, int]:
    return min(PALETTE, key=lambda c: dist(c, color))


def quantize(im: Image.Image) -> Image.Image:
    src = im.convert("RGBA")
    out = Image.new("RGBA", src.size)
    sp = src.load()
    dp = out.load()
    w, h = src.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = sp[x, y]
            if a < 16:
                dp[x, y] = (0, 0, 0, 0)
                continue
            qr, qg, qb = nearest((r, g, b))
            dp[x, y] = (qr, qg, qb, 255 if a > 140 else a)
    return out


def crop_frac(im: Image.Image, box: tuple[float, float, float, float]) -> Image.Image:
    w, h = im.size
    l, t, r, b = box
    return im.crop((int(w * l), int(h * t), int(w * r), int(h * b)))


def _capsule(x: int, y: int, w: int, h: int) -> bool:
    nx = (x - w / 2) / (w * 0.30)
    ny = (y - h * 0.54) / (h * 0.46)
    return nx * nx + ny * ny <= 1.0


def key_border(im: Image.Image, threshold: float, inset: float = 0.16) -> Image.Image:
    """Remove o cenário atrás do personagem sem deixar um retângulo opaco."""
    del inset
    from collections import deque

    im = im.convert("RGBA")
    w, h = im.size
    px = im.load()
    corners = [px[2, 2][:3], px[w - 3, 2][:3], px[2, h - 3][:3], px[w - 3, h - 3][:3]]
    seen = bytearray(w * h)
    q: deque[tuple[int, int]] = deque()

    def push(x: int, y: int) -> None:
        if 0 <= x < w and 0 <= y < h and not seen[y * w + x]:
            seen[y * w + x] = 1
            q.append((x, y))

    for x in range(w):
        push(x, 0)
        push(x, h - 1)
    for y in range(h):
        push(0, y)
        push(w - 1, y)

    while q:
        x, y = q.popleft()
        r, g, b, _a = px[x, y]
        gap = min(dist((r, g, b), sample) for sample in corners)
        limit = threshold * (0.55 if _capsule(x, y, w, h) else 1.15)
        sat = max(r, g, b) - min(r, g, b)
        if gap <= limit or (not _capsule(x, y, w, h) and sat < 18 and gap <= threshold + 12):
            px[x, y] = (0, 0, 0, 0)
            push(x - 1, y)
            push(x + 1, y)
            push(x, y - 1)
            push(x, y + 1)

    # kill leftover photo corners outside the figure
    for y in range(h):
        for x in range(w):
            if _capsule(x, y, w, h):
                continue
            r, g, b, a = px[x, y]
            if a and min(dist((r, g, b), sample) for sample in corners) < threshold + 8:
                px[x, y] = (0, 0, 0, 0)
    return im


def fit_subject(im: Image.Image, tw: int, th: int) -> Image.Image:
    bbox = im.getbbox()
    if not bbox:
        canvas = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
        return canvas
    cut = im.crop(bbox)
    cut.thumbnail((tw, th), Image.Resampling.BOX)
    canvas = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
    x = (tw - cut.width) // 2
    y = th - cut.height
    canvas.paste(cut, (x, y), cut)
    return quantize(canvas)


def process_character(name: str, tw: int, th: int, threshold: float = 36) -> Image.Image:
    src = Image.open(SOURCE / name)
    cropped = crop_frac(src, CROPS[name])
    keyed = key_border(cropped, threshold)
    return fit_subject(keyed, tw, th)


def shift(im: Image.Image, dy: int) -> Image.Image:
    canvas = Image.new("RGBA", im.size, (0, 0, 0, 0))
    canvas.paste(im, (0, dy), im)
    return canvas


def sheet(frames: list[Image.Image]) -> Image.Image:
    w, h = frames[0].size
    out = Image.new("RGBA", (w * len(frames), h), (0, 0, 0, 0))
    for i, frame in enumerate(frames):
        out.paste(frame, (i * w, 0), frame)
    return out


def grade_street(im: Image.Image) -> Image.Image:
    im = im.convert("RGB")
    # dusk: slightly crush blacks and warm mids
    lut_r = [min(255, int((i / 255) ** 0.82 * 255 + 20)) for i in range(256)]
    lut_g = [min(255, int((i / 255) ** 0.84 * 248 + 12)) for i in range(256)]
    lut_b = [min(255, int((i / 255) ** 0.90 * 230 + 6)) for i in range(256)]
    r, g, b = im.split()
    r = r.point(lut_r)
    g = g.point(lut_g)
    b = b.point(lut_b)
    return Image.merge("RGB", (r, g, b))


def process_street() -> Image.Image:
    west = Image.open(SOURCE / "street-west.jpg")
    east = Image.open(SOURCE / "street-east.jpg")
    # Keep architecture + cobbles, drop empty sky.
    west = crop_frac(west, (0.0, 0.30, 1.0, 0.82)).resize((SEGMENT_W, STREET_H), Image.Resampling.BOX)
    east = crop_frac(east, (0.0, 0.26, 1.0, 0.80)).resize((SEGMENT_W, STREET_H), Image.Resampling.BOX)
    street = Image.new("RGB", (STREET_W, STREET_H))
    street.paste(grade_street(west), (0, 0))
    street.paste(grade_street(east), (SEGMENT_W, 0))
    # Soft seam blend
    seam = SEGMENT_W
    band = 18
    left = street.crop((seam - band, 0, seam, STREET_H))
    right = street.crop((seam, 0, seam + band, STREET_H))
    for i in range(band):
        t = i / band
        col = Image.blend(left.crop((band - 1, 0, band, STREET_H)).resize((1, STREET_H)), right.crop((0, 0, 1, STREET_H)).resize((1, STREET_H)), t)
        # per-column blend of the two sides
        mix = Image.blend(
            left.crop((i, 0, i + 1, STREET_H)).resize((1, STREET_H)),
            right.crop((i, 0, i + 1, STREET_H)).resize((1, STREET_H)),
            t,
        )
        street.paste(mix, (seam - band + i, 0))
    quantized = quantize(street.convert("RGBA")).convert("RGB")
    return quantized


def process_layer(name: str, size: tuple[int, int], crop: tuple[float, float, float, float]) -> Image.Image:
    im = crop_frac(Image.open(SOURCE / name), crop)
    im = grade_street(im).resize(size, Image.Resampling.BOX)
    return quantize(im.convert("RGBA")).convert("RGB")


def process_foreground() -> Image.Image:
    im = Image.open(SOURCE / "fg-pipes.jpg").convert("RGBA")
    im = crop_frac(im, (0.0, 0.0, 1.0, 0.72)).resize((STREET_W, 150), Image.Resampling.BOX)
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, _ = px[x, y]
            lum = 0.3 * r + 0.5 * g + 0.2 * b
            # keep dark silhouettes, punch bright sky
            alpha = 0 if lum > 92 else min(210, int((92 - lum) * 3.4))
            if alpha < 18:
                px[x, y] = (0, 0, 0, 0)
            else:
                qr, qg, qb = nearest((r, g, b))
                px[x, y] = (qr, qg, qb, alpha)
    return im


def process_dialogue() -> Image.Image:
    im = crop_frac(Image.open(SOURCE / "ui-dialogue.jpg"), (0.04, 0.28, 0.96, 0.78))
    im = im.resize((520, 78), Image.Resampling.BOX)
    return quantize(im.convert("RGBA"))


def paint_lamp() -> Image.Image:
    im = Image.new("RGBA", (18, 56), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rectangle((7, 0, 10, 22), fill=(48, 44, 40, 255))
    d.rectangle((3, 20, 14, 36), fill=(72, 66, 58, 255))
    d.rectangle((5, 22, 12, 33), fill=(210, 168, 72, 230))
    d.rectangle((6, 23, 11, 32), fill=(238, 220, 176, 240))
    d.rectangle((2, 36, 15, 39), fill=(92, 56, 34, 255))
    d.rectangle((8, 39, 9, 55), fill=(48, 32, 24, 255))
    return im


def paint_steam() -> Image.Image:
    im = Image.new("RGBA", (16, 16), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.ellipse((3, 4, 10, 11), fill=(176, 158, 128, 140))
    d.ellipse((6, 1, 13, 8), fill=(214, 176, 108, 90))
    d.ellipse((2, 8, 9, 15), fill=(142, 126, 102, 80))
    return im


def paint_glow() -> Image.Image:
    im = Image.new("RGBA", (48, 48), (0, 0, 0, 0))
    cx, cy = 23, 23
    px = im.load()
    for y in range(48):
        for x in range(48):
            dd = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5
            if dd < 22:
                a = int(max(0, 150 - dd * 7))
                px[x, y] = (230, 198, 128, a)
    return im


def save(path: Path, im: Image.Image) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, "PNG", optimize=True)
    print(f"wrote {path.relative_to(ROOT)} {im.size}")


def main() -> None:
    ensure_dirs()
    collect_sources()
    missing = [name for name in CROPS if not (SOURCE / name).exists()]
    extra = ["street-west.jpg", "street-east.jpg", "parallax-factory.jpg", "parallax-mid.jpg", "fg-pipes.jpg", "ui-dialogue.jpg"]
    missing += [name for name in extra if not (SOURCE / name).exists()]
    if missing:
        raise SystemExit(f"fontes ausentes: {missing}")

    idle = process_character("nero-idle.jpg", NERO_W, NERO_H, 34)
    walk = process_character("nero-walk.jpg", NERO_W, NERO_H, 34)
    jump = process_character("nero-jump.jpg", NERO_W, NERO_H, 32)
    nero = sheet(
        [
            idle,
            shift(idle, -1),
            walk,
            shift(walk, 1),
            idle,
            shift(walk, -1),
            jump,
            shift(jump, 2),
            walk,
            idle,
            idle,
            shift(idle, 1),
        ]
    )
    save(OUT / "characters" / "player.png", nero)

    for src, dest, w, h, thr in (
        ("npc-ilda.jpg", "npc-ilda.png", NPC_W, NPC_H, 42),
        ("npc-worker.jpg", "npc-worker.png", NPC_W, NPC_H, 40),
        ("npc-child.jpg", "npc-child.png", CHILD_W, CHILD_H, 44),
        ("npc-mechanic.jpg", "npc-mechanic.png", NPC_W, NPC_H, 40),
    ):
        frame = process_character(src, w, h, thr)
        bob = sheet([frame, shift(frame, -1)])
        save(OUT / "characters" / dest, bob)

    street = process_street()
    save(OUT / "painted" / "street-operario.png", street)

    far = process_layer("parallax-factory.jpg", (960, 220), (0.0, 0.0, 1.0, 0.82))
    mid = process_layer("parallax-mid.jpg", (960, 250), (0.0, 0.08, 1.0, 0.92))
    save(OUT / "backgrounds" / "bg-far.png", far)
    save(OUT / "backgrounds" / "bg-mid.png", mid)
    save(OUT / "backgrounds" / "bg-near.png", process_foreground())

    save(OUT / "ui" / "dialogue.png", process_dialogue())
    save(OUT / "fx" / "steam.png", paint_steam())
    save(OUT / "fx" / "lamp-glow.png", paint_glow())
    save(OUT / "fx" / "lamp.png", paint_lamp())

    # Contact sheet for art review
    preview = Image.new("RGB", (1280, 720), (18, 14, 12))
    preview.paste(street.resize((960, 178), Image.Resampling.NEAREST), (20, 20))
    preview.paste(nero.resize((nero.width // 2, nero.height // 2), Image.Resampling.NEAREST), (20, 220))
    x = 20
    for name in ("npc-ilda.png", "npc-worker.png", "npc-child.png", "npc-mechanic.png"):
        npc = Image.open(OUT / "characters" / name)
        preview.paste(npc, (x, 400), npc)
        x += npc.width + 16
    preview.paste(far.resize((400, 92), Image.Resampling.NEAREST), (20, 560))
    preview.paste(mid.resize((400, 104), Image.Resampling.NEAREST), (440, 560))
    save(PREVIEW / "quarteirao-contact.png", preview)
    print("pipeline de arte pintada concluido")


if __name__ == "__main__":
    main()
