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

// Return currently visible cover element
function getActiveCover() {
  return document.querySelector(".cover-page:not(.hidden)");
}
const accessInput = document.getElementById("accessKey");
const accessGroup = document.querySelector(".input-group");

if (!SETTINGS.REQUIRE_ACCESS_CODE && accessGroup) {
  accessGroup.classList.add("hidden");
}


downloadBtn.addEventListener("click", () => {
  const coverPage = getActiveCover();

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
  
  // ⭐ CASE 2 — ONLY FIELDS MISSING
  if (!fieldsValid) {
    showMessage("⚠️ Please fill all required fields before downloading.");
    if (firstEmptyField) {
      firstEmptyField.focus();
      firstEmptyField.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return;
  }

  const enteredKey = accessInput ? accessInput.value.trim() : "";

  // ⭐ Only check if enabled
  if (SETTINGS.REQUIRE_ACCESS_CODE) {
    if (!enteredKey) {
      showMessage("🔐 Please enter access code.");
      accessInput.focus();
      return;
    }

    if (enteredKey !== SETTINGS.ACCESS_CODE) {
      showMessage("❌ Invalid or expired access code.");
      accessInput.focus();
      return;
    }
  }

  if (!coverPage) {
    showMessage("Error: Cover page element not found!");
    return;
  }

  if (!appliedPrice || appliedPrice < 0) {
    showMessage("Invalid price.");
    return;
  }

  // ⭐ ALL GOOD → RAZORPAY CHECKOUT
  const studentName = coverStudent?.innerText || "Student";
  const safeName = studentName.replace(/[^a-z0-9]/gi, "_");

  const discountInput = document.getElementById("discountCode");
  const enteredCode = discountInput ? discountInput.value.trim() : "";

  console.log("Final price (paise):", appliedPrice);

  // Disable button to prevent multiple clicks
  downloadBtn.disabled = true;

  // Razorpay options
  const rzpOptions = {
    key: "rzp_live_SFfynYVohQVMSU",
    amount: appliedPrice, // calculated final price in paise
    currency: "INR",
    name: "UniCover by Virendraxd",
    description: "UniCover - Cover Page Generator",
    prefill: {
      name: student.value || studentName,
      email: "student@example.com",
      contact: "9999999999"
    },
    theme: { color: "#3399cc" },
    handler: async function (response) {
      try {
        logBox.style.display = "block";

        addLog("✅ Payment Successful!");
        addLog("Payment ID: " + response.razorpay_payment_id);
        addLog("Order ID: " + response.razorpay_order_id);
        // addLog("Signature: " + response.razorpay_signature);

        // ⭐ SAVE DATA TO FIREBASE HERE
        await saveCoverData(response);

        // addLog("💾 Order saved to database");
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

        // ⭐ Temporarily activate real cover for PDF
        coverPage.style.position = "static";
        coverPage.style.left = "0";
        coverPage.style.opacity = "1";
        coverPage.style.pointerEvents = "auto";

        await new Promise(resolve => setTimeout(resolve, 100)); // small render delay

        html2pdf().set(options).from(coverPage).save().finally(() => {

          // ⭐ Hide it again after PDF
          coverPage.style.position = "fixed";
          coverPage.style.left = "-9999px";
          coverPage.style.opacity = "0";
          coverPage.style.pointerEvents = "none";

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

  saveFormData(); // save to local storage for autofill
  rzp1.open();    // Open Razorpay popup
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

function calculateFinalPrice(basePrice, code) {
  if (!SETTINGS.ENABLE_DISCOUNT) return basePrice;
  if (!code) return basePrice;

  const coupon = SETTINGS.DISCOUNT_CODES[code.toUpperCase()];

  if (!coupon) return basePrice;

  let finalPrice = basePrice;

  if (coupon.type === "percent") {
    finalPrice = basePrice - (basePrice * coupon.value / 100);
  }

  if (coupon.type === "flat") {
    finalPrice = basePrice - coupon.value;
  }

  // Prevent negative price
  return Math.max(finalPrice, 0);
}

function saveFormData() {
  const data = {
    session: session?.value,
    title: title?.value,
    subject: subject?.value,
    faculty: faculty?.value,
    position: position?.value,
    student: student?.value,
    course: course?.value,
    stream: stream?.value,
    year: year?.value
  };

  localStorage.setItem("unicover_last_data", JSON.stringify(data));
}

function autofillForm() {
  const saved = localStorage.getItem("unicover_last_data");
  if (!saved) {
    showMessage("No saved details found");
    return;
  }

  const data = JSON.parse(saved);

  if (session) session.value = data.session || "";
  if (title) title.value = data.title || "";
  if (subject) subject.value = data.subject || "";
  if (faculty) faculty.value = data.faculty || "";
  if (position) position.value = data.position || "";
  if (student) student.value = data.student || "";
  if (course) course.value = data.course || "";
  if (stream) stream.value = data.stream || "";
  if (year) year.value = data.year || "";

  // 🔥 Trigger cover updates
  session?.onchange?.();
  title?.onchange?.();
  subject?.oninput?.();
  faculty?.oninput?.();
  position?.onchange?.();
  student?.oninput?.();
  course?.onchange?.();
  stream?.onchange?.();
  year?.dispatchEvent(new Event("change"));

  showMessage("Details autofilled ✅", "success");
}

const autofillBtn = document.getElementById("autofillBtn");

autofillBtn?.addEventListener("click", autofillForm);

// =================- discount here
const discountInput = document.getElementById("discountCode");
const applyDiscountBtn = document.getElementById("applyDiscount");
const priceBadge = document.querySelector(".price-badge");

let appliedPrice = SETTINGS.PRICE; // default price
let appliedCode = null;

applyDiscountBtn.addEventListener("click", () => {

  const code = discountInput.value.trim().toUpperCase();

  if (!code) {
    showMessage("Enter a discount code.");
    return;
  }

  if (!SETTINGS.ENABLE_DISCOUNT) {
    showMessage("Discounts are disabled.");
    return;
  }

  const coupon = SETTINGS.DISCOUNT_CODES[code];

  if (!coupon) {
    showMessage("❌ Invalid discount code", "error");
    return;
  }

  let newPrice = SETTINGS.PRICE;

  if (coupon.type === "percent") {
    newPrice = SETTINGS.PRICE - (SETTINGS.PRICE * coupon.value / 100);
  }

  if (coupon.type === "flat") {
    newPrice = SETTINGS.PRICE - coupon.value;
  }

  newPrice = Math.max(newPrice, 0);

  appliedPrice = newPrice;
  appliedCode = code;

  priceBadge.textContent = "₹" + (appliedPrice / 100);

  showMessage("✅ Discount applied!", "success");
});

discountInput.addEventListener("input", () => {
  if (!discountInput.value.trim()) {
    appliedPrice = SETTINGS.PRICE;
    appliedCode = null;
    priceBadge.textContent = `₹${SETTINGS.PRICE / 100}`;
  }
});

// UNIVEERSITY SELECTOR AND THEME SWITCHER
const UNIVERSITY_CONFIG = {

  vu: {
    coverId: "cover-vu",
    preview: "assets/vu-cover-preview.png",
    primaryColor: "#00406E",
    borderColor: "#00406E",
    textColor: "#00406E",
    borderColor: "#00406E"
  },

  au: {
    coverId: "cover-au",
    preview: "assets/au-cover-preview.png",
    primaryColor: "#002D5D",
    borderColor: "#002D5D", 
    textColor: "#002D5D",
    borderColor: "#002D5D"
  }
};

function populateSelect(selectElement, items, placeholder) {

  selectElement.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  defaultOption.textContent = placeholder;

  selectElement.appendChild(defaultOption);

  items.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item;
    opt.textContent = item;
    selectElement.appendChild(opt);
  });

}

const covers = document.querySelectorAll(".cover-page");
const previewImg = document.getElementById("coverPreview");

const universitySelect = document.getElementById("university");
const previewSection = document.getElementById("previewSection");

const formInputs = [session, title, subject, faculty, position, student, course, stream, year];

// Initially disable all form inputs until university is selected
function disableFormInputs() {
  formInputs.forEach(input => {
    if (input) {
      input.disabled = true;
      // Find and style the associated label
      const label = input.previousElementSibling;
      if (label && label.tagName === "LABEL") {
        label.style.opacity = "0.5";
        label.style.color = "#999";
      }
    }
  });
}

// Enable all form inputs
function enableFormInputs() {
  formInputs.forEach(input => {
    if (input) {
      input.disabled = false;
      // Find and restore the associated label
      const label = input.previousElementSibling;
      if (label && label.tagName === "LABEL") {
        label.style.opacity = "1";
        label.style.color = "";
      }
    }
  });
}

// Disable form inputs on page load
disableFormInputs();

// Apply university theme colors
function applyTheme(themeColors) {
  // Apply to form labels
  document.querySelectorAll("form label").forEach(label => {
    label.style.color = themeColors.textColor;
  });

  // Apply to form inputs and selects
  document.querySelectorAll("input, select, textarea").forEach(input => {
    input.style.borderColor = themeColors.borderColor;
  });

  // Apply to buttons
  document.querySelectorAll("button").forEach(btn => {
    if (btn.id !== "copyLogBtn" && btn.id !== "applyDiscount") {
      btn.style.borderColor = themeColors.borderColor;
    }
  });

  // Apply to cover page
  const visibleCover = document.querySelector(".cover-page:not(.hidden)");
  if (visibleCover) {
    visibleCover.style.borderColor = themeColors.borderColor;
    visibleCover.style.setProperty("--primary-color", themeColors.primaryColor);
    visibleCover.style.setProperty("--cover-border-color", themeColors.borderColor);

    // Apply colors to cover details elements
    const detailsElements = visibleCover.querySelectorAll(
      ".session, .title, .subject" //, .submitted, .name, .position, .course, .stream, .year"
    );
    detailsElements.forEach(el => {
      el.style.color = themeColors.textColor;
    });
  }
}

// Reset theme to default
function resetTheme() {
  // Reset labels
  document.querySelectorAll("form label").forEach(label => {
    label.style.color = "";
  });

  // Reset inputs
  document.querySelectorAll("input, select, textarea").forEach(input => {
    input.style.borderColor = "";
  });

  // Reset buttons
  document.querySelectorAll("button").forEach(btn => {
    btn.style.borderColor = "";
  });

  // Reset preview section
  if (previewSection) {
    previewSection.style.borderColor = "";
  }

  // Reset cover
  document.querySelectorAll(".cover-page").forEach(cover => {
    cover.style.borderColor = "";
    cover.style.removeProperty("--primary-color");

    // Reset colors for cover details elements
    const detailsElements = cover.querySelectorAll(
      ".session, .title, .subject, .submitted"  // , .name, .position, .course, .stream, .year"
    );
    detailsElements.forEach(el => {
      el.style.color = "";
    });
  });
}

universitySelect.addEventListener("change", () => {

  const selectedUni = universitySelect.value;

  // ⭐ If nothing selected → disable inputs and hide preview
  if (!selectedUni) {
    disableFormInputs();
    previewSection.style.display = "none";
    resetTheme();
    return;
  }

  // ⭐ Show preview and enable inputs when university selected
  enableFormInputs();
  previewSection.style.display = "block";

  const uni = UNIVERSITY_CONFIG[selectedUni];
  if (!uni) return;

  // Switch covers
  document.querySelectorAll(".cover-page")
    .forEach(c => c.classList.add("hidden"));

  document.getElementById(uni.coverId)
    .classList.remove("hidden");

  // Change preview image
  document.getElementById("coverPreview").src = uni.preview;

  // Apply theme colors
  applyTheme(uni);

});

