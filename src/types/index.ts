export type NavTab = 
  | 'overview'
  | 'study-tasks'
  | 'study-timetable'
  | 'study-exams'
  | 'career-skills'
  | 'career-internships'
  | 'career-resume'
  | 'career-roadmap'
  | 'money-expenses'
  | 'money-budget'
  | 'campus-market'
  | 'campus-notes'
  | 'campus-events'
  | 'ai-assistant';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  course: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in_progress' | 'completed';
  estimatedHours: number;
  subtasks: Subtask[];
  notes?: string;
}

export interface ClassSession {
  id: string;
  courseCode: string;
  title: string;
  room: string;
  lecturer: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string; // HH:MM (24h)
  endTime: string;   // HH:MM (24h)
  type: 'Lecture' | 'Lab' | 'Tutorial' | 'Seminar';
  colorTag: string; // tailwind color prefix like 'indigo', 'emerald', etc.
}

export interface Exam {
  id: string;
  courseCode: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  weightage: number; // e.g. 35%
  syllabusCoverage: number; // 0 - 100
  confidenceLevel: 'needs_review' | 'moderate' | 'mastered';
  topics: string[];
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'Technical' | 'Core Engineering' | 'Soft Skills' | 'Design & Tools';
  proficiency: number; // 1 - 5
  targetLevel: number; // 1 - 5
  lastPracticed: string;
  keyProject: string;
}

export interface InternshipApp {
  id: string;
  company: string;
  role: string;
  location: string;
  stipend: string;
  appliedDate: string;
  status: 'wishlist' | 'applied' | 'oa_screening' | 'interview' | 'offer' | 'rejected';
  nextAction?: string;
  nextDate?: string;
  notes: string;
  url?: string;
}

export interface ResumeBullet {
  id: string;
  role: string;
  company: string;
  rawText: string;
  polishedOptions: string[];
  selectedText: string;
}

export interface RoadmapMilestone {
  id: string;
  year: 'Year 1' | 'Year 2' | 'Year 3' | 'Year 4';
  semester: 'Fall' | 'Spring';
  title: string;
  category: 'Academics' | 'Internship' | 'Project' | 'Leadership';
  completed: boolean;
  targetDate: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: 'Food & Groceries' | 'Rent & Utilities' | 'Books & Academic' | 'Transit' | 'Entertainment & Social' | 'Tech & Supplies';
  date: string; // YYYY-MM-DD
  paymentMethod: 'Student Card' | 'Apple Pay' | 'Venmo' | 'Cash';
  notes?: string;
}

export interface CategoryBudget {
  category: Expense['category'];
  limit: number;
}

export interface BudgetConfig {
  monthlyLimit: number;
  categories: CategoryBudget[];
}

export interface MarketplaceItem {
  id: string;
  title: string;
  price: number;
  condition: 'New / Sealed' | 'Like New' | 'Good' | 'Fair';
  category: 'Textbooks' | 'Dorm & Living' | 'Electronics' | 'Bikes & Transit' | 'Course Gear';
  sellerName: string;
  contactInfo: string;
  location: string;
  status: 'available' | 'sold';
  postedDate: string;
  description: string;
}

export interface NoteItem {
  id: string;
  title: string;
  courseCode: string;
  author: string;
  topic: string;
  tags: string[];
  lastUpdated: string;
  content: string;
  downloadsCount: number;
}

export interface CampusEvent {
  id: string;
  title: string;
  host: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  category: 'Career Fair' | 'Hackathon' | 'Club Meeting' | 'Social' | 'Guest Lecture';
  isRsvpd: boolean;
  attendeesCount: number;
  description: string;
  link?: string;
}

export interface DailyPlanScheduleBlock {
  time: string;
  activity: string;
  notes: string;
}

export interface DailyPlan {
  headline: string;
  topPriorities: string[];
  tacticalSchedule: DailyPlanScheduleBlock[];
  examStudyTip: string;
  financialTip: string;
  motivation: string;
  generatedAt: string;
}
