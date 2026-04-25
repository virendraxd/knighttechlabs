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

applySettingsUI();

let isGenerating = false;

// CHECK DB SAVE PERMISSIONS FOR COVER DATA
// (Handled internally by firebase.js window.saveCoverData)


// DOWNLOAD LIMIT LOGIC
function getOrCreateUserId() {
  if (window.currentUser) return window.currentUser.uid;
  return window.getDeviceUserId();
}
// ==========================================
// FREE DOWNLOADS REMAINING INDICATOR
// ==========================================
const FREE_LIMIT = 10;

window.updateFreeDownloadsBar = async function () {
  const bar = document.getElementById("freeDownloadsBar");
  const text = document.getElementById("freeDownloadsText");
  if (!bar || !text) return;

  // Don't show the bar for premium users
  if (window.isPremiumUser) {
    bar.style.display = 'none';
    return;
  }

  const userId = getOrCreateUserId();
  let used = 0;

  try {
    if (window.getDownloadUsage) {
      used = await window.getDownloadUsage(userId);
    }
  } catch (e) {
    // Firestore may not be ready yet — just skip showing the bar
    return;
  }

  const remaining = Math.max(0, FREE_LIMIT - used);

  if (remaining === 0) {
    text.innerHTML = `🔒 0/${FREE_LIMIT} premium downloads remaining`;
    bar.className = 'free-downloads-bar exhausted';
  } else if (remaining === 1) {
    text.innerHTML = `⚠️ ${remaining}/${FREE_LIMIT} free premium download left`;
    bar.className = 'free-downloads-bar warning';
  } else {
    text.innerHTML = `🎁 ${remaining}/${FREE_LIMIT} free premium downloads remaining`;
    bar.className = 'free-downloads-bar';
  }

  bar.style.display = 'flex';
}

// Load the bar once Firebase has had time to initialise
setTimeout(window.updateFreeDownloadsBar, 1200);

// Toggle button loading state
function setBtnLoading(isLoading) {
  const spinner = document.getElementById("btnSpinner");
  const content = document.getElementById("btnContent");
  
  if (isLoading) {
    spinner?.classList.remove("hidden");
    content?.classList.add("hidden");
    downloadBtn.disabled = true;
    downloadBtn.style.transform = "none";
    downloadBtn.style.pointerEvents = "none";
  } else {
    spinner?.classList.add("hidden");
    content?.classList.remove("hidden");
    downloadBtn.disabled = false;
    downloadBtn.style.transform = "";
    downloadBtn.style.pointerEvents = "";
  }
}


// CENTRAL PDF GENERATION ENGINE
async function executePDFGeneration(isWatermarked = false, shouldIncrement = false) {
  const coverPage = getActiveCover();
  const studentName = coverStudent?.innerText || "Student";
  const safeName = studentName.replace(/[^a-z0-9]/gi, "_");

  // Show spinner
  setBtnLoading(true);

  // Handle Watermark for download
  const watermark = coverPage.querySelector(".watermark-overlay");
  if (watermark) {
    // If it's a clean download, we hide the watermark during capture
    if (!isWatermarked) {
      watermark.classList.add("hidden-capture");
    } else {
      watermark.classList.remove("hidden-capture");
    }
  }

  logBox.style.display = "block";
  const delay = ms => new Promise(r => setTimeout(r, ms));

  const options = {
    margin: 0,
    filename: `${safeName}_Assignment_Cover${isWatermarked ? '_Watermarked' : ''}.pdf`,
    image: { type: "jpeg", quality: 1 },
    html2canvas: {
      scale: 3,
      useCORS: true,
      logging: false,
      letterRendering: true,
      scrollX: 0,
      scrollY: 0
    },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  coverPage.style.position = "static";
  coverPage.style.left = "0";
  coverPage.style.opacity = "1";
  coverPage.style.pointerEvents = "auto";

  try {
    addLog("📥 Preparing your cover...");

    // 1. Save all existing styles to restore later
    const originalStyles = {
      transform: coverPage.style.transform,
      transformOrigin: coverPage.style.transformOrigin,
      marginLeft: coverPage.style.marginLeft,
      marginBottom: coverPage.style.marginBottom,
      position: coverPage.style.position,
      left: coverPage.style.left,
      opacity: coverPage.style.opacity
    };

    // 2. FORCE pure A4 state for high-quality capture
    coverPage.style.transform = "none";
    coverPage.style.transformOrigin = "top left";
    coverPage.style.marginLeft = "0";
    coverPage.style.marginBottom = "0";
    coverPage.style.position = "static";
    coverPage.style.opacity = "1";

    await delay(800);
    addLog("🔄 Rendering high-quality PDF...");
    await delay(1200);
    addLog("⬇️ Download starting...");
    await delay(700);

    await html2pdf().set(options).from(coverPage).save();

    if (shouldIncrement && window.incrementDownloadCount) {
      const userId = getOrCreateUserId();
      await window.incrementDownloadCount(userId);
    }

    // 3. Restore original preview styles
    Object.assign(coverPage.style, originalStyles);

    await delay(400);
    addLog("✅ Download completed successfully!");
  } finally {
    // Always restore button — even if an error occurs mid-generation
    setBtnLoading(false);

    if (watermark) {
      watermark.classList.remove("hidden-capture");
    }

    // Ensure scaling is correct after generation
    scaleCoverToFit();
  }
}

async function triggerRazorpayPayment(amountInPaise, description, onSuccessCallback) {
  saveFormData();
  const studentName = coverStudent?.innerText || "Student";
  const userId = getOrCreateUserId();

  try {
    addLog("⏳ Initiating secure payment...");

    // Open Razorpay Checkout
    const rzpOptions = {
      key: "rzp_live_SFfynYVohQVMSU", // Sandbox/Live Key 
      amount: amountInPaise,
      currency: "INR",
      name: "UniCover by Virendraxd",
      description: description,
      prefill: {
        name: studentName,
        email: "student@example.com",
        contact: "9999999999"
      },
      theme: { color: "#3399cc" },
      handler: async function (response) {
        logBox.style.display = "block";
        addLog("✅ Payment Successful!");
        addLog("Payment ID: " + response.razorpay_payment_id);

        if (SHOULD_SAVE_COVER && window.saveCoverData) {
          await window.saveCoverData(response);
        }
        await onSuccessCallback();
      }
    };

    const rzp = new Razorpay(rzpOptions);
    rzp.on('payment.failed', function (res) {
      console.error("Payment failed", res.error);
      showGlobalToast("Payment failed! Please try again.", "error");
    });
    rzp.open();

  } catch (err) {
    console.error("Payment Initiation Error:", err);
    showGlobalToast("Could not open payment gateway. Please try again.", "error");
  }
}

// ==========================================
// FREEMIUM MODAL EVENTS
// ==========================================
const freemiumModal = document.getElementById("freemiumModal");

document.getElementById("fmBtnClose")?.addEventListener("click", () => {
  freemiumModal.classList.add("hidden");
  downloadBtn.disabled = false;
});

// Option 1: Free Watermark
document.getElementById("fmBtnFree")?.addEventListener("click", async () => {
  freemiumModal.classList.toggle("hidden");
  if (isGenerating) return;
  isGenerating = true;
  await executePDFGeneration(true, false); // Watermarked, NO increment
  isGenerating = false;
  downloadBtn.disabled = false;
});

// Option 2: Single Clean
document.getElementById("fmBtnSingle")?.addEventListener("click", () => {
  freemiumModal.classList.toggle("hidden");
  triggerRazorpayPayment(500, "Single Clean Download", async () => {
    if (isGenerating) return;
    isGenerating = true;
    await executePDFGeneration(false, false); // Clean, NO increment
    isGenerating = false;
    downloadBtn.disabled = false;
  });
});

// Option 3: Unlimited Clean + Auth
document.getElementById("fmBtnUnlimited")?.addEventListener("click", async () => {
  freemiumModal.classList.toggle("hidden");

  // 1. Force Login FIRST securely within the click event
  const loggedIn = await window.triggerLoginOnly();
  if (!loggedIn) {
    showGlobalToast("Google Sign-In required to unlock Premium. 🔐", "warning", 4000);
    downloadBtn.disabled = false;
    return;
  }

  // 2. Open Razorpay after successful login
  triggerRazorpayPayment(2900, "Unlimited Clean PDF Access", async () => {
    isGenerating = true;

    const upgraded = await window.markPremiumInDB();
    if (upgraded) {
      showGlobalToast("Premium Unlocked Successfully! 🎉", "success", 5000);
    } else {
      showGlobalToast("Payment success but auth failed. Contact Support.", "warning", 8000);
    }

    await executePDFGeneration(false, false); // Clean
    isGenerating = false;
    downloadBtn.disabled = false;
  });
});

// MAIN DOWNLOAD ENTRY POINT
downloadBtn.addEventListener("click", async () => {
  if (isGenerating) return;   // 🚫 Prevent spam

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

  if (!fieldsValid) {
    showGlobalToast("⚠️ Please fill all required fields before downloading.");
    if (firstEmptyField) {
      firstEmptyField.focus();
      firstEmptyField.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return;
  }

  // ⭐ PREMIUM CHECK (Instant clean execution)
  if (window.isPremiumUser) {
    isGenerating = true;
    setBtnLoading(true); // Show spinner
    
    showGlobalToast("Generating Premium Clean PDF...", "success", 2000);
    saveFormData();
    if (window.saveCoverData) {
      await window.saveCoverData({ razorpay_payment_id: "PREMIUM_USER" });
    }
    await executePDFGeneration(false, false);
    
    isGenerating = false;
    setBtnLoading(false); // Hide spinner
    return;
  }

  // ⭐ FREE LIMIT WAIT CHECK
  isGenerating = true;
  setBtnLoading(true); // Show spinner

  if (window.checkDownloadLimit) {
    const userId = getOrCreateUserId();
    const canDownload = await window.checkDownloadLimit(userId);

    if (canDownload) {
      console.log("✅ Limit Check Passed. Checking save settings...");

      // Still under limit -> free clean download
      if (window.saveCoverData) {
        console.log("💾 Calling saveCoverData...");
        await window.saveCoverData({ razorpay_payment_id: "FREE_MODE" });
      } else {
        console.error("❌ Critical: window.saveCoverData is NOT defined!");
      }
      saveFormData();
      await executePDFGeneration(false, true); // clean, increment
      
      isGenerating = false;
      setBtnLoading(false); // Hide spinner
      
      // Refresh the downloads remaining counter
      window.updateFreeDownloadsBar();
      return;
    } else {
      // FREEMIUM MODAL LAUNCH
      isGenerating = false;
      setBtnLoading(false); // Hide spinner
      window.updateFreeDownloadsBar(); // refresh bar to show 0 remaining
      freemiumModal.classList.toggle("hidden");
      return;
    }
  }

  // Fallback if limit checker fails
  saveFormData();
  await executePDFGeneration(false, false);
  isGenerating = false;
  setBtnLoading(false); // Hide spinner
});

async function generatePDFDirectly() {

  const coverPage = getActiveCover();
  if (!coverPage) {
    showGlobalToast("Error: Cover page element not found!");
    return;
  }

  const studentName = coverStudent?.innerText || "Student";
  const safeName = studentName.replace(/[^a-z0-9]/gi, "_");

  const options = {
    margin: 0,
    filename: `${safeName}_Assignment_Cover.pdf`,
    image: { type: "jpeg", quality: 1 },
    html2canvas: { scale: 3, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
  };

  coverPage.style.position = "static";
  coverPage.style.left = "0";
  coverPage.style.opacity = "1";
  coverPage.style.pointerEvents = "auto";

  await new Promise(resolve => setTimeout(resolve, 100));

  await html2pdf().set(options).from(coverPage).save();

  coverPage.style.position = "fixed";
  coverPage.style.left = "-9999px";
  coverPage.style.opacity = "0";
  coverPage.style.pointerEvents = "none";
}

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
    .then(() => showGlobalToast("Log copied to clipboard ✅"))
    .catch(() => showGlobalToast("Failed to copy log ❌"));
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
  const uni = document.getElementById("university");
  const data = {
    university: uni?.value,
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
    showGlobalToast("No saved details found");
    return;
  }

  const data = JSON.parse(saved);

  if (data.university) {
    universitySelect.value = data.university;
    universitySelect.dispatchEvent(new Event("change"));
  }

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

  showGlobalToast("Details autofilled ✅", "success");
}

const autofillBtn = document.getElementById("autofillBtn");

autofillBtn?.addEventListener("click", autofillForm);

// =================-- discount here --=================
const discountInput = document.getElementById("discountCode");
const applyDiscountBtn = document.getElementById("applyDiscount");
const priceBadge = document.querySelector(".price-badge");

let appliedPrice = SETTINGS.PRICE; // default price
let appliedCode = null;

if (SETTINGS.ENABLE_DISCOUNT && applyDiscountBtn && discountInput) {

  applyDiscountBtn.addEventListener("click", () => {

    const code = discountInput.value.trim().toUpperCase();

    if (!code) {
      showGlobalToast("Enter a discount code.");
      return;
    }

    const coupon = SETTINGS.DISCOUNT_CODES[code];

    if (!coupon) {
      showGlobalToast("❌ Invalid discount code", "error");
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

    const priceBadge = document.querySelector(".price-badge");
    if (priceBadge) {
      priceBadge.textContent = "₹" + (appliedPrice / 100);
    }

    showGlobalToast("✅ Discount applied!", "success");
  });
}

if (SETTINGS.ENABLE_DISCOUNT && discountInput && priceBadge) {

  discountInput.addEventListener("input", () => {
    if (!discountInput.value.trim()) {
      appliedPrice = SETTINGS.PRICE;
      appliedCode = null;
      priceBadge.textContent = `₹${SETTINGS.PRICE / 100}`;
    }
  });
}

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

// AUTO-SAVE ON ANY INPUT CHANGE
formInputs.forEach(input => {
  if (input) {
    const eventType = (input.tagName === "SELECT") ? "change" : "input";
    input.addEventListener(eventType, saveFormData);
  }
});
universitySelect?.addEventListener("change", saveFormData);

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

  const coverPage = document.getElementById(uni.coverId);
  coverPage.classList.remove("hidden");

  // Change preview image
  document.getElementById("coverPreview").src = uni.preview;

  // Apply theme colors
  applyTheme(uni);

  // Trigger scaling after a short delay for layout to settle
  setTimeout(scaleCoverToFit, 50);
});

/**
 * Precisely scales the A4 cover page to fit comfortably within its container.
 * This function handles both mobile scaling and desktop centering.
 */
function scaleCoverToFit() {
  const container = document.getElementById("previewSection");
  const cover = getActiveCover();

  // Don't scale if elements are missing or hidden
  if (!container || !cover || window.getComputedStyle(container).display === 'none') {
    return;
  }

  // A4 dimensions at 96 DPI (standard for most browsers)
  const a4Width = 794;
  const a4Height = 1123;

  // Use clientWidth for the actual available content space (excluding borders/scrollbars)
  const containerWidth = container.clientWidth;

  // If container width is 0, it might be hidden or still rendering; skip for now
  if (containerWidth <= 0) return;

  if (containerWidth < a4Width) {
    // MOBILE/TABLET VIEW: Scale down to fit the width
    const scale = containerWidth / a4Width;

    // Apply scale transformation
    cover.style.transformOrigin = "top left";
    cover.style.transform = `scale(${scale})`;

    // Center the scaled cover if there's any remaining fractional space
    const scaledWidth = a4Width * scale;
    const leftOffset = Math.max(0, (containerWidth - scaledWidth) / 2);
    cover.style.marginLeft = `${leftOffset}px`;

    // Calculate total height needed including the preview note
    const note = container.querySelector(".preview-note");
    const noteHeight = note ? note.offsetHeight + 15 : 0; // 15px is the margin-bottom from CSS

    // Update container height to match scaled content + note + some padding
    container.style.height = `${(a4Height * scale) + noteHeight + 30}px`;

    // Compensate for the layout space still taken by the unscaled element
    // This "pulls up" the bottom of the document flow
    cover.style.marginBottom = `-${a4Height * (1 - scale)}px`;
  } else {
    // DESKTOP VIEW: No scaling needed, just center it
    cover.style.transform = "none";
    cover.style.transformOrigin = "top center";
    cover.style.marginLeft = "0";
    cover.style.marginBottom = "0";
    container.style.height = "auto";
  }
}

// Robust scaling using ResizeObserver to handle orientation changes, 
// viewport resizing, and dynamic UI layout shifts.
const previewSectionEl = document.getElementById("previewSection");
if (previewSectionEl && window.ResizeObserver) {
  const ro = new ResizeObserver(() => {
    // Use requestAnimationFrame to ensure layout is settled
    requestAnimationFrame(scaleCoverToFit);
  });
  ro.observe(previewSectionEl);
}

// Fallback and global events
window.addEventListener("resize", scaleCoverToFit);
window.addEventListener("load", () => setTimeout(scaleCoverToFit, 100));
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(scaleCoverToFit, 500);
});

function animateCount(el, target) {
  let current = 0;
  const increment = target / 50;

  const update = () => {
    current += increment;

    if (current < target) {
      el.textContent = Math.floor(current) + "+";
      requestAnimationFrame(update);
    } else {
      el.textContent = target + "+";
    }
  };

  update();
}

