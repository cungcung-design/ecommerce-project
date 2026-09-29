from pathlib import Path

from pypdf import PdfReader


def extract_pdf_text(file_path: Path) -> str:
    reader = PdfReader(file_path)
    pages = []

    for page in reader.pages:
        text = page.extract_text() or ""

        if text.strip():
            pages.append(text)

    return "\n".join(pages)
