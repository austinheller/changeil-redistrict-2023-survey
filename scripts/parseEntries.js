import Papa from "papaparse";
import { createElement, createFragment } from "./lib/vanillaJSX.js";
/** @jsx createElement */
/** @jsxFrag createFragment */

const responsesUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRIDpKOh2tNsJewoaoW_yFVCoL2JbFBwQ0HLmxw-ZvIFmQqEb5fE6nY-qjbg7jG3M0iTcu0Fi8pmTay/pub?output=csv";

function parseEntries(entries) {
  const container = document.querySelector("#app");
  // Set up elements
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
  // Get office names
  const offices = [];
  entries.forEach((entry) => {
    let office = entry["Ward or Office Sought"].trim();
    if (!offices.includes(office)) {
      offices.push(office);
    }
  });
  // Sort offices
  offices.sort((a, b) => {
    // Mayor: Sort to top
    if (a.includes("Mayor")) {
      return -1;
    }
    // Ward numbers: Sort lowest to highest
    const wardAMatch = a.match(/\d+/g);
    const wardBMatch = b.match(/\d+/g);
    if (wardAMatch && wardBMatch) {
      let wardAVal = a.replace(/[^0-9]/g, "");
      wardAVal = parseInt(wardAVal);
      let wardBVal = b.replace(/[^0-9]/g, "");
      wardBVal = parseInt(wardBVal);
      if (wardAVal < wardBVal) {
        return -1;
      }
    } else {
      return 1;
    }
  });
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
      showResponses(office);
    });
  });
  function showResponses(officeName) {
    const responsesContainer = document.querySelector("#responses");
    // Clear existing entries
    responsesContainer.innerHTML = "";
    // Add new entries
    let entryIndex = 0;
    const entryEls = [];
    entries.forEach((entry) => {
      const keys = Object.keys(entry);
      const thisOfficeName = entry["Ward or Office Sought"].trim();
      if (officeName !== thisOfficeName) return;
      entryIndex++;

      // Basic info
      const name = entry["Full Name of Campaign Committee"];
      const currentOccupation = entry["Candidate Current Occupation"];
      const previousPositions = entry["Previous Elected Positions Held"];
      // Questions
      const questions = [
        "Do you believe we need to change the way the Chicago City Council draws its ward maps to ensure more accurate representation and participation of communities?",
        "Do you support an amendment to state statute to change the redistricting process to create an independent resident commission that reflects the diversity (age, gender, race, and socioeconomic) of Chicago to be tasked with drawing Chicago’s ward maps going forward?",
        "Do you support changes to the current ward mapping process that would allow more meaningful time for Chicago residents to provide feedback on proposed maps? Do you support requiring evidence that shows how residents’ feedback was considered?",
        "Do you support changes to the current redistricting process that would provide resources for residents and community organizations to analyze proposed ward maps, propose their own maps, and offer testimony about their communities? What changes would you support so that residents receive feedback from officials when they submit their own maps?",
        "Municipal redistricting law in Illinois currently counts incarcerated people as residents at their place of incarceration rather than at their last-known home address for purposes of drawing new ward maps. Do you support expanding prison gerrymandering reform to local ward redistricting? This would require that state agencies prepare and share redistricting data that lists incarcerated people at their last residential addresses, rather than at the addresses of the facilities where people are incarcerated at the time of the census.",
        "Would you support additional redistricting reform measures for state and congressional districts? Why or why not?",
        "COMPLY WITH THE U.S. CONSTITUTION\n\nThe process must be in accordance with the requirements of the U.S. Constitution. All persons -- regardless of age, citizenship, immigration status, ability, or eligibility to vote – should be accurately counted through the Census. In accordance with the U.S. Constitution, districts should be populated equally, as nearly as is practicable.",
        "COMPLY WITH FEDERAL AND STATE VOTING RIGHTS ACT\n\nThe process must emphasize representation and be fully compliant with both the federal Voting Rights Act (VRA) and all state voting rights laws, including the Illinois Voting Rights Act. The letter and the spirit of the VRA should be reflected in redistricting to protect the rights of voters of color. To advance these foundational goals, redistricting decision-makers should exercise their latitude under the law to create majority-minority, coalition, and influence districts.",
        "MAXIMIZE VOTER CHOICE, ELECTORAL CANDIDACY AND COMPETITIVENESS\n\nThe process should result in maximizing voter choice, encouraging electoral candidacy, and enhancing electoral competitiveness.",
        "RECOGNIZE AND PRESERVE COMMUNITIES OF INTEREST\n\nThe process should give consideration to true communities of interest. To the extent possible, but secondary to the protection of voting rights, populations with common social, ethnic or economic interests should have unified representation.",
        "ACCURATELY INCLUDE PERMANENT RESIDENCE OF ALL ILLINOISANS\n\nThe process must accurately represent the permanent residence of all Illinoisans. All persons residing away from their permanent residence, such as students, incarcerated individuals, and missionaries, should be counted at their home addresses regardless of Census counting rules. The Census should be encouraged to expand its exceptions to the usual residence rule to include incarcerated individuals, as well as students, missionaries, and overseas Americans.",
        "COMPRISE AND UPHOLD A TRANSPARENT AND ACCOUNTABLE PROCESS\n\nThe process must be transparent and accountable. Meetings of decision-makers and their legal, political, and mapping consultants must be open and accessible to the public to the greatest extent possible. The criteria used to draw maps must be objective, clear and justifiable, and districts must be drawn to offer voter choice. Communications related to the redistricting process should be subject to the Open Meetings Act and the Freedom of Information Act. Clear conflict-of-interest rules must be adopted and applied.",
        "PROVIDE FOR OPEN, FULL, AND MEANINGFUL PUBLIC PARTICIPATION\n\nThe process must allow for meaningful public participation and have the confidence of the public. Opportunities for public education and engagement must be provided, including opportunities to offer comment and amend draft maps. Redistricting bodies must provide data, tools, and ways for the public to have direct input into and affect the specific plans under consideration.",
        "Any final thoughts or points you would like to make on the subjects of gerrymandering and redistricting reform?",
      ];
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
      const entryEl = (
        <div class="entry" data-entry-index={entryIndex}>
          <h3>{name}</h3>
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
    function selectEntry(dir) {
      // Set index
      if (dir === "prev") {
        if (currentIndex - 1 >= 1) {
          currentIndex = currentIndex - 1;
        }
      } else if (dir === "next") {
        if (currentIndex + 1 <= entriesTotal) {
          currentIndex = currentIndex + 1;
        }
      } else {
        currentIndex = 1; // default
      }
      // Disable pages based on current index
      container.querySelectorAll("#entries .entry").forEach((el) => {
        const elIndex = parseInt(el.getAttribute("data-entry-index"));
        if (elIndex === currentIndex) {
          el.style.display = "block";
        } else {
          el.style.display = "none";
        }
      });
      // Disable navigation buttons based on current index
      if (currentIndex === 1) {
        prevButton.setAttribute("disabled", "disabled");
      } else {
        prevButton.removeAttribute("disabled");
      }
      if (currentIndex === entriesTotal) {
        nextButton.setAttribute("disabled", "disabled");
      } else {
        nextButton.removeAttribute("disabled");
      }
    }
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
    selectEntry();
    responsesContainer.scrollTo(0, 0);
  }
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
