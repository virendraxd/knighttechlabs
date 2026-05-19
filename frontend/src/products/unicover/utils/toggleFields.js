import { FORM_FIELDS } from "./formFields";

function disableFormInputs() {
  FORM_FIELDS.forEach(field => {
    if (field) {
      field.disabled = true;
      const label = field.previousElementSibling;
      if (label && label.tagName === "LABEL") {
        label.style.opacity = "0.5";
        label.style.color = "#999";
      }
    }
  });
}

function enableFormInputs() {
  FORM_FIELDS.forEach(field => {
    if (field) {
      field.disabled = false;
      const label = field.previousElementSibling;
      if (label && label.tagName === "LABEL") {
        label.style.opacity = "1";
        label.style.color = "";
      }
    }
  });
}

disableFormInputs();