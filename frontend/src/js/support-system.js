import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase.js";

export async function checkResolvedIssues() {
  const userId = window.getDeviceUserId ? window.getDeviceUserId() : localStorage.getItem("unicover_user_id");
  if (!userId) return;

  try {
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
  } catch (err) {
    console.error("Failed to check resolved issues:", err);
  }
}

function showResolvedPopup() {
  if (window.showGlobalToast) {
    window.showGlobalToast("🎉 Your support request has been resolved!", "success");
  }
}