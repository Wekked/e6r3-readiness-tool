import { XCircle, AlertTriangle, Info, CheckCircle, Layers, Link2, GitCompare, ClipboardCheck } from 'lucide-react';

export const DOCUMENT_TYPES = [
  { value: 'protocol', label: 'Clinical Trial Protocol', icon: '📋', shortLabel: 'Protocol' },
  { value: 'icf', label: 'Informed Consent Form', icon: '✍️', shortLabel: 'ICF' },
  { value: 'ib', label: "Investigator's Brochure", icon: '📖', shortLabel: 'IB' },
  { value: 'sop', label: 'Standard Operating Procedure', icon: '📑', shortLabel: 'SOP' },
  { value: 'monitoring_plan', label: 'Monitoring Plan', icon: '🔍', shortLabel: 'Mon. Plan' },
  { value: 'sap', label: 'Statistical Analysis Plan', icon: '📊', shortLabel: 'SAP' },
  { value: 'dmp', label: 'Data Management Plan', icon: '🗃️', shortLabel: 'DMP' },
  { value: 'csr', label: 'Clinical Study Report', icon: '📝', shortLabel: 'CSR' },
  { value: 'other', label: 'Other Trial Document', icon: '📄', shortLabel: 'Other' }
];

export const SEVERITY_CONFIG = {
  critical: { color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', label: 'Critical', icon: XCircle, weight: 0 },
  major: { color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', label: 'Major', icon: AlertTriangle, weight: 1 },
  minor: { color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE', label: 'Minor', icon: Info, weight: 2 },
  compliant: { color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', label: 'Compliant', icon: CheckCircle, weight: 3 }
};

export const TABS = [
  { id: 'workspace', label: 'Document Workspace', icon: Layers },
  { id: 'cross_ref', label: 'Cross-Reference', icon: Link2 },
  { id: 'compare', label: 'Version Compare', icon: GitCompare },
  { id: 'checklist', label: 'Section Checklist', icon: ClipboardCheck }
];

export const PROTOCOL_CHECKLIST = [
  { ref: 'B.1', label: 'General Information (title, ID, sponsor, dates)' },
  { ref: 'B.2', label: 'Background Information (IB summary, risk-benefit, route/dose justification)' },
  { ref: 'B.3', label: 'Trial Objectives & Purpose (estimands if defined)' },
  { ref: 'B.4', label: 'Trial Design (endpoints, blinding, randomisation, schedule of events)' },
  { ref: 'B.5', label: 'Selection of Participants (inclusion/exclusion, screening)' },
  { ref: 'B.6', label: 'Discontinuation & Withdrawal procedures' },
  { ref: 'B.7', label: 'Treatment & Interventions (dose, concomitant meds, adherence)' },
  { ref: 'B.8', label: 'Assessment of Efficacy' },
  { ref: 'B.9', label: 'Assessment of Safety (AE/SAE procedures, follow-up)' },
  { ref: 'B.10', label: 'Statistical Considerations (sample size, analysis plan, interim)' },
  { ref: 'B.11', label: 'Direct Access to Source Records' },
  { ref: 'B.12', label: 'Quality Control & QA (CTQ factors, monitoring, noncompliance)' },
  { ref: 'B.13', label: 'Ethics' },
  { ref: 'B.14', label: 'Data Handling & Record Keeping' },
  { ref: 'B.15', label: 'Financing & Insurance' },
  { ref: 'B.16', label: 'Publication Policy' }
];

export const ICF_CHECKLIST = [
  { ref: '2.8.10(a)', label: 'Purpose of the trial' },
  { ref: '2.8.10(b)', label: 'Trial involves research; summary of experimental aspects' },
  { ref: '2.8.10(c)', label: 'IP(s) and probability of random assignment' },
  { ref: '2.8.10(d)', label: 'Trial procedures including invasive procedures' },
  { ref: '2.8.10(e)', label: 'What is expected of participants' },
  { ref: '2.8.10(f)', label: 'Foreseeable risks/inconveniences (including embryo/foetus)' },
  { ref: '2.8.10(g)', label: 'Reasonably expected benefits (or statement of none)' },
  { ref: '2.8.10(h)', label: 'Alternative procedures/treatments and their risks/benefits' },
  { ref: '2.8.10(i)', label: 'Compensation/treatment for trial-related injury' },
  { ref: '2.8.10(j)', label: 'Anticipated prorated compensation' },
  { ref: '2.8.10(k)', label: 'Anticipated expenses for participation' },
  { ref: '2.8.10(l)', label: 'Voluntary participation; right to withdraw without penalty' },
  { ref: '2.8.10(m)', label: 'Follow-up for those who stop/withdraw' },
  { ref: '2.8.10(n)', label: 'Data handling on withdrawal; direct access consent' },
  { ref: '2.8.10(o)', label: 'Direct access for monitors/auditors/regulators/IRB' },
  { ref: '2.8.10(p)', label: 'Confidentiality of records; trial registration' },
  { ref: '2.8.10(q)', label: 'Timely communication of new information' },
  { ref: '2.8.10(r)', label: 'Contact persons for questions and trial-related injury' },
  { ref: '2.8.10(s)', label: 'Foreseeable reasons for termination of participation' },
  { ref: '2.8.10(t)', label: 'Expected duration of participation' },
  { ref: '2.8.10(u)', label: 'Approximate number of participants' },
  { ref: '2.8.10(v)', label: 'Results and treatment info availability' }
];
