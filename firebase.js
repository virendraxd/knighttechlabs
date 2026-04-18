import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, collection, addDoc, doc, getDoc, setDoc, updateDoc,
  increment, getDocs, deleteField, getCountFromServer, query, where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getAuth, signInWithPopup, GoogleAuthProvider,
  onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD_ZqX0oq1ZaW5TGKB04gmQk7EqPTMjWL8",
  authDomain: "knighttechlabs.firebaseapp.com",
  projectId: "knighttechlabs",
  storageBucket: "knighttechlabs.firebasestorage.app",
  messagingSenderId: "549938778813",
  appId: "1:549938778813:web:15d1cd53c4d5fe3ffbddd4",
  measurementId: "G-4Z0P8093Z5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

window.currentUser = null;
window.isPremiumUser = false;
window.authResolved = false;

function shouldSaveToDB() {
  if (!window.SETTINGS) return true;
  const isLocal = location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname === "::1" || location.hostname === "" || location.protocol === "file:";
  return window.SETTINGS.SAVE_TO_DB && (!isLocal || window.SETTINGS.SAVE_TO_DB_FROM_LOCALHOST === true);
}

// 🆔 CUSTOM USER ID FOR GUESTS
window.getDeviceUserId = function () {
  let userId = localStorage.getItem("unicover_user_id");
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    localStorage.setItem("unicover_user_id", userId);
    console.log("Generated new guest ID:", userId);
  }
  return userId;
};

// Initialize device ID immediately
window.getDeviceUserId();

//
// 🔐 AUTH HANDLING
//
onAuthStateChanged(auth, async (user) => {
  window.authResolved = true;

  // 🛡️ Only handle as authenticated if they are NOT anonymous
  if (user && !user.isAnonymous) {
    window.currentUser = user;

    localStorage.setItem("ktl_user_email", user.email);
    localStorage.setItem("ktl_user_name", user.displayName || "User");

    try {
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      // 🆕 CREATE USER IF NOT EXISTS
      if (!snap.exists()) {
        await setDoc(userRef, {
          name: user.displayName || "User",
          email: user.email,
          isPremium: false,
          downloadsCount: 0,
          createdAt: new Date()
        });

        // increment global users
        // (Now handled in incrementDownloadCount to include guests and avoid duplicates)
      }

      const data = snap.exists() ? snap.data() : {};
      window.isPremiumUser = data.isPremium || false;

      if (window.isPremiumUser) {
        localStorage.setItem("ktl_user_premium", "true");
      } else {
        localStorage.removeItem("ktl_user_premium");
      }

    } catch (err) {
      console.error("Auth error:", err);
    }

  } else {
    window.currentUser = null;
    window.isPremiumUser = false;
    localStorage.removeItem("ktl_user_email");
    localStorage.removeItem("ktl_user_name");
    localStorage.removeItem("ktl_user_premium");
  }

  if (window.updateAuthUI) window.updateAuthUI();
  if (window.updateFreeDownloadsBar) window.updateFreeDownloadsBar();
});

//
// 🚪 LOGOUT
//
window.logoutUser = async function () {
  await signOut(auth);
};

//
// 🔑 LOGIN
//
window.triggerLoginOnly = async function () {
  if (!window.currentUser) {
    try {
      const res = await signInWithPopup(auth, provider);
      window.currentUser = res.user;
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
  return true;
};

//
// 💎 PREMIUM
//
window.markPremiumInDB = async function () {
  if (!window.currentUser) return false;

  try {
    await setDoc(doc(db, "users", window.currentUser.uid), {
      isPremium: true
    }, { merge: true });

    window.isPremiumUser = true;
    return true;

  } catch (err) {
    console.error(err);
    return false;
  }
};

//
// 🧾 SAVE COVER → unicoverOrders
//
window.saveCoverData = async function (payment, fileUrl = "") {
  if (!shouldSaveToDB()) {
    console.warn("⚠️ Database saving is disabled by settings (Localhost or SAVE_TO_DB=false)");
    return;
  }
  try {
    const getValue = (id) => document.getElementById(id)?.value || "";

    const data = {
      // cover data
      session: getValue("session"),
      title: getValue("title"),
      subject: getValue("subject"),
      faculty: getValue("faculty"),
      position: getValue("position"),
      studentName: getValue("studentName"),
      course: getValue("course"),
      stream: getValue("stream"),
      year: getValue("year"),

      // user
      userId: window.currentUser?.uid || window.getDeviceUserId(),
      userEmail: window.currentUser?.email || "Guest",
      isGuest: !window.currentUser,

      // payment
      isPaid: !!payment,
      paymentId: payment?.razorpay_payment_id || null,

      // file
      fileUrl: fileUrl || null,

      createdAt: new Date()
    };

    await addDoc(collection(db, "unicoverOrders"), data);

    // ✅ Increment global savedCovers stat
    if (shouldSaveToDB()) {
      await updateDoc(doc(db, "stats", "main"), {
        savedCovers: increment(1)
      });
    }

    console.log("Order saved");

  } catch (error) {
    console.error("Save error:", error);
  }
};

//
// 📥 DOWNLOAD LIMIT + TRACKING
//
window.getDownloadUsage = async function (userId) {
  const ref = doc(db, "guestUsers", userId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data().count || 0 : 0;
};

window.checkDownloadLimit = async function (userId) {
  const count = await window.getDownloadUsage(userId);
  return count < 3;
};

window.incrementDownloadCount = async function (userId) {
  try {
    // ✅ Only update the 'users' doc if the user is actually authenticated
    if (userId && window.currentUser && window.currentUser.uid === userId) {
      await updateDoc(doc(db, "users", userId), {
        downloadsCount: increment(1)
      });
    }

    // ✅ Always track in guestUsers (works for both guests and auth users)
    if (userId) {
      const ref = doc(db, "guestUsers", userId);
      const snap = await getDoc(ref);

      const isGuest = !window.currentUser || window.currentUser.uid !== userId;

      if (snap.exists()) {
        await updateDoc(ref, {
          count: increment(1),
          lastUsed: new Date(),
          isGuest: isGuest
        });
      } else {
        // 🆕 NEW USER DETECTED (First time downloading)
        await setDoc(ref, {
          count: 1,
          createdAt: new Date(),
          lastUsed: new Date(),
          isGuest: isGuest,
          email: window.currentUser?.email || "Guest"
        });

        // ✅ Increment global users stat for new IDs
        if (shouldSaveToDB()) {
          await updateDoc(doc(db, "stats", "main"), {
            users: increment(1)
          });
        }
      }
    }

    // ✅ Always update global downloads stat
    if (shouldSaveToDB()) {
      await updateDoc(doc(db, "stats", "main"), {
        downloads: increment(1)
      });
    }

  } catch (err) {
    console.error("Download increment error:", err);
  }
};

//
// 📊 STATS
//
async function getStats() {
  try {
    const statsSnap = await getDoc(doc(db, "stats", "main"));
    const statsData = statsSnap.exists() ? statsSnap.data() : {};
    
    return { 
      users: statsData.users || 0, 
      downloads: statsData.downloads || 0,
      savedCovers: statsData.savedCovers || 0
    };
  } catch (e) {
    console.warn("Could not read stats:", e);
    return { users: 0, downloads: 0, savedCovers: 0 };
  }
}

function format(num) {
  if (num >= 1000) return (num / 1000).toFixed(1) + "K+";
  return num + "+";
}

async function loadStats() {
  try {
    const stats = await getStats();

    const userEl = document.getElementById("userCount");
    if (userEl) {
      userEl.textContent = format(stats.users);
    }

    const downloadEl = document.getElementById("downloadCount");
    if (downloadEl) {
      downloadEl.textContent = format(stats.downloads);
    }

  } catch (err) {
    console.error(err);
  }
};
loadStats();


//
// 🛠️ MIGRATION: downloadLimits → guestUsers
//
// window.migrateDownloadLimitsToGuestUsers = async function () {
//   console.log("🚀 Starting migration: downloadLimits → guestUsers...");
//   const snapshot = await getDocs(collection(db, "downloadLimits"));
//   let movedCount = 0;

//   for (const docSnap of snapshot.docs) {
//     const data = docSnap.data();
//     const newRef = doc(db, "guestUsers", docSnap.id);

//     // Copy data to new collection
//     await setDoc(newRef, data);
//     movedCount++;
//     console.log(`✅ Moved ${docSnap.id} (${movedCount}/${snapshot.size})`);
//   }

//   console.log(`🎉 Migration complete! Moved ${movedCount} documents.`);
//   console.log("⚠️ You can now safely delete the 'downloadLimits' collection in Firebase Console.");
// };

//
// 🛠️ OPTIONAL: MIGRATION (RUN ONCE)
//
window.migrateOrders = async function () {
  const snapshot = await getDocs(collection(db, "unicoverOrders"));

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const ref = doc(db, "unicoverOrders", docSnap.id);

    const updates = {};

    if (!("isPaid" in data)) updates.isPaid = !!data.paymentId;
    if (!("isGuest" in data)) updates.isGuest = !data.userId;
    if (!("fileUrl" in data)) updates.fileUrl = null;

    if ("accessKey" in data) updates.accessKey = deleteField();
    if ("signature" in data) updates.signature = deleteField();

    if (Object.keys(updates).length > 0) {
      await updateDoc(ref, updates);
      console.log("Migrated:", docSnap.id);
    }
  }

  console.log("Migration done 🚀");
};