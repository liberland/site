/** A display title whose middle part is set in gold italic: [before, emphasised, after]. */
export function Title({ parts, breakBefore = false }: { parts: readonly [string, string, string]; breakBefore?: boolean }) {
  const [before, em, after] = parts;
  return (
    <>
      {before}
      {breakBefore && <br />}
      <em>{em}</em>
      {after}
    </>
  );
}
