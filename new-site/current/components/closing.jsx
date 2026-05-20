// Closing CTA + primer card + footer — current-system links.

const Closing = () => (
  <>
    <section className="closing" id="register" data-screen-label="09 Closing CTA">
      <div className="closing-inner container">
        <div className="eyebrow" style={{justifyContent: "center", display: "inline-flex", marginBottom: 28}}>
          Cycle in progress · apply any day
        </div>
        <h2>
          The chain doesn't<br/>
          campaign <em>for you.</em>
        </h2>
        <p className="sub">
          Apply early. Submit a program. Submit a spot. Show up for a debate.
          That's the whole job until the next election moment.
        </p>

        <div className="closing-ctas">
          <a href="https://blockchain.liberland.org" className="btn btn-primary" target="_blank" rel="noopener">
            Apply via the Congress tab
            <ArrowRight />
          </a>
          <a href="#eligibility" className="btn btn-ghost">
            Check eligibility first
          </a>
        </div>

        <a href="primer-current.html" className="primer-link" target="_blank" rel="noopener">
          <div className="doc-icon" />
          <div>
            <div className="meta">The full primer · current system · 2026</div>
            <h4>How to Stand for Congress — Current Blockchain</h4>
            <p className="desc">
              Long-form, sourced, citizen-facing. Read this before you apply.
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
              <li><a href="#onboard">Get on the chain</a></li>
              <li><a href="#how">The three tiers</a></li>
              <li><a href="#take-action">Take action</a></li>
              <li><a href="#voting">Phragmén explainer</a></li>
              <li><a href="primer-current.html" target="_blank" rel="noopener">Full primer (PDF-ready)</a></li>
            </ul>
          </div>
          <div>
            <h5>On chain</h5>
            <ul>
              <li><a href="https://blockchain.liberland.org" target="_blank" rel="noopener">Liberland dApp</a></li>
              <li><a href="https://blockchain.liberland.org/home/profile" target="_blank" rel="noopener">My profile</a></li>
              <li><a href="https://liberland.org/elections" target="_blank" rel="noopener">Candidate pages</a></li>
              <li><a href="https://liberland.org/blockchain" target="_blank" rel="noopener">Blockchain overview</a></li>
            </ul>
          </div>
          <div>
            <h5>Read the law</h5>
            <ul>
              <li><a href="https://docs.liberland.org" target="_blank" rel="noopener">docs.liberland.org</a></li>
              <li><a href="#">The Constitution</a></li>
              <li><a href="https://forum.liberland.org" target="_blank" rel="noopener">Citizen Forum</a></li>
              <li><a href="https://liberland.org/profile" target="_blank" rel="noopener">Citizenship dashboard</a></li>
            </ul>
          </div>
        </div>

        <div className="foot-bottom">
          <div>Free Republic of Liberland · /candidate · current system</div>
          <div>Reference CC-CG-CUR-01</div>
        </div>
      </div>
    </footer>
  </>
);

window.Closing = Closing;
