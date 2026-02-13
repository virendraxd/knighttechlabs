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

downloadBtn.addEventListener("click", () => {
  
  // 🔹 Validate required fields
  const requiredFields = document.querySelectorAll(".required");
  let valid = true;

  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      valid = false;
      field.style.border = "2px solid red";
    } else {
      field.style.border = "";
    }
  });

  if (!valid) {
    alert("⚠️ Please fill all required fields before downloading.");
    return;
  }

  const studentName =
    document.getElementById("coverStudent")?.innerText || "Student";

  const options = {
    margin: 0,
    filename: `${studentName}_Assignment_Cover.pdf`,
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
});

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

// window.addEventListener("load", fixNavForUniCover);


