// FAQ — native <details>, so it works with keyboard and screen readers without extra code
function Faq() {
  const t = window.LL_T.faq;
  const { Link, SectionHead } = window.LL_UI;

  return (
    <section id="faq" className="section" data-screen-label="FAQ" style={{ paddingBottom: 0 }}>
      <div className="container">
        <SectionHead label={t.label} title={t.title} />

        <div className="faq">
          {t.items.map(item => (
            <details key={item.q}>
              <summary>
                <span>{item.q}</span>
                <span className="plus" aria-hidden="true">+</span>
              </summary>
              <div className="answer">
                <p className="body">{item.a}</p>
                {item.link && (
                  <p className="body"><Link href={item.link.href} className="text-link">{item.link.text}</Link></p>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

window.LL_Faq = Faq;
