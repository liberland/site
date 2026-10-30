/** The design's drawn arrow glyph; extends on hover via CSS. */
export function Arrow() {
  return <span className="arr" aria-hidden="true" />;
}

/** Visually hidden note for links that open in a new tab. */
export function NewTab() {
  return <span className="sr-only"> (opens in a new tab)</span>;
}
