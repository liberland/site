// Docs — the developer entry point for Liberland EVM.
// Sourced from frontend-export/FRONTEND-HOWTO.md at the frozen tag.
// The generated ABIs are authoritative where this page is ambiguous.

function Docs() {
  const { CHAIN, COMPANY } = window.VT_DATA;
  const { PageHero } = window.VT;

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "first-rule", label: "The first rule" },
    { id: "config", label: "Addresses" },
    { id: "quickstart", label: "Quick start" },
    { id: "identity", label: "Identity & stake" },
    { id: "elections", label: "Elections" },
    { id: "treasury", label: "Offices & treasury" },
    { id: "land", label: "Land & companies" },
    { id: "timing", label: "Timelock rules" },
    { id: "conventions", label: "Conventions" },
    { id: "support", label: "Support" },
  ];

  return (
    <React.Fragment>
      <PageHero
        eyebrow="Documentation"
        title="Read it before you deploy it"
        lede="Enough to put a citizen's stake, a live ballot and a queued treasury action into your app without guessing at a single constitutional rule."
        actions={
          <React.Fragment>
            <a href="#quickstart" className="btn btn--primary">Quick start <span className="arrow">→</span></a>
            <a href={CHAIN.repo} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">Repository ↗</a>
            <a href="protocol.html" className="btn btn--quiet">Protocol</a>
          </React.Fragment>
        }
      />

      <section className="section wrap">
        <div style={{ display: "grid", gridTemplateColumns: "200px minmax(0,1fr)", gap: 56, alignItems: "start" }} className="docs-grid">
          <nav className="docs-nav" aria-label="Documentation sections">
            <div className="eyebrow eyebrow--mute" style={{ marginBottom: 14 }}>On this page</div>
            <div className="stack stack--sm">
              {sections.map(s => (
                <a key={s.id} href={`#${s.id}`} style={{ color: "var(--text-3)", fontSize: 14.5, padding: "3px 0" }}>{s.label}</a>
              ))}
            </div>
          </nav>

          <div className="prose" data-reveal>
            <h2 id="overview">Overview</h2>
            <p>
              Liberland EVM is a set of Solidity contracts on the EVM. There is no proprietary SDK and no gateway
              API in front of it — you talk to the chain with <code>viem</code> and <code>wagmi</code> like any
              other contract system, using the ABIs generated at the frozen tag.
            </p>
            <p>
              Three kinds of contract matter to a frontend. <strong>Registries</strong> hold facts and are what you
              read. <strong>Policies</strong> decide rules over those facts and are what you ask instead of
              reimplementing. <strong>Apps</strong> run bounded workflows and are what you write to. Never write
              directly to a registry; the app contracts carry the office and eligibility checks.
            </p>
            <div className="card card--pad" style={{ margin: "24px 0", borderColor: "rgba(255,210,0,.3)", background: "rgba(255,210,0,.05)" }}>
              <p className="small" style={{ margin: 0, color: "var(--text-2)" }}>
                <strong style={{ color: "var(--yellow)" }}>Audit freeze.</strong>{" "}
                This documents the <code>{CHAIN.tag}</code> release, frozen {CHAIN.frozen} and pending external
                audit. It is not approved for Ethereum mainnet launch. Build against Sepolia, and read{" "}
                <a href="protocol.html#audit">the audit status</a> before you ship anything that holds value.
              </p>
            </div>

            <h2 id="first-rule">The first rule</h2>
            <p>
              Do not hardcode constitutional behaviour in the UI if a contract already exposes it. Thresholds,
              periods and eligibility are governed values — they can change by referendum without anyone
              redeploying your frontend, and a hardcoded copy becomes a lie the moment they do.
            </p>
            <ul>
              <li>Citizenship: <code>CitizenEligibilityPolicy.isCitizenInGoodStanding(wallet)</code></li>
              <li>Political weight: <code>VotingPowerPolicy.votingPower(wallet)</code></li>
              <li>Candidacy: <code>CandidateEligibilityPolicy.isEligibleCandidate(wallet)</code></li>
              <li>Election timing: <code>CongressElectionPolicy</code></li>
              <li>Unstake portion and welfare: <code>UnstakingPolicy</code></li>
              <li>Land parties and signers: <code>LandPartyPolicy</code></li>
            </ul>
            <p>
              The same rule applies to timelock delays. Read <code>minimumDelay(actionType)</code>; never ship the
              number.
            </p>

            <h2 id="config">Addresses</h2>
            <p>
              Deployment scripts write a per-network address manifest. Sepolia's is generated by{" "}
              <code>DeployDemo.s.sol</code>; production's by <code>Deploy.s.sol</code>. Both are environment-specific
              and deliberately not committed — the <code>.example.json</code> files in the repository show the schema
              and contain no usable addresses.
            </p>
            <pre><code>{`// frontend-export/example-config.ts
import { sepolia } from "viem/chains";
import addresses from "./sepolia-demo.json";

export const liberlandSepolia = {
  chain: sepolia,
  chainId: 11155111,
  explorer: "https://sepolia.etherscan.io",
  addresses,
} as const;`}</code></pre>
            <p>Three checks before you enable a single write:</p>
            <ul>
              <li><code>config.chainId === walletChainId</code>, or writes stay disabled.</li>
              <li>Parse <code>treasuryPrefundLlm</code>, <code>treasuryPrefundUsdc</code> and{" "}
                <code>stakingBackingSurplus</code> with <code>BigInt(...)</code>. They are decimal strings precisely
                so JSON parsing cannot quietly round them.</li>
              <li>On Sepolia, require <code>config.identityApp === config.demoCitizenGateway</code>. The gateway
                inherits <code>IdentityApp</code> and is one contract, not two.</li>
            </ul>

            <h2 id="quickstart">Quick start</h2>
            <p>Read a wallet's citizenship and stake. No key needed for reads.</p>
            <pre><code>{`import { createPublicClient, http, formatUnits } from "viem";
import { sepolia } from "viem/chains";

import config from "./sepolia-demo.json";
import identityRegistryAbi from "./abis/IdentityRegistry.json";
import stakeRegistryAbi from "./abis/StakeRegistry.json";
import citizenPolicyAbi from "./abis/CitizenEligibilityPolicy.json";
import votingPowerAbi from "./abis/VotingPowerPolicy.json";

const client = createPublicClient({ chain: sepolia, transport: http() });
const read = (address, abi, functionName, args = []) =>
  client.readContract({ address, abi, functionName, args });

const link = await read(config.identityRegistry, identityRegistryAbi, "getWalletLink", [wallet]);
const personId = link.personId;            // 0x0 when the wallet is not linked

const [activeStake, inWelfare, goodStanding, power] = await Promise.all([
  read(config.stakeRegistry, stakeRegistryAbi, "activeStakeOf", [personId]),
  read(config.stakeRegistry, stakeRegistryAbi, "isInWelfare", [personId]),
  read(config.citizenEligibilityPolicy, citizenPolicyAbi, "isCitizenInGoodStanding", [wallet]),
  read(config.votingPowerPolicy, votingPowerAbi, "votingPower", [wallet]),
]);

console.log(formatUnits(activeStake, 18), "LLM staked");`}</code></pre>
            <p>
              Do not infer a person ID in the UI. If the wallet is linked, the registry already knows it; if it is
              not, no amount of hashing will produce one.
            </p>

            <h2 id="identity">Identity &amp; stake</h2>
            <p>
              LLM is a standard ERC-20 with <code>18</code> decimals and a <code>70,000,000</code> hard cap. Every
              on-chain amount is in base units — multiply whatever the user typed by <code>1e18</code>, and divide
              before display. The 5,000 LLM minimum citizen stake is <code>5000e18</code>, and so is every bond and
              quorum figure on the <a href="protocol.html#parameters">parameters table</a>.
            </p>
            <pre><code>{`import { parseUnits } from "viem";

const amount = parseUnits(input, 18);

// Approve the app, then stake through it. The vault is custody, not an entry point.
await write(config.llmToken, llmAbi, "approve", [config.demoCitizenGateway, amount]);
await write(config.demoCitizenGateway, gatewayAbi, "stake", [amount]);`}</code></pre>
            <h3>Unstaking is discrete</h3>
            <p>
              There is no pending request and no claim balance. <code>unstake()</code> immediately releases one
              policy-defined portion of the <em>current</em> balance, reduces active stake, and starts a 30-day
              welfare period. Twelve of those operations release roughly 10% of the original stake, because each one
              applies to what is left rather than to where you started.
            </p>
            <pre><code>{`const portion = await read(config.unstakingPolicy, unstakingAbi, "unstakePortion", [activeStake]);
const welfarePeriod = await read(config.unstakingPolicy, unstakingAbi, "welfarePeriod");
const welfareUntil = await read(config.stakeRegistry, stakeRegistryAbi, "welfareUntilOf", [personId]);

// In welfare while block.timestamp < welfareUntil. Voting is suspended; citizenship is not.`}</code></pre>
            <p>
              A lending lien or the citizenship floor can reduce the amount actually released. Show{" "}
              <code>StakeLienRegistry.retainedStakeFloorOf(personId)</code> rather than promising a number the
              contract may decline to pay.
            </p>

            <h2 id="elections">Elections</h2>
            <p>
              Congress elections are not a single-choice vote. A ballot is two parallel arrays — candidates and
              signed allocations — scoped to exactly one cycle. Recasting replaces the whole ballot; nothing carries
              into a later cycle.
            </p>
            <pre><code>{`const cycleId = await read(config.congressCandidateRegistry, registryAbi, "latestCycleId");
const cycle   = await read(config.congressCandidateRegistry, registryAbi, "getCycle", [cycleId]);

// Validate against the policy the CYCLE stored, not the current one.
const maxPositive = await read(cycle.policy, policyAbi, "maxPositiveCandidates");
const weight      = await read(cycle.policy, policyAbi, "votingWeightAt",
                              [wallet, cycle.votingPowerSnapshotBlock]);

await write(config.congressElectionApp, electionAbi, "castBallot",
            [cycleId, candidates, allocations]);`}</code></pre>
            <ul>
              <li><code>latestCycleId()</code> drives every election screen. <code>currentCongressCycleId()</code> is
                the active office term and stays <code>0</code> until seats activate.</li>
              <li>Ballot weight is historical stake at the cycle's snapshot block. Current stake is not the weight,
                and a voter also needs current good standing.</li>
              <li>Use <code>previewNextElectionWindow()</code> for the next window. Never compute it from the
                finalization transaction's timestamp — the boundary is anchored to 17:00 UTC and late finalization
                advances to the next occurrence.</li>
              <li>Candidacy is person-bound within a cycle. The original application address stays the canonical
                ballot target after a wallet migration; reject a ballot that names both aliases.</li>
            </ul>
            <p>
              Anyone may call <code>finalizeElection(cycleId)</code> once voting has ended, and for the latest cycle
              that same transaction schedules the next one. The chain cannot wake itself at a timestamp, so this
              always waits for somebody with gas.
            </p>

            <h2 id="treasury">Offices &amp; treasury</h2>
            <p>
              Budgets are laws: they are approved by referendum and enacted through the timelock, not granted by an
              office. A payout revalidates the current office role and spending policy when it is routed, and the
              vault independently rematches the request ID, budget ID, amount and asset at execution. A stale
              proposal can therefore fail late, and that is working as intended.
            </p>
            <pre><code>{`// Office admin actions go through OfficeExecutor, never OfficeRegistry.
await write(config.officeExecutor, executorAbi, "assignClerk", [officeId, clerk]);

// Diagnose a failed disbursement against the commitment, not the balance.
const commitment = await read(config.budgetEnvelopeRegistry, budgetAbi,
                             "getBudgetCommitment", [requestId]);

// Queue state may legitimately lag the timelock. This is permissionless.
await write(config.payoutQueue, queueAbi, "syncPayoutState", [requestId]);`}</code></pre>
            <p>
              Bounded Congress and ministry actions live in <code>DecisionApp</code>. For a Congress ERC-20 transfer
              the source must both approve the app <em>and</em> authorise the exact decision ID — a generic
              allowance is not consent, deliberately. Feature-detect <code>decisionApp</code> so an older manifest
              fails closed rather than silently skipping the check.
            </p>

            <h2 id="land">Land &amp; companies</h2>
            <p>
              A land title stores a namespaced <code>PartyRef</code>, not a wallet. Show the stable party and resolve
              the current signer through <code>LandPartyPolicy</code>, because a person's wallet migration, a
              company's director change or an office's administrator change all move the signer without moving the
              title.
            </p>
            <pre><code>{`// Transfer is registrar-submitted dual consent, EIP-712, against a pinned version.
const title  = await read(config.landRegistry, landAbi, "getTitle", [titleId]);
const digest = await read(config.landRegistryApp, landAppAbi,
                          "hashTitleTransferAuthorization", [anchor]);

// Collect BOTH signatures, then submit before the deadline. Refresh
// authorization immediately before submitting: it can go stale in one block.`}</code></pre>
            <ul>
              <li>Clerks may only call <code>submitParcelDraft</code> and <code>updateParcelDraft</code>. Every live
                record change is registrar or admin.</li>
              <li>Subdivision and merge are atomic up to <code>MAX_PARCELS_PER_OPERATION()</code>; boundary
                adjustment always updates exactly two parcels.</li>
              <li>Accepted disputes and active encumbrances block transfers and structural operations. A merely
                filed dispute does not.</li>
              <li>Pending, suspended, dissolving, dissolved and rejected companies cannot mutate directors, share
                classes, shares or filings.</li>
              <li>Fees, insurance, court orders, co-ownership shares and geometry validation are deliberately absent.
                Do not render them as though the contracts enforced them.</li>
            </ul>

            <h2 id="timing">Timelock rules</h2>
            <p>
              Every governed change passes through <code>ActionTimelock</code> as a bounded typed action with a
              pinned target address. If the target module is replaced before execution, the queued action reverts
              rather than executing against whatever is there now.
            </p>
            <pre><code>{`const delay  = await read(config.actionTimelock, timelockAbi, "minimumDelay", [actionType]);
const action = await read(config.actionTimelock, timelockAbi, "getAction", [actionId]);
const ready  = await read(config.actionTimelock, timelockAbi, "isActionExecutable", [actionId]);

// earliestExecutionTime, expiresAt, targetModuleAddress, state — all on \`action\`.
// \`ready\` also detects a stale pinned target, so gate the button on it.`}</code></pre>
            <p>
              When a reviewed migration has separately approved app and authority pointer actions, execute them
              together with <code>executeActions(actionIds)</code> once each reports executable. And treat a{" "}
              <code>State</code> pointer update as a migration in the proposal UI: approving the pointer does not
              copy storage or move custody, and implying otherwise is how people vote for something they did not
              read.
            </p>

            <h2 id="conventions">Conventions</h2>
            <ul>
              <li>Amounts are integers in the smallest unit. Never parse a formatted string back into a number.</li>
              <li>For a stored process, use its pinned policy and snapshot block — never the current policy.</li>
              <li>Resolve <code>activeWalletOf(personId)</code> for the current signer. Historical records keep their
                original wallet for audit provenance, on purpose.</li>
              <li>Errors are typed. Match on the error name, never on message text.</li>
              <li>Refresh <code>totalBorrows()</code> and <code>borrowIndex()</code> after a mutating pool call. Time
                alone does not move a stored checkpoint; <code>currentDebtOf</code> previews what will.</li>
              <li>Set data in a monospace face when you render it. It is a brand rule and it is also just correct.</li>
            </ul>

            <h2 id="support">Support</h2>
            <p>
              Integration questions, contract questions and “this page is wrong” reports go to the same place:{" "}
              <a href={`mailto:${COMPANY.email}?subject=Docs`}>{COMPANY.email}</a>. Where this page and the Solidity
              disagree, the Solidity is right. If you are building something substantial, apply to the{" "}
              <a href="builders.html#grants">grant programme</a> before you start rather than after.
            </p>
            <p>
              The complete developer handoff — <code>FRONTEND-HOWTO.md</code>, <code>FRONTEND-CHANGES.md</code>, the
              generated ABIs and every architecture document — ships inside{" "}
              <a href={CHAIN.release} target="_blank" rel="noopener noreferrer">the frozen release ↗</a>.
            </p>
          </div>
        </div>
      </section>

      <style>{`
        .docs-nav { position: sticky; top: 96px; }
        @media (max-width: 900px) {
          /* minmax(0,1fr), not 1fr: a bare 1fr track keeps min-width:auto and
             lets a wide <pre> push the whole page sideways instead of
             scrolling inside its own box. */
          .docs-grid { grid-template-columns: minmax(0, 1fr) !important; gap: 32px !important; }
          .docs-nav { position: static; border-bottom: 1px solid var(--line); padding-bottom: 20px; }
        }
      `}</style>
    </React.Fragment>
  );
}

window.VT_PAGE = Docs;
