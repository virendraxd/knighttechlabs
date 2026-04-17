import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, collection, addDoc, doc, getDoc, setDoc, updateDoc,
  increment, getDocs, deleteField, getCountFromServer
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

//
// 🔐 AUTH HANDLING
//
onAuthStateChanged(auth, async (user) => {
  window.authResolved = true;

  if (user) {
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
        if (shouldSaveToDB()) {
          await updateDoc(doc(db, "stats", "main"), {
            users: increment(1)
          });
        }
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
      userId: window.currentUser?.uid || null,
      userEmail: window.currentUser?.email || null,
      isGuest: !window.currentUser,

      // payment
      isPaid: !!payment,
      paymentId: payment?.razorpay_payment_id || null,

      // file
      fileUrl: fileUrl || null,

      createdAt: new Date()
    };

    await addDoc(collection(db, "unicoverOrders"), data);

    console.log("Order saved");

  } catch (error) {
    console.error("Save error:", error);
  }
};

//
// 📥 DOWNLOAD LIMIT + TRACKING
//
window.getDownloadUsage = async function (userId) {
  const ref = doc(db, "downloadLimits", userId);
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
    // Guest userIds are localStorage-based (not Firebase Auth UIDs), so we
    // must NOT try to updateDoc on users/{guestId} — that doc doesn't exist.
    if (userId && window.currentUser && window.currentUser.uid === userId) {
      await updateDoc(doc(db, "users", userId), {
        downloadsCount: increment(1)
      });
    }

    // ✅ Always track in downloadLimits (works for both guests and auth users)
    if (userId) {
      const ref = doc(db, "downloadLimits", userId);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        await updateDoc(ref, { count: increment(1) });
      } else {
        await setDoc(ref, { count: 1 });
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
  // Count unique devices/users from downloadLimits collection
  // Each document = one unique device ID, so this is the true unique-user count
  let deviceUsers = 0;
  try {
    const countSnap = await getCountFromServer(collection(db, "downloadLimits"));
    deviceUsers = countSnap.data().count;
  } catch (e) {
    console.warn("Could not count downloadLimits:", e);
  }

  // Still read downloads from stats/main
  let downloads = 0;
  try {
    const snap = await getDoc(doc(db, "stats", "main"));
    if (snap.exists()) downloads = snap.data().downloads || 0;
  } catch (e) {
    console.warn("Could not read stats/main:", e);
  }

  return { users: deviceUsers, downloads };
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