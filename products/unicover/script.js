// INPUTS
const session = document.getElementById("session");
const title = document.getElementById("title");
const subject = document.getElementById("subject");
const faculty = document.getElementById("faculty");
const position = document.getElementById("position");
const student = document.getElementById("studentName");
const course = document.getElementById("course");
const stream = document.getElementById("stream");
const year = document.getElementById("year");

// COVER ELEMENTS
const coverSession = document.getElementById("coverSession");
const coverTitle = document.getElementById("coverTitle");
const coverSubject = document.getElementById("coverSubject");
const coverFaculty = document.getElementById("coverFaculty");
const coverPosition = document.getElementById("coverPosition");
const coverStudent = document.getElementById("coverStudent");
const coverCourse = document.getElementById("coverCourse");
const coverStream = document.getElementById("coverStream");
const coverYear = document.getElementById("coverYear");

// HELPERS
const upper = (el) => el.value.toUpperCase();

// LIVE UPDATE
if (session) {
  session.onchange = () => coverSession.textContent = "SESSION : " + session.value;
}
if (title) {
  title.onchange = () => coverTitle.textContent = title.value;
}
if (subject) {
  subject.oninput = () => coverSubject.textContent = "SUBJECT : " + subject.value.toUpperCase();
}
if (faculty) {
  faculty.oninput = () => coverFaculty.textContent = faculty.value.toUpperCase();
}
if (position) {
  position.onchange = () => coverPosition.textContent = position.value;
}
if (student) {
  student.oninput = () => coverStudent.textContent = student.value.toUpperCase();
}
if (course) {
  course.onchange = () => coverCourse.textContent = course.value;
}
if (stream) {
  stream.onchange = () => coverStream.textContent = stream.value;
}
if (year && coverYear) {
  year.addEventListener("change", () => {

    const value = year.value; // 1st, 2nd, etc
    const number = value.slice(0, -2);
    const suffix = value.slice(-2);

    coverYear.innerHTML = `${number}<sup>${suffix}</sup> YEAR`;
  });
}

const downloadBtn = document.getElementById("downloadPdf");
const coverPage = document.querySelector(".cover-page");
const accessInput = document.getElementById("accessKey");

// 🔐 Generate daily code
const today = new Date().toISOString().slice(0, 10);
const correctKey = "KTL-" + today;

downloadBtn.addEventListener("click", () => {

  // 🔐 ACCESS CODE
  const enteredKey = accessInput.value.trim();
  const codeFilled = enteredKey.length > 0;
  const codeValid = enteredKey === correctKey;

  // 📝 REQUIRED FIELDS
  const requiredFields = document.querySelectorAll(".required");
  let fieldsValid = true;
  let firstEmptyField = null;

  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      fieldsValid = false;
      field.style.border = "2px solid red";
      if (!firstEmptyField) firstEmptyField = field;
    } else {
      field.style.border = "";
    }
  });

  // ⭐ CASE 1 — BOTH MISSING
  if (!fieldsValid && !codeFilled) {
    showMessage("⚠️ Please fill all required fields and enter Access Code.");
    if (firstEmptyField) {
      firstEmptyField.focus();
      firstEmptyField.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return;
  }

  // ⭐ CASE 2 — ONLY FIELDS MISSING
  if (!fieldsValid) {
    showMessage("⚠️ Please fill all required fields before downloading.");
    if (firstEmptyField) {
      firstEmptyField.focus();
      firstEmptyField.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return;
  }

  // ⭐ CASE 3 — CODE EMPTY
  if (!codeFilled) {
    showMessage("🔐 Please enter access code.");
    accessInput.focus();
    return;
  }

  // ⭐ CASE 4 — CODE WRONG
  if (!codeValid) {
    showMessage("❌ Invalid or expired access code.");
    accessInput.focus();
    return;
  }

  if (!coverPage) {
    showMessage("Error: Cover page element not found!");
    return;
  }

  // ⭐ ALL GOOD → RAZORPAY CHECKOUT
  const studentName = coverStudent?.innerText || "Student";
  const safeName = studentName.replace(/[^a-z0-9]/gi, "_");

  // Disable button to prevent multiple clicks
  downloadBtn.disabled = true;

  // Razorpay options
  const rzpOptions = {
    key: "rzp_live_SFfynYVohQVMSU", // Replace with your Razorpay Test Key ID
    amount: 1000, // Amount in paise (₹10)
    currency: "INR",
    name: "UniCover by Virendraxd",
    description: "Assignment Cover Page Generator",
    prefill: {
      name: student.value || studentName,
      email: "student@example.com",
      contact: "9999999999"
    },
    theme: { color: "#3399cc" },
    handler: function (response) {
      try {
        logBox.style.display = "block";

        addLog("✅ Payment Successful!");
        addLog("Payment ID: " + response.razorpay_payment_id);
        addLog("Order ID: " + response.razorpay_order_id);
        addLog("Signature: " + response.razorpay_signature);
        addLog("📥 Starting PDF download...");

        console.log("Payment successful", response);

        // ✅ Generate PDF after successful payment
        const options = {
          margin: 0,
          filename: `${safeName}_Assignment_Cover.pdf`,
          image: { type: "jpeg", quality: 1 },
          html2canvas: { scale: 3, useCORS: true, scrollX: 0, scrollY: 0 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: { mode: "avoid-all" }
        };

        html2pdf().set(options).from(coverPage).save().finally(() => {
          addLog("✅ PDF Download Completed!");
          downloadBtn.disabled = false;
        });
      } catch (err) {
        console.error("PDF generation failed:", err);
        logBox.style.display = "block";
        addLog("❌ PDF generation failed. Check console.");
        downloadBtn.disabled = false;
      }
    }
  };

  const rzp1 = new Razorpay(rzpOptions);

  // Payment failed handler
  rzp1.on('payment.failed', function (response) {
    console.error("Payment failed:", response.error);
    showMessage("Payment failed! Try again.");
    downloadBtn.disabled = false;
  });

  // Open Razorpay popup
  rzp1.open();
});

console.log("Today's Access Code:", correctKey);

document.querySelectorAll(".required").forEach(field => {
  field.addEventListener("input", () => {
    if (field.value.trim()) field.style.border = "";
  });
});

function getBase() {
  // GitHub Pages domain check
  if (location.hostname.includes("github.io")) {
    return "/knighttechlabs/"; // repo name
  }

  // Localhost
  return "/";
}

function fixNavForUniCover() {
  const path = location.pathname;

  if (!path.includes("/products/unicover")) return;

  const home = document.querySelector('[data-link="home"]');
  const products = document.querySelector('[data-link="products"]');
  const about = document.querySelector('[data-link="about"]');

  const BASE = getBase();

  if (home) home.href = BASE + "index.html";
  if (products) products.href = BASE + "index.html#products";
  if (about) about.href = BASE + "index.html#about";
}

function showMessage(text, type = "error", duration = 3000) {
  const box = document.getElementById("messageBox");

  box.textContent = text;
  box.className = "";              // reset classes
  box.classList.add(type, "show");

  // Auto hide
  setTimeout(() => {
    box.classList.remove("show");
  }, duration);
}

const logBox = document.getElementById("logBox");
const logContent = document.getElementById("logContent");
const copyLogBtn = document.getElementById("copyLogBtn");

// Add a line to log
function addLog(message) {
  const timestamp = new Date().toLocaleTimeString();
  logContent.textContent += `[${timestamp}] ${message}\n`;
  logContent.scrollTop = logContent.scrollHeight; // auto scroll to bottom
}

// Copy log to clipboard
copyLogBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(logContent.textContent)
    .then(() => alert("Log copied to clipboard ✅"))
    .catch(() => alert("Failed to copy log ❌"));
});
