// Closing CTA section + primer download card + site footer.

const Closing = () => (
  <>
    <section className="closing" id="register" data-screen-label="07 Closing CTA">
      <div className="closing-inner container">
        <div className="eyebrow" style={{justifyContent: "center", display: "inline-flex", marginBottom: 28}}>
          Phase 1 closes in 9 days
        </div>
        <h2>
          The chain doesn't<br/>
          campaign <em>for you.</em>
        </h2>
        <p className="sub">
          Register early. Tell people what you'd do. Show up where citizens are.
          That's the whole job until election day.
        </p>

        <div className="closing-ctas">
          <a href="https://blockchain.liberland.org" className="btn btn-primary" target="_blank" rel="noopener">
            Register your candidacy
            <ArrowRight />
          </a>
          <a href="#eligibility" className="btn btn-ghost">
            Check eligibility first
          </a>
        </div>

        <a href="primer.html" className="primer-link" target="_blank" rel="noopener">
          <div className="doc-icon" />
          <div>
            <div className="meta">The full primer · v1.0 · 2026</div>
            <h4>How to Stand for Congress — Candidate Primer</h4>
            <p className="desc">
              Long-form, sourced, citizen-facing. Read this before you register.
            </p>
          </div>
          <div className="go">
            Read <ArrowRight size={12} />
          </div>
        </a>
      </div>
    </section>

    <footer className="site-foot">
      <div className="container">
        <div className="foot-grid">
          <div className="foot-brand">
            <div className="motto">“To live and let live.”</div>
            <p>
              The Free Republic of Liberland — sovereign micronation on the
              west bank of the Danube, governed on-chain by its citizens.
            </p>
          </div>
          <div>
            <h5>Candidates</h5>
            <ul>
              <li><a href="#eligibility">Eligibility checker</a></li>
              <li><a href="#how">The three tiers</a></li>
              <li><a href="#timeline">Election timeline</a></li>
              <li><a href="#voting">D21 simulator</a></li>
              <li><a href="primer.html" target="_blank" rel="noopener">Full primer (PDF-ready)</a></li>
            </ul>
          </div>
          <div>
            <h5>On chain</h5>
            <ul>
              <li><a href="https://blockchain.liberland.org" target="_blank" rel="noopener">Liberland dApp</a></li>
              <li><a href="https://liberland.org/blockchain" target="_blank" rel="noopener">Blockchain overview</a></li>
              <li><a href="#">Elections explorer</a></li>
              <li><a href="#">Validator program</a></li>
            </ul>
          </div>
          <div>
            <h5>Read the law</h5>
            <ul>
              <li><a href="https://docs.liberland.org" target="_blank" rel="noopener">docs.liberland.org</a></li>
              <li><a href="#">The Constitution</a></li>
              <li><a href="#">Referendum Law</a></li>
              <li><a href="https://forum.liberland.org" target="_blank" rel="noopener">Citizen Forum</a></li>
            </ul>
          </div>
        </div>

        <div className="foot-bottom">
          <div>Free Republic of Liberland · /candidate · 2026 cycle</div>
          <div>Reference CC-CG-2026-01</div>
        </div>
      </div>
    </footer>
  </>
);

window.Closing = Closing;
