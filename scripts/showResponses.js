import { createElement, createFragment } from "./lib/vanillaJSX.js";
import getCandidatesForOffice from "./getCandidatesForOffice.js";
import questions from "./questions.js";
import selectEntry from "./selectEntry.js";

/** @jsx createElement */
/** @jsxFrag createFragment */

export default function showResponses(entries, officeName) {
  const responsesEl = document.querySelector("#responses");
  // Clear existing entries
  responsesEl.innerHTML = "";
  // Add new entries
  let entryIndex = 0;
  const candidates = getCandidatesForOffice(entries, officeName);
  const entryEls = [];
  candidates.forEach((entry) => {
    entryIndex++;
    // Basic info
    const name = entry["Candidate Name"];
    const currentOccupation = entry["Candidate Current Occupation"];
    const previousPositions = entry["Previous Elected Positions Held"];
    const firstEntry = entryIndex === 1 ? true : false;
    const currentEntry = entryIndex === 1 ? true : false;
    const lastEntry = entryIndex === candidates.length ? true : false;
    let questionFragments = [];
    questions.forEach((question) => {
      let questionText;
      const questionTextFragments = question.split("\n\n");
      if (questionTextFragments.length > 1) {
        questionText = [];
        questionTextFragments.forEach((fragment) => {
          questionText.push(
            <span>
              {fragment}
              <br />
            </span>
          );
        });
      } else {
        questionText = question;
      }
      const answer = entry[question];
      if (answer) {
        const questionFragment = (
          <div class="question">
            <p>
              <strong>{questionText}</strong>
            </p>
            <p>{answer}</p>
          </div>
        );
        questionFragments.push(questionFragment);
      }
    });
    let entryContents;
    if (entry["Failed to respond?"] === "TRUE") {
      entryContents = (
        <p class="no-response">This candidate did not respond to the survey.</p>
      );
    } else {
      entryContents = (
        <div>
          <ul>
            <li>
              <strong>Candidate current occupation:</strong> {currentOccupation}
            </li>
            <li>
              <strong>Previous elected positions held:</strong>{" "}
              {previousPositions}
            </li>
          </ul>
          <div class="questions">{questionFragments}</div>
        </div>
      );
    }
    const entryEl = (
      <div
        class="entry"
        data-name={name}
        data-index={entryIndex}
        data-is-first={firstEntry}
        data-is-current={currentEntry}
        data-is-last={lastEntry}
      >
        <h3>{name}</h3>
        {entryContents}
      </div>
    );
    entryEls.push(entryEl);
  });
  // Add navigation
  const entriesTotal = entryIndex;
  let currentIndex = 1;
  const prevButton = (
    <button id="entries-prev">
      &laquo; Previous<span class="hide-mobile"> Candidate</span>
    </button>
  );
  const nextButton = (
    <button id="entries-next">
      Next<span class="hide-mobile"> Candidate</span> &raquo;
    </button>
  );
  prevButton.addEventListener("click", () => {
    selectEntry("prev");
  });
  nextButton.addEventListener("click", () => {
    selectEntry("next");
  });
  // Create container
  const entriesEl = (
    <div id="entries">
      <div id="entries-controls">
        {prevButton}
        {nextButton}
      </div>
      {entryEls}
    </div>
  );
  responsesEl.appendChild(entriesEl);
  selectEntry("");
  responsesEl.scrollTo(0, 0);
}
