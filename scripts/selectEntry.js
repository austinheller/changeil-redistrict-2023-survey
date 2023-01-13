export default function selectEntry(selector = "") {
  const responsesEl = document.querySelector("#responses");
  // Hide inactive entries
  responsesEl.querySelectorAll(".entry").forEach((entry) => {
    entry.style.display = "none";
  });
  // Find the new entry
  const currentEntry = responsesEl.querySelector(`[data-is-current="true"]`);
  const currentIndex = parseInt(currentEntry.getAttribute("data-index"));
  let newEntry = false;
  switch (selector) {
    case "prev":
      newEntry = responsesEl.querySelector(
        `[data-index="${currentIndex - 1}"]`
      );
      break;
    case "next":
      newEntry = responsesEl.querySelector(
        `[data-index="${currentIndex + 1}"]`
      );
      break;
    default:
      newEntry = responsesEl.querySelector(`[data-index="1"]`);
      break;
  }
  if (newEntry !== false && newEntry !== null) {
    currentEntry.setAttribute("data-is-current", "false");
    newEntry.setAttribute("data-is-current", "true");
    newEntry.style.display = "block";
  }
  // Update button state
  const prevButton = responsesEl.querySelector("#entries-prev");
  const nextButton = responsesEl.querySelector("#entries-next");
  if (prevButton && nextButton) {
    if (newEntry.getAttribute("data-is-first") === "true") {
      prevButton.setAttribute("disabled", "disabled");
    } else {
      prevButton.removeAttribute("disabled");
    }
    if (newEntry.getAttribute("data-is-last") === "true") {
      nextButton.setAttribute("disabled", "disabled");
    } else {
      nextButton.removeAttribute("disabled");
    }
  }
  return newEntry;
}
