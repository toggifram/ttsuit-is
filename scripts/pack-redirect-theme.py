#!/usr/bin/env python3
from pathlib import Path
import zipfile

root = Path(__file__).resolve().parents[1] / "shopify" / "redirect-theme"
dest = Path(__file__).resolve().parents[1] / "shopify" / "ttsuit-redirect-theme.zip"
skip = {"LICENSE.md"}

with zipfile.ZipFile(dest, "w", zipfile.ZIP_DEFLATED) as z:
    for path in sorted(root.rglob("*")):
        if path.is_file() and path.name not in skip:
            z.write(path, path.relative_to(root).as_posix())

print(f"{dest} ({dest.stat().st_size} bytes)")
