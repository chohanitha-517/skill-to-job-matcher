import { 
  Task, 
  ClassSession, 
  Exam, 
  SkillItem, 
  InternshipApp, 
  ResumeBullet, 
  RoadmapMilestone, 
  Expense, 
  BudgetConfig, 
  MarketplaceItem, 
  NoteItem, 
  CampusEvent,
  DailyPlan
} from '../types';

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Problem Set 4: Dynamic Programming & DAGs',
    course: 'CS201',
    dueDate: '2026-10-01',
    dueTime: '23:59',
    priority: 'high',
    status: 'in_progress',
    estimatedHours: 4,
    notes: 'Verify runtime complexities with Master Theorem and test topological sort edge cases.',
    subtasks: [
      { id: 'st-1', title: 'Implement Bellman-Ford recurrence in Python', completed: true },
      { id: 'st-2', title: 'Prove optimal substructure lemma for Problem 3', completed: false },
      { id: 'st-3', title: 'Write unit tests on disconnected DAG graph', completed: false }
    ]
  },
  {
    id: 'task-2',
    title: 'Linear Algebra Problem Set 5: Eigenvalues & Diagonalization',
    course: 'MATH240',
    dueDate: '2026-10-02',
    dueTime: '17:00',
    priority: 'high',
    status: 'todo',
    estimatedHours: 3,
    notes: 'Section 5.3 practice problems 14, 18, 26.',
    subtasks: [
      { id: 'st-4', title: 'Calculate characteristic polynomials for 3x3 matrices', completed: false },
      { id: 'st-5', title: 'Verify eigenspaces and geometric multiplicity', completed: false }
    ]
  },
  {
    id: 'task-3',
    title: 'Systems Lab 2: Concurrent Buffer & POSIX Mutexes',
    course: 'CS240',
    dueDate: '2026-10-05',
    dueTime: '23:59',
    priority: 'medium',
    status: 'in_progress',
    estimatedHours: 5,
    notes: 'Valgrind clean check required. Beware of deadlock on ring buffer full condition.',
    subtasks: [
      { id: 'st-6', title: 'Implement thread-safe ring buffer enqueue/dequeue', completed: true },
      { id: 'st-7', title: 'Benchmark consumer throughput with 8 worker threads', completed: false }
    ]
  },
  {
    id: 'task-4',
    title: 'Microeconomics Chapter 7 Reading: Monopoly Deadweight Loss',
    course: 'ECON101',
    dueDate: '2026-10-03',
    dueTime: '10:00',
    priority: 'low',
    status: 'todo',
    estimatedHours: 1.5,
    notes: 'Take brief summary notes for Thursday tutorial quiz.',
    subtasks: [
      { id: 'st-8', title: 'Review marginal revenue curve geometry', completed: false }
    ]
  },
  {
    id: 'task-5',
    title: 'Revise Resume & Apply to Stripe SWE Internship',
    course: 'Career',
    dueDate: '2026-09-30',
    dueTime: '21:00',
    priority: 'high',
    status: 'completed',
    estimatedHours: 2,
    notes: 'Polished bullet points using Google X-Y-Z formula. Application submitted via portal.',
    subtasks: [
      { id: 'st-9', title: 'Format project section with quantifiable latency metrics', completed: true },
      { id: 'st-10', title: 'Submit portal application', completed: true }
    ]
  }
];

export const INITIAL_CLASSES: ClassSession[] = [
  // Monday
  {
    id: 'cls-1',
    courseCode: 'CS201',
    title: 'Data Structures & Algorithms',
    room: 'Turing Hall 104',
    lecturer: 'Prof. Katherine Vance',
    dayOfWeek: 'Monday',
    startTime: '09:00',
    endTime: '10:30',
    type: 'Lecture',
    colorTag: 'indigo'
  },
  {
    id: 'cls-2',
    courseCode: 'MATH240',
    title: 'Linear Algebra & Matrix Analysis',
    room: 'Euler Science Bldg 210',
    lecturer: 'Dr. Raymond Chen',
    dayOfWeek: 'Monday',
    startTime: '11:00',
    endTime: '12:30',
    type: 'Lecture',
    colorTag: 'sky'
  },
  {
    id: 'cls-3',
    courseCode: 'CS240',
    title: 'Computer Systems Architecture Lab',
    room: 'Silicon Lab 302',
    lecturer: 'TA Marcus Brody',
    dayOfWeek: 'Monday',
    startTime: '14:00',
    endTime: '16:00',
    type: 'Lab',
    colorTag: 'emerald'
  },

  // Tuesday
  {
    id: 'cls-4',
    courseCode: 'ECON101',
    title: 'Principles of Microeconomics',
    room: 'Social Sciences Aud. B',
    lecturer: 'Prof. Sarah Jenkins',
    dayOfWeek: 'Tuesday',
    startTime: '10:00',
    endTime: '11:30',
    type: 'Lecture',
    colorTag: 'amber'
  },
  {
    id: 'cls-5',
    courseCode: 'CS201',
    title: 'Algorithms Problem Solving Seminar',
    room: 'Turing Hall 208',
    lecturer: 'Prof. Katherine Vance',
    dayOfWeek: 'Tuesday',
    startTime: '13:00',
    endTime: '14:30',
    type: 'Seminar',
    colorTag: 'indigo'
  },

  // Wednesday
  {
    id: 'cls-6',
    courseCode: 'CS201',
    title: 'Data Structures & Algorithms',
    room: 'Turing Hall 104',
    lecturer: 'Prof. Katherine Vance',
    dayOfWeek: 'Wednesday',
    startTime: '09:00',
    endTime: '10:30',
    type: 'Lecture',
    colorTag: 'indigo'
  },
  {
    id: 'cls-7',
    courseCode: 'MATH240',
    title: 'Linear Algebra & Matrix Analysis',
    room: 'Euler Science Bldg 210',
    lecturer: 'Dr. Raymond Chen',
    dayOfWeek: 'Wednesday',
    startTime: '11:00',
    endTime: '12:30',
    type: 'Lecture',
    colorTag: 'sky'
  },
  {
    id: 'cls-8',
    courseCode: 'CS240',
    title: 'Computer Systems Architecture',
    room: 'Engineering Hall 401',
    lecturer: 'Prof. Alan Zhao',
    dayOfWeek: 'Wednesday',
    startTime: '14:00',
    endTime: '15:30',
    type: 'Lecture',
    colorTag: 'emerald'
  },

  // Thursday
  {
    id: 'cls-9',
    courseCode: 'ECON101',
    title: 'Microeconomics Tutorial & Problem Session',
    room: 'Social Sciences 112',
    lecturer: 'TA Elena Rostova',
    dayOfWeek: 'Thursday',
    startTime: '10:00',
    endTime: '11:30',
    type: 'Tutorial',
    colorTag: 'amber'
  },
  {
    id: 'cls-10',
    courseCode: 'MATH240',
    title: 'Linear Algebra Recitation',
    room: 'Euler Science 105',
    lecturer: 'TA David Miller',
    dayOfWeek: 'Thursday',
    startTime: '13:30',
    endTime: '15:00',
    type: 'Tutorial',
    colorTag: 'sky'
  },

  // Friday
  {
    id: 'cls-11',
    courseCode: 'CS240',
    title: 'Computer Systems Architecture',
    room: 'Engineering Hall 401',
    lecturer: 'Prof. Alan Zhao',
    dayOfWeek: 'Friday',
    startTime: '10:00',
    endTime: '11:30',
    type: 'Lecture',
    colorTag: 'emerald'
  },
  {
    id: 'cls-12',
    courseCode: 'CS201',
    title: 'Algorithms Coding Office Hours & Review',
    room: 'Turing Hall 104',
    lecturer: 'Prof. Katherine Vance',
    dayOfWeek: 'Friday',
    startTime: '13:00',
    endTime: '14:30',
    type: 'Seminar',
    colorTag: 'indigo'
  }
];

export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'ex-1',
    courseCode: 'CS201',
    title: 'Algorithms & Data Structures Midterm',
    date: '2026-10-04',
    time: '14:00 - 16:00',
    location: 'Campus Main Gymnasium Hall C',
    weightage: 30,
    syllabusCoverage: 82,
    confidenceLevel: 'moderate',
    topics: [
      'Asymptotic notation & Master Theorem',
      'Divide and conquer (QuickSelect, Karatsuba)',
      'Self-balancing BSTs and Red-Black invariants',
      'Graph traversals: BFS, DFS, Dijkstra, A*'
    ]
  },
  {
    id: 'ex-2',
    courseCode: 'MATH240',
    title: 'Linear Algebra Midterm Exam',
    date: '2026-10-12',
    time: '09:00 - 11:00',
    location: 'Euler Hall Aud. 1',
    weightage: 25,
    syllabusCoverage: 65,
    confidenceLevel: 'needs_review',
    topics: [
      'Subspaces, null space, column space, rank',
      'Linear transformations and kernel/range',
      'Determinants and Cramer rule',
      'Eigenvalues, eigenvectors, diagonalization'
    ]
  },
  {
    id: 'ex-3',
    courseCode: 'ECON101',
    title: 'Microeconomics Mid-Semester Assessment',
    date: '2026-10-22',
    time: '11:30 - 13:00',
    location: 'Social Sciences Aud. A',
    weightage: 20,
    syllabusCoverage: 90,
    confidenceLevel: 'mastered',
    topics: [
      'Supply and demand elasticity',
      'Consumer surplus and deadweight loss',
      'Production functions and cost curves',
      'Perfect competition vs monopoly equilibrium'
    ]
  },
  {
    id: 'ex-4',
    courseCode: 'CS240',
    title: 'Systems & Assembly Final Exam',
    date: '2026-12-08',
    time: '08:30 - 11:30',
    location: 'Engineering Aud. 2',
    weightage: 40,
    syllabusCoverage: 40,
    confidenceLevel: 'needs_review',
    topics: [
      'x86-64 stack frame layout & calling conventions',
      'Virtual memory, TLB, page tables',
      'Cache hierarchy & cache-friendly code',
      'POSIX signals, fork/exec, concurrent threads'
    ]
  }
];

export const INITIAL_SKILLS: SkillItem[] = [
  {
    id: 'sk-1',
    name: 'Data Structures & Algorithms',
    category: 'Technical',
    proficiency: 4,
    targetLevel: 5,
    lastPracticed: 'Yesterday',
    keyProject: 'Solved 140+ LeetCode medium questions; custom B-tree in C++'
  },
  {
    id: 'sk-2',
    name: 'TypeScript & Modern React',
    category: 'Technical',
    proficiency: 5,
    targetLevel: 5,
    lastPracticed: 'Today',
    keyProject: 'Built Student Life OS and campus club portal'
  },
  {
    id: 'sk-3',
    name: 'Systems Programming (C / Linux / POSIX)',
    category: 'Core Engineering',
    proficiency: 3,
    targetLevel: 4,
    lastPracticed: '3 days ago',
    keyProject: 'Concurrent multi-threaded web server & custom memory allocator'
  },
  {
    id: 'sk-4',
    name: 'PostgreSQL & Query Optimization',
    category: 'Technical',
    proficiency: 4,
    targetLevel: 4,
    lastPracticed: '1 week ago',
    keyProject: 'Designed relational schemas with indexing and CTE analytics'
  },
  {
    id: 'sk-5',
    name: 'System Design & Distributed Architectures',
    category: 'Core Engineering',
    proficiency: 2,
    targetLevel: 4,
    lastPracticed: '2 weeks ago',
    keyProject: 'Studying Designing Data-Intensive Applications (Kleppmann)'
  },
  {
    id: 'sk-6',
    name: 'Technical Writing & Documentation',
    category: 'Soft Skills',
    proficiency: 4,
    targetLevel: 5,
    lastPracticed: '4 days ago',
    keyProject: 'Published campus developer handbook & RFC design docs'
  }
];

export const INITIAL_INTERNSHIPS: InternshipApp[] = [
  {
    id: 'int-1',
    company: 'Stripe',
    role: 'Software Engineering Intern (Summer 2027)',
    location: 'San Francisco, CA / Seattle, WA',
    stipend: '$56 / hour + housing stipend',
    appliedDate: '2026-09-12',
    status: 'interview',
    nextAction: 'Technical Round 2: Distributed Systems & Coding',
    nextDate: '2026-10-08',
    notes: 'Passed screening and Round 1. Focus prep on concurrency, idempotency, and clean API design.',
    url: 'https://stripe.com/jobs'
  },
  {
    id: 'int-2',
    company: 'Google',
    role: 'Software Engineering STEP / SWE Intern',
    location: 'Mountain View, CA',
    stipend: '$52 / hour + dorm relocation',
    appliedDate: '2026-09-04',
    status: 'oa_screening',
    nextAction: 'Complete Snapshot Survey & Coding Assessment',
    nextDate: '2026-10-02',
    notes: 'Referred by alumni mentor Sarah (Class of 2024). OA sent 2 days ago.',
    url: 'https://careers.google.com'
  },
  {
    id: 'int-3',
    company: 'Notion',
    role: 'Frontend & Product Engineering Intern',
    location: 'San Francisco, CA (Hybrid)',
    stipend: '$50 / hour',
    appliedDate: '2026-09-18',
    status: 'applied',
    nextAction: 'Waiting for initial recruiter resume review',
    notes: 'Highlighted rich-text block rendering and state management projects in cover note.',
    url: 'https://notion.so/careers'
  },
  {
    id: 'int-4',
    company: 'Datadog',
    role: 'Systems & Infrastructure Intern',
    location: 'New York, NY',
    stipend: '$54 / hour + housing',
    appliedDate: '2026-08-28',
    status: 'offer',
    nextAction: 'Review offer package and confirm response deadline',
    nextDate: '2026-10-15',
    notes: 'Received written offer for Summer 2027 Infrastructure team! Compelling option.',
    url: 'https://datadoghq.com'
  },
  {
    id: 'int-5',
    company: 'Ramp',
    role: 'Full Stack Engineering Intern',
    location: 'New York, NY',
    stipend: '$60 / hour',
    appliedDate: '2026-09-22',
    status: 'wishlist',
    nextAction: 'Reach out to recruiter on LinkedIn with custom note',
    notes: 'Applications close mid-October. High-growth fintech environment.',
    url: 'https://ramp.com/careers'
  }
];

export const INITIAL_RESUME_BULLETS: ResumeBullet[] = [
  {
    id: 'rb-1',
    role: 'Software Lead',
    company: 'Campus Autonomous Vehicle Club',
    rawText: 'worked on the sensor pipeline and helped team speed up lidar data processing',
    polishedOptions: [
      'Architected high-throughput LiDAR ingest pipeline in C++, reducing point-cloud latency by 42% across 60 FPS live camera feeds.',
      'Spearheaded sensor telemetry fusion for autonomous rover, boosting real-time obstacle detection accuracy by 28% using spatial KD-trees.',
      'Optimized memory footprint of multi-threaded sensor pipeline, cutting memory leaks to 0 and accelerating frame processing by 35ms.'
    ],
    selectedText: 'Architected high-throughput LiDAR ingest pipeline in C++, reducing point-cloud latency by 42% across 60 FPS live camera feeds.'
  },
  {
    id: 'rb-2',
    role: 'Full-Stack Developer',
    company: 'Student Government Association',
    rawText: 'made an online course evaluation tool that students used to check professor ratings',
    polishedOptions: [
      'Engineered full-stack course intelligence platform serving 4,800+ undergraduate students, handling 15k+ monthly queries with sub-100ms response times.',
      'Deployed serverless Postgres API with Redis caching layer, reducing median page load time from 1.8s to 240ms during peak semester registration.',
      'Collaborated with 3 engineers to build accessible React frontend with Tailwind CSS, increasing student feedback submission volume by 135%.'
    ],
    selectedText: 'Engineered full-stack course intelligence platform serving 4,800+ undergraduate students, handling 15k+ monthly queries with sub-100ms response times.'
  }
];

export const INITIAL_ROADMAP: RoadmapMilestone[] = [
  {
    id: 'rm-1',
    year: 'Year 1',
    semester: 'Fall',
    title: 'Master Intro to Programming (Python/Java) & Discrete Math',
    category: 'Academics',
    completed: true,
    targetDate: 'Dec 2024'
  },
  {
    id: 'rm-2',
    year: 'Year 1',
    semester: 'Spring',
    title: 'Join ACM Student Chapter & Ship First Hackathon Project',
    category: 'Leadership',
    completed: true,
    targetDate: 'May 2025'
  },
  {
    id: 'rm-3',
    year: 'Year 2',
    semester: 'Fall',
    title: 'Complete Data Structures & Algorithms with grade A',
    category: 'Academics',
    completed: true,
    targetDate: 'Dec 2025'
  },
  {
    id: 'rm-4',
    year: 'Year 2',
    semester: 'Spring',
    title: 'Secure First Sophomore SWE Internship (Datadog / Local Tech)',
    category: 'Internship',
    completed: true,
    targetDate: 'May 2026'
  },
  {
    id: 'rm-5',
    year: 'Year 3',
    semester: 'Fall',
    title: 'Land Top-Tier Summer 2027 Internship (Stripe / Google target)',
    category: 'Internship',
    completed: false,
    targetDate: 'Nov 2026'
  },
  {
    id: 'rm-6',
    year: 'Year 3',
    semester: 'Spring',
    title: 'Publish Undergraduate Research Paper or Core OSS Project',
    category: 'Project',
    completed: false,
    targetDate: 'May 2027'
  },
  {
    id: 'rm-7',
    year: 'Year 4',
    semester: 'Fall',
    title: 'Convert Summer Internship into Full-Time Return Offer',
    category: 'Internship',
    completed: false,
    targetDate: 'Oct 2027'
  },
  {
    id: 'rm-8',
    year: 'Year 4',
    semester: 'Spring',
    title: 'Complete Senior Capstone Project & Graduate Magna Cum Laude',
    category: 'Academics',
    completed: false,
    targetDate: 'May 2028'
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    title: 'Trader Joe\'s Grocery Haul (Meal Prep)',
    amount: 64.50,
    category: 'Food & Groceries',
    date: '2026-09-28',
    paymentMethod: 'Student Card',
    notes: 'Chicken, oats, spinach, berries, almond milk for the week.'
  },
  {
    id: 'exp-2',
    title: 'Campus Coffee & Cold Brew',
    amount: 5.25,
    category: 'Food & Groceries',
    date: '2026-09-28',
    paymentMethod: 'Apple Pay',
    notes: 'Morning study session at Library Cafe.'
  },
  {
    id: 'exp-3',
    title: 'Monthly Subway & Campus Bus Pass',
    amount: 45.00,
    category: 'Transit',
    date: '2026-09-25',
    paymentMethod: 'Student Card',
    notes: 'Subsidized student transit card.'
  },
  {
    id: 'exp-4',
    title: 'Linear Algebra Solutions Manual & Notebooks',
    amount: 32.00,
    category: 'Books & Academic',
    date: '2026-09-22',
    paymentMethod: 'Apple Pay',
    notes: 'Campus bookstore supplies.'
  },
  {
    id: 'exp-5',
    title: 'Roommate Pizza & Hackathon Snack Night',
    amount: 18.50,
    category: 'Entertainment & Social',
    date: '2026-09-20',
    paymentMethod: 'Venmo',
    notes: 'Split with dorm mates.'
  },
  {
    id: 'exp-6',
    title: 'USB-C Multi-Hub for Laptop',
    amount: 29.99,
    category: 'Tech & Supplies',
    date: '2026-09-15',
    paymentMethod: 'Apple Pay',
    notes: 'Needed for external monitor and hardware lab.'
  },
  {
    id: 'exp-7',
    title: 'Chipotle Burrito Bowl',
    amount: 12.80,
    category: 'Food & Groceries',
    date: '2026-09-14',
    paymentMethod: 'Apple Pay',
    notes: 'Quick dinner after 4-hour systems lab.'
  }
];

export const INITIAL_BUDGET_CONFIG: BudgetConfig = {
  monthlyLimit: 1100,
  categories: [
    { category: 'Food & Groceries', limit: 420 },
    { category: 'Rent & Utilities', limit: 350 },
    { category: 'Transit', limit: 75 },
    { category: 'Books & Academic', limit: 100 },
    { category: 'Entertainment & Social', limit: 100 },
    { category: 'Tech & Supplies', limit: 55 }
  ]
};

export const INITIAL_MARKETPLACE: MarketplaceItem[] = [
  {
    id: 'item-1',
    title: 'TI-84 Plus CE Color Graphing Calculator',
    price: 65,
    condition: 'Like New',
    category: 'Electronics',
    sellerName: 'Maya Patel (Junior, Engineering)',
    contactInfo: 'mpatel@campus.edu · IG: @maya_p',
    location: 'Student Union Lobby / Library 2nd Floor',
    status: 'available',
    postedDate: '2026-09-27',
    description: 'Comes with charging cable and sliding protective case. Perfect battery health. Required for MATH240 and PHYS101.'
  },
  {
    id: 'item-2',
    title: 'Introduction to Algorithms (CLRS 4th Edition)',
    price: 45,
    condition: 'Good',
    category: 'Textbooks',
    sellerName: 'Jordan Reed (Senior, CS)',
    contactInfo: 'jreed@campus.edu',
    location: 'North Campus Quad Dorms',
    status: 'available',
    postedDate: '2026-09-26',
    description: 'Clean pages, no heavy highlighting. Essential reference for CS201 and technical interview prep.'
  },
  {
    id: 'item-3',
    title: 'Ergonomic Mesh Dorm Desk Chair (Adjustable Arms)',
    price: 50,
    condition: 'Like New',
    category: 'Dorm & Living',
    sellerName: 'Chloe Bennett (Sophomore)',
    contactInfo: 'bennett_c@campus.edu',
    location: 'West Campus Dorms (Elevator building)',
    status: 'available',
    postedDate: '2026-09-25',
    description: 'Upgraded to a standing desk so selling this. Super comfortable for long coding sessions. Can help carry down to your car.'
  },
  {
    id: 'item-4',
    title: 'Schwinn Single-Speed Campus Commuter Bike',
    price: 110,
    condition: 'Good',
    category: 'Bikes & Transit',
    sellerName: 'David Vance (Senior)',
    contactInfo: 'dvance@campus.edu',
    location: 'Bike racks behind Science Complex',
    status: 'available',
    postedDate: '2026-09-23',
    description: 'Includes Kryptonite U-Lock ($40 value) and front LED light. Fresh brake pads installed last month.'
  },
  {
    id: 'item-5',
    title: 'iPad Air 5th Gen (64GB) + Apple Pencil 2',
    price: 360,
    condition: 'Like New',
    category: 'Electronics',
    sellerName: 'Samira Khan (Pre-Med)',
    contactInfo: 'samira_k@campus.edu',
    location: 'Bio-Medical Library Cafe',
    status: 'sold',
    postedDate: '2026-09-20',
    description: 'Paperlike screen protector installed on day one. Zero scratches. Great for GoodNotes / Notability math derivations.'
  }
];

export const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    title: 'Dynamic Programming & DAG Recurrences Master Sheet',
    courseCode: 'CS201',
    author: 'Alex Rivera (You)',
    topic: 'Graph Algorithms & Memoization',
    tags: ['Algorithms', 'DP', 'Exams', 'CheatSheet'],
    lastUpdated: '2026-09-27',
    downloadsCount: 38,
    content: `# CS201: Dynamic Programming Framework

### 1. The 5-Step Recipe
1. **Define Subproblems**: Let \`OPT(i, j)\` be the optimal solution value considering prefix elements up to index \`i\` with capacity or constraint \`j\`.
2. **Guess / Relate**: Identify the last decision made. Relate \`OPT(i)\` to smaller subproblems \`OPT(i-1)\`, \`OPT(i-k)\`.
3. **Recurrence & Base Cases**:
   - Write mathematical definition with boundary conditions (e.g. \`OPT(0) = 0\`, invalid state = \`+∞\` or \`-∞\`).
4. **Topological Order (Bottom-up or Memoized)**:
   - Ensure dependencies form an acyclic directed graph (DAG). Solve in topological order of subproblems.
5. **Reconstruct Solution**:
   - Store parent pointers or backtrack using the computed table values.

### 2. Classic Patterns to Memorize
- **Prefix / Suffix**: Longest Increasing Subsequence (LIS) in O(N log N) with binary search.
- **2D Grid / Interval**: Longest Common Subsequence (LCS) and Edit Distance.
- **Tree DP**: Maximum Weight Independent Set on Trees via post-order traversal.`
  },
  {
    id: 'note-2',
    title: 'Eigenvalues, Diagonalization & Spectral Theorem',
    courseCode: 'MATH240',
    author: 'Dr. Raymond Chen (Lecture Notes)',
    topic: 'Linear Algebra Midterm Review',
    tags: ['Math', 'Eigenvalues', 'Matrix', 'Midterm'],
    lastUpdated: '2026-09-24',
    downloadsCount: 52,
    content: `# MATH240: Eigenvalues & Matrix Diagonalization

### 1. Fundamental Equations
- **Eigenvalue Condition**: \`A v = λ v\` where \`v ≠ 0\`.
- **Characteristic Polynomial**: \`det(A - λ I) = 0\`.
- Roots of polynomial give eigenvalues \`λ_1, λ_2, ... , λ_n\`.
- **Eigenspace \`E_λ\`**: \`Null(A - λ I)\`. Basis is found by row-reducing \`A - λ I\`.

### 2. Diagonalizability Criteria
- Matrix \`A\` of size \`n x n\` is diagonalizable iff it has \`n\` linearly independent eigenvectors.
- In this case: \`A = P D P^(-1)\`, where columns of \`P\` are eigenvectors and diagonal entries of \`D\` are corresponding eigenvalues.
- **Geometric vs Algebraic Multiplicity**:
  - \`1 <= dim(E_λ) <= alg_mult(λ)\`.
  - \`A\` is diagonalizable iff for EVERY eigenvalue, geometric multiplicity equals algebraic multiplicity.

### 3. Spectral Theorem for Symmetric Matrices
- If \`A = A^T\` (real symmetric):
  1. All eigenvalues are strictly REAL numbers.
  2. Eigenvectors corresponding to distinct eigenvalues are mutually ORTHOGONAL.
  3. \`A\` can be orthogonally diagonalized: \`A = Q D Q^T\`, where \`Q\` is orthogonal (\`Q^T = Q^(-1)\`).`
  },
  {
    id: 'note-3',
    title: 'x86-64 Memory Layout, Stack Frames & Calling Conventions',
    courseCode: 'CS240',
    author: 'Systems Lab TAs',
    topic: 'Computer Systems Architecture',
    tags: ['Systems', 'C', 'x86-64', 'Assembly', 'Memory'],
    lastUpdated: '2026-09-22',
    downloadsCount: 44,
    content: `# CS240: x86-64 Architecture & Stack Discipline

### 1. Register Calling Conventions (System V AMD64 ABI)
- **Function Arguments**:
  - 1st: \`%rdi\`
  - 2nd: \`%rsi\`
  - 3rd: \`%rdx\`
  - 4th: \`%rcx\`
  - 5th: \`%r8\`
  - 6th: \`%r9\`
  - Extra arguments: pushed onto stack in reverse order.
- **Return Value**: \`%rax\` (and \`%rdx\` if 128-bit).
- **Callee-Saved Registers** (Must be preserved across calls):
  - \`%rbx\`, \`%rsp\`, \`%rbp\`, \`%r12\`, \`%r13\`, \`%r14\`, \`%r15\`.
- **Caller-Saved Registers** (Can be freely overwritten by callee):
  - All other registers (\`%rax\`, \`%rdi\`, \`%rsi\`, \`%rdx\`, \`%rcx\`, \`%r8-r11\`).`
  }
];

export const INITIAL_EVENTS: CampusEvent[] = [
  {
    id: 'ev-1',
    title: 'Fall University Tech & Engineering Career Fair 2026',
    host: 'University Career Services & IEEE',
    date: '2026-10-06',
    time: '10:00 AM - 4:00 PM',
    location: 'Student Recreational Arena (Main Concourse)',
    category: 'Career Fair',
    isRsvpd: true,
    attendeesCount: 620,
    description: '80+ top tech employers recruiting for Summer 2027 internships and new grad roles (Google, Stripe, Microsoft, Datadog, Figma, NVIDIA, and top startups). Bring 15+ printed resumes.',
    link: 'https://campus.edu/career-fair'
  },
  {
    id: 'ev-2',
    title: 'HackCampus 2026: 48-Hour Fall Hackathon',
    host: 'ACM & Campus Hacker Society',
    date: '2026-10-16',
    time: 'Friday 6:00 PM - Sunday 2:00 PM',
    location: 'Computer Science Building & Innovation Center',
    category: 'Hackathon',
    isRsvpd: true,
    attendeesCount: 340,
    description: '$15,000 in prize tracks across AI Agents, Climate Tech, and Campus Life Tools. Free meals, sponsor swag, API credits, and recruiter speed-dating.',
    link: 'https://hackcampus2026.dev'
  },
  {
    id: 'ev-3',
    title: 'Guest Lecture: Scalable Infrastructure at Discord',
    host: 'Department of Computer Science',
    date: '2026-10-08',
    time: '5:30 PM - 7:00 PM',
    location: 'Turing Hall Auditorium 101',
    category: 'Guest Lecture',
    isRsvpd: false,
    attendeesCount: 110,
    description: 'Principal Engineer Mark Vance discusses scaling real-time voice and message routing to 200M monthly active users using Elixir and Rust.',
    link: 'https://campus.edu/cs-lectures'
  },
  {
    id: 'ev-4',
    title: 'Midterm Midnight Pancake Breakfast & Study Jam',
    host: 'Student Government Association',
    date: '2026-10-03',
    time: '10:00 PM - 1:00 AM',
    location: 'Main University Dining Commons',
    category: 'Social',
    isRsvpd: false,
    attendeesCount: 420,
    description: 'Free freshly flipped pancakes, hot cocoa bar, quiet study zones, and peer tutoring tables right before midterm week kicks off.'
  }
];

export const INITIAL_DAILY_PLAN: DailyPlan = {
  headline: 'High-leverage study sprint: conquer CS201 dynamic programming and attend systems architecture lab.',
  topPriorities: [
    'Complete CS201 Problem Set 4 subproblems (Due in 3 days) during afternoon deep work.',
    'Attend CS240 Systems Lab at 14:00; test ring buffer edge cases under multi-threading.',
    'Review characteristic polynomial eigenvalues for MATH240 Midterm (12 days countdown).'
  ],
  tacticalSchedule: [
    { time: '08:30 - 09:00', activity: 'Morning Fuel & Schedule Review', notes: 'Hydrate, check daily allowance ($24.80 safe spend), pack laptop charger.' },
    { time: '09:00 - 10:30', activity: 'CS201 Lecture: Dynamic Programming', notes: 'Turing Hall 104. Sit front row for DAG topological sorting recap.' },
    { time: '11:00 - 12:30', activity: 'MATH240 Lecture: Matrix Diagonalization', notes: 'Euler Science 210. Take crisp notes on geometric vs algebraic multiplicity.' },
    { time: '12:30 - 13:45', activity: 'Healthy Lunch & Campus Walk', notes: 'Dorm meal prep or Library Cafe ($8 max). Clear mental cache.' },
    { time: '14:00 - 16:00', activity: 'CS240 Systems Lab: Concurrent Buffer', notes: 'Silicon Lab 302. Pair program on POSIX mutex condition variables.' },
    { time: '16:30 - 18:30', activity: 'Deep Work Sprint: Algorithms Problem Set 4', notes: 'Library 3rd floor quiet cubicles. Knock out the topological sort recurrence.' },
    { time: '19:30 - 20:30', activity: 'Career Check-in: Stripe Technical Round Prep', notes: 'Review concurrency concepts and practice 1 mock LeetCode problem.' }
  ],
  examStudyTip: 'For your CS201 Midterm in 4 days, stop passive re-reading. Draw state transitions for 3 classic DP problems on a whiteboard without looking at notes.',
  financialTip: 'You have spent $207 this month of your $1,100 budget. Safe daily spend is $26.50. You are comfortably on track!',
  motivation: 'Excellence in university is not an act of sudden brilliance, but a daily habit of focused, distraction-free execution.',
  generatedAt: 'Today at 08:00 AM'
};
