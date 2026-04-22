import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
const db = window.db;

async function checkResolvedIssues() {
  const userId = window.getDeviceUserId();

  const q = query(
    collection(db, "supportRequests"),
    where("userId", "==", userId),
    where("status", "==", "closed")
  );

  const snapshot = await getDocs(q);

  if (!snapshot.empty && !localStorage.getItem("issueSeen")) {
    showResolvedPopup();
    localStorage.setItem("issueSeen", "true");
  }
}

function showResolvedPopup() {
  showGlobalToast("🎉 Your issue has been fixed!");
}

window.addEventListener("load", () => {
  checkResolvedIssues();
});