#!/usr/bin/env python3
"""Gera calçamento irregular e um stand-in de Winsth na escala oficial.

Winsth não veio como spritesheet utilizável — só o guia de proporção.
Este stand-in existe para física, IA e arena; não é arte final.
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "assets"

NERO_BODY = 144
WINSTH_BODY = round(NERO_BODY * 2.30 / 1.80)  # 184
FRAME_W = 148
FRAME_H = 236


def cobble() -> Image.Image:
    im = Image.new("RGB", (256, 36), (62, 48, 38))
    d = ImageDraw.Draw(im)
    rng = 7919
    for i in range(48):
        rng = (rng * 1103515245 + 12345) & 0x7FFFFFFF
        x = (rng >> 8) % 250
        y = (rng >> 16) % 28
        w = 8 + (rng >> 4) % 18
        h = 5 + (rng >> 12) % 8
        tone = 48 + (rng >> 20) % 40
        color = (tone + 12, tone, tone - 8)
        d.rounded_rectangle((x, y, x + w, y + h), radius=1, fill=color, outline=(28, 20, 16))
    for x in (40, 118, 200):
        d.rectangle((x, 10, x + 22, 28), outline=(90, 78, 58))
        d.line((x + 2, 19, x + 20, 19), fill=(70, 58, 40))
    d.ellipse((160, 22, 210, 34), fill=(48, 58, 62))
    d.rectangle((0, 0, 255, 2), fill=(86, 66, 48))
    return im


def shadow() -> Image.Image:
    im = Image.new("RGBA", (48, 10), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.ellipse((2, 2, 46, 8), fill=(10, 8, 6, 90))
    return im


def winsth_pose(ox: int, bob: int, hammer: str) -> Image.Image:
    im = Image.new("RGBA", (FRAME_W, FRAME_H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    feet = FRAME_H - 2
    body_top = feet - WINSTH_BODY
    # legs
    d.rectangle((ox + 46, feet - 52, ox + 64, feet), fill=(46, 38, 32))
    d.rectangle((ox + 72, feet - 52 + bob, ox + 90, feet), fill=(38, 32, 28))
    d.rectangle((ox + 44, feet - 8, ox + 66, feet), fill=(22, 18, 16))
    d.rectangle((ox + 70, feet - 8, ox + 94, feet), fill=(22, 18, 16))
    # trousers / hips
    d.rectangle((ox + 40, body_top + 88, ox + 98, feet - 48), fill=(58, 46, 36))
    d.rectangle((ox + 38, body_top + 82, ox + 100, body_top + 96), fill=(36, 28, 22))
    # torso massive
    d.rectangle((ox + 34, body_top + 28, ox + 104, body_top + 90), fill=(150, 96, 72))
    d.rectangle((ox + 38, body_top + 32, ox + 100, body_top + 70), fill=(40, 32, 28))  # vest
    d.rectangle((ox + 52, body_top + 40, ox + 86, body_top + 78), fill=(160, 102, 76))
    # mechanical arms
    arm_y = body_top + 40 + (4 if hammer == "up" else 0)
    d.rectangle((ox + 12, arm_y, ox + 36, arm_y + 46), fill=(92, 78, 58))
    d.rectangle((ox + 102, arm_y - (18 if hammer == "swing" else 0), ox + 132, arm_y + 50), fill=(80, 68, 50))
    d.ellipse((ox + 8, arm_y + 38, ox + 30, arm_y + 60), fill=(70, 60, 46))
    d.ellipse((ox + 110, arm_y + 40, ox + 136, arm_y + 64), fill=(70, 60, 46))
    # head + jaw
    d.ellipse((ox + 54, body_top + 2, ox + 90, body_top + 38), fill=(168, 112, 86))
    d.rectangle((ox + 58, body_top + 24, ox + 86, body_top + 36), fill=(90, 78, 62))
    d.rectangle((ox + 62, body_top + 18, ox + 70, body_top + 24), fill=(20, 16, 12))
    # top hat — excluded from body measure
    d.rectangle((ox + 50, body_top - 28, ox + 94, body_top + 4), fill=(16, 12, 10))
    d.rectangle((ox + 44, body_top + 2, ox + 100, body_top + 8), fill=(12, 10, 8))
    # hammer
    if hammer == "idle":
        d.rectangle((ox + 118, arm_y - 8, ox + 128, arm_y + 70), fill=(70, 56, 40))
        d.rectangle((ox + 108, arm_y - 22, ox + 140, arm_y - 2), fill=(48, 40, 32))
    elif hammer == "up":
        d.rectangle((ox + 120, body_top - 20, ox + 130, arm_y + 20), fill=(70, 56, 40))
        d.rectangle((ox + 108, body_top - 40, ox + 142, body_top - 16), fill=(48, 40, 32))
    elif hammer == "swing":
        d.rectangle((ox + 20, arm_y + 36, ox + 130, arm_y + 48), fill=(70, 56, 40))
        d.rectangle((ox + 6, arm_y + 24, ox + 28, arm_y + 60), fill=(48, 40, 32))
    elif hammer == "slam":
        d.rectangle((ox + 118, arm_y + 20, ox + 128, feet - 6), fill=(70, 56, 40))
        d.rectangle((ox + 100, feet - 22, ox + 144, feet - 4), fill=(48, 40, 32))
    # steam
    d.ellipse((ox + 28, arm_y - 10, ox + 40, arm_y + 2), fill=(210, 200, 180, 120))
    return im


def winsth_sheet() -> Image.Image:
    poses = [
        winsth_pose(6, 0, "idle"),
        winsth_pose(6, 1, "idle"),
        winsth_pose(4, 0, "idle"),
        winsth_pose(8, 1, "idle"),
        winsth_pose(6, 0, "up"),
        winsth_pose(2, 0, "swing"),
        winsth_pose(6, 0, "slam"),
        winsth_pose(10, 0, "idle"),
    ]
    sheet = Image.new("RGBA", (FRAME_W * len(poses), FRAME_H), (0, 0, 0, 0))
    for i, frame in enumerate(poses):
        sheet.paste(frame, (i * FRAME_W, 0), frame)
    return sheet


def spark() -> Image.Image:
    im = Image.new("RGBA", (10, 10), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.ellipse((2, 2, 8, 8), fill=(230, 190, 90, 200))
    return im


def main() -> None:
    (OUT / "tilesets").mkdir(parents=True, exist_ok=True)
    (OUT / "characters").mkdir(parents=True, exist_ok=True)
    (OUT / "fx").mkdir(parents=True, exist_ok=True)
    cobble().save(OUT / "tilesets" / "cobble.png", "PNG")
    shadow().save(OUT / "fx" / "contact-shadow.png", "PNG")
    spark().save(OUT / "fx" / "spark.png", "PNG")
    winsth_sheet().save(OUT / "characters" / "winsth.png", "PNG")
    print("cobble, sombra, winsth stand-in gerados", "body", WINSTH_BODY)


if __name__ == "__main__":
    main()
