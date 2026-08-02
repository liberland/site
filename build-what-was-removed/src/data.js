// Seed data for the public evidence ledger.
// Money is stored in integer minor units (cents) — see DATA-DICTIONARY.md.
// Every field here traces to the handoff document's "Suggested initial incident
// records" section. Do not add values here that aren't backed by a source grade
// of primary_official, primary_legal_filing, primary_private or corroborated_witness.
(function (root, factory) {
  const mod = factory();
  if (typeof module === "object" && module.exports) module.exports = mod;
  if (root) root.Data = mod;
})(typeof window !== "undefined" ? window : undefined, function () {
  const incidents = [
    {
      id: "GS-2023-09-21",
      date: "2023-09-21",
      title: "Settlement dismantling and property removal",
      status: "claimed_unreturned_or_destroyed",
      statusLabel: "CLAIMED UNRETURNED / DESTROYED",
      proc: "CRIMINAL COMPLAINT FILED",
      grade: "primary_legal_filing",
      gradeLabel: "PRIMARY LEGAL FILING",
      valuationScope: "incident_total",
      claimedCents: 5448622,
      includeInLoss: true,
      sources: 4,
      banner: "DISPUTED — CRIMINAL COMPLAINT FILED — NO FINAL FINDING",
      summary:
        "Affected parties allege that structures and private property were destroyed or removed during an operation involving forestry personnel and police. A criminal complaint was filed. The site asserts no final finding of criminal guilt.",
      claimant:
        "The owner reports that a dwelling, tools, communications equipment, a generator and personal belongings were removed or destroyed and were not returned. Witnesses state that no itemised inventory was provided at the scene. The criminal complaint alleges losses of €54,486.22.",
      official:
        "No operative official explanation is presently published in this evidence record. This does not establish that none exists. Any official basis provided will be published here in full.",
      questions: [
        "Which legal power was exercised, and by which competent decision-maker?",
        "Was a written decision with reasons issued before or after the intervention?",
        "Was an itemised inventory of removed property created, and where is it held?",
        "Where is the removed property now, and what preservation steps were taken?",
        "What remedy was made available to the affected parties, and within what period?",
      ],
      itemNote:
        "VALUATION SCOPE: INCIDENT_TOTAL. THE AGGREGATE COMPLAINT VALUE IS COUNTED; ITEM VALUES BELOW ARE INFORMATIONAL AND ARE NOT ADDED TO TOTALS.",
      items: [
        { name: "Dwelling structure and fittings", statusLabel: "CLAIMED DESTROYED", value: "informational" },
        { name: "Hand and power tools", statusLabel: "CLAIMED REMOVED", value: "informational" },
        { name: "Communications equipment", statusLabel: "CLAIMED REMOVED", value: "informational" },
        { name: "Generator", statusLabel: "CLAIMED REMOVED", value: "informational" },
        { name: "Personal belongings and documents", statusLabel: "CLAIMED REMOVED", value: "informational" },
      ],
      srcDocs: [
        { id: "SRC-001", title: "Criminal complaint (Croatian), filed 2023", grade: "PRIMARY LEGAL FILING", limits: "States the claimed aggregate value. Establishes an allegation, not a finding." },
        { id: "SRC-002", title: "Owner witness account, recorded 2023", grade: "SINGLE WITNESS", limits: "Uncorroborated at present. Not used to support monetary totals." },
        { id: "SRC-003", title: "Site photographs, 21–23 September 2023", grade: "PRIMARY PRIVATE", limits: "Publication pending redaction approval. Faces must be blurred; EXIF removed on build." },
        { id: "SRC-004", title: "Campaign internal loss summary", grade: "INTERNAL SUMMARY", limits: "Derived document. Excluded from aggregate totals." },
      ],
      timeline: [
        { date: "2023-09-21", text: "Intervention reported at the settlement site." },
        { date: "2023-09", text: "Criminal complaint filed recording €54,486.22 in claimed losses." },
        { date: "2024–2025", text: "Documentation, valuation and primary-source review continuing. No final decision recorded in this dataset." },
        { date: "Open", text: "Procedural status: criminal complaint filed. No final finding." },
      ],
    },
    {
      id: "GS-2024-02-16",
      date: "2024-02-16",
      title: "Swan houseboat intervention",
      status: "disputed_removal",
      statusLabel: "DISPUTED REMOVAL",
      proc: "DOCUMENTATION INCOMPLETE",
      grade: "unverified",
      gradeLabel: "UNVERIFIED",
      valuationScope: "incident_total",
      claimedCents: null,
      includeInLoss: false,
      sources: 1,
      banner: "DISPUTED REMOVAL — DOCUMENTATION INCOMPLETE — EXCLUDED FROM TOTALS",
      summary:
        "Campaign records report removal of the Swan houseboat. The operative legal basis, procedural outcome and valuation require further primary-document review.",
      claimant:
        "Campaign records report the removal. No valuation is published, and no monetary claim from this incident enters any aggregate on this site.",
      official:
        "No operative official explanation is presently published in this evidence record. This does not establish that none exists.",
      questions: [
        "What legal basis was relied on?",
        "Where is the vessel now?",
        "Was any inventory or certificate issued?",
        "Is a valuation supported by an acquisition document?",
      ],
      itemNote: "NO VALUATION PUBLISHED. EVIDENCE GRADE UNVERIFIED — EXCLUDED FROM ALL AGGREGATES.",
      items: [{ name: "Swan houseboat", statusLabel: "DISPUTED REMOVAL", value: "not valued" }],
      srcDocs: [{ id: "SRC-010", title: "Campaign internal record", grade: "UNVERIFIED", limits: "Not sufficient to support a published value or an allegation of unlawfulness." }],
      timeline: [
        { date: "2024-02-16", text: "Removal reported in campaign records." },
        { date: "Open", text: "Primary-document review outstanding." },
      ],
    },
    {
      id: "GS-2024-05-18",
      date: "2024-05-18",
      title: "Construction intervention",
      status: "disputed_demolition",
      statusLabel: "DISPUTED DEMOLITION",
      proc: "DOCUMENTATION INCOMPLETE",
      grade: "unverified",
      gradeLabel: "UNVERIFIED",
      valuationScope: "incident_total",
      claimedCents: null,
      includeInLoss: false,
      sources: 1,
      banner: "DISPUTED DEMOLITION — DOCUMENTATION INCOMPLETE — EXCLUDED FROM TOTALS",
      summary:
        "Internal records report an intervention affecting construction activity. No final legal conclusion or complete valuation is published.",
      claimant:
        "Internal records report the intervention. The campaign does not assert that it was unlawful; that question is unresolved on the present record.",
      official:
        "No operative official explanation is presently published in this evidence record. This does not establish that none exists.",
      questions: [
        "Was a construction-law decision issued?",
        "Was the action proportionate to the stated purpose?",
        "What materials were removed, and were they inventoried?",
      ],
      itemNote: "NO VALUATION PUBLISHED. EXCLUDED FROM ALL AGGREGATES.",
      items: [{ name: "Construction materials and works", statusLabel: "DISPUTED DEMOLITION", value: "not valued" }],
      srcDocs: [{ id: "SRC-020", title: "Campaign internal record", grade: "UNVERIFIED", limits: "Insufficient to support a published value." }],
      timeline: [
        { date: "2024-05-18", text: "Intervention reported in internal records." },
        { date: "Open", text: "Documentation incomplete." },
      ],
    },
    {
      id: "GS-2026-07-02",
      date: "2026-07-02",
      title: "Temporary camping-equipment seizure",
      status: "temporary_administrative_seizure",
      statusLabel: "TEMPORARY SEIZURE",
      proc: "MISDEMEANOUR PROCESS NOT FINAL",
      grade: "primary_official",
      gradeLabel: "PRIMARY OFFICIAL",
      valuationScope: "item_total",
      seizureCents: 12000,
      includeInLoss: false,
      sources: 2,
      banner: "TEMPORARY ADMINISTRATIVE SEIZURE — MISDEMEANOUR PROCESS NOT FINAL — NOT A PERMANENT LOSS",
      summary:
        "An inspector issued an itemised temporary-seizure certificate in connection with alleged unauthorised camping. The legality or proportionality may be disputed, but the property is not classified as stolen or permanently lost.",
      claimant:
        "The owner reports that the listed items were taken into temporary custody. The owner disputes the proportionality of the measure. The property remains subject to a process that is not final.",
      official:
        "An itemised temporary-seizure certificate was issued by the inspecting authority, listing five items. The certificate is the operative official record for this incident.",
      questions: [
        "Is the seizure proportionate to the alleged camping offence?",
        "What is the deadline for return if the process concludes without penalty?",
        "Is the itemisation complete and accurate?",
      ],
      itemNote:
        "VALUATION SCOPE: ITEM_TOTAL. ITEM VALUES ARE COUNTED; NO INCIDENT-LEVEL AGGREGATE EXISTS. TEMPORARY SEIZURES NEVER ENTER THE CLAIMED PERMANENT LOSS METRIC.",
      items: [
        { name: "Sleeping bag", statusLabel: "TEMPORARY SEIZURE", value: "€30.00" },
        { name: "Pillow", statusLabel: "TEMPORARY SEIZURE", value: "€10.00" },
        { name: "Inflatable mattress", statusLabel: "TEMPORARY SEIZURE", value: "€10.00" },
        { name: "Black case with green mat", statusLabel: "TEMPORARY SEIZURE", value: "€20.00" },
        { name: "Blue bag with green pillow and folding mat", statusLabel: "TEMPORARY SEIZURE", value: "€50.00" },
      ],
      srcDocs: [
        { id: "SRC-030", title: "Temporary-seizure certificate, 2 July 2026", grade: "SEIZURE CERTIFICATE", limits: "Official itemised record. Establishes the fact and scope of the seizure, not its lawfulness." },
        { id: "SRC-031", title: "Owner photographs of listed items", grade: "PRIMARY PRIVATE", limits: "Supports identification only. Publication pending redaction approval." },
      ],
      timeline: [
        { date: "2026-07-02", text: "Itemised temporary-seizure certificate issued in connection with alleged unauthorised camping." },
        { date: "Open", text: "Misdemeanour process not final. Property not classified as permanently lost." },
      ],
    },
  ];

  const items = [
    { incidentId: "GS-2026-07-02", name: "Sleeping bag", category: "Camping equipment", owner: "Resident A", cents: 3000 },
    { incidentId: "GS-2026-07-02", name: "Pillow", category: "Camping equipment", owner: "Resident A", cents: 1000 },
    { incidentId: "GS-2026-07-02", name: "Inflatable mattress", category: "Camping equipment", owner: "Resident A", cents: 1000 },
    { incidentId: "GS-2026-07-02", name: "Black case with green mat", category: "Camping equipment", owner: "Resident A", cents: 2000 },
    { incidentId: "GS-2026-07-02", name: "Blue bag with green pillow and folding mat", category: "Camping equipment", owner: "Resident A", cents: 5000 },
  ];

  const budget = [
    { id: "evidence", name: "Evidence preservation", desc: "Archiving, redaction, hashing, storage and independent custody of primary documents and images.", targetCents: 2400000, receivedCents: 642000, spentCents: 318000, report: "REPORT R-2026-Q1" },
    { id: "legal", name: "Croatian legal recovery", desc: "Counsel in Croatia, filings, translations, expert valuation and procedural costs.", targetCents: 6000000, receivedCents: 1490000, spentCents: 924000, report: "REPORT R-2026-Q1" },
    { id: "infra", name: "Replacement of essential infrastructure", desc: "Shelter, power, water, sanitation and communications equipment to restore basic function.", targetCents: 4500000, receivedCents: 815000, spentCents: 560000, report: "REPORT R-2026-Q1" },
    { id: "safety", name: "Safety and environmental compliance", desc: "Waste, fire, sanitation and visitor protocols, plus independent environmental review.", targetCents: 1800000, receivedCents: 230000, spentCents: 90000, report: "PENDING" },
    { id: "accounting", name: "Public accounting and independent review", desc: "Bookkeeping, publication of financial reports and external review of this campaign’s own accounts.", targetCents: 1200000, receivedCents: 305000, spentCents: 145000, report: "REPORT R-2026-Q1" },
  ];

  const grades = [
    { key: "primary_official", label: "Primary official", desc: "Decisions, certificates and records issued by a public authority.", totals: "COUNTS", tone: "ok" },
    { key: "primary_legal_filing", label: "Primary legal filing", desc: "Complaints and filings lodged with a court or prosecutor. Establishes an allegation, not a finding.", totals: "COUNTS", tone: "ok" },
    { key: "primary_private", label: "Primary private", desc: "Invoices, ownership documents and contemporaneous photographs held by the owner.", totals: "COUNTS", tone: "ok" },
    { key: "corroborated_witness", label: "Corroborated witness", desc: "An account supported by at least one independent source.", totals: "COUNTS", tone: "ok" },
    { key: "single_witness", label: "Single witness", desc: "One uncorroborated account. Published with attribution.", totals: "CASE BY CASE", tone: "warn" },
    { key: "advocacy_reference", label: "Advocacy reference", desc: "Campaign or third-party advocacy material.", totals: "EXCLUDED", tone: "bad" },
    { key: "unverified", label: "Unverified", desc: "Reported but not yet supported by a reviewable primary source.", totals: "EXCLUDED", tone: "bad" },
  ];

  const policies = [
    { title: "Chain of custody", body: "Every published source records its issuer, date, language, grade, SHA-256 hash and the claims it supports. Originals are held privately; only approved redacted files are ever served." },
    { title: "Redaction policy", body: "Publication fails closed: nothing is displayed unless its redaction status is approved. Signatures, identity numbers, private addresses and payment details are removed. Faces are blurred. EXIF metadata is stripped at build time." },
    { title: "Corrections policy", body: "Anyone may request a correction. Every request, and the decision on it, is published in the corrections history of the affected record, with the fields that changed." },
    { title: "Double counting", body: "Each incident declares a valuation scope. Either the authoritative aggregate counts and item values are informational, or complete item values count and the aggregate is disabled — never both." },
    { title: "Currency", body: "Native-currency totals are primary. EUR and CZK are never silently added. Any conversion states its rate, date and source, and can be switched off. Money is held in integer minor units." },
    { title: "Limitations", body: "This is an evidence archive, not a court. Where the official position is unknown, the record says so, and says that silence here does not establish that no explanation exists." },
  ];

  const approvedTerms = [
    "Documented Recovery Value",
    "Claimed Permanent Loss",
    "Property Reported Removed or Destroyed",
    "Value Alleged in Filed Complaints",
    "Temporary Administrative Seizure",
    "Returned or Recovered",
    "Adjudicated Award",
  ];

  const prohibitedTerms = [
    "Total Stolen",
    "Thieves / robbers",
    "Criminal officers",
    "Corrupt authority",
    "Proven theft",
    "State-organised looting",
  ];

  const casePillars = [
    { n: "01", title: "Rule of law", body: "Public power should be exercised under a clear legal basis by a competent decision-maker, with written reasons capable of review. The campaign does not assert that any particular intervention was unlawful; it asserts that the record required to test that question should exist and should be disclosable." },
    { n: "02", title: "Property safeguards", body: "Where property is removed, an itemised inventory, a preservation duty and a return or compensation route are the minimum standards. Difficult territorial questions do not eliminate the need to document, preserve and account for private property." },
    { n: "03", title: "Environmental stewardship", body: "An environmental mandate should protect a forest. The settlement project will publish waste, sanitation, fire, safety and visitor protocols, and will seek independent environmental review rather than resist it." },
    { n: "04", title: "Peaceful settlement", body: "A permanent, nonviolent community is a practical alternative to recurring confrontation and unmanaged uncertainty. The campaign is funded to document rather than to confront." },
    { n: "05", title: "Regional economic opportunity", body: "The long-term vision includes lawful low-impact accommodation, boating, cycling, education, cultural exchange, local purchasing and cooperation with neighbouring communities." },
    { n: "06", title: "Acknowledgement of Croatian interests", body: "Croatia has legitimate border-security, environmental, navigation, construction, camping and public-safety interests. The proposition is not that those interests are illegitimate, but that they should be implemented through clear powers, written reasons, itemised records, proportional action, preservation of property and effective remedies." },
    { n: "07", title: "Unresolved legal questions", body: "Sovereignty, permitted use and the lawfulness of each intervention are unresolved on this record. No court has established Liberland sovereignty or an unrestricted right to build, and this site does not claim otherwise." },
  ];

  const correctionFields = [
    "Page or record",
    "Disputed statement",
    "Proposed correction",
    "Supporting source",
    "Contact details",
    "Consent to publication",
    "Urgency or privacy risk",
  ];

  const EVIDENCE_NOTICE =
    "This website documents property reported as removed, destroyed, seized or not returned during interventions affecting the Gornja Siga settlement project. Descriptions of criminal conduct are allegations contained in identified complaints or witness accounts unless expressly marked as adjudicated. “Claimed value” is not a court award. Temporary seizures are not treated as permanent losses unless the property is finally forfeited, destroyed or remains unreturned after the applicable process. Corrections and official responses are invited.";

  return {
    incidents,
    items,
    budget,
    grades,
    policies,
    approvedTerms,
    prohibitedTerms,
    casePillars,
    correctionFields,
    EVIDENCE_NOTICE,
  };
});
