# E6(R3) Transition Readiness Tool

**AI-powered compliance analysis for clinical trial documents against ICH E6(R3)**

![License](https://img.shields.io/badge/license-MIT-blue)
![ICH E6(R3)](https://img.shields.io/badge/ICH_E6(R3)-Jan_2025-green)
![Status](https://img.shields.io/badge/status-beta-orange)

---

## The Problem

With ICH E6(R3) adopted January 6, 2025, and the EMA enforcing compliance since July 2025, clinical research organizations face a massive transition challenge:

- **SOP gap analysis** across dozens of documents against a fundamentally restructured guideline
- **Cross-document inconsistencies** — protocols, ICFs, monitoring plans, and SOPs that contradict each other
- **No clear "good enough" benchmark** — teams update documents but can't validate alignment
- **Version drift** — amended documents that degrade compliance without anyone noticing
- **Training gaps** — staff still operating with R2 mindset on R3-governed trials

67% of organizations report needing 2-3x more change management effort than initially planned. Most implementations experience 3-6 month delays due to validation cycles alone.

## What This Tool Does

The E6(R3) Transition Readiness Tool helps clinical operations, quality, and regulatory teams assess their document suite against ICH E6(R3) requirements — not as a replacement for expert review, but as a first-pass gap analysis that surfaces issues before they become inspection findings.

### Core Capabilities

| Feature | Description |
|---|---|
| **Multi-Document Workspace** | Upload and analyze protocols, ICFs, IBs, SOPs, monitoring plans, SAPs, DMPs, and CSRs individually against E6(R3) |
| **Cross-Document Analysis** | Compare 2+ documents to identify inconsistencies, gaps, alignment issues, and dependency failures across your document suite |
| **Version Comparison** | Track compliance trajectory between document versions — what was resolved, what's new, what persists |
| **Section Checklists** | Deterministic coverage of every Appendix B protocol element and all 22 ICF elements from Section 2.8.10 |

### How It Differs From Asking Claude Directly

| Claude Chat | This Tool |
|---|---|
| Freeform conversation; coverage depends on what you ask | Structured, repeatable analysis with deterministic section coverage |
| Single document at a time | Multi-document cross-referencing identifies inter-document conflicts |
| No version tracking | Side-by-side version comparison with compliance trajectory |
| Generic GCP knowledge | Embedded E6(R3) structural knowledge with exact section mapping |
| Prose output you have to parse | Severity-scored findings with section refs, excerpts, and actionable recommendations |

## Tech Stack

- **Frontend**: React 18 + Vite, Tailwind-inspired styling, Lucide icons, Recharts
- **API**: Serverless function (Netlify Functions / Vercel API routes) proxying to Anthropic Claude API
- **AI Model**: Claude Sonnet 4 with embedded ICH E6(R3) compliance knowledge base
- **Deployment**: Netlify or Vercel (one-click from repo)

## Getting Started

### Prerequisites

- Node.js 18+
- An Anthropic API key ([get one here](https://console.anthropic.com/))

### Local Development

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/e6r3-readiness-tool.git
cd e6r3-readiness-tool

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Add your Anthropic API key to .env

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

Set the environment variable `ANTHROPIC_API_KEY` in your Netlify dashboard under Site Settings → Environment Variables.

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Set `ANTHROPIC_API_KEY` in your Vercel project's Environment Variables.

## Project Structure

```
e6r3-readiness-tool/
├── api/
│   └── analyze.js              # Serverless API route (Vercel-compatible)
├── netlify/
│   └── functions/
│       └── analyze.js          # Serverless function (Netlify-compatible)
├── src/
│   ├── components/
│   │   ├── App.jsx             # Main application shell + tab routing
│   │   ├── WorkspaceTab.jsx    # Document upload & individual analysis
│   │   ├── CrossRefTab.jsx     # Cross-document analysis
│   │   ├── CompareTab.jsx      # Version comparison
│   │   ├── ChecklistTab.jsx    # Section-by-section checklists
│   │   └── ui/                 # Shared UI components
│   │       ├── FindingCard.jsx
│   │       ├── ScoreRing.jsx
│   │       ├── SeverityBadge.jsx
│   │       ├── DocCard.jsx
│   │       └── LoadingOverlay.jsx
│   ├── lib/
│   │   ├── api.js              # API client (calls serverless function)
│   │   ├── constants.js        # Document types, severity config, ICH sections
│   │   ├── prompts.js          # System prompts & analysis prompt builders
│   │   └── fileUtils.js        # File reading utilities
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── public/
│   └── favicon.svg
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## ICH E6(R3) Coverage

The tool's embedded knowledge base covers the complete ICH E6(R3) structure:

- **11 Overarching Principles** (Section II) — ethics, informed consent, IRB/IEC, scientific soundness, qualified individuals, quality by design, proportionality, protocol clarity, reliable results, roles/responsibilities, IP management
- **Annex 1 Sections 1-4** — IRB/IEC, Investigator, Sponsor, Data Governance
- **Appendix A** — Investigator's Brochure requirements including RSI
- **Appendix B** — Protocol content requirements (B.1-B.16)
- **Appendix C** — Essential records (criteria-based approach)

Key R2→R3 changes flagged during analysis:
- Quality by Design & Critical-to-Quality factors
- Proportionate risk-based approaches
- New Data Governance section (Section 4)
- Computerised systems validation (4.3.4)
- Centralised monitoring emphasis
- Expanded service provider oversight (3.6)
- Criteria-based essential records (Appendix C)
- eConsent and remote consent support
- Quality tolerance limits (3.10.1.3)

## Limitations & Disclaimer

This tool provides AI-assisted compliance analysis for **informational purposes only**. It does not constitute regulatory, legal, or professional advice.

- AI analysis may miss nuances that a qualified GCP auditor would catch
- Document parsing depends on file format — PDF works best; DOCX text extraction may be limited
- Cross-reference analysis quality improves with more complete document sets
- Always validate findings with qualified regulatory professionals before making compliance decisions
- Not a substitute for formal gap analysis conducted by experienced GCP consultants

## About

Built by **Steve Stork** — a clinical operations and technology professional with 15+ years of experience spanning biopharma (Sage Therapeutics), CROs (IQVIA), clinical technology vendors (OpenClinica), and academic medical centers/investigative sites (NYU Langone). Veeva Vault Platform Fundamentals and Business Administrator Certified.

This tool reflects the intersection of hands-on clinical trial conduct experience (site → sponsor → CRO → vendor) with clinical data systems implementation expertise. The cross-document analysis capability addresses a gap identified through direct experience with the operational challenge of maintaining document consistency across a trial's TMF during guideline transitions.

## License

MIT — see [LICENSE](LICENSE) for details.

## Contributing

Contributions welcome. Areas of particular interest:

- Additional document-type-specific checklists (e.g., DSUR, IND annual report)
- Annex 2 coverage when finalized (pragmatic/decentralized trials)
- Export to audit-ready DOCX/PDF report format
- Persistent storage for remediation tracking
- Regional regulatory overlay (EU CTR, FDA 21 CFR alignment)
