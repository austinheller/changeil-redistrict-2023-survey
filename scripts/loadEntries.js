import Papa from "papaparse";
import { createElement, createFragment } from "./lib/vanillaJSX.js";
import getOfficeNames from "./getOfficeNames.js";
import showResponses from "./showResponses.js";

/** @jsx createElement */
/** @jsxFrag createFragment */

const responsesUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRIDpKOh2tNsJewoaoW_yFVCoL2JbFBwQ0HLmxw-ZvIFmQqEb5fE6nY-qjbg7jG3M0iTcu0Fi8pmTay/pub?output=csv";

function parseEntries(entries) {
  const container = document.querySelector("#app");
  // Set up containers
  const officesEl = <div id="candidates-list"></div>;
  container.appendChild(officesEl);
  const responsesEl = (
    <div id="responses">
      <p class="placeholder">
        Select an office to see the candidates' answers.
      </p>
    </div>
  );
  container.appendChild(responsesEl);
  // Add offices to sidebar
  const offices = getOfficeNames(entries);
  offices.forEach((office) => {
    const officeButton = (
      <button class="office-button" data-office={office}>
        {office}
      </button>
    );
    officesEl.appendChild(officeButton);
    officeButton.addEventListener("click", () => {
      container.querySelectorAll(".office-button").forEach((button) => {
        button.classList.remove("selected");
      });
      officeButton.classList.add("selected");
      showResponses(entries, office);
    });
  });
}

export default function loadEntries(container) {
  Papa.parse(responsesUrl, {
    download: true,
    header: true,
    complete: (results) => {
      parseEntries(results.data);
    },
  });
}
