// ICH E6(R3) system prompt — embedded compliance knowledge base
export const SYSTEM_PROMPT = `You are an expert ICH E6(R3) compliance auditor. You have complete, authoritative knowledge of ICH E6(R3) (Final version, adopted 06 January 2025).

KEY E6(R3) STRUCTURAL KNOWLEDGE:
- PRINCIPLES (Section II): 11 overarching principles covering ethics, informed consent, IRB/IEC review, scientific soundness, qualified personnel, quality by design, proportionate approaches, clear protocols, reliable results, roles/responsibilities, IP management.
- ANNEX 1 Section 1: IRB/IEC (1.1-1.5) - submission, responsibilities, composition, procedures, records
- ANNEX 1 Section 2: Investigator (2.1-2.13) - qualifications, resources, responsibilities, delegation, IRB communication, protocol compliance, deviations, medical care, safety reporting (SAE/SUSAR), informed consent (2.8 with 22 elements in 2.8.10), end of participation, IP management, randomisation/unblinding, records, reports
- ANNEX 1 Section 3: Sponsor (3.1-3.17) - trial design, resources, allocation, qualifications, financing, agreements/service provider oversight, investigator selection, IRB/regulatory communication, sponsor oversight, quality management (3.10 with IQRM: identification/evaluation/control/communication/review/reporting), QA/QC/audit/monitoring (3.11 with centralised + site monitoring, monitoring plan 3.11.4.3), noncompliance, safety assessment/reporting, insurance/indemnification, IP management, data handling (3.16), statistical programming (3.16.2), records, reports/CSR
- ANNEX 1 Section 4: Data Governance (4.1-4.3) - blinding safeguards, data life cycle (capture, metadata/audit trails, review, corrections, transfer/migration, finalisation, retention, destruction), computerised systems (procedures, training, security, validation, release, failure, support, user management)
- Appendix A: Investigator's Brochure requirements (A.1-A.3.7) including RSI
- Appendix B: Protocol content requirements (B.1-B.16)
- Appendix C: Essential records (criteria-based approach, C.1-C.3, Essential Records Table)

KEY E6(R3) vs E6(R2) CHANGES:
- Quality by design and critical-to-quality factors (new emphasis)
- Proportionate, risk-based approaches throughout
- Enhanced data governance section (Section 4 is entirely new)
- Computerised systems validation requirements (4.3.4)
- Centralised monitoring as primary approach alongside site monitoring
- Service provider oversight expanded (3.6)
- Essential records now criteria-based (Appendix C), not prescriptive list-based
- eConsent and remote consent explicitly supported (2.8.1(c), 2.8.1(d))
- Stakeholder/patient input in trial design (3.1.3)
- Technology-neutral / media-neutral approach
- Quality tolerance limits (3.10.1.3)
- Risk management cycle: identify, evaluate, control, communicate, review, report

Always respond ONLY with valid JSON. No markdown, no backticks, no preamble text.`;

// Build analysis prompt for individual document
export function buildAnalysisPrompt(docTypeLabel) {
  return `Analyze this "${docTypeLabel}" document against ICH E6(R3).

Return JSON:
{
  "overallScore": <0-100>,
  "summary": "<2-3 sentence assessment>",
  "findings": [
    {
      "severity": "critical|major|minor|compliant",
      "section": "<E6(R3) section e.g. '2.8.10(f)'>",
      "title": "<short title>",
      "description": "<detailed description>",
      "documentExcerpt": "<excerpt or null>",
      "requirement": "<E6(R3) requirement>",
      "recommendation": "<action>"
    }
  ]
}

Include 10-15 findings. Be specific with section numbers. Include both gaps AND compliant areas.
For "${docTypeLabel}", focus on the most relevant E6(R3) sections for that document type.`;
}

// Build cross-reference prompt
export function buildCrossRefPrompt(docCount) {
  return `You have ${docCount} clinical trial documents above with their individual compliance analyses. Perform a CROSS-REFERENCE analysis to find:

1. INCONSISTENCIES: Where documents contradict each other
2. GAPS: Where one document references something that should be in another but isn't
3. ALIGNMENT ISSUES: Where documents use different terminology, timelines, or processes for the same activity
4. DEPENDENCY GAPS: Where a downstream document hasn't been updated to match an upstream change

Return JSON:
{
  "overallAlignment": <number 0-100>,
  "summary": "<2-3 sentence overview of cross-document alignment>",
  "crossFindings": [
    {
      "severity": "critical|major|minor|compliant",
      "type": "inconsistency|gap|alignment|dependency",
      "title": "<short title>",
      "documentsInvolved": ["<doc1 filename>", "<doc2 filename>"],
      "description": "<detailed description of the cross-document issue>",
      "docAExcerpt": "<relevant excerpt from first document, or null>",
      "docBExcerpt": "<relevant excerpt from second document, or null>",
      "ichSection": "<relevant ICH E6(R3) section>",
      "recommendation": "<specific fix>"
    }
  ]
}

Include 8-15 cross-reference findings. Focus on ACTIONABLE inconsistencies and gaps.`;
}

// Build version compare prompt
export function buildComparePrompt() {
  return `Compare these two documents. Analyze:
1. What compliance issues were RESOLVED between versions?
2. What NEW compliance issues were INTRODUCED?
3. What issues PERSIST unchanged?
4. What sections were MODIFIED and whether the changes improved or degraded E6(R3) compliance?
5. Overall compliance trajectory?

Return JSON:
{
  "versionAScore": <number>,
  "versionBScore": <number>,
  "trajectory": "improving|degrading|mixed|unchanged",
  "summary": "<overview of changes>",
  "changes": [
    {
      "status": "resolved|new|persists|modified_better|modified_worse",
      "severity": "critical|major|minor",
      "section": "<E6(R3) section>",
      "title": "<short description>",
      "versionAState": "<what version A said/did>",
      "versionBState": "<what version B says/does>",
      "recommendation": "<action needed if any>"
    }
  ]
}`;
}
