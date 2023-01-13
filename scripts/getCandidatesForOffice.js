export default function getCandidatesForOffice(entries, officeName) {
  const candidates = [];
  // Get matching candidates for office
  entries.forEach((entry) => {
    const keys = Object.keys(entry);
    const thisOfficeName = entry["Ward or Office Sought"].trim();
    if (officeName !== thisOfficeName) return;
    candidates.push(entry);
  });
  // Sort candidates by last name
  candidates.sort((a, b) => {
    const nameRegex = /\s/g;
    const nameA = a["Candidate Name"].trim().split(nameRegex);
    const nameB = b["Candidate Name"].trim().split(nameRegex);
    const lastNameA = nameA[nameA.length - 1];
    const lastNameB = nameB[nameB.length - 1];
    if (lastNameA < lastNameB) {
      return -1;
    }
    if (lastNameA > lastNameB) {
      return 1;
    }
    return 0;
  });
  return candidates;
}
