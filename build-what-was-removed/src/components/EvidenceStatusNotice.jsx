// Reusable disclaimer required on every total, every incident page, and above
// the donation form. Text is verbatim from the handoff document — do not
// paraphrase it; see CONTENT-GUIDE.md.
function EvidenceStatusNotice({ variant = "full", linkToEvidence }) {
  const full = window.Data.EVIDENCE_NOTICE;

  if (variant === "compact") {
    return (
      <div className="evidence-notice evidence-notice--compact">
        <span className="label-mono">EVIDENCE&nbsp;NOTICE</span>
        <p style={{ margin: 0, fontSize: 16, lineHeight: 1.62, color: "var(--muted-2)", maxWidth: "110ch" }}>
          Claimed values are allegations contained in identified complaints or witness accounts unless expressly
          marked as adjudicated. A claimed value is not a court award. Temporary seizures are never counted as
          permanent losses.{" "}
          {linkToEvidence && (
            <a
              href={window.Router.pathFor("evidence")}
              onClick={(e) => {
                e.preventDefault();
                window.Router.navigate("evidence");
              }}
            >
              Read the full evidence notice →
            </a>
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="evidence-notice" role="note" aria-label="Evidence status notice">
      {full}
    </div>
  );
}

window.BWWR_EvidenceStatusNotice = EvidenceStatusNotice;
