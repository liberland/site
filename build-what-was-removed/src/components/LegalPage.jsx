function LegalPage({ section }) {
  React.useEffect(() => {
    if (section) {
      const el = document.getElementById(section);
      if (el) el.scrollIntoView();
    }
  }, [section]);

  return (
    <section className="section section--tight">
      <div className="eyebrow" style={{ marginBottom: 22 }}>Legal</div>
      <h1 className="h2" style={{ marginBottom: 48, maxWidth: "20ch" }}>Terms, privacy and disclaimers</h1>

      <div id="terms" style={{ padding: "32px 0", borderTop: "1px solid var(--rule-strong)" }}>
        <h2 className="h3" style={{ marginBottom: 14 }}>Terms of use</h2>
        <p className="body-text">
          This site is published by the Gornja Siga Settlement Campaign as a documentation and fundraising
          resource. It is not legal advice, not an investment offering, and not a guarantee of any outcome in any
          proceeding. TODO — final terms of use pending the recipient legal entity's confirmation and counsel review.
        </p>
      </div>

      <div id="privacy" style={{ padding: "32px 0", borderTop: "1px solid var(--rule-strong)" }}>
        <h2 className="h3" style={{ marginBottom: 14 }}>Privacy notice</h2>
        <p className="body-text">
          No third-party analytics or tracking is present on this site by default. Correction and right-of-reply
          submissions are stored through an abstract adapter (see EVIDENCE-PUBLICATION-CHECKLIST.md) and are not
          published automatically. Passport numbers, dates of birth, home addresses, payment details, signatures and
          the identities of uninvolved private persons are redacted before publication. TODO — data controller
          contact details pending recipient entity confirmation.
        </p>
      </div>

      <div id="donation-terms" style={{ padding: "32px 0", borderTop: "1px solid var(--rule-strong)" }}>
        <h2 className="h3" style={{ marginBottom: 14 }}>Donation terms</h2>
        <p className="body-text">
          Donations confer no ownership, financial return, citizenship right, land title or investment interest.
          This is a donation/crowdfunding campaign, not an investment offering. No live payment method is enabled.
          TODO — recipient legal entity, payment provider, supported currencies and refund policy required before
          any payment method is enabled.
        </p>
      </div>

      <div id="evidence-disclaimer" style={{ padding: "32px 0", borderTop: "1px solid var(--rule-strong)" }}>
        <h2 className="h3" style={{ marginBottom: 14 }}>Evidence disclaimer</h2>
        <div className="evidence-notice">{window.Data.EVIDENCE_NOTICE}</div>
      </div>
    </section>
  );
}

window.BWWR_LegalPage = LegalPage;
