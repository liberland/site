// Small shared pieces: copy lookup, links, rich text and section headers.
window.LL_T = window.LL_I18N[window.LL_LANG || "en"];
window.LL_ROOT = window.LL_ROOT || "";

function isExternal(href) {
  return /^https?:\/\//.test(href);
}

// Every off-site link opens in a new tab, safely, and says so to screen readers.
function Link({ href, children, className, style }) {
  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} style={style}>
        {children}
        <span aria-hidden="true">{" ↗"}</span>
        <span className="sr-only"> {window.LL_T.newTab}</span>
      </a>
    );
  }
  return <a href={href} className={className} style={style}>{children}</a>;
}

// Rich text: a string, or an array of strings, { em } spans and { href, text } links.
function Rich({ value }) {
  if (typeof value === "string") return value;
  if (!Array.isArray(value)) {
    if (value && value.href) return <Link href={value.href} className="text-link">{value.text}</Link>;
    return null;
  }
  return value.map((part, i) => {
    if (typeof part === "string") return <React.Fragment key={i}>{part}</React.Fragment>;
    if (part.em) return <em key={i}>{part.em}</em>;
    return <Link key={i} href={part.href} className="text-link">{part.text}</Link>;
  });
}

// `paragraphs` is a list of plain paragraphs shown under the heading.
function SectionHead({ label, title, paragraphs = [] }) {
  return (
    <div className="section-head">
      <span className="label">{label}</span>
      <div>
        <h2 className="display h2"><Rich value={title} /></h2>
        {paragraphs.map((p, i) => <p key={i} className="lede">{p}</p>)}
      </div>
    </div>
  );
}

window.LL_UI = { Link, Rich, SectionHead, isExternal };
