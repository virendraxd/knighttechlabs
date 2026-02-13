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
    showMessage("⚠️ Please fill all required fields AND enter access code.");
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

  // ⭐ ALL GOOD → RAZORPAY CHECKOUT

  const studentName = document.getElementById("coverStudent")?.innerText || "Student";
  const safeName = studentName.replace(/[^a-z0-9]/gi, "_");

  // Razorpay options
  const rzpOptions = {
    key: "rzp_live_SFfynYVohQVMSU", // Replace with your Razorpay Test Key ID
    amount: 100, // Amount in paise (₹1 = 100)
    currency: "INR",
    name: "UniCover by Virendraxd",
    description: "Assignment Cover Page Generator",
    // image: "https://yourwebsite.com/logo.png", // optional
    handler: function (response) {
      // ✅ Payment successful → generate PDF
      const options = {
        margin: 0,
        filename: `${safeName}_Assignment_Cover.pdf`,
        image: { type: "jpeg", quality: 1 },

        html2canvas: {
          scale: 3,
          useCORS: true,
          scrollX: 0,
          scrollY: 0
        },

        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait"
        },

        pagebreak: { mode: "avoid-all" }
      };

      html2pdf().set(options).from(coverPage).save();
    },
    prefill: { name: "", email: "", contact: "" },
    theme: { color: "#3399cc" }
  };

  const rzp1 = new Razorpay(rzpOptions);
  rzp1.open();
});

console.log("Today's Access Code:", correctKey);

document.querySelectorAll(".required").forEach(field => {
  field.addEventListener("input", () => {
    if (field.value.trim()) field.style.border = "";
  });
});


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