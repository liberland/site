// Shared site data. One file to edit when the facts change.

/* ============================================================
   ⚠ PLACEHOLDER FIGURES
   Every number in this block is illustrative and must be replaced
   with audited, real values before this site goes live. Nothing
   here has been verified. The brand voice rule is "never a claim
   without a figure behind it" — which cuts both ways.

   Protocol facts are NOT in this block. They live in CHAIN below
   and are sourced from the audit-freeze release.
   ============================================================ */
const PLACEHOLDER = {
  parcelsTokenised: "112",
  arkPhaseUnits:    "48",
  arkPhaseSold:     "31",
  buildersShipping: "24",
  grantPool:        "250,000",
};

/* ============================================================
   CHAIN — the protocol Votula operates.

   Every value below is transcribed from the frozen release
   `audit-freeze-2026-08-03` of the Liberland EVM repository:
   docs/Protocol-Parameters.md, docs/Architecture.md,
   docs/Internal-Audit-Report.md and docs/Audit-Scope.md.

   These are real. If the repository changes, change them here
   and nowhere else.
   ============================================================ */
const CHAIN = {
  name:    "Liberland EVM",
  repo:    "https://github.com/Balazs091/Liberland-blockchain",
  release: "https://github.com/Balazs091/Liberland-blockchain/releases/tag/audit-freeze-2026-08-03",
  tag:     "audit-freeze-2026-08-03",
  frozen:  "3 August 2026",

  /* Build profile — docs/Audit-Scope.md */
  build: {
    solidity:  "0.8.36",
    evm:       "osaka",
    optimizer: "200 runs",
    framework: "Foundry 1.7.1",
    slither:   "Slither 0.11.5",
  },

  /* Freeze evidence — docs/Internal-Audit-Report.md */
  evidence: {
    testsPassed:     "335",
    testsFailed:     "0",
    invariants:      "17",
    invariantRuns:   "256 runs · 65,536 handler calls",
    coverageLines:      "78.87%",
    coverageStatements: "82.30%",
    coverageBranches:   "43.67%",
    coverageFunctions:  "86.10%",
    sizeLimit:       "24,576",
    largestContract: "SenateApp",
    largestSize:     "24,232",
    largestMargin:   "344",
    slitherRaw:      "366",
    slitherReviewed: "43",
    verdict: "Code candidate and constitutional source verified. Not approved for Ethereum mainnet launch.",
  },

  /* The four layers — docs/Architecture.md */
  layers: [
    {
      id: "core",
      name: "Core",
      colour: "var(--yellow)",
      note: "The execution trust root. Never repointable.",
      modules: ["ConstitutionKernel", "GovernanceRouter", "ActionTimelock"],
    },
    {
      id: "registries",
      name: "Registries",
      colour: "var(--lagoon)",
      note: "Stable facts and accounting. The source of truth.",
      modules: [
        "IdentityRegistry", "StakeRegistry", "ElectorateRegistry", "ReferendumRegistry",
        "CongressCandidateRegistry", "SenateSeatRegistry", "PresidentRegistry", "ExecutiveRegistry",
        "OfficeRegistry", "BudgetEnvelopeRegistry", "LegislationRegistry", "LandRegistry",
        "CompanyRegistry", "StakeLienRegistry",
      ],
    },
    {
      id: "policies",
      name: "Policies",
      colour: "var(--danube-lift)",
      note: "Replaceable rules evaluated over registry facts.",
      modules: [
        "CitizenEligibilityPolicy", "VotingPowerPolicy", "CandidateEligibilityPolicy",
        "CongressElectionPolicy", "ReferendumPolicy", "SenatePowersPolicy", "UnstakingPolicy",
        "TreasurySpendingPolicy", "OfficePermissionPolicy", "LandPartyPolicy",
        "LendingRiskParameterPolicy", "KinkedInterestRatePolicy", "FixedLlmUsdcPriceOraclePolicy",
      ],
    },
    {
      id: "apps",
      name: "Apps",
      colour: "var(--sunset-soft)",
      note: "Bounded citizen and government workflows.",
      modules: [
        "IdentityApp", "LLMStakingVault", "ReferendumApp", "CongressElectionApp", "SenateApp",
        "PublicVetoApp", "HeadOfStateApp", "CabinetApp", "DecisionApp", "OfficeExecutor",
        "TreasuryVault", "PayoutQueue", "MinistryTreasury", "LandRegistryApp",
        "CompanyRegistryApp", "USDCLendingPoolApp",
      ],
    },
  ],

  /* Parameter tables — docs/Protocol-Parameters.md */
  params: {
    network: {
      title: "Network and Congress",
      cols: ["Parameter", "Ethereum mainnet", "Sepolia demo"],
      rows: [
        ["Chain ID", "1", "11155111"],
        ["Congress seats", "7", "2"],
        ["Runner-up slots", "2", "2"],
        ["Maximum candidates", "9", "8"],
        ["Nomination minimum", "2 days", "1 day"],
        ["Voting minimum", "3 days", "2 days"],
        ["Recurring cycle", "90 days", "3 days"],
        ["Election end boundary", "17:00 UTC", "17:00 UTC"],
      ],
    },
    llm: {
      title: "LLM, identity and stake",
      cols: ["Parameter", "Both networks"],
      rows: [
        ["LLM decimals", "18"],
        ["LLM hard cap", "70,000,000 LLM"],
        ["Minimum citizen stake", "5,000 LLM"],
        ["Minimum candidate stake", "6,000 LLM"],
        ["Candidate bond", "6,000 LLM"],
        ["Citizen proposal bond", "6,000 LLM"],
        ["Unstake welfare period", "30 days"],
        ["Wallet-migration delay", "2 days"],
      ],
    },
    thresholds: {
      title: "Referenda and constitutional thresholds",
      cols: ["Parameter", "Both networks"],
      rows: [
        ["Citizen-origin ordinary quorum", "10,000 LLM turnout"],
        ["Congress-origin ordinary quorum", "8,000 LLM turnout"],
        ["Ordinary voting minimum", "7 days"],
        ["Emergency voting duration", "3 days"],
        ["Standard adoption delay", "7 days"],
        ["Constitutional supporting headcount", "50% of electorate"],
        ["Constitutional supporting stake", "65% of weighted turnout"],
      ],
    },
    senate: {
      title: "Senate, executive and public veto",
      cols: ["Parameter", "Both networks"],
      rows: [
        ["Senate capacity", "100 seats"],
        ["Minimum cancellation support", "2 seats"],
        ["Disbursement suspension", "30 days"],
        ["Public veto threshold", "2 eligible citizens"],
        ["President term", "1,825 days"],
        ["Prime Minister term", "1,825 days"],
        ["Minister term", "1,825 days"],
      ],
    },
    timelocks: {
      title: "Timelocks and treasury",
      cols: ["Parameter", "Both networks"],
      rows: [
        ["Module governance delay", "2 days"],
        ["Budget approval delay", "1 day"],
        ["Legislation enactment delay", "1 day"],
        ["Treasury disbursement delay", "2 days"],
        ["Default execution window", "7 days"],
        ["Standard payout pre-route delay", "6 hours"],
        ["Sensitive payout pre-route delay", "1 day"],
      ],
    },
    lending: {
      title: "Launch lending",
      cols: ["Parameter", "Ethereum mainnet", "Sepolia demo"],
      rows: [
        ["Borrow asset", "External 6-decimal USDC", "MockUSDC"],
        ["Fixed launch price", "1 LLM = 2 USDC", "1 LLM = 2 USDC"],
        ["Maximum LTV", "30%", "30%"],
        ["Liquidation threshold", "40%", "40%"],
        ["Liquidation bonus", "15%", "15%"],
        ["Reserve factor", "15%", "15%"],
        ["Aggregate borrow cap", "1,000,000 USDC", "1,000,000 USDC"],
        ["Per-person debt cap", "100,000 USDC", "Unlimited"],
        ["Utilization kink", "80%", "80%"],
        ["Borrow APR at 0 / kink / 100%", "5% · 13% · 113%", "5% · 13% · 113%"],
      ],
    },
  },

  /* Deliberate constraints — docs/Architecture.md, verbatim in substance */
  constraints: [
    "No hidden super-admin or emergency backdoor.",
    "No unrestricted executor and no arbitrary calldata execution.",
    "No sensitive queued-action bypass, and no action executes twice.",
    "No Congress unrestricted technical control.",
    "No registry pointer swap without an externally reviewed migration.",
    "No population-sized constitutional snapshot transaction.",
    "No standing Congress ballots across cycles.",
    "No production dependency on demo minting or onboarding powers.",
    "No generic land-record override and no placeholder fee custody.",
  ],
};

const COMPANY = {
  name:     "Votula, Ltd.",
  city:     "Victoria, Seychelles",
  parent:   "Liberland",
  parentUrl:"https://liberland.org",
  arkUrl:   "https://ark.ll.land",
  email:    "hello@votula.com",
  domain:   "votula.com",
};

const NAV_LINKS = [
  { href: "protocol.html", label: "Protocol",  id: "protocol" },
  { href: "property.html", label: "Property",  id: "property" },
  { href: "llm.html",      label: "LLM",       id: "llm" },
  { href: "builders.html", label: "Builders",  id: "builders" },
  { href: "company.html",  label: "Company",   id: "company" },
  { href: "docs.html",     label: "Docs",      id: "docs" },
];

const FOOTER_COLUMNS = [
  {
    title: "Protocol",
    links: [
      { href: "protocol.html", label: "Liberland EVM" },
      { href: "protocol.html#modules", label: "Module map" },
      { href: "protocol.html#parameters", label: "Parameters" },
      { href: "protocol.html#audit", label: "Audit status" },
    ],
  },
  {
    title: "Product",
    links: [
      { href: "property.html", label: "Land and property" },
      { href: "llm.html", label: "LLM, stake and lending" },
      { href: "builders.html", label: "Build on Liberland" },
      { href: "docs.html", label: "Integration docs" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "company.html", label: "About Votula" },
      { href: "company.html#structure", label: "How we are structured" },
      { href: "company.html#compliance", label: "Compliance" },
      { href: "brand.html", label: "Brand language" },
    ],
  },
  {
    title: "Source",
    links: [
      { href: CHAIN.release, label: "Audit freeze ↗", external: true },
      { href: CHAIN.repo, label: "Repository ↗", external: true },
      { href: "https://liberland.org", label: "Liberland ↗", external: true },
      { href: "https://ark.ll.land", label: "Ark Village ↗", external: true },
    ],
  },
];

/* The one joke per page lives here so nobody writes two. */
const MARQUEE = [
  "SUN", "·", "WAVE", "·", "BLOCK", "·",
  "LAND", "·", "LEDGER", "·", "LIBERTY", "·",
];

const DISCLAIMER =
  "Votula, Ltd. is a company registered in Victoria, Seychelles. Nothing on this site is an offer to sell " +
  "or a solicitation to buy any security, token, or interest in property, and nothing here is investment, " +
  "legal, or tax advice. The Liberland EVM protocol is frozen for external audit and is not approved for " +
  "Ethereum mainnet launch; the internal audit report is engineering evidence, not an independent audit. " +
  "Tokenised property carries risk, including total loss of capital and the risk that an interest cannot be " +
  "sold when you want to sell it. Offerings are made only to eligible participants under the terms of the " +
  "relevant offering documents, and availability depends on your jurisdiction.";

window.VT_DATA = { PLACEHOLDER, CHAIN, COMPANY, NAV_LINKS, FOOTER_COLUMNS, MARQUEE, DISCLAIMER };
