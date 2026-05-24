import { applySettingsUI } from "./utils/settings.js"
import { SETTINGS } from "./config.js"

const html2pdf = (await import("html2pdf.js")).default;

const coverStudent = document.getElementById("coverStudent");

// Return currently visible cover element
export function getActiveCover() {
  return document.querySelector(".cover-page:not(.hidden)");
}

applySettingsUI();

// DOWNLOAD LIMIT LOGIC
export function getOrCreateUserId() {
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
  const type = getSelectedTemplateType();
  if (window.isPremiumUser || type === 'hand') {
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
  window.canDownloadFree = remaining > 0;

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
  updatePriceBadge();
}

// Load the bar once Firebase has had time to initialise
setTimeout(window.updateFreeDownloadsBar, 1200);

export function getSelectedTemplateType() {
  const selected = document.querySelector('input[name="templateType"]:checked');
  return selected ? selected.value : "auto";
}

// Live preview for template switch
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('input[name="templateType"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const coverPage = getActiveCover();
      const type = getSelectedTemplateType();

      // Fields that are blanked out in Hand Mode
      const handBlankFields = ["subject", "faculty", "studentName"];

      if (type === 'hand') {
        coverPage.classList.add('hand-mode');
        // Hide unnecessary form fields
        handBlankFields.forEach(id => {
          const field = document.getElementById(id);
          if (field) {
            field.classList.add("field-hidden");
            // Find and hide the associated label
            const label = field.previousElementSibling;
            if (label && label.tagName === "LABEL") {
              label.classList.add("field-hidden");
            }
          }
        });
      } else {
        coverPage.classList.remove('hand-mode');
        // Show all fields
        handBlankFields.forEach(id => {
          const field = document.getElementById(id);
          if (field) {
            field.classList.remove("field-hidden");
            // Find and show the associated label
            const label = field.previousElementSibling;
            if (label && label.tagName === "LABEL") {
              label.classList.remove("field-hidden");
            }
          }
        });
      }
      updatePriceBadge();
    });
  });
});

function updatePriceBadge() {
  const type = getSelectedTemplateType();
  const badge = document.querySelector(".price-badge");
  const payMain = document.getElementById("payMain");
  const payTitle = payMain?.querySelector(".pay-title");
  const bar = document.getElementById("freeDownloadsBar");

  if (!payMain) return;

  // 1. Manage Sidebar visibility first
  if (bar) {
    if (window.isPremiumUser || type === 'hand') {
      bar.style.display = 'none';
    } else if (type === 'auto') {
      bar.style.display = 'flex';
    }
  }

  // 2. Ensure payMain is visible
  payMain.classList.remove("hidden");
  payMain.style.display = "flex";

  // 3. Determine Title and Badge visibility
  if (type === 'hand') {
    // Fill by Hand Mode
    if (payTitle) payTitle.textContent = "Download Cover";
    if (badge) {
      badge.textContent = "₹19";
      badge.style.display = "inline-block";
    }
  } else {
    // Auto-Filled Mode
    const isFree = window.isPremiumUser || window.canDownloadFree === true;

    if (payTitle) {
      payTitle.textContent = isFree ? "Download Cover" : "Pay & Download Cover";
    }

    if (badge) {
      badge.style.display = "none";
    }
  }
}

// CENTRAL PDF GENERATION ENGINE
export async function executePDFGeneration({ setIsBtnSpinning, isWatermarked = false, shouldIncrement = false }) {
  const logBox = document.getElementById("logBox");
  const coverPage = getActiveCover();
  const templateType = getSelectedTemplateType();
  const formData = JSON.parse(localStorage.getItem("unicover_last_data") || "{}");
  const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  let plan = "Free";
  if (window.isPremiumUser) {
    plan = "Premium";
  } else if (templateType === 'hand') {
    plan = "Paid";
  } else if (!isWatermarked && !shouldIncrement) {
    plan = "Paid";
  }

  let student = formData.studentName || "";
  if (templateType === 'hand') {
    student = "Blank";
  }
  const firstName = capitalize(student.trim().split(/\s+/)[0] || "Student").replace(/[^a-zA-Z0-9]/g, "");

  const subject = formData.subject || "Subject";
  const firstSubjectWord = capitalize(subject.trim().split(/\s+/)[0] || "Subject").replace(/[^a-zA-Z0-9]/g, "");

  const titleVal = formData.title || "Assignment";
  const titleWord = capitalize(titleVal.trim().split(/\s+/)[0] || "Assignment").replace(/[^a-zA-Z0-9]/g, "");

  const customFilename = `UniCover_${plan}_${firstName}_${firstSubjectWord}_${titleWord}${isWatermarked ? '_Watermarked' : ''}.pdf`;

  // Premium check for hand mode (Double check, although handled in main click)
  if (templateType === 'hand' && !window.isPremiumUser) {
    // If we reach here somehow without payment/premium for hand mode
    // (e.g. calling executePDFGeneration directly)
    return;
  }

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
    filename: customFilename,
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

    if (templateType === 'hand') {
      coverPage.classList.add('hand-mode');
    }

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

    if (watermark) {
      watermark.classList.remove("hidden-capture");
    }

    coverPage.classList.remove('hand-mode');

    // Ensure scaling is correct after generation
    scaleCoverToFit();
  }
}

// async function generatePDFDirectly() {

//   const coverPage = getActiveCover();
//   if (!coverPage) {
//     if (window.showGlobalToast) window.showGlobalToast("Error: Cover page element not found!");
//     return;
//   }

//   const studentName = coverStudent?.innerText || "Student";
//   const safeName = studentName.replace(/[^a-z0-9]/gi, "_");

//   const options = {
//     margin: 0,
//     filename: `${safeName}_Assignment_Cover.pdf`,
//     image: { type: "jpeg", quality: 1 },
//     html2canvas: { scale: 3, useCORS: true },
//     jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
//   };

//   coverPage.style.position = "static";
//   coverPage.style.left = "0";
//   coverPage.style.opacity = "1";
//   coverPage.style.pointerEvents = "auto";

//   await new Promise(resolve => setTimeout(resolve, 100));

//   await html2pdf().set(options).from(coverPage).save();

//   coverPage.style.position = "fixed";
//   coverPage.style.left = "-9999px";
//   coverPage.style.opacity = "0";
//   coverPage.style.pointerEvents = "none";
// }

document.querySelectorAll(".required").forEach(field => {
  field.addEventListener("input", () => {
    if (field.value.trim()) field.style.border = "";
  });
});

// function getBase() {
//   // GitHub Pages domain check
//   if (location.hostname.includes("github.io")) {
//     return "/knighttechlabs/"; // repo name
//   }

//   // Localhost
//   return "/";
// }

// function fixNavForUniCover() {
//   // handled by react router
// }

const logContent = document.getElementById("logContent");
const copyLogBtn = document.getElementById("copyLogBtn");

// Add a line to log
export function addLog(message) {
  const timestamp = new Date().toLocaleTimeString();

  const logContent = document.getElementById("logContent");
  // const copyLogBtn = document.getElementById("copyLogBtn");

  logContent.textContent += `[${timestamp}] ${message}\n`;
  logContent.scrollTop = logContent.scrollHeight; // auto scroll to bottom
}

// Copy log to clipboard
if (copyLogBtn) {
  copyLogBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(logContent.textContent)
      .then(() => { if (window.showGlobalToast) window.showGlobalToast("Log copied to clipboard ✅"); })
      .catch(() => { if (window.showGlobalToast) window.showGlobalToast("Failed to copy log ❌"); });
  });
}

// function calculateFinalPrice(basePrice, code) {
//   if (!SETTINGS.ENABLE_DISCOUNT) return basePrice;
//   if (!code) return basePrice;

//   const coupon = SETTINGS.DISCOUNT_CODES[code.toUpperCase()];

//   if (!coupon) return basePrice;

//   let finalPrice = basePrice;

//   if (coupon.type === "percent") {
//     finalPrice = basePrice - (basePrice * coupon.value / 100);
//   }

//   if (coupon.type === "flat") {
//     finalPrice = basePrice - coupon.value;
//   }

//   // Prevent negative price
//   return Math.max(finalPrice, 0);
// }

// UNIVEERSITY SELECTOR AND THEME SWITCHER
// const UNIVERSITY_CONFIG = {

//   vu: {
//     coverId: "cover-vu",
//     preview: "assets/vu-cover-preview.png",
//     primaryColor: "#00406E",
//     borderColor: "#00406E",
//     textColor: "#00406E",
//     borderColor: "#00406E"
//   },

//   au: {
//     coverId: "cover-au",
//     preview: "assets/au-cover-preview.png",
//     primaryColor: "#002D5D",
//     borderColor: "#002D5D",
//     textColor: "#002D5D",
//     borderColor: "#002D5D"
//   }
// };

// function populateSelect(selectElement, items, placeholder) {

//   selectElement.innerHTML = "";

//   const defaultOption = document.createElement("option");
//   defaultOption.value = "";
//   defaultOption.disabled = true;
//   defaultOption.selected = true;
//   defaultOption.textContent = placeholder;

//   selectElement.appendChild(defaultOption);

//   items.forEach(item => {
//     const opt = document.createElement("option");
//     opt.value = item;
//     opt.textContent = item;
//     selectElement.appendChild(opt);
//   });
// }

// const covers = document.querySelectorAll(".cover-page");
// const previewImg = document.getElementById("coverPreview");

// function applyTheme(themeColors) {
//   // Apply to form labels
//   document.querySelectorAll("form label").forEach(label => {
//     label.style.color = themeColors.textColor;
//   });

//   // Apply to form inputs and selects
//   document.querySelectorAll("input, select, textarea").forEach(input => {
//     input.style.borderColor = themeColors.borderColor;
//   });

//   // Apply to buttons
//   document.querySelectorAll("button").forEach(btn => {
//     if (btn.id !== "copyLogBtn" && btn.id !== "applyDiscount") {
//       btn.style.borderColor = themeColors.borderColor;
//     }
//   });

//   // Apply to cover page
//   const visibleCover = document.querySelector(".cover-page:not(.hidden)");
//   if (visibleCover) {
//     visibleCover.style.borderColor = themeColors.borderColor;
//     visibleCover.style.setProperty("--primary-color", themeColors.primaryColor);
//     visibleCover.style.setProperty("--cover-border-color", themeColors.borderColor);

//     // Apply colors to cover details elements
//     const detailsElements = visibleCover.querySelectorAll(
//       ".session, .title, .subject" //, .submitted, .name, .position, .course, .stream, .year"
//     );
//     detailsElements.forEach(el => {
//       el.style.color = themeColors.textColor;
//     });
//   }
// }

// Reset theme to default
// function resetTheme() {
//   // Reset labels
//   document.querySelectorAll("form label").forEach(label => {
//     label.style.color = "";
//   });

//   // Reset inputs
//   document.querySelectorAll("input, select, textarea").forEach(input => {
//     input.style.borderColor = "";
//   });

//   // Reset buttons
//   document.querySelectorAll("button").forEach(btn => {
//     btn.style.borderColor = "";
//   });

//   // Reset preview section
//   if (previewSection) {
//     previewSection.style.borderColor = "";
//   }

//   // Reset cover
//   document.querySelectorAll(".cover-page").forEach(cover => {
//     cover.style.borderColor = "";
//     cover.style.removeProperty("--primary-color");

//     // Reset colors for cover details elements
//     const detailsElements = cover.querySelectorAll(
//       ".session, .title, .subject, .submitted"  // , .name, .position, .course, .stream, .year"
//     );
//     detailsElements.forEach(el => {
//       el.style.color = "";
//     });
//   });
// }

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
// viewport resizing and dynamic UI layout shifts.
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
window.addEventListener("load", () => {
  setTimeout(scaleCoverToFit, 100);
  setTimeout(updatePriceBadge, 200);
});
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(scaleCoverToFit, 500);
  updatePriceBadge();
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

if (SETTINGS.debugMode) {
  console.log("Unicover Script Loaded")
}