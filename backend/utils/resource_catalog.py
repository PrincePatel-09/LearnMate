"""
Static resource catalog for official roadmap.sh links and popular course links.
Used for direct redirects and fast matching before falling back to AI.
"""
from __future__ import annotations

import re


def _normalize(text: str) -> str:
    text = (text or "").lower()
    text = re.sub(r"[^a-z0-9]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def _slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", _normalize(text)).strip("-")


ROADMAP_LINKS = [
    {"title": "Frontend Developer", "url": "https://roadmap.sh/frontend", "aliases": ["frontend", "frontend developer"]},
    {"title": "Backend Developer", "url": "https://roadmap.sh/backend", "aliases": ["backend", "backend developer"]},
    {"title": "Full Stack Developer", "url": "https://roadmap.sh/full-stack", "aliases": ["fullstack", "full stack", "full stack developer"]},
    {"title": "JavaScript", "url": "https://roadmap.sh/javascript", "aliases": ["javascript", "js"]},
    {"title": "TypeScript", "url": "https://roadmap.sh/typescript", "aliases": ["typescript", "ts"]},
    {"title": "React", "url": "https://roadmap.sh/react", "aliases": ["react", "react developer"]},
    {"title": "Angular", "url": "https://roadmap.sh/angular", "aliases": ["angular"]},
    {"title": "Vue", "url": "https://roadmap.sh/vue", "aliases": ["vue", "vue js", "vue.js"]},
    {"title": "Next.js", "url": "https://roadmap.sh/next", "aliases": ["next", "nextjs", "next.js"]},
    {"title": "Node.js", "url": "https://roadmap.sh/nodejs", "aliases": ["node", "nodejs", "node.js"]},
    {"title": "Python", "url": "https://roadmap.sh/python", "aliases": ["python"]},
    {"title": "Java", "url": "https://roadmap.sh/java", "aliases": ["java"]},
    {"title": "C++", "url": "https://roadmap.sh/cpp", "aliases": ["c++", "cpp"]},
    {"title": "Go", "url": "https://roadmap.sh/golang", "aliases": ["go", "golang"]},
    {"title": "Rust", "url": "https://roadmap.sh/rust", "aliases": ["rust"]},
    {"title": "AI Engineer", "url": "https://roadmap.sh/ai-engineer", "aliases": ["ai engineer", "ai engineering"]},
    {"title": "Machine Learning / Data Scientist", "url": "https://roadmap.sh/ai-data-scientist", "aliases": ["machine learning", "data scientist", "ai data scientist"]},
    {"title": "Data Analyst", "url": "https://roadmap.sh/data-analyst", "aliases": ["data analyst"]},
    {"title": "MLOps", "url": "https://roadmap.sh/mlops", "aliases": ["mlops"]},
    {"title": "Prompt Engineering", "url": "https://roadmap.sh/prompt-engineering", "aliases": ["prompt engineering"]},
    {"title": "AI Agents", "url": "https://roadmap.sh/ai-agents", "aliases": ["ai agents", "agents"]},
    {"title": "LLM Engineer", "url": "https://roadmap.sh/llm-engineer", "aliases": ["llm engineer", "llm"]},
    {"title": "Generative AI", "url": "https://roadmap.sh/generative-ai", "aliases": ["generative ai", "gen ai"]},
    {"title": "DevOps", "url": "https://roadmap.sh/devops", "aliases": ["devops"]},
    {"title": "Docker", "url": "https://roadmap.sh/docker", "aliases": ["docker"]},
    {"title": "Kubernetes", "url": "https://roadmap.sh/kubernetes", "aliases": ["kubernetes", "k8s"]},
    {"title": "AWS", "url": "https://roadmap.sh/aws", "aliases": ["aws", "amazon web services"]},
    {"title": "Azure", "url": "https://roadmap.sh/azure", "aliases": ["azure"]},
    {"title": "Google Cloud", "url": "https://roadmap.sh/gcp", "aliases": ["gcp", "google cloud", "google cloud platform"]},
    {"title": "Linux", "url": "https://roadmap.sh/linux", "aliases": ["linux"]},
    {"title": "Git", "url": "https://roadmap.sh/git", "aliases": ["git", "git version control"]},
    {"title": "SQL", "url": "https://roadmap.sh/sql", "aliases": ["sql"]},
    {"title": "PostgreSQL", "url": "https://roadmap.sh/postgresql", "aliases": ["postgresql", "postgres", "pgsql"]},
    {"title": "MongoDB", "url": "https://roadmap.sh/mongodb", "aliases": ["mongodb", "mongo"]},
    {"title": "Redis", "url": "https://roadmap.sh/redis", "aliases": ["redis"]},
    {"title": "Cyber Security", "url": "https://roadmap.sh/cyber-security", "aliases": ["cyber security", "cybersecurity", "security"]},
    {"title": "Android", "url": "https://roadmap.sh/android", "aliases": ["android"]},
    {"title": "Flutter", "url": "https://roadmap.sh/flutter", "aliases": ["flutter"]},
    {"title": "React Native", "url": "https://roadmap.sh/react-native", "aliases": ["react native"]},
    {"title": "UX Design", "url": "https://roadmap.sh/ux-design", "aliases": ["ux design", "ui ux", "user experience"]},
    {"title": "Design System", "url": "https://roadmap.sh/design-system", "aliases": ["design system"]},
    {"title": "Computer Science", "url": "https://roadmap.sh/computer-science", "aliases": ["computer science", "cs fundamentals"]},
    {"title": "Software Design & Architecture", "url": "https://roadmap.sh/software-design-architecture", "aliases": ["software design architecture", "software design", "architecture"]},
    {"title": "System Design", "url": "https://roadmap.sh/system-design", "aliases": ["system design"]},
    {"title": "API Design", "url": "https://roadmap.sh/api-design", "aliases": ["api design"]},
    {"title": "Software Architect", "url": "https://roadmap.sh/software-architect", "aliases": ["software architect"]},
    {"title": "QA Engineer", "url": "https://roadmap.sh/qa", "aliases": ["qa", "qa engineer"]},
    {"title": "Testing", "url": "https://roadmap.sh/testing", "aliases": ["testing", "software testing"]},
    {"title": "Data Engineer", "url": "https://roadmap.sh/data-engineer", "aliases": ["data engineer"]},
    {"title": "Blockchain", "url": "https://roadmap.sh/blockchain", "aliases": ["blockchain"]},
    {"title": "Game Developer", "url": "https://roadmap.sh/game-developer", "aliases": ["game developer", "gamedev"]},
    {"title": "Product Manager", "url": "https://roadmap.sh/product-manager", "aliases": ["product manager", "pm"]},
    {"title": "Engineering Manager", "url": "https://roadmap.sh/engineering-manager", "aliases": ["engineering manager", "em"]},
    {"title": "Technical Writer", "url": "https://roadmap.sh/technical-writer", "aliases": ["technical writer"]},
]


POPULAR_COURSE_GROUPS = [
    {
        "category": "python",
        "platform": "Mixed (official + curated)",
        "duration": "Self-paced",
        "difficulty": "Beginner",
        "rating": 4.8,
        "free": True,
        "recommended": True,
        "image_color": "#3776AB",
        "keywords": ["python", "data science", "automation", "programming"],
        "courses": [
            {"title": "Python for Everybody", "url": "https://www.coursera.org/specializations/python"},
            {"title": "CS50P", "url": "https://cs50.harvard.edu/python/"},
            {"title": "Automate the Boring Stuff", "url": "https://automatetheboringstuff.com/"},
            {"title": "100 Days of Code", "url": "https://www.udemy.com/course/100-days-of-code/"},
            {"title": "Google Crash Course on Python", "url": "https://www.coursera.org/learn/python-crash-course"},
            {"title": "Real Python", "url": "https://realpython.com/"},
            {"title": "Python Essentials (Cisco)", "url": "https://www.netacad.com/courses/python-essentials-1"},
            {"title": "freeCodeCamp Python", "url": "https://www.freecodecamp.org/learn/scientific-computing-with-python/"},
            {"title": "Codecademy Python", "url": "https://www.codecademy.com/learn/learn-python-3"},
            {"title": "NPTEL Python", "url": "https://nptel.ac.in/"},
            {"title": "Hyperskill Python", "url": "https://hyperskill.org/tracks/2"},
            {"title": "Python Docs", "url": "https://docs.python.org/3/tutorial/"},
            {"title": "Kaggle Python", "url": "https://www.kaggle.com/learn/python"},
            {"title": "IBM Python", "url": "https://www.coursera.org/learn/python-for-applied-data-science-ai"},
            {"title": "DataCamp Python", "url": "https://www.datacamp.com/tracks/python-programmer"},
        ],
    },
    {
        "category": "web development",
        "platform": "Mixed (official + curated)",
        "duration": "Self-paced",
        "difficulty": "Beginner",
        "rating": 4.8,
        "free": True,
        "recommended": True,
        "image_color": "#0F62FE",
        "keywords": ["web development", "frontend", "backend", "full stack", "javascript", "html", "css"],
        "courses": [
            {"title": "The Odin Project", "url": "https://www.theodinproject.com/"},
            {"title": "freeCodeCamp", "url": "https://www.freecodecamp.org/learn/"},
            {"title": "CS50 Web", "url": "https://cs50.harvard.edu/web/"},
            {"title": "Meta Front-End", "url": "https://www.coursera.org/professional-certificates/meta-front-end-developer"},
            {"title": "Meta Back-End", "url": "https://www.coursera.org/professional-certificates/meta-back-end-developer"},
            {"title": "Full Stack Open", "url": "https://fullstackopen.com/en/"},
            {"title": "Angela Yu Bootcamp", "url": "https://www.udemy.com/course/the-complete-web-development-bootcamp/"},
            {"title": "Colt Steele Bootcamp", "url": "https://www.udemy.com/course/the-web-developer-bootcamp/"},
            {"title": "Scrimba Frontend", "url": "https://scrimba.com/learn/frontend"},
            {"title": "Frontend Masters", "url": "https://frontendmasters.com/"},
            {"title": "MDN Learn", "url": "https://developer.mozilla.org/en-US/docs/Learn"},
            {"title": "CodeWithHarry", "url": "https://www.youtube.com/@CodeWithHarry"},
            {"title": "Apna College", "url": "https://www.youtube.com/@ApnaCollegeOfficial"},
            {"title": "Traversy Media", "url": "https://www.youtube.com/@TraversyMedia"},
            {"title": "JavaScript.info", "url": "https://javascript.info/"},
        ],
    },
    {
        "category": "ai ml",
        "platform": "Mixed (official + curated)",
        "duration": "Self-paced",
        "difficulty": "Intermediate",
        "rating": 4.8,
        "free": True,
        "recommended": True,
        "image_color": "#08BDBA",
        "keywords": ["ai", "machine learning", "data science", "llm", "generative ai"],
        "courses": [
            {"title": "Andrew Ng ML", "url": "https://www.coursera.org/learn/machine-learning"},
            {"title": "Deep Learning Specialization", "url": "https://www.coursera.org/specializations/deep-learning"},
            {"title": "AI for Everyone", "url": "https://www.coursera.org/learn/ai-for-everyone"},
            {"title": "IBM AI Engineering", "url": "https://www.coursera.org/professional-certificates/ai-engineer"},
            {"title": "Google ML Crash Course", "url": "https://developers.google.com/machine-learning/crash-course"},
            {"title": "fast.ai", "url": "https://course.fast.ai/"},
            {"title": "Hands-On ML Book", "url": "https://github.com/ageron/handson-ml3"},
            {"title": "Hugging Face Course", "url": "https://huggingface.co/learn"},
            {"title": "CS229", "url": "https://cs229.stanford.edu/"},
            {"title": "CS231n", "url": "https://cs231n.stanford.edu/"},
            {"title": "LLM University", "url": "https://github.com/mlabonne/llm-course"},
            {"title": "OpenAI Cookbook", "url": "https://cookbook.openai.com/"},
            {"title": "DeepLearning.AI", "url": "https://www.deeplearning.ai/courses/"},
            {"title": "Kaggle Learn", "url": "https://www.kaggle.com/learn"},
            {"title": "Machine Learning A-Z", "url": "https://www.udemy.com/course/machinelearning/"},
        ],
    },
]


def resolve_roadmap(goal: str) -> dict:
    """Find the best matching official roadmap.sh entry for a goal."""
    goal_norm = _normalize(goal)
    if not goal_norm:
        return {}

    for entry in ROADMAP_LINKS:
        if goal_norm == _normalize(entry["title"]):
            return entry
        for alias in entry.get("aliases", []):
            if alias in goal_norm:
                return entry
    return {}


def flatten_popular_courses() -> list[dict]:
    """Return a flattened list of the bundled popular courses."""
    courses: list[dict] = []
    for group in POPULAR_COURSE_GROUPS:
        for index, course in enumerate(group["courses"]):
            title = course["title"]
            courses.append(
                {
                    "id": _slugify(f'{group["category"]}-{title}'),
                    "title": title,
                    "platform": group["platform"],
                    "url": course["url"],
                    "duration": group["duration"],
                    "difficulty": group["difficulty"],
                    "rating": group["rating"],
                    "free": group["free"],
                    "recommended": index < 5 or group["recommended"],
                    "description": f'Popular {group["category"]} learning resource.',
                    "image_color": group["image_color"],
                    "category": group["category"],
                    "keywords": " ".join(group["keywords"] + [title, group["category"]]),
                }
            )
    return courses


POPULAR_COURSES = flatten_popular_courses()


def resolve_popular_courses(query: str = "", category: str = "", limit: int = 8) -> list[dict]:
    """Find the most relevant popular courses for a query or category."""
    query_norm = _normalize(query)
    category_norm = _normalize(category)
    text = f"{query_norm} {category_norm}".strip()

    if not text:
        return POPULAR_COURSES[:limit]

    ranked: list[dict] = []
    for course in POPULAR_COURSES:
        haystack = _normalize(" ".join([
            course.get("title", ""),
            course.get("platform", ""),
            course.get("category", ""),
            course.get("keywords", ""),
        ]))
        score = 0
        if category_norm and category_norm in haystack:
            score += 4
        if query_norm and query_norm in haystack:
            score += 6
        for token in text.split():
            if token and token in haystack:
                score += 1
        if score > 0:
            ranked.append({"score": score, "course": course})

    ranked.sort(key=lambda item: (-item["score"], item["course"]["title"]))
    return [item["course"] for item in ranked[:limit]]


def build_resource_reply(message: str) -> str:
    """Generate a direct markdown reply with official resource links when possible."""
    message_norm = _normalize(message)
    if not message_norm:
        return ""

    course_request = any(token in message_norm for token in ["course", "courses", "learn", "recommend", "suggest", "resource"])
    if course_request:
        courses = resolve_popular_courses(message, limit=5)
        if courses:
            lines = ["Here are the most relevant popular courses I found:\n"]
            for course in courses:
                lines.append(f"- [{course['title']}]({course['url']}) — {course['platform']}")
            return "\n".join(lines)

    roadmap_match = None
    if "roadmap" in message_norm or "path" in message_norm or "route" in message_norm:
        roadmap_match = resolve_roadmap(message)
    elif any(token in message_norm for token in ["frontend", "backend", "full stack", "react", "node", "python", "devops", "data science", "machine learning", "ai", "docker", "kubernetes", "system design"]):
        roadmap_match = resolve_roadmap(message)

    if roadmap_match:
        return (
            f"I found the official roadmap for **{roadmap_match['title']}**.\n\n"
            f"[Open the roadmap.sh guide]({roadmap_match['url']})"
        )

    return ""
