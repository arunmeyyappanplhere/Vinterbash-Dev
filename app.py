# app.py
# Sanskrit KWIC Search — Streamlit UI
# Imports all logic from kwic_search.py

import streamlit as st
import pdfplumber
import io
import pandas as pd

from kwic_search import (
    tokenize,
    parse_custom_nouns,
    get_participant_hints,
    resolve_variants,
    build_kwic,
    sort_kwic,
    find_participants,
    compute_ttr,
    word_frequency,
)

# ── Page config ────────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="Sanskrit KWIC Search",
    page_icon="🪔",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── CSS ────────────────────────────────────────────────────────────────────────
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600&family=Inter:wght@300;400;500;600&display=swap');

html, body, [class*="css"] { font-family: 'Inter', sans-serif; }

.stApp { background: #0f0e17; color: #fffffe; }
#MainMenu, footer, header { visibility: hidden; }

[data-testid="stSidebar"] { background: #1a1828 !important; border-right: 1px solid #2e2b4a; }
[data-testid="stSidebar"] * { color: #a7a3c2 !important; }
[data-testid="stSidebar"] h1,
[data-testid="stSidebar"] h2,
[data-testid="stSidebar"] h3 { color: #fffffe !important; }

.hero {
    background: linear-gradient(135deg, #1a1828 0%, #2d1b4e 100%);
    border: 1px solid #3d2d6e; border-radius: 16px;
    padding: 2rem 2.5rem; margin-bottom: 1.5rem;
    position: relative; overflow: hidden;
}
.hero::before {
    content: "॰"; position: absolute; right: 2rem; top: 50%;
    transform: translateY(-50%); font-size: 7rem; color: #3d2d6e;
    font-family: 'Noto Sans Devanagari', sans-serif; line-height: 1;
}
.hero h1 { font-size: 2rem; font-weight: 600; color: #fffffe; margin: 0 0 0.4rem 0; }
.hero p  { color: #a7a3c2; font-size: 0.95rem; margin: 0; }
.badge {
    display: inline-block; background: #3d2d6e; color: #c4b5fd;
    font-size: 0.72rem; font-weight: 500; padding: 3px 10px;
    border-radius: 20px; margin-bottom: 0.6rem;
    letter-spacing: 0.05em; text-transform: uppercase;
}

.metric-row { display: flex; gap: 12px; margin-bottom: 1.5rem; flex-wrap: wrap; }
.metric-card {
    flex: 1; min-width: 120px;
    background: #1a1828; border: 1px solid #2e2b4a;
    border-radius: 12px; padding: 1rem 1.25rem;
}
.metric-card .val { font-size: 1.8rem; font-weight: 600; color: #c4b5fd; line-height: 1; }
.metric-card .lbl { font-size: 0.75rem; color: #6b6888; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em; }

.ttr-card {
    background: #1b3a2d; border: 1px solid #065f46;
    border-radius: 12px; padding: 1rem 1.5rem; margin-bottom: 1.25rem;
}
.ttr-card .ttr-val { font-size: 2.2rem; font-weight: 700; color: #6ee7b7; }
.ttr-card .ttr-lbl { font-size: 0.8rem; color: #a7f3d0; margin-top: 2px; }
.ttr-card .ttr-explain { font-size: 0.82rem; color: #6ee7b7; margin-top: 8px; }

.kwic-container {
    background: #1a1828; border: 1px solid #2e2b4a;
    border-radius: 12px; overflow: hidden; margin-top: 1rem;
}
.kwic-header {
    background: #13111f; padding: 0.75rem 1.25rem;
    border-bottom: 1px solid #2e2b4a;
    display: flex; justify-content: space-between; align-items: center;
}
.kwic-header-title { font-size: 0.8rem; font-weight: 500; color: #6b6888; text-transform: uppercase; letter-spacing: 0.08em; }
.kwic-row-wrapper { padding: 0 1.25rem; }
.kwic-row {
    display: grid; grid-template-columns: 32px 1fr auto 1fr;
    gap: 0; align-items: center;
    border-bottom: 1px solid #1f1d30; padding: 0.6rem 0;
}
.kwic-row:last-child { border-bottom: none; }
.kwic-row:hover { background: #13111f; border-radius: 6px; }
.kwic-num  { font-size: 0.72rem; color: #3d3a5c; text-align: right; padding-right: 12px; }
.kwic-left { font-family: 'Noto Sans Devanagari','Inter',sans-serif; font-size: 0.9rem; color: #a7a3c2; text-align: right; padding-right: 16px; line-height: 1.6; }
.kwic-keyword { font-family: 'Noto Sans Devanagari','Inter',sans-serif; font-size: 0.9rem; font-weight: 600; color: #0f0e17; background: #c4b5fd; padding: 3px 12px; border-radius: 20px; white-space: nowrap; text-align: center; }
.kwic-right { font-family: 'Noto Sans Devanagari','Inter',sans-serif; font-size: 0.9rem; color: #a7a3c2; padding-left: 16px; line-height: 1.6; }

.event-card { background: #1a1828; border: 1px solid #2e2b4a; border-radius: 12px; padding: 1rem 1.25rem; margin-bottom: 0.75rem; }
.event-title { font-size: 0.8rem; font-weight: 600; color: #c4b5fd; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.5rem; }
.event-context { font-family: 'Noto Sans Devanagari','Inter',sans-serif; font-size: 0.88rem; color: #fffffe; line-height: 1.7; margin-bottom: 0.5rem; }
.participant-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 0.5rem; }
.participant-tag { background: #2d1b4e; color: #c4b5fd; font-size: 0.72rem; padding: 3px 10px; border-radius: 20px; font-weight: 500; }
.event-tag { display: inline-block; background: #1b3a2d; color: #6ee7b7; font-size: 0.72rem; padding: 3px 10px; border-radius: 20px; font-weight: 500; margin-right: 6px; }

.stTextInput > div > div > input {
    background: #1a1828 !important; border: 1px solid #3d2d6e !important;
    border-radius: 10px !important; color: #fffffe !important;
    font-family: 'Noto Sans Devanagari','Inter',sans-serif !important;
    font-size: 1rem !important; padding: 0.6rem 1rem !important;
}
.stTextInput > div > div > input:focus { border-color: #c4b5fd !important; box-shadow: 0 0 0 2px rgba(196,181,253,0.15) !important; }
.stSelectbox > div > div { background: #1a1828 !important; border: 1px solid #3d2d6e !important; border-radius: 10px !important; color: #fffffe !important; }
.stButton > button { background: #6d28d9 !important; color: #fffffe !important; border: none !important; border-radius: 10px !important; font-weight: 500 !important; padding: 0.5rem 1.5rem !important; }
.stButton > button:hover { background: #7c3aed !important; }
.stTextArea textarea { background: #1a1828 !important; border: 1px solid #3d2d6e !important; border-radius: 10px !important; color: #fffffe !important; font-family: 'Noto Sans Devanagari','Inter',sans-serif !important; }
div[data-testid="stFileUploader"] { background: #1a1828 !important; border: 1px dashed #3d2d6e !important; border-radius: 12px !important; }
.stTabs [data-baseweb="tab-list"] { background: #13111f !important; border-radius: 10px !important; padding: 4px !important; gap: 4px !important; }
.stTabs [data-baseweb="tab"] { background: transparent !important; color: #6b6888 !important; border-radius: 8px !important; font-weight: 500 !important; }
.stTabs [aria-selected="true"] { background: #3d2d6e !important; color: #c4b5fd !important; }
[data-testid="stExpander"] { background: #1a1828 !important; border: 1px solid #2e2b4a !important; border-radius: 12px !important; }
</style>
""", unsafe_allow_html=True)


# ── PDF extractor ──────────────────────────────────────────────────────────────
def extract_pdf(file_bytes: bytes) -> str:
    parts = []
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            t = page.extract_text()
            if t:
                parts.append(t)
    return "\n".join(parts)


# ── Session state ──────────────────────────────────────────────────────────────
if "tokens"    not in st.session_state: st.session_state.tokens    = []
if "raw_text"  not in st.session_state: st.session_state.raw_text  = ""
if "processed" not in st.session_state: st.session_state.processed = False


# ══════════════════════════════════════════════════════════════════════════════
#  SIDEBAR
# ══════════════════════════════════════════════════════════════════════════════
with st.sidebar:
    st.markdown("## ⚙️ Search Settings")

    ctx_size = st.slider("Context window (words each side)", 2, 15, 5)

    match_mode = st.selectbox(
        "Match mode",
        ["exact", "contains", "starts"],
        format_func=lambda x: {"exact": "Exact match", "contains": "Contains", "starts": "Starts with"}[x],
    )

    sort_by = st.selectbox("Sort results by", ["Position in text", "Left context", "Right context"])

    st.markdown("---")
    st.markdown("### 📚 Your Special Noun Groups")
    st.markdown("One group per line. Format:")
    st.code("word = variant1, variant2, देवनागरी", language=None)

    custom_nouns_input = st.text_area(
        "Define your noun groups",
        height=220,
        label_visibility="collapsed",
        placeholder="hanuman = hanuman, हनुमान, maruti, anjaneya\nsita = sita, सीता, janaki\nrama = rama, राम, raghava\nlanka = lanka, लंका, lankapuri",
    )

    SPECIAL_NOUNS    = parse_custom_nouns(custom_nouns_input)
    PARTICIPANT_HINTS = get_participant_hints(SPECIAL_NOUNS)

    if SPECIAL_NOUNS:
        st.success(f"{len(SPECIAL_NOUNS)} noun group(s) loaded")
    else:
        st.caption("No groups defined yet — plain search still works.")

    st.markdown("---")
    st.markdown("### ℹ️ About")
    st.markdown(
        "Sanskrit KWIC Search — annotation pipeline for Sanskrit NLP. "
        "Supports Devanagari & IAST transliteration."
    )


# ══════════════════════════════════════════════════════════════════════════════
#  HERO
# ══════════════════════════════════════════════════════════════════════════════
st.markdown("""
<div class="hero">
  <div class="badge">Sanskrit NLP Annotation Tool</div>
  <h1>🪔 Sanskrit KWIC Search</h1>
  <p>Keyword-In-Context search · Type-Token Ratio · Event & Participant Extraction</p>
</div>
""", unsafe_allow_html=True)


# ══════════════════════════════════════════════════════════════════════════════
#  TABS
# ══════════════════════════════════════════════════════════════════════════════
tab1, tab2, tab3 = st.tabs(["📥  Load Text", "🔍  KWIC Search", "📊  Corpus Stats & TTR"])


# ─────────────────────────────────────────────────────────────────────────────
#  TAB 1 — LOAD TEXT
# ─────────────────────────────────────────────────────────────────────────────
with tab1:
    st.markdown("### Load your Sanskrit corpus")
    col_a, col_b = st.columns(2)

    with col_a:
        st.markdown("**Option 1 — Upload a PDF**")
        uploaded_pdf = st.file_uploader("Choose a Sanskrit PDF", type=["pdf"], label_visibility="collapsed")
        if uploaded_pdf:
            with st.spinner("Extracting text from PDF…"):
                try:
                    raw = extract_pdf(uploaded_pdf.read())
                    st.session_state.raw_text = raw
                    st.success(f"PDF loaded — {len(raw)} characters extracted")
                except Exception as e:
                    st.error(f"Could not read PDF: {e}")

    with col_b:
        st.markdown("**Option 2 — Paste Sanskrit text**")
        pasted = st.text_area(
            "Paste text here", height=220,
            placeholder="यदा यदा हि धर्मस्य…\nOr paste IAST transliteration…",
            label_visibility="collapsed",
        )
        if pasted.strip():
            st.session_state.raw_text = pasted.strip()

    col_s1, col_s2 = st.columns([1, 3])
    with col_s1:
        if st.button("Load sample corpus"):
            try:
                with open("corpus.txt", encoding="utf-8") as f:
                    st.session_state.raw_text = f.read()
                st.success("Sample corpus loaded!")
            except FileNotFoundError:
                st.error("corpus.txt not found in project folder.")

    st.markdown("---")

    if st.session_state.raw_text:
        st.markdown(f"**Preview** ({len(st.session_state.raw_text)} characters):")
        st.code(
            st.session_state.raw_text[:500] + ("…" if len(st.session_state.raw_text) > 500 else ""),
            language=None,
        )
        if st.button("⚡ Process & Index Text", use_container_width=True):
            with st.spinner("Tokenising and indexing…"):
                st.session_state.tokens    = tokenize(st.session_state.raw_text)
                st.session_state.processed = True
            st.success(f"✓ Indexed {len(st.session_state.tokens)} tokens — go to Search tab!")
    else:
        st.info("Upload a PDF or paste text above, then click Process.")


# ─────────────────────────────────────────────────────────────────────────────
#  TAB 2 — KWIC SEARCH
# ─────────────────────────────────────────────────────────────────────────────
with tab2:
    if not st.session_state.processed:
        st.info("Go to **Load Text** tab first to load and process your corpus.")
    else:
        tokens = st.session_state.tokens
        ttr    = compute_ttr(tokens)

        # Metric row
        st.markdown(f"""
        <div class="metric-row">
          <div class="metric-card"><div class="val">{ttr['tokens']:,}</div><div class="lbl">Total Tokens</div></div>
          <div class="metric-card"><div class="val">{ttr['types']:,}</div><div class="lbl">Unique Types</div></div>
          <div class="metric-card"><div class="val">{ttr['ttr']}%</div><div class="lbl">Type-Token Ratio</div></div>
          <div class="metric-card"><div class="val">{len(SPECIAL_NOUNS)}</div><div class="lbl">Noun Groups</div></div>
        </div>
        """, unsafe_allow_html=True)

        # Search bar
        col_inp, col_btn = st.columns([4, 1])
        with col_inp:
            query = st.text_input(
                "Search keyword",
                placeholder="Type a word — e.g. रामः  or  dharma  or  sita",
                label_visibility="collapsed",
            )
        with col_btn:
            search_clicked = st.button("Search 🔍", use_container_width=True)

        if query:
            variants   = resolve_variants(query, SPECIAL_NOUNS)
            is_special = len(variants) > 1

            if is_special:
                st.markdown(
                    f'<span class="event-tag">Special noun expanded</span> '
                    + " · ".join(f"`{v}`" for v in variants),
                    unsafe_allow_html=True,
                )

            results = build_kwic(tokens, variants, ctx_size, match_mode)
            results = sort_kwic(results, sort_by)

            if not results:
                st.warning(f'No occurrences of "{query}" found. Try "contains" match mode.')
            else:
                st.markdown(f"### {len(results)} occurrence{'s' if len(results)>1 else ''} of `{query}`")

                # KWIC table
                rows_html = ""
                for i, r in enumerate(results):
                    left_txt  = " ".join(r["left"])
                    right_txt = " ".join(r["right"])
                    rows_html += f"""
                    <div class="kwic-row">
                      <div class="kwic-num">{i+1}</div>
                      <div class="kwic-left">{left_txt}</div>
                      <div class="kwic-keyword">{r['keyword']}</div>
                      <div class="kwic-right">{right_txt}</div>
                    </div>"""

                st.markdown(f"""
                <div class="kwic-container">
                  <div class="kwic-header">
                    <span class="kwic-header-title">← Left context &nbsp;&nbsp; Keyword &nbsp;&nbsp; Right context →</span>
                    <span class="kwic-header-title">±{ctx_size} words</span>
                  </div>
                  <div class="kwic-row-wrapper">{rows_html}</div>
                </div>
                """, unsafe_allow_html=True)

                # Event & Participant panel (only for special nouns)
                if is_special:
                    st.markdown("---")
                    st.markdown("### 🎭 Event & Participant Analysis")
                    st.markdown(
                        "Since this is a special noun (event/character), "
                        "participants detected in each context window are highlighted below:"
                    )
                    for i, r in enumerate(results):
                        all_ctx      = r["left"] + [r["keyword"]] + r["right"]
                        participants = find_participants(all_ctx, PARTICIPANT_HINTS)
                        p_tags = (
                            "".join(f'<span class="participant-tag">{p}</span>' for p in participants)
                            if participants
                            else '<span style="color:#3d3a5c;font-size:0.78rem">No participants detected in window</span>'
                        )
                        st.markdown(f"""
                        <div class="event-card">
                          <div class="event-title">Occurrence {i+1} · token position {r['pos']}</div>
                          <div class="event-context">
                            {" ".join(r["left"])}
                            <span style="background:#3d2d6e;color:#c4b5fd;padding:2px 8px;border-radius:12px;font-weight:600">{r['keyword']}</span>
                            {" ".join(r["right"])}
                          </div>
                          <div style="font-size:0.72rem;color:#6b6888;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.05em">Participants in context</div>
                          <div class="participant-row">{p_tags}</div>
                        </div>
                        """, unsafe_allow_html=True)

                # Export
                st.markdown("---")
                export_rows = []
                for r in results:
                    all_ctx      = r["left"] + [r["keyword"]] + r["right"]
                    participants = find_participants(all_ctx, PARTICIPANT_HINTS)
                    export_rows.append({
                        "Position":     r["pos"],
                        "Left Context": " ".join(r["left"]),
                        "Keyword":      r["keyword"],
                        "Right Context":  " ".join(r["right"]),
                        "Participants": ", ".join(participants),
                    })
                df_export = pd.DataFrame(export_rows)

                col_e1, col_e2 = st.columns(2)
                with col_e1:
                    csv = df_export.to_csv(index=False).encode("utf-8")
                    st.download_button(
                        "⬇️ Download results as CSV",
                        data=csv,
                        file_name=f"kwic_{query}.csv",
                        mime="text/csv",
                        use_container_width=True,
                    )
                with col_e2:
                    with st.expander("Preview export table"):
                        st.dataframe(df_export, use_container_width=True, hide_index=True)


# ─────────────────────────────────────────────────────────────────────────────
#  TAB 3 — CORPUS STATS & TTR
# ─────────────────────────────────────────────────────────────────────────────
with tab3:
    if not st.session_state.processed:
        st.info("Load and process a text first.")
    else:
        tokens = st.session_state.tokens
        ttr    = compute_ttr(tokens)

        st.markdown("### Type-Token Ratio (TTR)")

        # TTR explanation card
        if ttr["ttr"] >= 70:
            ttr_note = "High TTR — varied vocabulary, low repetition."
        elif ttr["ttr"] >= 40:
            ttr_note = "Medium TTR — moderate repetition, typical of narrative prose."
        else:
            ttr_note = "Low TTR — high repetition, typical of Sanskrit poetry/mantras."

        st.markdown(f"""
        <div class="ttr-card">
          <div class="ttr-val">{ttr['ttr']}%</div>
          <div class="ttr-lbl">Type-Token Ratio</div>
          <div class="ttr-explain">
            {ttr['types']} unique types ÷ {ttr['tokens']} total tokens = {ttr['ttr']}%<br>
            {ttr_note}
          </div>
        </div>
        """, unsafe_allow_html=True)

        st.markdown("""
        **How to read TTR:**
        - **High TTR (~100%)** → lots of varied words, little repetition (like a dictionary)
        - **Low TTR (~0%)** → same words repeat often (like a chant or mantra)
        - Sanskrit epics have **low TTR** because names (Rama, Sita) and sacred words (dharma) repeat deliberately — this is a feature of the poetry style, not a flaw
        """)

        st.markdown("---")
        st.markdown("### Corpus Overview")
        col1, col2, col3, col4 = st.columns(4)
        col1.metric("Total tokens",   f"{ttr['tokens']:,}")
        col2.metric("Unique types",   f"{ttr['types']:,}")
        col3.metric("TTR",            f"{ttr['ttr']}%")
        col4.metric("Characters",     f"{len(st.session_state.raw_text):,}")

        st.markdown("---")
        st.markdown("### Top 20 Most Frequent Words")
        freq     = word_frequency(tokens, top_n=20)
        freq_df  = pd.DataFrame(freq, columns=["Word", "Frequency"])
        st.bar_chart(freq_df.set_index("Word"), color="#c4b5fd")

        st.markdown("---")
        st.markdown("### Special Noun Coverage")
        if SPECIAL_NOUNS:
            coverage = []
            for noun, variants in SPECIAL_NOUNS.items():
                v_norm = [v.strip().lower() for v in variants]
                count  = sum(1 for t in tokens if t.strip().lower() in v_norm)
                coverage.append({"Noun Group": noun, "Occurrences": count, "Variants": len(variants)})
            cov_df = pd.DataFrame(coverage)
            st.dataframe(cov_df, use_container_width=True, hide_index=True)
        else:
            st.caption("Define special noun groups in the sidebar to see coverage.")

        st.markdown("---")
        with st.expander("📄 View raw text"):
            st.text(st.session_state.raw_text)
