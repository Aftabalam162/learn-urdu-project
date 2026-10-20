#!/usr/bin/env python3
"""Add absolute canonical/OpenGraph URLs and write sitemap.xml for a published GitHub Pages site."""
from pathlib import Path
from urllib.parse import urlsplit
from xml.sax.saxutils import escape
import re,sys
if len(sys.argv)!=2:
    sys.exit('Usage: python prepare_seo.py https://USERNAME.github.io/REPO/')
base=sys.argv[1].strip().rstrip('/')+'/'
parts=urlsplit(base)
if parts.scheme!='https' or not parts.netloc or parts.query or parts.fragment:
    sys.exit('Please supply an HTTPS public site URL, for example https://USERNAME.github.io/urdu-seekho/')
root=Path(__file__).resolve().parent
paths=['index.html','practice.html','word-list.html']
for p in paths:
    path=root/p
    html=path.read_text(encoding='utf-8')
    url=base+('' if p=='index.html' else p)
    block=('<!-- SITE_URL_MARKER_START -->\n'
       f'<link rel="canonical" href="{url}">\n'
       f'<meta property="og:url" content="{url}">\n'
       '<!-- SITE_URL_MARKER_END -->')
    html,n=re.subn(r'<!-- SITE_URL_MARKER_START -->.*?<!-- SITE_URL_MARKER_END -->',lambda _:block,html,count=1,flags=re.S)
    if n!=1: sys.exit(f'Missing SEO marker in {p}')
    path.write_text(html,encoding='utf-8')
urls=[base,base+'practice.html',base+'word-list.html']
xml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+''.join('  <url><loc>'+escape(u)+'</loc></url>\n' for u in urls)+'</urlset>\n'
(root/'sitemap.xml').write_text(xml,encoding='utf-8')
print('SEO URLs set for:',base)
print('Created sitemap.xml with',len(urls),'pages')
