import { DailyPlan } from '../types';

export async function fetchDailyPlan(params: {
  studentName?: string;
  todayDay?: string;
  todayDate?: string;
  classes: any[];
  tasks: any[];
  exams: any[];
  budget: any;
  customFocus?: string;
}): Promise<DailyPlan> {
  try {
    const res = await fetch('/api/ai/daily-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      throw new Error(`Failed to generate daily plan: ${res.statusText}`);
    }

    const data = await res.json();
    return {
      headline: data.headline || 'Optimized daily academic and productivity sprint.',
      topPriorities: data.topPriorities || [
        'Complete today’s lecture readings and coursework.',
        'Review upcoming exam review topics.',
        'Track daily expenditures.'
      ],
      tacticalSchedule: data.tacticalSchedule || [
        { time: '09:00 - 12:00', activity: 'Morning Classes & Active Learning', notes: 'Engage actively and take structured notes.' },
        { time: '13:30 - 16:30', activity: 'Afternoon Deep Work Sprint', notes: 'Focus on highest priority assignments without distractions.' },
        { time: '18:00 - 20:00', activity: 'Exam Review & Problem Solving', notes: 'Practice active recall and problem sets.' }
      ],
      examStudyTip: data.examStudyTip || 'Focus on active recall and testing yourself under timed conditions.',
      financialTip: data.financialTip || `Keep daily expenses under your safe daily allowance limit.`,
      motivation: data.motivation || 'Consistent daily focus outpaces last-minute all-nighters every time.',
      generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  } catch (error) {
    console.error('Error fetching daily plan:', error);
    throw error;
  }
}

export async function polishResumeBulletApi(
  rawBullet: string,
  role: string,
  company: string
): Promise<string[]> {
  try {
    const res = await fetch('/api/ai/resume-bullet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawBullet, role, company }),
    });

    if (!res.ok) {
      throw new Error('Failed to polish resume bullet');
    }

    const data = await res.json();
    return data.bullets || [];
  } catch (error) {
    console.error('Resume bullet error:', error);
    throw error;
  }
}

export async function generateStudyGuideApi(
  noteTitle: string,
  noteContent: string,
  courseCode: string
): Promise<{
  summary: string;
  keyConcepts: string[];
  flashcards: { question: string; answer: string }[];
}> {
  try {
    const res = await fetch('/api/ai/study-guide', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ noteTitle, noteContent, courseCode }),
    });

    if (!res.ok) {
      throw new Error('Failed to generate study guide');
    }

    const data = await res.json();
    return {
      summary: data.summary || 'Summary unavailable.',
      keyConcepts: data.keyConcepts || [],
      flashcards: data.flashcards || []
    };
  } catch (error) {
    console.error('Study guide error:', error);
    throw error;
  }
}

export async function sendChatToAi(
  message: string,
  history: { role: 'user' | 'model'; text: string }[],
  context: any
): Promise<string> {
  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, context }),
    });

    if (!res.ok) {
      throw new Error('Failed to get AI response');
    }

    const data = await res.json();
    return data.reply || 'No response received.';
  } catch (error) {
    console.error('Chat error:', error);
    throw error;
  }
}
