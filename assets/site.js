// Fill these with the owner's confirmed profile URLs.
const socialLinks = { x: "", note: "" };
for (const [name, url] of Object.entries(socialLinks)) {
  if (!url) continue;
  const placeholder = document.querySelector('[data-social="' + name + '"]');
  if (!placeholder) continue;
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  const title = document.createElement("span");
  title.textContent = name === "x" ? "X" : "note";
  const detail = document.createElement("small");
  detail.textContent = "プロフィールを見る ↗";
  link.append(title, detail);
  placeholder.replaceWith(link);
}
// Animate on entry without hiding content when JavaScript is unavailable.
if (!matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.animate(
        [{ opacity: 0.65, transform: "translateY(16px)" }, { opacity: 1, transform: "translateY(0)" }],
        { duration: 550, easing: "cubic-bezier(.2,.7,.3,1)" }
      );
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.12 });
  document.querySelectorAll(".product, .about-section, .note-row, .showcase-item, .download-section").forEach(el => observer.observe(el));
}
