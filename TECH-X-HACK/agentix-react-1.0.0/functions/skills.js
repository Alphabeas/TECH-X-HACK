const skillKeywords = [
    "sql",
    "python",
    "excel",
    "tableau",
    "power bi",
    "react",
    "javascript",
    "typescript",
    "node",
    "aws",
    "git",
    "docker",
    "machine learning",
    "statistics",
    "communication",
    "stakeholder",
    "storytelling",
    "product sense",
    "data visualization",
];

const roleRequirements = {
    "Data Analyst": ["sql", "excel", "data visualization", "storytelling", "stakeholder"],
    "Product Analyst": ["sql", "product sense", "data visualization", "communication", "stakeholder"],
    "Frontend Engineer": ["javascript", "react", "typescript", "git"],
    "Data Scientist": ["python", "machine learning", "statistics", "communication"],
};

function buildRoadmap(dreamRole, gaps) {
    const weekOne = gaps.slice(0, 2);
    const weekTwo = gaps.slice(2, 4);
    return [
        {
            week: "Week 1",
            focus: weekOne.length ? `Close gaps: ${weekOne.join(", ")}` : "Baseline projects",
            outputs: "One portfolio project + skill drills",
            checkpoint: "Vibe-Check review",
        },
        {
            week: "Week 2",
            focus: weekTwo.length ? `Build proof in ${weekTwo.join(", ")}` : "Advance project",
            outputs: "Second project + case study",
            checkpoint: "Mock interview",
        },
        {
            week: "Week 3",
            focus: `Role alignment for ${dreamRole}`,
            outputs: "Interview stories + resume update",
            checkpoint: "Role fit score update",
        },
        {
            week: "Week 4",
            focus: "Signal amplification",
            outputs: "LinkedIn refresh + applications",
            checkpoint: "Next sprint plan",
        },
    ];
}

module.exports = { skillKeywords, roleRequirements, buildRoadmap };
