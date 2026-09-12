// Documentary imagery. "The land is the image" — the Danube, the floodplain,
// the light on the water, the site as it actually is.
//
// A Photo renders from the manifest in Data.images. When an entry has no
// `src` it renders its placeholder instead of a broken image, so the page is
// always complete. Evidence photographs are deliberately NOT served from this
// manifest — see EvidenceSlot below.
function Photo({ id, aspect, radius, onDark, className, style }) {
  const img = (window.Data.images || {})[id];

  if (!img || !img.src) {
    return (
      <div style={{ ...style }} className={className}>
        <div
          style={{ aspectRatio: aspect || "4/3", borderRadius: radius === "record" ? 0 : "var(--r-surface)", overflow: "hidden" }}
        >
          <div
            className={"image-slot" + (onDark ? " image-slot--on-dark" : "")}
            style={{ width: "100%", height: "100%", borderRadius: "inherit" }}
          >
            {(img && img.placeholder) || "Documentary photograph — Gornja Siga"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <figure style={{ margin: 0, ...style }} className={className}>
      <div
        className={"photo" + (radius === "record" ? " photo--record" : "")}
        style={{ aspectRatio: aspect || "4/3" }}
      >
        <img src={img.src} alt={img.alt} loading="lazy" decoding="async" width={img.width} height={img.height} />
      </div>
      {/* CC BY-SA requires the licence to be named and linked alongside the
          author and the source, so the credit line is not decorative — it is
          the condition of use. */}
      <figcaption className={"photo__credit" + (onDark ? " photo__credit--on-dark" : "")}>
        {img.caption ? img.caption + " · " : ""}
        {img.author}
        {img.license ? (
          <>
            {", "}
            {img.licenseUrl ? (
              <a href={img.licenseUrl} target="_blank" rel="noopener noreferrer nofollow">
                {img.license}
              </a>
            ) : (
              img.license
            )}
          </>
        ) : null}
        {img.sourceUrl ? (
          <>
            {" · "}
            <a href={img.sourceUrl} target="_blank" rel="noopener noreferrer nofollow">
              source
            </a>
          </>
        ) : null}
      </figcaption>
    </figure>
  );
}

// An evidence photograph is never a documentary landscape shot. This slot
// stays a slot until a specific, redaction-approved file exists for it —
// dressing a general photograph of the river up as evidence of an
// intervention would break the standard the rest of the site runs on.
function EvidenceSlot({ caption, figure, aspect, onDark, style }) {
  return (
    <div style={style}>
      <div style={{ aspectRatio: aspect || "4/3" }}>
        <div
          className={"image-slot image-slot--withheld" + (onDark ? " image-slot--on-dark" : "")}
          style={{ width: "100%", height: "100%" }}
        >
          {caption}
        </div>
      </div>
      <div className={"photo__credit" + (onDark ? " photo__credit--on-dark" : "")}>{figure}</div>
    </div>
  );
}

window.BWWR_Photo = Photo;
window.BWWR_EvidenceSlot = EvidenceSlot;
