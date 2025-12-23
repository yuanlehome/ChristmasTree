#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import argparse
from pathlib import Path
import uuid


def main():
    parser = argparse.ArgumentParser(
        description="Rename all files in a directory to sequential numbers starting from 1."
    )
    parser.add_argument("dir", help="目标目录")
    parser.add_argument("-r", "--recursive", action="store_true",
                        help="递归处理子目录")
    parser.add_argument("--start", type=int, default=1,
                        help="起始编号（默认 1）")
    parser.add_argument("--by", choices=["name", "mtime"], default="name",
                        help="排序方式：name=按文件名，mtime=按修改时间")
    args = parser.parse_args()

    root = Path(args.dir).expanduser().resolve()
    if not root.is_dir():
        raise SystemExit(f"Directory not found: {root}")

    files = list(root.rglob("*") if args.recursive else root.glob("*"))
    files = [f for f in files if f.is_file()]

    if not files:
        print("No files found.")
        return

    # 排序
    if args.by == "name":
        files.sort(key=lambda p: p.name)
    else:
        files.sort(key=lambda p: p.stat().st_mtime)

    # ---------- 第一阶段：临时重命名（避免冲突） ----------
    temp_map = {}
    for f in files:
        tmp = f.with_name(f".__tmp__{uuid.uuid4().hex}{f.suffix}")
        f.rename(tmp)
        temp_map[tmp] = f

    # ---------- 第二阶段：正式重命名 ----------
    idx = args.start
    for tmp in sorted(temp_map.keys(), key=lambda p: p.name):
        orig = temp_map[tmp]
        new_name = f"{idx}{orig.suffix}"
        new_path = orig.with_name(new_name)
        tmp.rename(new_path)
        print(f"{orig.name} -> {new_name}")
        idx += 1

    print(f"\nDone. Renamed {len(files)} files.")


if __name__ == "__main__":
    main()
