#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import argparse
from pathlib import Path
from PIL import Image, ImageOps

# 注册 HEIC / HEIF（iPhone）
try:
    from pillow_heif import register_heif_opener  # type: ignore
    register_heif_opener()
    HEIF_ENABLED = True
except Exception:
    HEIF_ENABLED = False


def safe_convert_mode(img: Image.Image) -> Image.Image:
    """EXIF 方向 + 转成适合 PNG 的 RGB / RGBA"""
    try:
        img = ImageOps.exif_transpose(img)
    except Exception:
        pass

    if img.mode in ("RGB", "RGBA"):
        return img
    if img.mode in ("P", "LA"):
        return img.convert("RGBA")
    if img.mode == "CMYK":
        return img.convert("RGB")
    return img.convert("RGBA")


def unique_path(p: Path) -> Path:
    """避免重名"""
    if not p.exists():
        return p
    stem, suffix = p.stem, p.suffix
    parent = p.parent
    i = 1
    while True:
        candidate = parent / f"{stem}_{i}{suffix}"
        if not candidate.exists():
            return candidate
        i += 1


def convert_one_last_frame(src: Path, dst_root: Path, rel: Path, overwrite: bool) -> bool:
    """
    把任意图片 / 动图 / HEIC 转成 PNG
    多帧时：保存【最后一帧】
    """
    try:
        with Image.open(src) as im:
            # 判断是否多帧
            n_frames = int(getattr(im, "n_frames", 1) or 1)

            # 👉 关键点：seek 到最后一帧
            try:
                im.seek(n_frames - 1)
            except Exception:
                # 某些格式 seek 失败，退化为默认帧
                pass

            out_dir = dst_root / rel.parent
            out_dir.mkdir(parents=True, exist_ok=True)

            out_path = (out_dir / rel.name).with_suffix(".png")
            if not overwrite:
                out_path = unique_path(out_path)

            img = safe_convert_mode(im.copy())
            img.save(out_path, format="PNG", optimize=True)
            return True

    except Exception as e:
        print(f"[FAIL] {src} -> {e}")
        return False


def main():
    parser = argparse.ArgumentParser(
        description="Convert images to PNG (save LAST frame for animated / multi-frame images)."
    )
    parser.add_argument("input_dir", help="输入目录")
    parser.add_argument("-o", "--output-dir", default="",
                        help="输出目录（默认：输入目录/converted_png）")
    parser.add_argument("-r", "--recursive", action="store_true",
                        help="递归扫描子目录")
    parser.add_argument("--overwrite", action="store_true",
                        help="覆盖已有 PNG")
    parser.add_argument("--include-png", action="store_true",
                        help="连 PNG 也重新处理")
    args = parser.parse_args()

    in_dir = Path(args.input_dir).expanduser().resolve()
    if not in_dir.is_dir():
        raise SystemExit(f"Input dir not found: {in_dir}")

    out_dir = Path(args.output_dir).expanduser().resolve() if args.output_dir else (in_dir / "converted_png")
    out_dir.mkdir(parents=True, exist_ok=True)

    if not HEIF_ENABLED:
        print("[WARN] pillow-heif 未启用，HEIC/HEIF 可能打不开")

    iterator = in_dir.rglob("*") if args.recursive else in_dir.glob("*")

    total = 0
    success = 0

    for p in iterator:
        if not p.is_file():
            continue

        # 避免处理输出目录
        try:
            if out_dir in p.parents:
                continue
        except Exception:
            pass

        if not args.include_png and p.suffix.lower() == ".png":
            continue

        rel = p.relative_to(in_dir)
        total += 1

        if convert_one_last_frame(p, out_dir, rel, overwrite=args.overwrite):
            success += 1
            print(f"[OK] {p}")

    print(f"\nDone. Scanned {total} files, converted {success} PNG(s)")
    print(f"Output dir: {out_dir}")


if __name__ == "__main__":
    main()
