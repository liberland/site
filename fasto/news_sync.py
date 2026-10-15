#!/usr/bin/env python3
"""Sync Fasto news from GitHub issues labelled "novinka" into fasto/news/news.json.

Run by .github/workflows/fasto-news.yml. Every open "novinka" issue written by
someone with write access to the repository becomes one news item (id
"issue-<number>"); closed issues are removed. Photos attached to the issue are
downloaded, resized and stored in fasto/news/issue-<number>/. Items that do not
come from issues (any other id) are left alone.

Environment: GITHUB_TOKEN, GITHUB_REPOSITORY. Needs Pillow.
"""
import io
import json
import os
import re
import shutil
import sys
import urllib.error
import urllib.request
from pathlib import Path

from PIL import Image, ImageOps

HERE = Path(__file__).parent
NEWS_DIR = HERE / "news"
NEWS_FILE = NEWS_DIR / "news.json"
LABEL = "novinka"
MAX_SIDE = 1600
ALLOWED_PERMISSIONS = {"admin", "maintain", "write"}
IMAGE_HOSTS = (
    "https://github.com/user-attachments/",
    "https://user-images.githubusercontent.com/",
    "https://private-user-images.githubusercontent.com/",
    "https://raw.githubusercontent.com/liberland/site/",
)

TOKEN = os.environ["GITHUB_TOKEN"]
REPO = os.environ["GITHUB_REPOSITORY"]
API = "https://api.github.com"

FIELDS = {
    "Kategorie": "category",
    "Místo": "location",
    "Datum": "date",
    "Text (česky)": "text_cs",
    "Fotky": "photos",
    "Title (English)": "title_en",
    "Text (English)": "text_en",
    "Naslov (hrvatski)": "title_hr",
    "Tekst (hrvatski)": "text_hr",
}
IMG_MD = re.compile(r"!\[[^\]]*\]\((\S+?)\)")
IMG_HTML = re.compile(r"<img\b[^>]*?\bsrc=[\"']([^\"']+)[\"'][^>]*>", re.I)


def api(path, method="GET", body=None):
    req = urllib.request.Request(
        API + path, method=method,
        data=json.dumps(body).encode() if body is not None else None,
        headers={"Authorization": f"Bearer {TOKEN}", "Accept": "application/vnd.github+json",
                 "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "fasto-news-sync"},
    )
    with urllib.request.urlopen(req) as r:
        data = r.read()
        return json.loads(data) if data else None


def issues_with_label():
    out, page = [], 1
    while True:
        batch = api(f"/repos/{REPO}/issues?labels={LABEL}&state=all&per_page=100&page={page}")
        out += [i for i in batch if "pull_request" not in i]
        if len(batch) < 100:
            return out
        page += 1


_perm_cache = {}


def can_write(login):
    if login not in _perm_cache:
        try:
            perm = api(f"/repos/{REPO}/collaborators/{login}/permission")["permission"]
        except urllib.error.HTTPError:
            perm = "none"
        _perm_cache[login] = perm in ALLOWED_PERMISSIONS
    return _perm_cache[login]


def parse_body(body):
    """Split an issue-form body ("### Label" sections) into our fields."""
    fields, current = {}, None
    for line in (body or "").replace("\r\n", "\n").split("\n"):
        m = re.match(r"^### (.+?)\s*$", line)
        if m and m.group(1) in FIELDS:
            current = FIELDS[m.group(1)]
            fields[current] = []
        elif current:
            fields[current].append(line)
    out = {k: "\n".join(v).strip() for k, v in fields.items()}
    return {k: ("" if v == "_No response_" else v) for k, v in out.items()}


def image_urls(text):
    urls = IMG_MD.findall(text) + IMG_HTML.findall(text)
    # bare links that GitHub inserts for some uploads
    urls += re.findall(r"(?<![(\"'])(https://github\.com/user-attachments/assets/[\w-]+)", text)
    seen, out = set(), []
    for u in urls:
        if u not in seen and u.startswith(IMAGE_HOSTS):
            seen.add(u)
            out.append(u)
    return out


def strip_images(text):
    text = IMG_MD.sub("", text)
    text = IMG_HTML.sub("", text)
    text = re.sub(r"https://github\.com/user-attachments/assets/[\w-]+", "", text)
    return re.sub(r"\n{3,}", "\n\n", text).strip()


def download(url):
    for auth in (False, True):
        headers = {"User-Agent": "fasto-news-sync"}
        if auth:
            headers["Authorization"] = f"Bearer {TOKEN}"
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=60) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if auth or e.code not in (401, 403, 404):
                raise
    raise RuntimeError("unreachable")


def save_photos(number, urls):
    folder = NEWS_DIR / f"issue-{number}"
    if folder.exists():
        shutil.rmtree(folder)
    folder.mkdir(parents=True)
    images = []
    for k, url in enumerate(urls, 1):
        im = ImageOps.exif_transpose(Image.open(io.BytesIO(download(url)))).convert("RGB")
        im.thumbnail((MAX_SIDE, MAX_SIDE))
        path = folder / f"{k}.jpg"
        im.save(path, "JPEG", quality=82, optimize=True, progressive=True)
        images.append({"src": f"news/issue-{number}/{k}.jpg", "w": im.size[0], "h": im.size[1]})
    return images


def main():
    categories = json.loads((NEWS_DIR / "categories.json").read_text(encoding="utf-8"))
    by_name = {v["cs"].lower(): k for k, v in categories.items()}
    news = json.loads(NEWS_FILE.read_text(encoding="utf-8"))
    old = {it["id"]: it for it in news.get("items", [])}
    kept = [it for it in news.get("items", []) if not it["id"].startswith("issue-")]
    published, errors = [], []

    for issue in issues_with_label():
        n = issue["number"]
        iid = f"issue-{n}"
        folder = NEWS_DIR / iid
        if issue["state"] != "open" or not can_write(issue["user"]["login"]):
            if folder.exists():
                shutil.rmtree(folder)
            continue
        f = parse_body(issue.get("body"))
        prev = old.get(iid)
        try:
            if prev and prev.get("updated_at") == issue["updated_at"] and folder.exists():
                images = prev.get("images", [])
            else:
                images = save_photos(n, image_urls(issue.get("body") or ""))
        except Exception as e:  # keep the previous version if photos fail
            errors.append((n, f"Fotky se nepodařilo stáhnout: {e}"))
            if prev:
                published.append(prev)
            continue
        date = f.get("date", "")
        if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", date):
            date = issue["created_at"][:10]
        title = re.sub(r"^\s*(novinka|fasto)\s*[:–-]\s*", "", issue["title"], flags=re.I).strip()
        published.append({
            "id": iid,
            "date": date,
            "category": by_name.get(f.get("category", "").lower(), "obecne"),
            "location": f.get("location", ""),
            "title": {"cs": title, "en": f.get("title_en", ""), "hr": f.get("title_hr", "")},
            "text": {lang: strip_images(f.get(f"text_{lang}", "")) for lang in ("cs", "en", "hr")},
            "images": images,
            "issue": n,
            "updated_at": issue["updated_at"],
        })

    # drop folders of issue items that no longer exist
    live = {it["id"] for it in published}
    for d in NEWS_DIR.glob("issue-*"):
        if d.is_dir() and d.name not in live:
            shutil.rmtree(d)

    items = sorted(kept + published, key=lambda i: i.get("date", ""), reverse=True)
    NEWS_FILE.write_text(json.dumps({"items": items}, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"{len(published)} issue news, {len(kept)} other news")
    if errors:
        Path(os.environ.get("RUNNER_TEMP", "/tmp"), "news-errors.json").write_text(json.dumps(errors, ensure_ascii=False))
        for n, msg in errors:
            print(f"::warning::#{n}: {msg}")


if __name__ == "__main__":
    sys.exit(main())
