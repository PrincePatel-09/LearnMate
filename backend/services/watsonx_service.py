"""
IBM watsonx.ai — Granite model service wrapper.
Handles authentication, model initialisation, and all inference calls.
"""
import os
import json
from ibm_watsonx_ai import APIClient, Credentials
from ibm_watsonx_ai.foundation_models import ModelInference
from ibm_watsonx_ai.metanames import GenTextParamsMetaNames as GenParams

from prompts.AGENT_INSTRUCTIONS import build_system_prompt


class WatsonxService:
    """Singleton-style service for IBM Granite model calls."""

    _client: APIClient = None
    _model: ModelInference = None

    @classmethod
    def _get_model(cls) -> ModelInference:
        if cls._model is None:
            credentials = Credentials(
                url=os.getenv("WATSONX_URL", "https://us-south.ml.cloud.ibm.com"),
                api_key=os.getenv("WATSONX_API_KEY"),
            )
            cls._client = APIClient(credentials)
            cls._model = ModelInference(
                model_id=os.getenv("GRANITE_MODEL_ID", "ibm/granite-13b-chat-v2"),
                api_client=cls._client,
                project_id=os.getenv("WATSONX_PROJECT_ID"),
                params={
                    GenParams.MAX_NEW_TOKENS: 2048,
                    GenParams.MIN_NEW_TOKENS: 10,
                    GenParams.TEMPERATURE: 0.7,
                    GenParams.TOP_P: 0.9,
                    GenParams.REPETITION_PENALTY: 1.1,
                },
            )
        return cls._model

    @classmethod
    def chat(cls, messages: list, user_profile: dict = None) -> str:
        """
        Send a conversation to Granite and return the assistant reply.

        messages: [{"role": "user"|"assistant", "content": "..."}]
        """
        model = cls._get_model()
        system_prompt = build_system_prompt(user_profile)

        # Build the prompt in IBM Granite chat format
        prompt = f"<|system|>\n{system_prompt}\n"
        for msg in messages:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            if role == "user":
                prompt += f"<|user|>\n{content}\n"
            else:
                prompt += f"<|assistant|>\n{content}\n"
        prompt += "<|assistant|>\n"

        try:
            response = model.generate_text(prompt=prompt)
            return response.strip() if isinstance(response, str) else str(response)
        except Exception as e:
            return f"⚠️ AI service temporarily unavailable. Error: {str(e)}"

    @classmethod
    def generate_roadmap(cls, goal: str, skill_level: str, weekly_hours: float,
                         interests: str, user_profile: dict = None) -> str:
        """Generate a structured JSON roadmap for the given goal."""
        model = cls._get_model()
        system_prompt = build_system_prompt(user_profile)

        prompt = f"""<|system|>
{system_prompt}
<|user|>
Generate a detailed, structured learning roadmap as valid JSON for the following:

Goal: {goal}
Current Skill Level: {skill_level}
Weekly Study Hours: {weekly_hours}
Interests / Context: {interests}

Return ONLY valid JSON (no markdown fences) with this exact structure:
{{
  "title": "Roadmap title",
  "goal": "{goal}",
  "total_weeks": <number>,
  "roadmapsh_url": "<roadmap.sh URL if official roadmap exists, else empty string>",
  "roadmapsh_explanation": "<explain which sections to study first, skip, estimated time — only if URL present>",
  "phases": [
    {{
      "phase": 1,
      "title": "Phase title",
      "duration_weeks": 2,
      "milestone": "What you can do after this phase",
      "topics": [
        {{
          "name": "Topic name",
          "description": "What this covers",
          "level": "Beginner|Intermediate|Advanced",
          "estimated_hours": 10,
          "resources": [
            {{"title": "Resource name", "platform": "Platform name", "url": "URL", "free": true}}
          ],
          "status": "not_started"
        }}
      ],
      "project": {{
        "name": "Mini project name",
        "description": "Build this to apply what you learned",
        "skills_used": ["skill1", "skill2"]
      }}
    }}
  ]
}}
<|assistant|>
"""
        try:
            response = model.generate_text(prompt=prompt)
            text = response.strip() if isinstance(response, str) else str(response)
            # Attempt to clean and parse JSON
            if "```" in text:
                text = text.split("```")[1].replace("json", "").strip()
            return text
        except Exception as e:
            return json.dumps({"error": str(e)})

    @classmethod
    def assess_skill(cls, answers: list, user_profile: dict = None) -> str:
        """Evaluate 5-question skill assessment and return level + personalised start."""
        model = cls._get_model()
        system_prompt = build_system_prompt(user_profile)
        qa_text = "\n".join(
            f"Q{i+1}: {a.get('question','')}  A: {a.get('answer','')}"
            for i, a in enumerate(answers)
        )
        prompt = f"""<|system|>
{system_prompt}
<|user|>
Based on these skill assessment answers, evaluate the student and respond as JSON:
{qa_text}

Return ONLY valid JSON:
{{
  "skill_level": "Beginner|Intermediate|Advanced",
  "strengths": ["..."],
  "gaps": ["..."],
  "recommended_start": "Where to begin on their roadmap",
  "motivational_message": "Personalised encouragement"
}}
<|assistant|>
"""
        try:
            response = model.generate_text(prompt=prompt)
            return response.strip() if isinstance(response, str) else str(response)
        except Exception as e:
            return json.dumps({"error": str(e)})

    @classmethod
    def suggest_courses(cls, goal: str, skill_level: str, completed_topics: list) -> str:
        """Return curated, real course recommendations as JSON."""
        model = cls._get_model()
        completed = ", ".join(completed_topics) if completed_topics else "None yet"
        prompt = f"""<|system|>
You are LearnMate AI, a learning coach. Only recommend real, verifiable courses.
Never invent course names or URLs. Use only these platforms:
IBM SkillsBuild, freeCodeCamp, Coursera, edX, YouTube, The Odin Project, NPTEL, Udemy.
<|user|>
Recommend 8 courses for a student with:
Goal: {goal}
Skill Level: {skill_level}
Already completed: {completed}

Return ONLY valid JSON array:
[
  {{
    "id": "unique-id",
    "title": "Course title",
    "platform": "Platform name",
    "url": "Real URL",
    "duration": "X hours",
    "difficulty": "Beginner|Intermediate|Advanced",
    "rating": 4.5,
    "free": true,
    "recommended": true,
    "description": "One sentence why this course is valuable",
    "image_color": "#hex color for card gradient"
  }}
]
<|assistant|>
"""
        try:
            response = model.generate_text(prompt=prompt)
            text = response.strip() if isinstance(response, str) else str(response)
            if "```" in text:
                text = text.split("```")[1].replace("json", "").strip()
            return text
        except Exception as e:
            return json.dumps([])
