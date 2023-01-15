function encodeHash(decoded) {
  return decoded
    .replace(/ /g, "_")
    .replace(/"/g, "&quot;")
    .replace(/“/g, "&ldquo;")
    .replace(/”/g, "&rdquo;")
    .replace(/'/g, "&#039;");
}

export default function sendFocusStatus(office, name) {
  const message = `${office};;${name}`;
  window.location.hash = encodeHash(message);
  window.parent.postMessage(message, "*");
}
