import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export const analyzeWithClaude = async (resumeText, jobDescription) => {
  const prompt = `You are an expert career coach and technical recruiter.

Compare the following resume against the job description and respond ONLY with a valid JSON object — no markdown, no explanation, just raw JSON.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Respond with this exact JSON structure:
{
  "matchScore": <number 0-100>,
  "jobTitle": "<extract job title from JD>",
  "summary": "<2-3 sentence summary of fit>",
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "resources": [
    {
      "skill": "Docker",
      "links": [
        { "title": "Docker in 100 Seconds", "url": "https://www.youtube.com/watch?v=Gjnup-PuquQ", "type": "youtube" },
        { "title": "Docker Official Docs",  "url": "https://docs.docker.com/get-started/", "type": "article" }
      ]
    }
  ]
}

Rules:
- matchScore: realistic score based on skill overlap
- matchedSkills: skills present in BOTH resume and JD
- missingSkills: skills required in JD but NOT in resume
- resources: only for missingSkills, max 3 links each, prefer free YouTube + official docs
- Keep summary concise and actionable`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    messages: [{ role: "user", content: prompt }],
  });

  const raw   = message.content[0].text.trim();
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
};