// Chế độ kiểm tra: ?debug_tracking=1 (cùng cờ với đo lường) thì hiện các khung giữ chỗ nằm trong
// <template data-debug-only> (xem src/components/DebugOnly.astro). Bình thường các khung này bị ẩn hoàn toàn.
const KEY = "giong-debug-tracking";

function debugOn(): boolean {
  const q = new URLSearchParams(location.search).get("debug_tracking");
  try {
    if (q === "1") sessionStorage.setItem(KEY, "1");
    if (q === "0") sessionStorage.removeItem(KEY);
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return q === "1";
  }
}

if (debugOn()) {
  // Lặp lại vì có khối chứa khung trống lồng bên trong khối khác.
  let t: HTMLTemplateElement | null;
  while ((t = document.querySelector<HTMLTemplateElement>("template[data-debug-only]"))) t.replaceWith(t.content);
}
