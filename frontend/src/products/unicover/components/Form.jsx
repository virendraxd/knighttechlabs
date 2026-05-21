import { autofillForm } from "../utils/autofill"
import { FORM_FIELDS } from "../data/formFields";

function Form({ formData, setFormData, handleChange, missingFields, templateType }) {
    const formatLable = (label) => {
        if (!label) return "";

        return label
            .replace(/([A-Z])/g, " $1") // split camelCase
            .replace(/^./, (c) => c.toUpperCase())
            .trim();
    }

    return (
        <div>
            <form id="coverForm">
                <button type="button" id="autofillBtn" className="btn-autofill" onClick={() => autofillForm(setFormData)}>
                    Autofill Last Details
                </button>

                {FORM_FIELDS.map((field) => {
                    const isHandBlankField = ["subject", "faculty", "studentName"].includes(field.name);
                    if (templateType === "hand" && isHandBlankField) {
                        return null;
                    }
                    const isDisabled = field.name !== "institution" && !formData.institution;
                    const labelStyle = isDisabled ? { opacity: 0.5, color: "#999" } : {};
                    
                    return (
                    <div key={field.name}>
                        <label style={labelStyle}>{formatLable(field.name)}</label>

                        {field.type === "text" && (
                            <input
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                placeholder={field.placeholder}
                                required
                                disabled={isDisabled}
                                style={{ border: missingFields && missingFields.includes(field.name) ? '2px solid red' : '' }}
                            />
                        )}

                        {field.type === "textarea" && (
                            <textarea
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                placeholder={field.placeholder}
                                required
                                disabled={isDisabled}
                                style={{ border: missingFields && missingFields.includes(field.name) ? '2px solid red' : '' }}
                            />
                        )}

                        {field.type === "select" && (
                            <select
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                required
                                disabled={isDisabled}
                                style={{ border: missingFields && missingFields.includes(field.name) ? '2px solid red' : '' }}
                            >
                                <option value="" disabled hidden>Select {field.label}</option>

                                {field.options.map((opt, index) => {
                                    if (opt.group) {
                                        return (
                                            <optgroup key={index} label={opt.group}>
                                                {opt.options.map((sub) => (
                                                    <option key={sub.value} value={sub.value}>
                                                        {sub.label}
                                                    </option>
                                                ))}
                                            </optgroup>
                                        );
                                    }

                                    return (

                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    );
                                })}
                            </select>
                        )}
                    </div>
                )})}
            </form>
        </div>
    )
}

export default Form