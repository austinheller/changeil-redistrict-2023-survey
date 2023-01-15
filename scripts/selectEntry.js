import { createElement, createFragment } from "./lib/vanillaJSX.js";
import getCandidatesForOffice from "./getCandidatesForOffice.js";
import questions from "./questions.js";
import setAppFocus from "./setAppFocus.js";
import getSocialMediaLink from "./getSocialMediaLink.js";
import sendFocusStatus from "./sendFocusStatus.js";

/** @jsx createElement */
/** @jsxFrag createFragment */

function loadResponses(entries, officeName) {
  const entriesEl = document.querySelector("#entries");
  // Clear existing entries
  entriesEl.innerHTML = "";
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
    // Set up questions
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
    // Set up social links
    const facebookLink = getSocialMediaLink(
      entry["Campaign Facebook"],
      "facebook"
    );
    const twitterLink = getSocialMediaLink(
      entry["Campaign Twitter"],
      "twitter"
    );
    let links = "";
    if (facebookLink || twitterLink) {
      links = (
        <ul class="links">
          <li>{facebookLink}</li>
          <li>{twitterLink}</li>
        </ul>
      );
    }
    // Create the entry
    const entryEl = (
      <div
        class="entry"
        data-name={name}
        data-index={entryIndex}
        data-is-first={firstEntry}
        data-is-current={currentEntry}
        data-is-last={lastEntry}
      >
        <div class="entry-heading">
          <h3>{name}</h3>
          {links}
        </div>
        {entryContents}
      </div>
    );
    entriesEl.appendChild(entryEl);
  });
  // Add current office to nav title
  const currentOfficeTitle = document.querySelector("#office-title");
  currentOfficeTitle.innerText = officeName;
}

export default function selectEntry(selector = "", entries) {
  const responsesEl = document.querySelector("#responses");
  const office = responsesEl.getAttribute("data-current-office");
  if (selector !== "prev" && selector !== "next") {
    loadResponses(entries, office);
  }
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
      if (selector === "") {
        newEntry = responsesEl.querySelector(`[data-index="1"]`);
      } else {
        newEntry = responsesEl.querySelector(`[data-name="${selector}"]`);
      }
      break;
  }
  // Validate entry
  if (newEntry !== false && newEntry !== null) {
    currentEntry.setAttribute("data-is-current", "false");
    newEntry.setAttribute("data-is-current", "true");
    newEntry.style.display = "block";
  } else {
    console.error("No entry was found.");
    return;
  }
  // Update nav button state
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
  // Hide placeholder
  responsesEl.removeAttribute("data-no-responses");
  responsesEl.scrollTo(0, 0);
  // Set app focus
  setAppFocus("responses");
  // Set sidebar focus
  const name = newEntry.getAttribute("data-name");
  const sidebar = document.querySelector(
    `#candidates-list .office[data-office="${office}"]`
  );
  const candidateInBar = sidebar.querySelector(`[data-candidate="${name}"]`);
  sidebar.classList.add("selected");
  candidateInBar.classList.add("selected");
  // Add candidate name to responses el
  responsesEl.setAttribute("data-current-candidate", name);
  // Send status
  sendFocusStatus(office, name);
}
