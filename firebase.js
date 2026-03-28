import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, doc, getDoc, setDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

window.saveCoverData = async function (payment) {
  try {
    const getValue = (id) => document.getElementById(id)?.value || "";

    const data = {
      session: getValue("session"),
      title: getValue("title"),
      subject: getValue("subject"),
      faculty: getValue("faculty"),
      position: getValue("position"),
      studentName: getValue("studentName"),
      course: getValue("course"),
      stream: getValue("stream"),
      year: getValue("year"),
      accessKey: getValue("accessKey") || "None",

      paymentId: payment?.razorpay_payment_id || "N/A",
      orderId: payment?.razorpay_order_id || "N/A",
      signature: payment?.razorpay_signature || "N/A",

      createdAt: new Date()
    };

    await addDoc(collection(db, "unicoverOrders"), data);

    console.log("Data saved successfully");
  } catch (error) {
    console.error("Firebase error:", error);
  }
}

// DOWNLOAD LIMIT TRACKER
window.checkDownloadLimit = async function (userId) {
  try {
    const userRef = doc(db, "downloadLimits", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      return data.count < 3; // Returns true if less than 3
    } else {
      // User not in DB yet, so they have 0 downloads so far
      return true;
    }
  } catch (error) {
    console.error("Error checking download limit:", error);
    // Returning true on error so users don't get blocked if their network drops briefly,
    // though you can switch this to false if you want strict checking.
    return true;
  }
};

window.incrementDownloadCount = async function (userId) {
  try {
    const userRef = doc(db, "downloadLimits", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      await updateDoc(userRef, { count: increment(1) });
    } else {
      await setDoc(userRef, { count: 1 });
    }
  } catch (error) {
    console.error("Error incrementing download tracking:", error);
  }
};