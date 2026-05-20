// Wallet picker — 4 cards (SubWallet, Talisman, Polkadot.js, Ledger) shown
// in the "Get on the chain" section.

const WALLETS = [
  {
    name: "SubWallet",
    type: "Mobile · Browser",
    tag: "Recommended",
    desc: "The wallet the docs are written around. Mobile app works well on iOS and Android, plus a browser extension for desktop.",
    glyph: "SW",
    accent: "var(--gold)",
    url: "https://www.subwallet.app/",
  },
  {
    name: "Talisman",
    type: "Browser extension",
    tag: "Desktop",
    desc: "Polished browser extension. Strong UX for managing multiple Substrate accounts at once.",
    glyph: "T",
    accent: "#FF3D75",
    url: "https://talisman.xyz/",
  },
  {
    name: "Polkadot.js",
    type: "Browser extension",
    tag: "Technical",
    desc: "The reference extension. Less polished but maximally compatible — works with everything in the Substrate world.",
    glyph: "{·}",
    accent: "#E6007A",
    url: "https://polkadot.js.org/extension/",
  },
  {
    name: "Ledger",
    type: "Hardware · Polkadot app",
    tag: "Cold storage",
    desc: "If you hold significant LLD/LLM, use hardware. Install the Polkadot app on your Ledger to sign Liberland transactions.",
    glyph: "▣",
    accent: "var(--navy-mid)",
    url: "https://www.ledger.com/",
  },
];

const STEPS = [
  {
    num: "1.",
    title: "Confirm your status on liberland.org",
    body:
      "Sign in. Confirm your citizenship is active and your Merit balance is ≥ 5,000. Fix anything off-chain first — then move on.",
  },
  {
    num: "2.",
    title: "Install a wallet",
    body:
      "Pick one of the four. Save the 12-word seed phrase on paper. Don't photograph it. Don't sync it to a cloud password manager.",
  },
  {
    num: "3.",
    title: "Claim at blockchain.liberland.org",
    body:
      "Open the dApp where your wallet lives (or scan-pair from mobile). Follow the on-screen flow to claim citizenship and Merits. Merits typically arrive within one business day.",
  },
  {
    num: "4.",
    title: "Set your identity",
    body:
      "On the dApp profile, click Update identity. Set display name, legal name, and candidacy website — 32 character limit per field. Use a URL shortener for long links.",
  },
];

const Onboard = () => (
  <section className="section onboard-section" id="onboard" data-screen-label="03 Onboarding">
    <div className="container">
      <div className="section-head">
        <div>
          <div className="section-num">§ 02 · Get on the chain</div>
          <h2>Wallet, citizenship,<br/><em>identity.</em></h2>
        </div>
        <p className="lead">
          The current chain is Substrate, the same framework Polkadot uses. Standard
          Polkadot-ecosystem wallets work. If you haven't onboarded yet, this is the
          short version of how.
        </p>
      </div>

      <div className="steps-row">
        {STEPS.map((s) => (
          <div className="step-card" key={s.num}>
            <div className="step-num">{s.num}</div>
            <div className="step-body">
              <h4>{s.title}</h4>
              <p>{s.body}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="onboard-sub">Pick a wallet</h3>

      <div className="wallets">
        {WALLETS.map((w) => (
          <a className="wallet-card" href={w.url} target="_blank" rel="noopener" key={w.name}>
            <div className="wallet-glyph" style={{background: w.accent}}>
              {w.glyph}
            </div>
            <div className="wallet-body">
              <div className="wallet-head">
                <div className="wallet-name">{w.name}</div>
                <div className="wallet-tag">{w.tag}</div>
              </div>
              <div className="wallet-type">{w.type}</div>
              <p>{w.desc}</p>
            </div>
            <div className="wallet-go"><ArrowRight size={12} /></div>
          </a>
        ))}
      </div>

      <div className="seed-warning">
        <div className="sw-icon">⚠</div>
        <div>
          <h4>The seed phrase is the only key</h4>
          <p>
            If you lose your 12 words, nobody — not the Citizenship Office, not the
            validators, not the Provisional Government — can recover your account.
            If someone else gets them, they have your political identity and your Merits.
            Paper. Safe. No photos. Tell no one.
          </p>
        </div>
      </div>
    </div>
  </section>
);

window.Onboard = Onboard;
