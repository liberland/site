function CorrectionForm() {
  const [values, setValues] = React.useState({});
  const [status, setStatus] = React.useState("idle");
  const fields = window.Data.correctionFields;

  function setField(f, v) {
    setValues((prev) => ({ ...prev, [f]: v }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    const missing = fields.filter((f) => f !== "Urgency or privacy risk" && !values[f]);
    if (missing.length) {
      setStatus("error");
      return;
    }
    await window.SubmissionsAdapter.submit("correction", values);
    setStatus("submitted");
  }

  if (status === "submitted") {
    return (
      <div role="status" className="small" style={{ padding: "16px 0" }}>
        Your correction request has been recorded for review. Nothing is published automatically; the decision, and
        the reasons for it, will appear in the corrections history of the affected record.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {status === "error" && (
        <div role="alert" className="small" style={{ color: "var(--bad-fg)", marginBottom: 14 }}>
          Please complete all required fields before submitting.
        </div>
      )}
      {fields.map((f) => (
        <label key={f} className="field" style={{ marginBottom: 15 }}>
          <span className="field-label">{f}</span>
          <input value={values[f] || ""} onChange={(e) => setField(f, e.target.value)} required={f !== "Urgency or privacy risk"} />
        </label>
      ))}
      <button type="submit" className="btn btn--dark btn-full">Submit correction request</button>
    </form>
  );
}

function ReplyForm() {
  const [values, setValues] = React.useState({ org: "", record: "", statement: "" });
  const [status, setStatus] = React.useState("idle");

  function setField(f, v) {
    setValues((prev) => ({ ...prev, [f]: v }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!values.org || !values.record || !values.statement) {
      setStatus("error");
      return;
    }
    await window.SubmissionsAdapter.submit("right_of_reply", values);
    setStatus("submitted");
  }

  if (status === "submitted") {
    return (
      <div role="status" className="small" style={{ padding: "16px 0" }}>
        Your right of reply has been recorded for review. Replies are published unedited, subject only to privacy
        redaction.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {status === "error" && (
        <div role="alert" className="small" style={{ color: "var(--bad-fg)", marginBottom: 14 }}>
          Please complete organisation/capacity, the record referenced, and your statement.
        </div>
      )}
      <label className="field" style={{ marginBottom: 15 }}>
        <span className="field-label">Organisation or capacity</span>
        <input value={values.org} onChange={(e) => setField("org", e.target.value)} required />
      </label>
      <label className="field" style={{ marginBottom: 15 }}>
        <span className="field-label">Record referenced</span>
        <input value={values.record} onChange={(e) => setField("record", e.target.value)} required />
      </label>
      <label className="field" style={{ marginBottom: 15 }}>
        <span className="field-label">Statement for publication</span>
        <textarea rows="7" value={values.statement} onChange={(e) => setField("statement", e.target.value)} required />
      </label>
      <div className="label-mono" style={{ marginBottom: 18, lineHeight: 1.75, fontSize: 10.5 }}>
        REPLIES ARE PUBLISHED UNEDITED EXCEPT FOR PRIVACY REDACTION. SUBMISSIONS ARE STORED THROUGH AN ABSTRACT
        ADAPTER; NO THIRD-PARTY ANALYTICS OR TRACKING IS PRESENT ON THIS SITE.
      </div>
      <button type="submit" className="btn btn--dark btn-full">Submit reply</button>
    </form>
  );
}

function ReplyPage() {
  return (
    <section className="section section--tight" style={{ maxWidth: 1000 }}>
      <div className="eyebrow" style={{ marginBottom: 22 }}>Right of reply &amp; corrections</div>
      <h1 className="h2" style={{ marginBottom: 24, maxWidth: "20ch" }}>Tell us where this record is wrong</h1>
      <p className="body-text" style={{ fontSize: 19.5, marginBottom: 48 }}>
        Croatian authorities, Hrvatske Šume, police officers, contractors, witnesses and property owners may submit
        a reply or a correction request. Nothing is published automatically; every decision, including refusals, is
        recorded in the corrections history of the affected record.
      </p>
      <div className="card-grid card-grid--2" style={{ marginBottom: 48 }}>
        <div>
          <h2 className="h3" style={{ marginBottom: 20 }}>Request a correction</h2>
          <CorrectionForm />
        </div>
        <div>
          <h2 className="h3" style={{ marginBottom: 20 }}>Submit a right of reply</h2>
          <ReplyForm />
        </div>
      </div>
    </section>
  );
}

window.BWWR_ReplyPage = ReplyPage;
