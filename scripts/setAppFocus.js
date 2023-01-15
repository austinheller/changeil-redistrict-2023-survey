export default function setAppFocus(focus) {
  const container = document.querySelector("#app");
  container.setAttribute("data-focus", focus);
  // Clear sidebar selections
  const sidebarSelected = document.querySelectorAll(
    "#candidates-list *.selected"
  );
  sidebarSelected.forEach((el) => {
    el.classList.remove("selected");
  });
}
