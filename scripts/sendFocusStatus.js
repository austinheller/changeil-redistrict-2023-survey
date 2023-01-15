export default function sendFocusStatus(office, name) {
  const message = `${office}; ${name}`;
  window.parent.postMessage(message, "*");
}
