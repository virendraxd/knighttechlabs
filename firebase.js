import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

window.saveCoverData = async function(payment) {
  const data = {
    session: document.getElementById("session").value,
    title: document.getElementById("title").value,
    subject: document.getElementById("subject").value,
    faculty: document.getElementById("faculty").value,
    position: document.getElementById("position").value,
    studentName: document.getElementById("studentName").value,
    course: document.getElementById("course").value,
    stream: document.getElementById("stream").value,
    year: document.getElementById("year").value,
    accessKey: document.getElementById("accessKey").value || "None",

    paymentId: payment?.razorpay_payment_id || "N/A",
    orderId: payment?.razorpay_order_id || "N/A",
    signature: payment?.razorpay_signature || "N/A",

    createdAt: new Date()
  };

  await addDoc(collection(db, "unicoverOrders"), data);

  console.log("Data saved successfully");
};
