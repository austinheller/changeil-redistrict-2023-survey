export default function sendFocusStatus(office, name) {
  const message = `${office}; ${name}`;
  window.postMessage(message, "*");
}
