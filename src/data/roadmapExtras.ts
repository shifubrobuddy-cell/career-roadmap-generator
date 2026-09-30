export interface MilestoneProject {
  title: string;
  deliverable: string;
  instructions: string[];
  sampleRepoOrDemo?: string;
  estimatedTimeHours: number;
}

export interface MilestoneQuizItem {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface MilestoneDetails {
  skillId: number;
  project: MilestoneProject;
  quiz: MilestoneQuizItem[];
  checklist: string[];
  realWorldApplications: string[];
}

export const MILESTONE_EXTRAS: Record<number, MilestoneDetails> = {
  // Web Dev Skills
  101: {
    skillId: 101,
    project: {
      title: 'Accessible Semantic Portfolio Landing Page',
      deliverable: 'A standards-compliant HTML5 page with header, nav, main, sections, articles, accessible contact form with custom validation attributes, and complete OpenGraph meta tags.',
      instructions: [
        'Use semantic HTML elements (<header>, <nav>, <main>, <section>, <article>, <footer>) instead of unsemantic <div>s.',
        'Build a contact form containing email, phone, text fields with required, pattern, and aria-describedby attributes.',
        'Include full accessibility landmarks, alt tags on all imagery, and valid heading hierarchy (h1 through h3).',
      ],
      sampleRepoOrDemo: 'github.com/developer/semantic-html5-starter',
      estimatedTimeHours: 4,
    },
    quiz: [
      {
        question: 'Which element is mandatory inside a <form> to associate a descriptive text label with an <input>?',
        options: ['<span>', '<label for="...">', '<p>', '<caption for="...">'],
        correctIndex: 1,
        explanation: 'The <label for="inputId"> tag programmatically associates a text label with its form input for screen readers and touch targets.',
      },
      {
        question: 'What is the purpose of the `aria-label` attribute?',
        options: [
          'It styles the element in CSS',
          'It provides an invisible, accessible string description for assistive tech when no visual label exists',
          'It connects to a database field',
          'It speeds up JavaScript execution',
        ],
        correctIndex: 1,
        explanation: 'aria-label provides an explicit text label for screen readers when an interactive element does not contain visible text (e.g., icon-only buttons).',
      },
    ],
    checklist: [
      'Mastered HTML5 doctype and head metadata (charset, viewport, title, SEO tags)',
      'Built a valid accessible form with input types (email, tel, url, number, date)',
      'Understood semantic document outline and ARIA landmark roles',
    ],
    realWorldApplications: [
      'Clean SEO-optimized web landing pages',
      'Accessible e-commerce checkout flows',
      'Enterprise compliance with WCAG & Section 508',
    ],
  },
  102: {
    skillId: 102,
    project: {
      title: 'Responsive Bento Dashboard Layout & CSS Theme Engine',
      deliverable: 'A multi-device responsive dashboard featuring CSS Grid bento tiles, Flexbox navigation bars, and CSS Custom Properties for dynamic light/dark theming.',
      instructions: [
        'Construct a 12-column responsive CSS Grid system that adapts to mobile (1 col), tablet (2 col), and desktop (4 col).',
        'Use CSS variables (--bg, --text, --accent) for instant theme transitions.',
        'Implement CSS flex-wrap and gap properties for header actions and status chips.',
      ],
      sampleRepoOrDemo: 'github.com/developer/responsive-css-grid-mastery',
      estimatedTimeHours: 6,
    },
    quiz: [
      {
        question: 'What does `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))` do?',
        options: [
          'Forces a fixed 3-column layout at all screen sizes',
          'Creates a fluid responsive grid where columns automatically wrap when screen width is smaller than 280px without media queries',
          'Breaks the browser layout engine',
          'Only works on mobile devices',
        ],
        correctIndex: 1,
        explanation: 'repeat(auto-fit, minmax(...)) creates an intrinsically responsive grid layout that wraps automatically without manual breakpoints.',
      },
      {
        question: 'In CSS, what is the specificity difference between a class selector `.btn` and an ID selector `#header`?',
        options: [
          'Classes have higher specificity',
          'ID selectors have a specificity of (0,1,0,0) which overrides class selectors (0,0,1,0)',
          'They have identical specificity',
          'Specificity only applies to inline styles',
        ],
        correctIndex: 1,
        explanation: 'ID selectors outweigh class, attribute, and pseudo-class selectors in the CSS cascade hierarchy.',
      },
    ],
    checklist: [
      'Understood Flexbox container vs item properties (flex-grow, flex-shrink, flex-basis)',
      'Constructed complex responsive layouts with CSS Grid template areas',
      'Created smooth CSS transitions, keyframe animations, and custom CSS variables',
    ],
    realWorldApplications: [
      'SaaS Web App Dashboards',
      'High-converting e-commerce product grids',
      'Cross-platform responsive web applications',
    ],
  },
  103: {
    skillId: 103,
    project: {
      title: 'Real-Time Currency & Stock Tracker with Fetch & Web Storage',
      deliverable: 'An interactive browser application that fetches live exchange rates via REST API, renders dynamic charts, handles loading/error states, and saves watchlists to localStorage.',
      instructions: [
        'Implement asynchronous data fetching with `fetch`, `async/await`, and comprehensive `try/catch` error handling.',
        'Manipulate DOM nodes dynamically using modern element creation and template fragments.',
        'Implement debounced search filtering and persist user selections to browser localStorage.',
      ],
      sampleRepoOrDemo: 'github.com/developer/modern-vanilla-js-tracker',
      estimatedTimeHours: 8,
    },
    quiz: [
      {
        question: 'What is a JavaScript closure?',
        options: [
          'A function that closes the browser window',
          'A function combined with its lexical environment, allowing it to access variables from its outer enclosing scope even after the outer function has returned',
          'A syntax error in modern JavaScript',
          'An encrypted JSON object',
        ],
        correctIndex: 1,
        explanation: 'A closure is the combination of a function bundled together with references to its surrounding state (lexical environment).',
      },
      {
        question: 'What is the Event Loop in JavaScript responsible for?',
        options: [
          'Compiling TypeScript into WebAssembly',
          'Monitoring the Call Stack and Task/Microtask Queues to push asynchronous callbacks onto the stack when it is empty',
          'Rendering CSS transitions on the GPU',
          'Encrypting HTTPS packets',
        ],
        correctIndex: 1,
        explanation: 'The Event Loop continuously checks the call stack and dequeues microtasks (Promises) and macrotasks (setTimeout, DOM events) when the stack clears.',
      },
    ],
    checklist: [
      'Mastered ES6+ syntax (destructuring, spread, arrow functions, template literals, modules)',
      'Handled asynchronous operations with Promises, async/await, Promise.all, and error boundaries',
      'Understood DOM events, bubbling, delegation, and event listener cleanup',
    ],
    realWorldApplications: [
      'Dynamic interactive client-side web apps',
      'API-driven real-time analytics widgets',
      'Browser extension development',
    ],
  },
  105: {
    skillId: 105,
    project: {
      title: 'Production Kanban Board with Custom Hooks & State Sync',
      deliverable: 'A modular React 19 application featuring drag-and-drop task columns, custom hooks for localStorage synchronization, modal workflows, and optimized memoized rendering.',
      instructions: [
        'Decompose the UI into reusable atomic components with explicit TypeScript interfaces.',
        'Create custom hooks (useLocalStorage, useDebounce) for decoupled reusable business logic.',
        'Optimize render cycles with useMemo and useCallback where appropriate.',
      ],
      sampleRepoOrDemo: 'github.com/developer/react-kanban-board',
      estimatedTimeHours: 12,
    },
    quiz: [
      {
        question: 'Why should you never mutate state directly in React (e.g. `state.todos.push(newTodo)`)?',
        options: [
          'React relies on shallow reference equality checks; mutating an existing object in place will prevent re-rendering',
          'It will crash the operating system',
          'Direct mutation is allowed in React 19 without penalty',
          'Direct mutation slows down CSS loading',
        ],
        correctIndex: 0,
        explanation: 'React compares previous and next states by reference; direct mutation keeps the same object reference, so React fails to trigger re-renders.',
      },
      {
        question: 'When should you use `useCallback` in React?',
        options: [
          'For every single function in every component',
          'When passing callback functions to memoized child components (React.memo) to prevent unnecessary child re-renders',
          'Only when making HTTP requests',
          'To replace useState completely',
        ],
        correctIndex: 1,
        explanation: 'useCallback caches a function definition between renders, useful when passing callbacks to optimized children relying on reference equality.',
      },
    ],
    checklist: [
      'Mastered component lifecycle, props, state, and unidirectional data flow',
      'Built custom hooks to encapsulate complex stateful business logic',
      'Applied React Context or state management for global application workflows',
    ],
    realWorldApplications: [
      'Modern enterprise web SaaS platforms',
      'Interactive collaboration tools',
      'Single Page Applications (SPAs)',
    ],
  },
};

// Generic fallback generator for skills without custom bespoke details
export function getMilestoneDetails(skill: {
  skill_id: number;
  skill_name: string;
  description: string;
  stage_label: string;
  difficulty: string;
  estimated_hours: number;
  key_topics: string[];
}): MilestoneDetails {
  if (MILESTONE_EXTRAS[skill.skill_id]) {
    return MILESTONE_EXTRAS[skill.skill_id];
  }

  return {
    skillId: skill.skill_id,
    project: {
      title: `Hands-On Lab: Master ${skill.skill_name}`,
      deliverable: `Build a production-grade mini application demonstrating deep mastery of ${skill.skill_name} and its key architecture patterns.`,
      instructions: [
        `Review the core documentation and best practice guidelines for ${skill.skill_name}.`,
        `Implement a functional proof-of-concept integrating: ${skill.key_topics.join(', ')}.`,
        'Verify test cases, edge condition handling, and document architectural decisions in a README.',
      ],
      estimatedTimeHours: Math.max(4, Math.round(skill.estimated_hours * 0.25)),
    },
    quiz: [
      {
        question: `What is the primary architectural goal of learning ${skill.skill_name}?`,
        options: [
          `To build scalable, maintainable, and industry-standard solutions leveraging ${skill.key_topics[0] || 'core concepts'}`,
          'To add unnecessary complexity to the codebase',
          'To bypass security validation protocols',
          'To write unmaintainable legacy code',
        ],
        correctIndex: 0,
        explanation: `Mastering ${skill.skill_name} empowers engineers to build reliable, high-performance systems aligned with industry standards.`,
      },
      {
        question: `Which topic is central to practical mastery of ${skill.skill_name}?`,
        options: [
          skill.key_topics[1] || 'Core Architecture Principles',
          'Random deprecated functions',
          'Unverified trial-and-error scripts',
          'Hardcoded global static variables',
        ],
        correctIndex: 0,
        explanation: `${skill.key_topics[1] || 'This core skill'} forms a foundational pillar for modern engineering workflows.`,
      },
    ],
    checklist: [
      `Understood foundational theory and specifications for ${skill.skill_name}`,
      `Practiced core implementation patterns: ${skill.key_topics.slice(0, 2).join(', ')}`,
      `Completed hands-on practical exercises and resolved edge cases`,
    ],
    realWorldApplications: [
      'Production application development',
      'Technical interview problem solving & systems architecture',
      'Team codebase maintenance & optimization',
    ],
  };
}
