export const FORM_FIELDS = [
    {
        name: "institution",
        label: "Institution",
        type: "select",
        options: [
            { label: "Amity University", value: "au" },
            { label: "Lovely Professional University", value: "lpu" },
            { label: "Vikrant University", value: "vu" },
        ],
    },

    {
        name: "session",
        label: "Session",
        type: "select", 
        options: [
            { label: "2025–2026", value: "2025-2026" },
            { label: "2026–2027", value: "2026-2027" },
        ],
    },

    {
        name: "title",
        label: "Title",
        type: "select",
        options: [
            { label: "Assignment File", value: "ASSIGNMENT FILE" },
            { label: "Practical File", value: "PRACTICAL FILE" },
            { label: "Project Report", value: "PROJECT REPORT" },
        ],
    },

    {
        name: "subject",
        label: "Subject",
        type: "textarea",
        placeholder: "Enter Subject",
    },

    {
        name: "faculty",
        label: "Faculty Name",
        type: "text",
        placeholder: "Enter Faculty Name",
    },

    {
        name: "position",
        label: "Position",
        type: "select",
        options: [
            { label: "HOD", value: "HOD" },
            { label: "MENTOR", value: "MENTOR" },
            { label: "PROFESSOR", value: "PROFESSOR" },
            { label: "ASSOCIATE PROFESSOR", value: "ASSOCIATE PROFESSOR" },
            { label: "ASSISTANT PROFESSOR", value: "ASSISTANT PROFESSOR" },
        ],
    },

    {
        name: "studentName",
        label: "Student Name",
        type: "text",
        placeholder: "Enter Student Name",
    },

    {
        name: "course",
        label: "Course",
        type: "select",
        options: [
            { label: "B.Tech", value: "B.Tech" },
            { label: "BBA", value: "BBA" },
            { label: "B.Com", value: "B.Com" },
            { label: "B.Sc", value: "B.Sc" },
            { label: "B.Arch", value: "B.Arch" },
            { label: "B.Plan", value: "B.Plan" },
            { label: "BCA", value: "BCA" },
            { label: "B.A.", value: "B.A." },
            { label: "B.E.", value: "B.E." },
            { label: "MCA", value: "MCA" },
            { label: "M.Tech", value: "M.Tech" },
            { label: "M.E.", value: "M.E." },
            { label: "M.Sc", value: "M.Sc" },
            { label: "M.Com", value: "M.Com" },
            { label: "M.A.", value: "M.A." },
            { label: "Diploma", value: "Diploma" },
        ],
    },

    {
        name: "stream",
        label: "Stream",
        type: "select",
        options: [
            {
                group: "Engineering (B.Tech / B.E. / M.Tech / M.E. / Diploma)",
                options: [
                    { label: "Computer Science Engineering (CSE)", value: "CSE" },
                    { label: "Information Technology (IT)", value: "IT" },
                    { label: "Electronics & Communication Engineering (ECE)", value: "ECE" },
                    { label: "Electrical Engineering (EE)", value: "EE" },
                    { label: "Mechanical Engineering (ME)", value: "ME" },
                    { label: "Civil Engineering (CE)", value: "CE" },
                    { label: "Artificial Intelligence & Data Science (AI-DS)", value: "AI-DS" },
                    { label: "AI & Machine Learning (AI-ML)", value: "AI-ML" },
                    { label: "Cyber Security", value: "Cyber Security" },
                    { label: "Data Science", value: "Data Science" },
                    { label: "Robotics & Automation", value: "Robotics & Automation" },
                ],
            },

            {
                group: "Science (B.Sc / M.Sc)",
                options: [
                    { label: "Physics", value: "Physics" },
                    { label: "Chemistry", value: "Chemistry" },
                    { label: "Mathematics", value: "Mathematics" },
                    { label: "Botany", value: "Botany" },
                    { label: "Zoology", value: "Zoology" },
                    { label: "Computer Science", value: "Computer Science" },
                    { label: "Biotechnology", value: "Biotechnology" },
                    { label: "Microbiology", value: "Microbiology" },
                    { label: "Nursing", value: "Nursing" },
                    { label: "Agriculture", value: "Agriculture" }
                ]
            },

            {
                group: "Commerce (B.Com / M.Com)",
                options: [
                    { label: "General", value: "General" },
                    { label: "Honors", value: "Honors" },
                    { label: "Accounting & Finance", value: "Accounting & Finance" },
                    { label: "Taxation", value: "Taxation" },
                    { label: "Computer Applications", value: "Computer Applications" },
                    { label: "Banking & Insurance", value: "Banking & Insurance" },
                ],
            },

            {
                group: "Arts & Humanities (B.A. / M.A.)",
                options: [
                    { label: "English", value: "English" },
                    { label: "Hindi", value: "Hindi" },
                    { label: "History", value: "History" },
                    { label: "Political Science", value: "Political Science" },
                    { label: "Economics", value: "Economics" },
                    { label: "Sociology", value: "Sociology" },
                    { label: "Psychology", value: "Psychology" },
                    { label: "Geography", value: "Geography" },
                    { label: "Philosophy", value: "Philosophy" },
                    { label: "Fine Arts", value: "Fine Arts" },
                ],
            },

            {
                group: "Computer Applications (BCA / MCA)",
                options: [
                    { label: "General", value: "General" },
                    { label: "Data Science", value: "Data Science" },
                    { label: "Cloud Computing", value: "Cloud Computing" },
                    { label: "Cyber Security", value: "Cyber Security" },
                    { label: "AI & ML", value: "AI & ML" },
                ]
            },
        ],
    },

    {
        name: "year",
        label: "year",
        type: "select",
        options: [
            { label: "1st Year", value: "1st" },
            { label: "2nd Year", value: "2nd" },
            { label: "3rd Year", value: "3rd" },
            { label: "4th Year", value: "4th" }
        ],
    }
];