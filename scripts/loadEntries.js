import Papa from "papaparse";
import { createElement, createFragment } from "./lib/vanillaJSX.js";
import getOfficeNames from "./getOfficeNames.js";
import selectEntry from "./selectEntry.js";
import getCandidatesForOffice from "./getCandidatesForOffice.js";
import setAppFocus from "./setAppFocus.js";

/** @jsx createElement */
/** @jsxFrag createFragment */

const responsesUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRIDpKOh2tNsJewoaoW_yFVCoL2JbFBwQ0HLmxw-ZvIFmQqEb5fE6nY-qjbg7jG3M0iTcu0Fi8pmTay/pub?output=csv";

function parseEntries(entries) {
  const container = document.querySelector("#app");
  // Set up elements
  const officesEl = <ul id="candidates-list"></ul>;
  container.appendChild(officesEl);
  const responsesEl = (
    <div id="responses" data-no-responses>
      <p class="placeholder">
        Select an office to see the candidates' answers.
      </p>
      <div id="entries"></div>
    </div>
  );
  container.appendChild(responsesEl);
  // Add offices to sidebar
  const offices = getOfficeNames(entries);
  offices.forEach((office) => {
    const officeEl = (
      <li class="office" data-office={office}>
        <button class="office-button">{office}</button>
        <ul class="candidates"></ul>
      </li>
    );
    officesEl.appendChild(officeEl);
    // Add candidates to office
    const candidates = getCandidatesForOffice(entries, office);
    const candidatesList = officeEl.querySelector(".candidates");
    officeEl.appendChild(candidatesList);
    candidates.forEach((candidate) => {
      const candidateButton = (
        <button
          data-candidate-button
          data-candidate={candidate["Candidate Name"]}
        >
          {candidate["Candidate Name"]}
        </button>
      );
      candidateButton.addEventListener("click", () => {
        responsesEl.setAttribute("data-current-office", office);
        selectEntry(candidate["Candidate Name"], entries);
      });
      candidatesList.appendChild(<li>{candidateButton}</li>);
    });
    officeEl.querySelector(".office-button").addEventListener("click", () => {
      responsesEl.setAttribute("data-current-office", office);
      selectEntry("", entries);
    });
  });
  // Add navigation
  const menuButton = <button id="show-menu">Show Offices</button>;
  const prevButton = (
    <button id="entries-prev" disabled="disabled">
      &laquo; Previous<span class="hide-mobile"> Candidate</span>
    </button>
  );
  const nextButton = (
    <button id="entries-next" disabled="disabled">
      Next<span class="hide-mobile"> Candidate</span> &raquo;
    </button>
  );
  menuButton.addEventListener("click", () => {
    setAppFocus("menu");
  });
  prevButton.addEventListener("click", () => {
    selectEntry("prev", entries);
  });
  nextButton.addEventListener("click", () => {
    selectEntry("next", entries);
  });
  const controlsEl = (
    <div id="entries-controls">
      <h4 id="office-title"></h4>
      <div class="buttons">
        {menuButton}
        {prevButton}
        {nextButton}
      </div>
    </div>
  );
  responsesEl.appendChild(controlsEl);
  // Set focus
  setAppFocus("menu");
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
