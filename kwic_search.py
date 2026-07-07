# kwic_search.py
# Core KWIC logic — tokenization, search, TTR, special noun expansion

import re
from collections import Counter


# ── Tokenizer ─────────────────────────────────────────────────────────────────

def tokenize(text: str) -> list:
    """Split Sanskrit text into tokens, stripping punctuation."""
    cleaned = re.sub(r'[।॥\.,:;!?\(\)\[\]{}"\'""\'\'—\-]', ' ', text)
    return [t for t in cleaned.split() if t.strip()]


def normalize(word: str) -> str:
    """Lowercase + strip for comparison."""
    return word.strip().lower()


# ── Special Noun Parser ────────────────────────────────────────────────────────

def parse_custom_nouns(text: str) -> dict:
    """
    Parse user-defined special noun groups from sidebar text area.
    Format per line:  word = variant1, variant2, देवनागरी
    Returns dict: { canonical: [variant1, variant2, ...] }
    """
    result = {}
    for line in text.strip().splitlines():
        line = line.strip()
        if not line or "=" not in line:
            continue
        key, _, vals = line.partition("=")
        key = key.strip().lower()
        variants = [v.strip() for v in vals.split(",") if v.strip()]
        if key and variants:
            result[key] = variants
    return result


def get_participant_hints(special_nouns: dict) -> list:
    """
    Build a flat list of all variant forms from special nouns.
    Used to detect participants in event context windows.
    """
    hints = []
    for variants in special_nouns.values():
        for v in variants:
            h = normalize(v)
            if h not in hints:
                hints.append(h)
    return hints


def resolve_variants(query: str, special_nouns: dict) -> list:
    """
    If query matches a special noun group, return all its variants.
    Otherwise return the query itself as a single-item list.
    """
    q = normalize(query)
    for canonical, variants in special_nouns.items():
        all_forms = [normalize(v) for v in variants]
        if q == canonical or q in all_forms:
            return all_forms
    return [q]


# ── Match ──────────────────────────────────────────────────────────────────────

def token_matches(token: str, variants: list, mode: str) -> bool:
    """Check if a token matches any variant under the given match mode."""
    t = normalize(token)
    for v in variants:
        if mode == "exact" and t == v:
            return True
        if mode == "contains" and v in t:
            return True
        if mode == "starts" and t.startswith(v):
            return True
    return False


# ── KWIC Builder ───────────────────────────────────────────────────────────────

def build_kwic(tokens: list, variants: list, ctx: int, mode: str) -> list:
    """
    Find all occurrences of variants in tokens.
    Returns list of dicts: { pos, keyword, left, right }
    """
    results = []
    for i, tok in enumerate(tokens):
        if token_matches(tok, variants, mode):
            left  = tokens[max(0, i - ctx): i]
            right = tokens[i + 1: min(len(tokens), i + 1 + ctx)]
            results.append({
                "pos":     i,
                "keyword": tok,
                "left":    left,
                "right":   right,
            })
    return results


def sort_kwic(results: list, sort_by: str) -> list:
    """Sort KWIC results by position, left context, or right context."""
    if sort_by == "Left context":
        return sorted(results, key=lambda r: normalize(r["left"][-1]) if r["left"] else "")
    if sort_by == "Right context":
        return sorted(results, key=lambda r: normalize(r["right"][0]) if r["right"] else "")
    return results


# ── Participant Finder ─────────────────────────────────────────────────────────

def find_participants(context_tokens: list, participant_hints: list) -> list:
    """
    Scan context window tokens and return any that match participant hints.
    participant_hints is built from the user's special noun definitions.
    """
    found = []
    for tok in context_tokens:
        if normalize(tok) in participant_hints and tok not in found:
            found.append(tok)
    return found


# ── TTR ────────────────────────────────────────────────────────────────────────

def compute_ttr(tokens: list) -> dict:
    """
    Compute Type-Token Ratio (TTR).
    TTR = unique words / total words
    High TTR => varied vocabulary.
    Low TTR  => repetitive text (common in Sanskrit poetry).
    """
    if not tokens:
        return {"tokens": 0, "types": 0, "ttr": 0.0}
    total  = len(tokens)
    unique = len(set(normalize(t) for t in tokens))
    return {
        "tokens": total,
        "types":  unique,
        "ttr":    round(unique / total * 100, 2),
    }


# ── Word Frequency ─────────────────────────────────────────────────────────────

def word_frequency(tokens: list, top_n: int = 20) -> list:
    """Return top_n most frequent words as list of (word, count) tuples."""
    freq = Counter(normalize(t) for t in tokens)
    return freq.most_common(top_n)
