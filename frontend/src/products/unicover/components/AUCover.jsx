
function AUCover({ formData = {}, templateType }) {
    const yearMap = {
        "1st": "1ˢᵗ",
        "2nd": "2ⁿᵈ",
        "3rd": "3ʳᵈ",
        "4th": "4ᵗʰ"
    };

    const formatField = (field) => {
        if (!field) return "";
        return field.toUpperCase();
    };

    return (
        <div id="cover-au" className={`cover-page real-cover ${templateType === "hand" ? "hand-mode" : ""}`}>
            <span className="watermark-overlay">Created with UniCover (Free)</span>
            <div className="top-section">
                <img src="assets/aulogo.png" className="uni-logo" />
            </div>
            <div className="details-section">
                <span className="upper">
                    <div className="session" id="coverSession">SESSION : {formData.session || "2025-2026"}</div>
                    <div className="title" id="coverTitle">{formData.title || "ASSIGNMENT FILE"}</div>
                    <div className="subject" id="coverSubject">SUBJECT : {formatField(formData.subject) || "DESIGN THINKING"}</div>
                </span>
                <span className="bottom">
                    <div className="left">
                        <div className="submitted">SUBMITTED TO:</div>
                        <div className="name" id="coverFaculty">{formatField(formData.faculty) || "PROF JOHN DAS"}</div>
                        <div className="position" id="coverPosition">{formData.position || "PROFESSOR"}</div>
                    </div>
                    <div className="right">
                        <div className="submitted">SUBMITTED BY:</div>
                        <div className="name" id="coverStudent">{formatField(formData.studentName) || "VIRENDRA SINGH"}</div>
                        <div className="std-info">
                            <span className="course" id="coverCourse">{formData.course || "B TECH"}</span>
                            <span className="stream" id="coverStream">({formData.stream || "CSE"})</span>
                            <span className="year" id="coverYear">{(yearMap[formData.year] || "1ˢᵗ") + " YEAR"}</span>
                        </div>
                    </div>
                </span>
            </div>
        </div>
    );
}
export default AUCover;