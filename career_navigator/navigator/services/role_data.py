ROLE_SKILL_FALLBACK = {
	"Product Analyst": {
		"technical": ["SQL", "A/B Testing", "Metrics"],
		"tools": ["Excel", "Tableau"],
		"soft": ["Communication", "Stakeholder Management"],
	},
	"Data Analyst": {
		"technical": ["SQL", "Data Cleaning", "Visualization"],
		"tools": ["Excel", "Power BI"],
		"soft": ["Storytelling", "Communication"],
	},
	"Frontend Engineer": {
		"technical": ["JavaScript", "React", "TypeScript"],
		"tools": ["Git", "Vite"],
		"soft": ["Problem Solving", "Collaboration"],
	},
	"Backend Engineer": {
		"technical": ["Python", "APIs", "Databases"],
		"tools": ["Django", "Postman", "Git"],
		"soft": ["Problem Solving", "Communication"],
	},
	"Full Stack Developer": {
		"technical": ["JavaScript", "React", "Node.js"],
		"tools": ["Git", "Docker", "Postman"],
		"soft": ["Collaboration", "Problem Solving"],
	},
	"Machine Learning Engineer": {
		"technical": ["Python", "Machine Learning", "Model Evaluation"],
		"tools": ["Jupyter", "TensorFlow", "Git"],
		"soft": ["Analytical Thinking", "Communication"],
	},
	"DevOps Engineer": {
		"technical": ["CI/CD", "Infrastructure as Code", "Cloud"],
		"tools": ["Docker", "Kubernetes", "GitHub Actions"],
		"soft": ["Ownership", "Collaboration"],
	},
	"UI/UX Designer": {
		"technical": ["Interaction Design", "User Research", "Prototyping"],
		"tools": ["Figma", "FigJam", "Adobe XD"],
		"soft": ["Empathy", "Communication"],
	},
	"Product Manager": {
		"technical": ["Roadmapping", "Prioritization", "Analytics"],
		"tools": ["Jira", "Notion", "Mixpanel"],
		"soft": ["Leadership", "Stakeholder Management"],
	},
	"default": {
		"technical": ["Problem Solving"],
		"tools": ["Git"],
		"soft": ["Communication"],
	},
}


ROLE_ROADMAP_FALLBACK = {
	"Product Analyst": {
		"week_1": {"focus": "Metrics and SQL foundations", "tasks": ["Review core product metrics", "Practice SQL queries on product datasets", "Define one north-star metric"], "project": "Create a product KPI dashboard", "checkpoint": "Present KPI definitions and SQL outputs"},
		"week_2": {"focus": "Experimentation", "tasks": ["Learn A/B testing fundamentals", "Design one experiment hypothesis", "Create experiment success criteria"], "project": "Draft an experiment spec document", "checkpoint": "Run peer review for test design"},
		"week_3": {"focus": "Insight storytelling", "tasks": ["Analyze one user funnel", "Document insights and recommendations", "Create decision-ready summary"], "project": "Funnel analysis report", "checkpoint": "Share findings with stakeholders"},
		"week_4": {"focus": "Interview readiness", "tasks": ["Prepare product analytics case responses", "Refine project portfolio bullets", "Practice stakeholder communication"], "project": "Portfolio-ready case study", "checkpoint": "Complete one mock interview"},
	},
	"Data Analyst": {
		"week_1": {"focus": "Data preparation", "tasks": ["Practice cleaning a raw dataset", "Handle missing/outlier values", "Define data quality checks"], "project": "Cleaned dataset notebook", "checkpoint": "Submit reproducible cleaning workflow"},
		"week_2": {"focus": "Visualization", "tasks": ["Create 3 actionable charts", "Build one dashboard page", "Write chart narratives"], "project": "Exploratory dashboard", "checkpoint": "Present top 5 insights"},
		"week_3": {"focus": "Business analysis", "tasks": ["Frame a business question", "Run cohort or trend analysis", "Recommend actions from data"], "project": "Business insights memo", "checkpoint": "Decision-focused presentation"},
		"week_4": {"focus": "Portfolio polish", "tasks": ["Refine SQL and dashboard projects", "Add README and context", "Practice case interview questions"], "project": "Two polished portfolio projects", "checkpoint": "Mock interview + feedback"},
	},
	"Frontend Engineer": {
		"week_1": {"focus": "Core React patterns", "tasks": ["Build reusable components", "Practice state and props patterns", "Improve responsive layout"], "project": "Component library starter", "checkpoint": "Ship responsive UI module"},
		"week_2": {"focus": "Type safety and API integration", "tasks": ["Add TypeScript types", "Integrate one REST API", "Handle loading/error states"], "project": "Data-driven feature page", "checkpoint": "Pass lint/build checks"},
		"week_3": {"focus": "Performance and UX", "tasks": ["Optimize bundle and rendering", "Improve accessibility", "Refine interactions"], "project": "UX-optimized feature", "checkpoint": "Audit Lighthouse and a11y"},
		"week_4": {"focus": "Interview + portfolio", "tasks": ["Prepare frontend system design notes", "Document architecture decisions", "Practice coding questions"], "project": "Portfolio-ready frontend app", "checkpoint": "Mock frontend interview"},
	},
}
