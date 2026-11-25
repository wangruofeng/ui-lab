"""Find UI Lab cases in an XML catalog and return a ranked JSON shortlist."""

import argparse
import json
import sys
import unicodedata
from pathlib import Path
from urllib.parse import urlsplit
from xml.etree import ElementTree


def normalize(value):
    return unicodedata.normalize("NFKC", value).strip().casefold()


def search_cases(catalog, terms, source_filter):
    matches = []
    for collection in catalog.findall("collection"):
        source = collection.findtext("title", "")
        source_id = urlsplit(collection.get("url", "")).fragment.strip("/")
        if source_filter and source_filter not in (normalize(source), normalize(source_id)):
            continue

        for chapter in collection.findall("chapter"):
            chapter_title = chapter.get("title", "")
            for case in chapter.findall("case"):
                url = case.get("url", "")
                case_id = urlsplit(url).fragment.rsplit("/", 1)[-1]
                title = case.findtext("title", "")
                summary = case.findtext("summary", "")
                fields = (
                    (normalize(title), 4),
                    (normalize(case_id), 3),
                    (normalize(summary), 2),
                    (normalize(chapter_title), 1),
                    (normalize(source), 1),
                    (normalize(source_id), 1),
                )
                score = sum(
                    max((weight for field, weight in fields if term in field), default=0)
                    for term in terms
                )
                if score or not terms:
                    matches.append((score, {
                        "source": source,
                        "chapter": chapter_title,
                        "title": title,
                        "summary": summary,
                        "url": url,
                    }))

    matches.sort(key=lambda match: match[0], reverse=True)
    return [case for _, case in matches]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("catalog", help="Path to sitemap.xml, or - to read stdin")
    parser.add_argument("keywords", nargs="*", help="Search terms or quoted phrases")
    parser.add_argument("--source", help="Exact source title or route ID")
    parser.add_argument("--limit", type=int, default=8, help="Maximum results (default: 8)")
    args = parser.parse_args()

    terms = set(filter(None, map(normalize, args.keywords)))
    source_filter = normalize(args.source or "")
    if not terms and not source_filter:
        parser.error("provide keywords or --source")
    if args.limit < 1:
        parser.error("--limit must be positive")

    try:
        data = sys.stdin.buffer.read() if args.catalog == "-" else Path(args.catalog).read_bytes()
        catalog = ElementTree.fromstring(data)
    except (OSError, ElementTree.ParseError) as error:
        parser.error(f"could not read UI Lab XML catalog: {error}")
    if catalog.tag != "sitemap" or catalog.find("./collection/chapter/case") is None:
        parser.error("expected the UI Lab sitemap with collection/chapter/case entries")

    matches = search_cases(catalog, terms, source_filter)
    print(json.dumps(matches[:args.limit], ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
