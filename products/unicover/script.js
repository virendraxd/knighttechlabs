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
if (year) {
  year.onchange = () => {
    coverYear.innerHTML = year.value.toUpperCase() + "<sup> YEAR</sup>";
  }
};

const downloadBtn = document.getElementById("downloadPdf");
const coverPage = document.querySelector(".cover-page");

downloadBtn.addEventListener("click", () => {

  const studentName =
    document.getElementById("coverStudent")?.innerText || "Student";

  const options = {
    margin: [0, 0, 0, 0],
    filename: `${studentName}_Assignment_Cover.pdf`,
    image: { type: "jpeg", quality: 1 },
    html2canvas: {
      scale: 3,
      useCORS: true,
      scrollY: 0,
      
      windowWidth: 794,   // 210mm @ 96dpi
      windowHeight: 1123  // 297mm @ 96dpi
    },

    jsPDF: {
      unit: "mm",
      format: [210, 297],   // 👈 EXACT SIZE
      orientation: "portrait"
    },
    pagebreak: { mode: ["avoid-all"] }
  };

  html2pdf().set(options).from(coverPage).save();
});

