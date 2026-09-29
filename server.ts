import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI client with standard header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper to check if API key exists
const hasApiKey = () => {
  return Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '');
};

// 1. AI: What Should I Do Today? (Daily Briefing)
app.post('/api/ai/daily-plan', async (req: Request, res: Response) => {
  try {
    const {
      studentName = 'Student',
      todayDay = 'Monday',
      todayDate = 'September 29, 2026',
      classes = [],
      tasks = [],
      exams = [],
      budget = {},
      customFocus = ''
    } = req.body;

    if (!hasApiKey()) {
      return res.json({
        headline: `Focus on high-priority deadlines and your upcoming ${exams[0]?.title || 'midterms'} review!`,
        topPriorities: [
          `Review syllabus for ${exams[0]?.title || 'upcoming exam'} (${exams[0]?.daysLeft || 4} days remaining).`,
          `Complete ${tasks[0]?.title || 'high-priority assignment'} due this week.`,
          `Attend today's lectures and keep daily spending under $${budget?.dailyAllowance || 25}.`
        ],
        tacticalSchedule: [
          { time: '09:00 - 11:30', activity: 'Academic Classes & Lecture Notes', notes: 'Attend scheduled sessions and log key formula cards.' },
          { time: '13:00 - 15:00', activity: 'Deep Work: Assignment Sprints', notes: 'Knock out urgent tasks with zero distractions.' },
          { time: '16:00 - 18:00', activity: 'Exam Preparation Block', notes: 'Practice problem sets and active recall.' },
          { time: '19:30 - 20:30', activity: 'Campus & Career Check-in', notes: 'Follow up on internship applications and club duties.' }
        ],
        examStudyTip: 'Use 25-minute Pomodoro cycles with active recall rather than passive re-reading.',
        financialTip: `Stay within your daily allowance of $${budget?.dailyAllowance || 25}. Pack a lunch or brew your own coffee to save $7+.`,
        motivation: 'Small disciplined efforts compound into massive semester victories.'
      });
    }

    const prompt = `You are the executive AI advisor inside Student Life OS.
Analyze the following live student academic, career, and financial profile:

Student: ${studentName}
Today: ${todayDay}, ${todayDate}
User focus request: ${customFocus || 'Plan my most optimal and balanced day.'}

Today's Classes:
${classes.map((c: any) => `- ${c.time}: ${c.code} ${c.title} (${c.room}, ${c.type})`).join('\n') || 'No scheduled classes today.'}

Pending Tasks:
${tasks.map((t: any) => `- [${t.priority.toUpperCase()}] ${t.title} (Course: ${t.course}, Due: ${t.dueDate})`).join('\n') || 'No urgent tasks.'}

Upcoming Exams:
${exams.map((e: any) => `- ${e.title} (${e.date}, ${e.daysLeft} days left, Coverage: ${e.syllabusCoverage}%)`).join('\n') || 'No exams this week.'}

Budget Context:
- Monthly Limit: $${budget.monthlyLimit || 1200}
- Spent So Far: $${budget.spent || 420}
- Safe Daily Allowance: $${budget.dailyAllowance || 25}

Respond with a strictly formatted JSON object with no markdown wrapping:
{
  "headline": "A sharp, inspiring 1-sentence tactical summary of today's mission",
  "topPriorities": ["3 concrete, high-impact non-negotiable items for today"],
  "tacticalSchedule": [
    { "time": "e.g. 08:30 - 10:00", "activity": "Actionable task/class", "notes": "Specific tactical advice" },
    { "time": "10:30 - 12:30", "activity": "...", "notes": "..." },
    { "time": "14:00 - 16:30", "activity": "...", "notes": "..." },
    { "time": "19:00 - 20:30", "activity": "...", "notes": "..." }
  ],
  "examStudyTip": "Actionable study tactic tailored directly to the nearest exam",
  "financialTip": "Specific spending advice based on their daily allowance",
  "motivation": "A punchy, grounded motivational quote for ambitious students"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating daily plan:', error);
    return res.status(500).json({
      error: 'Could not generate AI plan at this moment.',
      fallback: true
    });
  }
});

// 2. AI: Resume Bullet Point Polisher (Google X-Y-Z formula)
app.post('/api/ai/resume-bullet', async (req: Request, res: Response) => {
  try {
    const { rawBullet, role = 'Software Engineer / Student', company = 'Campus Project' } = req.body;

    if (!rawBullet) {
      return res.status(400).json({ error: 'Missing bullet text.' });
    }

    if (!hasApiKey()) {
      return res.json({
        bullets: [
          `Engineered core modules for ${company}, reducing query latency by 35% across 1,200+ simulated users using optimized caching.`,
          `Spearheaded the development of interactive features for ${company} by deploying TypeScript services, boosting user retention by 22%.`,
          `Refactored client-side architecture in ${company} using modern React patterns, resulting in 40% faster initial load time.`
        ]
      });
    }

    const prompt = `You are a tech recruiter and resume specialist.
Rewrite this student's raw resume bullet point for a ${role} role at ${company}:
Raw: "${rawBullet}"

Apply the Google X-Y-Z formula: "Accomplished [X] as measured by [Y], by doing [Z]".
Provide 3 strong, varied variations with strong active action verbs (e.g. Engineered, Spearheaded, Architected, Automated) and realistic quantifiable metrics.

Return pure JSON:
{
  "bullets": [
    "bullet 1",
    "bullet 2",
    "bullet 3"
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{"bullets":[]}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Resume polisher error:', error);
    return res.status(500).json({ error: 'Failed to polish resume bullet.' });
  }
});

// 3. AI: Notes Summarizer & Study Flashcard Generator
app.post('/api/ai/study-guide', async (req: Request, res: Response) => {
  try {
    const { noteTitle, noteContent, courseCode = 'General' } = req.body;

    if (!noteContent && !noteTitle) {
      return res.status(400).json({ error: 'Provide note title or content.' });
    }

    if (!hasApiKey()) {
      return res.json({
        summary: `Key review sheet for ${noteTitle} covering foundational concepts, trade-offs, and exam applications.`,
        keyConcepts: [
          'Core algorithmic invariants and asymptotic bounds (Big-O analysis)',
          'Trade-offs between space complexity vs time efficiency',
          'Edge case handling: empty states, boundary values, and stack overflows'
        ],
        flashcards: [
          { question: `What is the primary constraint in ${noteTitle}?`, answer: 'Maintaining optimal time bounds while preventing redundant computation.' },
          { question: 'When is dynamic programming preferable over memoization?', answer: 'When all subproblems must be solved and iterative tabular formulation saves call stack overhead.' },
          { question: 'How do you verify edge condition safety?', answer: 'Check 0-length inputs, single-node graphs, and duplicate keys.' }
        ]
      });
    }

    const prompt = `You are a university academic tutor for ${courseCode}.
Create a high-yield exam revision guide from these student notes:
Title: ${noteTitle}
Notes:
"""${noteContent}"""

Return pure JSON:
{
  "summary": "2-sentence executive summary of the topic",
  "keyConcepts": ["3 to 4 core points to memorize"],
  "flashcards": [
    { "question": "Question 1", "answer": "Crisp answer 1" },
    { "question": "Question 2", "answer": "Crisp answer 2" },
    { "question": "Question 3", "answer": "Crisp answer 3" }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Study guide error:', error);
    return res.status(500).json({ error: 'Failed to generate study guide.' });
  }
});

// 4. AI: Interactive Student OS Assistant Chat
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [], context = {} } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    if (!hasApiKey()) {
      return res.json({
        reply: `I received your message: "${message}". As your Student Life OS advisor, I recommend prioritizing your nearest exam (${context.nearestExam || 'Upcoming Midterm'}) and keeping your daily study sessions in focused 45-minute blocks. Feel free to log tasks or check your timetable!`
      });
    }

    const systemInstruction = `You are the Student Life OS Companion: an intelligent, encouraging, pragmatic, and highly organized academic mentor.
You help students with:
- Daily study strategies, time management, and preventing burnout
- Course exam preparation and technical problem breakdown
- Internship interview prep, ATS resumes, and career roadmapping
- Student budgeting and campus life navigation
Keep your answers structured, encouraging, concise, and immediately actionable. Avoid fluff.`;

    const chatHistory = history.map((h: any) => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.text || h.content || '' }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        ...chatHistory,
        {
          role: 'user',
          parts: [{ text: `Current student context: ${JSON.stringify(context)}\n\nStudent question: ${message}` }]
        }
      ],
      config: {
        systemInstruction,
      }
    });

    return res.json({ reply: response.text });
  } catch (error: any) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: 'Chat service error.' });
  }
});

// Vite middleware for dev / static files for prod
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`Student Life OS Server listening on port ${PORT}`);
  });
}

startServer();
