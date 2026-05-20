// 90-day rolling cycle — visualises the "election moments" not "election days" idea.
// A horizontal ribbon with three cycles drawn (prev, current, next), with a moving
// "today" marker and a callout for the next election moment.

const Cycle = () => {
  // "Day in cycle" — fake live progress: 38 of 90
  const [day, setDay] = React.useState(38);

  // Slowly nudge the marker for visual life (1 day every 4s of viewing)
  React.useEffect(() => {
    const id = setInterval(() => {
      setDay((d) => (d >= 90 ? 1 : d + 1));
    }, 6000);
    return () => clearInterval(id);
  }, []);

  const pct = (day / 90) * 100;
  const daysLeft = 90 - day;

  return (
    <section className="section cycle-section" id="cycle" data-screen-label="06 Cycle">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-num">§ 05 · The cycle</div>
            <h2>Election <em>moments,</em><br/>not election days.</h2>
          </div>
          <p className="lead">
            The cycle resolves every 90 days, but it isn't a single-day event.
            Votes don't reset. Candidates don't disappear. There's no "campaign season" —
            you're either visible all 90 days, or you're not.
          </p>
        </div>

        <div className="cycle-board">
          <div className="ribbon">
            <div className="ribbon-track" />

            {/* Three election moments (gold dots) at 0%, 33%, 66%, 100% */}
            <div className="moment" style={{left: "0%"}}>
              <div className="moment-dot" />
              <div className="moment-label">Cycle N−1 resolved</div>
              <div className="moment-sub">~90 days ago</div>
            </div>
            <div className="moment now" style={{left: `${pct / 3}%`}}>
              <div className="moment-dot pulse" />
              <div className="moment-label">You are here</div>
              <div className="moment-sub">Day {day} of 90</div>
            </div>
            <div className="moment future" style={{left: "33.33%"}}>
              <div className="moment-dot" />
              <div className="moment-label">Next election moment</div>
              <div className="moment-sub">in {daysLeft} days</div>
            </div>
            <div className="moment future" style={{left: "66.66%"}}>
              <div className="moment-dot" />
              <div className="moment-label">Then again</div>
              <div className="moment-sub">+90 days</div>
            </div>
            <div className="moment future" style={{left: "100%"}}>
              <div className="moment-dot" />
              <div className="moment-label">…and again</div>
              <div className="moment-sub">forever rolling</div>
            </div>

            {/* Cycle bands */}
            <div className="cycle-band band-past" />
            <div className="cycle-band band-current" />
            <div className="cycle-band band-next" />
          </div>

          <div className="cycle-implications">
            <div>
              <h4>Votes carry forward.</h4>
              <p>If a citizen picked you last cycle and never changed it, they're picking you this cycle too. Keep the support you have by staying in the conversation.</p>
            </div>
            <div>
              <h4>Apply early — not late.</h4>
              <p>Most voters set their selections weeks before a moment and never touch them. Showing up the last week is showing up too late.</p>
            </div>
            <div>
              <h4>Delegation persists too.</h4>
              <p>Voters who delegated to a sitting member months ago are still delegating now. Cultivate those relationships across the whole cycle.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

window.Cycle = Cycle;
