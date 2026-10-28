"""Знімки Mini App у рамці iPhone, як на cartium.store (Device.astro).

Кожне ![…](…){ .phone } після збірки обгортається розміткою рамки: титанова смуга,
чорна рамка, Dynamic Island, статус-бар, індикатор «додому» і бокові кнопки.
Самі знімки — без кутів і без статус-бару (див. docs/assets/shots/README.md).
Розмітка зі <span>, бо знімок часто стоїть усередині абзацу.
"""
import os
import re

from PIL import Image

IMG = re.compile(r'<img\b(?=[^>]*\bclass="(?:[^"]*\s)?phone(?:\s[^"]*)?")[^>]*>')
SRC = re.compile(r'\bsrc="([^"]+)"')

ICONS = (
    '<svg viewBox="0 0 18 12" aria-hidden="true"><rect x="0" y="8" width="3" height="4" rx="1"/>'
    '<rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/>'
    '<rect x="15" y="0" width="3" height="12" rx="1"/></svg>'
    '<svg viewBox="0 0 16 12" aria-hidden="true"><path d="M8 2.4c2.3 0 4.4.9 6 2.4l1.3-1.4A10.6 10.6 0 0 0 8 .4 '
    '10.6 10.6 0 0 0 .7 3.4L2 4.8a8.6 8.6 0 0 1 6-2.4Zm0 3.8c1.3 0 2.5.5 3.4 1.3l1.3-1.4A7 7 0 0 0 8 4.2a7 7 0 0 '
    '0-4.7 1.9l1.3 1.4c.9-.8 2.1-1.3 3.4-1.3Zm0 3.8c.4 0 .8.2 1.1.4L8 11.6 6.9 10.4c.3-.2.7-.4 1.1-.4Z"/></svg>'
    '<svg viewBox="0 0 27 12" aria-hidden="true"><rect x="0.5" y="0.5" width="23" height="11" rx="3.2" '
    'fill="none" stroke="currentColor" stroke-opacity="0.4"/><rect x="2" y="2" width="20" height="8" rx="2"/>'
    '<path d="M25 4v4c.8-.3 1.4-1.1 1.4-2s-.6-1.7-1.4-2Z" fill-opacity="0.45"/></svg>'
)

FRAME = (
    '<span class="iphone">'
    '<span class="iphone-key iphone-key--action"></span><span class="iphone-key iphone-key--up"></span>'
    '<span class="iphone-key iphone-key--down"></span><span class="iphone-key iphone-key--side"></span>'
    '<span class="iphone-body"><span class="iphone-glass"><span class="iphone-screen">'
    '<span class="iphone-status" aria-hidden="true"><span>9:41</span><span class="iphone-island"></span>'
    '<span class="iphone-icons">' + ICONS + '</span></span>'
    '{img}'
    '<span class="iphone-home" aria-hidden="true"></span>'
    '</span></span></span></span>'
)

_sizes = {}


def _size(path):
    if path not in _sizes:
        try:
            with Image.open(path) as im:
                _sizes[path] = im.size
        except OSError:
            _sizes[path] = None
    return _sizes[path]


def on_page_content(html, page, config, files):
    page_dir = os.path.dirname(os.path.join(config["docs_dir"], page.file.src_path))
    # на головній перші три знімки — у герої першого екрана, їх вантажимо одразу
    eager = [3 if page.is_homepage else 0]

    def wrap(match):
        tag = match.group(0)
        if eager[0] > 0:
            eager[0] -= 1
            extra = ' loading="eager" decoding="async"'
        else:
            extra = ' loading="lazy" decoding="async"'
        src = SRC.search(tag)
        if src and "://" not in src.group(1):
            size = _size(os.path.normpath(os.path.join(page_dir, src.group(1))))
            if size:
                extra += f' width="{size[0]}" height="{size[1]}"'
        return FRAME.format(img=tag[:-1].rstrip("/ ") + extra + ">")

    return IMG.sub(wrap, html)
