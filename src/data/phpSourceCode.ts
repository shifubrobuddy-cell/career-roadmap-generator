export interface PhpFile {
  path: string;
  name: string;
  category: 'database' | 'config' | 'includes' | 'pages' | 'api' | 'assets';
  description: string;
  content: string;
}

export const PHP_PROJECT_FILES: PhpFile[] = [
  {
    path: 'database.sql',
    name: 'database.sql',
    category: 'database',
    description: 'Complete MySQL 8.0 Schema and Seed Data for all 5 Career Tracks',
    content: `-- ==========================================================
-- Career Roadmap Generator: Personalized Skill Path Platform
-- Academic Mini-Project Database Schema & Seed Data (MySQL 8.0)
-- Engine: InnoDB | Charset: utf8mb4 | Collation: utf8mb4_unicode_ci
-- ==========================================================

CREATE DATABASE IF NOT EXISTS \`career_roadmap_db\`
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE \`career_roadmap_db\`;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Careers Table
CREATE TABLE IF NOT EXISTS careers (
    career_id INT AUTO_INCREMENT PRIMARY KEY,
    career_name VARCHAR(100) NOT NULL,
    career_slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon_key VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Skill Paths Table
CREATE TABLE IF NOT EXISTS skill_paths (
    skill_id INT AUTO_INCREMENT PRIMARY KEY,
    career_id INT NOT NULL,
    step_order INT NOT NULL,
    stage_label VARCHAR(50), -- Fundamentals / Intermediate / Advanced
    skill_name VARCHAR(150) NOT NULL,
    description TEXT,
    resource_link VARCHAR(255),
    FOREIGN KEY (career_id) REFERENCES careers(career_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. User Skills Assessment Table
CREATE TABLE IF NOT EXISTS user_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    career_id INT NOT NULL,
    skill_id INT NOT NULL,
    already_known BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (career_id) REFERENCES careers(career_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skill_paths(skill_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_skill (user_id, career_id, skill_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. User Progress Tracking Table
CREATE TABLE IF NOT EXISTS user_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    career_id INT NOT NULL,
    skill_id INT NOT NULL,
    status ENUM('not_started','in_progress','completed') DEFAULT 'not_started',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (career_id) REFERENCES careers(career_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skill_paths(skill_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_progress (user_id, career_id, skill_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================================
-- SEED DATA: 5 Careers
-- ==========================================================
INSERT INTO careers (career_id, career_name, career_slug, description, icon_key) VALUES
(1, 'Web Developer', 'web-developer', 'Build modern responsive web applications, robust REST APIs, and full-stack cloud software.', 'globe'),
(2, 'Data Analyst', 'data-analyst', 'Transform raw data into business intelligence, statistical insights, and executive interactive dashboards.', 'bar-chart'),
(3, 'UI/UX Designer', 'ui-ux-designer', 'Design intuitive digital experiences, conduct user research, craft Figma design systems, and prototype flows.', 'palette'),
(4, 'Android App Developer', 'android-developer', 'Engineer native Android mobile apps using Kotlin, Jetpack Compose, Room database, and clean architecture.', 'smartphone'),
(5, 'Digital Marketing Specialist', 'digital-marketing', 'Drive customer acquisition, SEO optimization, high-converting ad campaigns, and automated growth funnels.', 'trending-up')
ON DUPLICATE KEY UPDATE career_name = VALUES(career_name);

-- ==========================================================
-- SEED DATA: Skills for Career 1 (Web Developer)
-- ==========================================================
INSERT INTO skill_paths (skill_id, career_id, step_order, stage_label, skill_name, description, resource_link) VALUES
(101, 1, 1, 'Fundamentals', 'HTML5 & Semantic Markup', 'Master document structure, accessibility (ARIA), forms, and SEO meta tags.', 'https://developer.mozilla.org/en-US/docs/Learn/HTML'),
(102, 1, 2, 'Fundamentals', 'CSS3, Flexbox & Grid Systems', 'Build fully responsive mobile-first layouts, custom properties, and transitions.', 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/'),
(103, 1, 3, 'Fundamentals', 'JavaScript Core & DOM Manipulation', 'Master ES6+ syntax, scope, closures, event listeners, promises, and fetch API.', 'https://javascript.info/'),
(104, 1, 4, 'Fundamentals', 'Git & GitHub Version Control', 'Learn branching, pull requests, merge conflict resolution, and teamwork.', 'https://git-scm.com/book/en/v2'),
(105, 1, 5, 'Intermediate', 'React.js & Component Architecture', 'Build single-page apps using React components, hooks, and virtual DOM patterns.', 'https://react.dev/learn'),
(106, 1, 6, 'Intermediate', 'Node.js & Express RESTful APIs', 'Create server-side HTTP microservices, route handling, and middleware pipelines.', 'https://expressjs.com/en/starter/installing.html'),
(107, 1, 7, 'Intermediate', 'Relational Databases (MySQL / PostgreSQL)', 'Design normalized schemas, parameterized SQL queries, indexing, and joins.', 'https://www.mysqltutorial.org/'),
(108, 1, 8, 'Intermediate', 'Authentication, JWT & Web Security', 'Implement secure user auth, bcrypt password hashing, and OWASP defense.', 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html'),
(109, 1, 9, 'Advanced', 'TypeScript & Type-Safe Engineering', 'Strengthen codebases with interfaces, generics, and strict static typing.', 'https://www.typescriptlang.org/docs/'),
(110, 1, 10, 'Advanced', 'Full-Stack Performance & Core Web Vitals', 'Optimize bundle size, code splitting, lazy loading, and database caching.', 'https://web.dev/learn/performance'),
(111, 1, 11, 'Advanced', 'Docker, CI/CD & Cloud Deployment', 'Containerize apps, configure GitHub Actions pipelines, and deploy to cloud.', 'https://docs.docker.com/get-started/'),
(112, 1, 12, 'Advanced', 'System Design & Scalable Architecture', 'Design distributed systems, load balancing, caching layers, and rate limiters.', 'https://github.com/donnemartin/system-design-primer')
ON DUPLICATE KEY UPDATE skill_name = VALUES(skill_name);

-- ==========================================================
-- SEED DATA: Skills for Career 2 (Data Analyst)
-- ==========================================================
INSERT INTO skill_paths (skill_id, career_id, step_order, stage_label, skill_name, description, resource_link) VALUES
(201, 2, 1, 'Fundamentals', 'Advanced Excel & Google Sheets Analytics', 'Master XLOOKUP, INDEX/MATCH, Pivot Tables, and dynamic data cleansing.', 'https://support.microsoft.com/en-us/excel'),
(202, 2, 2, 'Fundamentals', 'SQL Querying & Relational Databases', 'Write complex SELECT queries, WHERE filters, GROUP BY aggregations, and JOINs.', 'https://mode.com/sql-tutorial/'),
(203, 2, 3, 'Fundamentals', 'Descriptive Statistics & Probability', 'Understand mean, variance, normal distribution, z-scores, and probability.', 'https://www.khanacademy.org/math/statistics-probability'),
(204, 2, 4, 'Fundamentals', 'Python Foundations for Data Analysis', 'Learn Python data structures, list comprehensions, functions, and file I/O.', 'https://www.learnpython.org/'),
(205, 2, 5, 'Intermediate', 'Data Manipulation with Pandas & NumPy', 'Master DataFrames, missing value handling, group-by logic, and vectorization.', 'https://pandas.pydata.org/docs/getting_started/index.html'),
(206, 2, 6, 'Intermediate', 'Data Cleaning & Wrangling Pipelines', 'Detect anomalies, type conversions, regex parsing, and pipeline scripts.', 'https://www.kaggle.com/learn/data-cleaning'),
(207, 2, 7, 'Intermediate', 'Data Visualization (Matplotlib, Seaborn)', 'Design heatmaps, box plots, scatter distributions, and informative charts.', 'https://seaborn.pydata.org/tutorial.html'),
(208, 2, 8, 'Intermediate', 'BI Dashboards with Power BI & Tableau', 'Build DAX measures, interactive drill-downs, and executive KPI dashboards.', 'https://learn.microsoft.com/en-us/training/powerplatform/power-bi'),
(209, 2, 9, 'Advanced', 'Inferential Statistics & A/B Testing', 'Hypothesis testing, p-values, t-tests, ANOVA, and experiment design.', 'https://towardsdatascience.com/a-b-testing-a-complete-guide-to-statistical-testing-e3f1db140499'),
(210, 2, 10, 'Advanced', 'Exploratory Data Analysis & ML Basics', 'Perform thorough EDA, fit baseline Linear/Logistic regressions, and evaluate.', 'https://scikit-learn.org/stable/tutorial/basic/tutorial.html'),
(211, 2, 11, 'Advanced', 'Data Storytelling & Executive Presentation', 'Translate complex data metrics into strategic business narratives for leadership.', 'https://www.storytellingwithdata.com/blog')
ON DUPLICATE KEY UPDATE skill_name = VALUES(skill_name);

-- ==========================================================
-- SEED DATA: Skills for Career 3 (UI/UX Designer)
-- ==========================================================
INSERT INTO skill_paths (skill_id, career_id, step_order, stage_label, skill_name, description, resource_link) VALUES
(301, 3, 1, 'Fundamentals', 'UX Fundamentals & Design Thinking', 'Learn Empathize, Define, Ideate, Prototype, and Test design framework.', 'https://www.nngroup.com/articles/design-thinking/'),
(302, 3, 2, 'Fundamentals', 'User Research & Personas', 'Conduct user interviews, synthesize empathy maps, and create user personas.', 'https://www.interaction-design.org/literature/topics/user-research'),
(303, 3, 3, 'Fundamentals', 'Information Architecture & User Flows', 'Organize site maps, hierarchical taxonomy, and wireflow diagrams.', 'https://uxplanet.org/information-architecture-basics-for-designers-b5d43df62e11'),
(304, 3, 4, 'Fundamentals', 'Low-Fidelity Wireframing & Sketching', 'Rapidly ideate layout compositions to validate functional concepts early.', 'https://balsamiq.com/learn/articles/wireframing-starter-kit/'),
(305, 3, 5, 'Intermediate', 'Figma Mastery: Auto Layout & Components', 'Master Auto Layout 5.0, component variants, properties, and prototypes.', 'https://help.figma.com/hc/en-us/categories/360002051613-Figma-design'),
(306, 3, 6, 'Intermediate', 'Visual Design, Typography & Color Theory', 'Master mathematical type scales, 8pt grids, elevation, and UI hierarchy.', 'https://www.refactoringui.com/'),
(307, 3, 7, 'Intermediate', 'Design Systems & Component Libraries', 'Architect scalable design tokens, atomic design hierarchy, and state matrixes.', 'https://designsystemsrepo.com/'),
(308, 3, 8, 'Intermediate', 'Usability Testing & Heuristic Evaluation', 'Evaluate interfaces using Nielsen\\'s 10 Usability Heuristics and test sessions.', 'https://www.nngroup.com/articles/ten-usability-heuristics/'),
(309, 3, 9, 'Advanced', 'Accessibility & Inclusive Design (WCAG 2.2)', 'Design compliant interfaces meeting WCAG AA contrast and keyboard navigation.', 'https://www.w3.org/WAI/standards-guidelines/wcag/'),
(310, 3, 10, 'Advanced', 'Micro-Interactions & Motion Design', 'Design purposeful UI motion, choreography, easing curves, and Lottie animations.', 'https://m3.material.io/styles/motion/overview'),
(311, 3, 11, 'Advanced', 'Developer Handoff & Design-to-Code Specs', 'Prepare production-ready Figma redlines, design tokens, and edge cases.', 'https://help.figma.com/hc/en-us/articles/15023124644247-Guide-to-Dev-Mode-in-Figma'),
(312, 3, 12, 'Advanced', 'Portfolio Case Study Formulation', 'Structure comprehensive design case studies documenting context and ROI.', 'https://www.case-study.club/')
ON DUPLICATE KEY UPDATE skill_name = VALUES(skill_name);

-- ==========================================================
-- SEED DATA: Skills for Career 4 (Android App Developer)
-- ==========================================================
INSERT INTO skill_paths (skill_id, career_id, step_order, stage_label, skill_name, description, resource_link) VALUES
(401, 4, 1, 'Fundamentals', 'Kotlin Programming Fundamentals', 'Master Kotlin syntax, null safety, data classes, extension functions, and lambdas.', 'https://kotlinlang.org/docs/home.html'),
(402, 4, 2, 'Fundamentals', 'Android Studio & Project Architecture', 'Learn Gradle build scripts, AndroidManifest.xml, app resources, and Logcat.', 'https://developer.android.com/studio/intro'),
(403, 4, 3, 'Fundamentals', 'Activity & Fragment Lifecycle', 'Understand onCreate, onResume, configuration changes, and SavedStateHandle.', 'https://developer.android.com/guide/components/activities/activity-lifecycle'),
(404, 4, 4, 'Fundamentals', 'Modern UI with Jetpack Compose', 'Build declarative UIs using Composable functions, State hoisting, and LazyColumn.', 'https://developer.android.com/develop/ui/compose/tutorial'),
(405, 4, 5, 'Intermediate', 'Material Design 3 & Dynamic Theming', 'Apply Material 3 color palettes, typography scales, and dark theme support.', 'https://m3.material.io/develop/android/jetpack-compose'),
(406, 4, 6, 'Intermediate', 'ViewModel, LiveData & StateFlow', 'Implement MVVM architecture, StateFlow streams, and lifecycle survival.', 'https://developer.android.com/topic/libraries/architecture/viewmodel'),
(407, 4, 7, 'Intermediate', 'Room Database & Offline Persistence', 'Create SQLite entities, DAO queries with Flow, and repository pattern sync.', 'https://developer.android.com/training/data-storage/room'),
(408, 4, 8, 'Intermediate', 'Kotlin Coroutines & Asynchronous Flow', 'Manage background threads safely with CoroutineScope and Dispatchers.IO.', 'https://developer.android.com/kotlin/coroutines'),
(409, 4, 9, 'Advanced', 'Networking with Retrofit & OkHttp', 'Consume REST APIs, JSON serialization, and OkHttp interceptors.', 'https://square.github.io/retrofit/'),
(410, 4, 10, 'Advanced', 'Dependency Injection with Hilt', 'Inject ViewModels, repositories, and network clients using Hilt annotations.', 'https://developer.android.com/training/dependency-injection/hilt-android'),
(411, 4, 11, 'Advanced', 'WorkManager & Background Execution', 'Schedule guaranteed background syncs and push notification handlers.', 'https://developer.android.com/topic/libraries/architecture/workmanager'),
(412, 4, 12, 'Advanced', 'Unit Testing, ProGuard & Play Store Release', 'Write JUnit tests, configure ProGuard rules, build App Bundles, and deploy.', 'https://developer.android.com/studio/publish')
ON DUPLICATE KEY UPDATE skill_name = VALUES(skill_name);

-- ==========================================================
-- SEED DATA: Skills for Career 5 (Digital Marketing Specialist)
-- ==========================================================
INSERT INTO skill_paths (skill_id, career_id, step_order, stage_label, skill_name, description, resource_link) VALUES
(501, 5, 1, 'Fundamentals', 'Marketing Fundamentals & Customer Funnels', 'Understand the marketing flywheel, AIDA funnel, buyer personas, and CAC/LTV.', 'https://academy.hubspot.com/courses/inbound-marketing'),
(502, 5, 2, 'Fundamentals', 'Content Marketing & High-Converting Copywriting', 'Master copywriting frameworks (PAS, AIDA), storytelling, and content calendars.', 'https://copyblogger.com/copywriting-101/'),
(503, 5, 3, 'Fundamentals', 'Search Engine Optimization (SEO) Foundations', 'Conduct keyword intent research, on-page optimization, and meta descriptions.', 'https://moz.com/beginners-guide-to-seo'),
(504, 5, 4, 'Fundamentals', 'Social Media Strategy & Community Management', 'Develop channel-specific growth strategies and organic engagement flywheels.', 'https://blog.hootsuite.com/social-media-strategy-template/'),
(505, 5, 5, 'Intermediate', 'Technical SEO, Site Audits & Schema Markup', 'Diagnose crawl errors, XML sitemaps, robots.txt, and JSON-LD structured data.', 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide'),
(506, 5, 6, 'Intermediate', 'Google Analytics 4 (GA4) Mastery', 'Configure event-driven tracking, custom conversion events, and funnels.', 'https://skillshop.exceedlms.com/student/path/1833-google-analytics-individual-qualification'),
(507, 5, 7, 'Intermediate', 'Google Tag Manager (GTM) Implementation', 'Implement tags, triggers, variables, and dataLayer events without code.', 'https://www.analyticsmania.com/post/google-tag-manager-for-beginners/'),
(508, 5, 8, 'Intermediate', 'Search Engine Marketing (Google Ads & PPC)', 'Build Google Search and Display campaigns, bid strategies, and negative keywords.', 'https://skillshop.exceedlms.com/student/path/18128-google-ads-search-certification'),
(509, 5, 9, 'Advanced', 'Paid Social Ads (Meta Ads Manager & TikTok)', 'Target custom & lookalike audiences, manage Meta CAPI, and optimize ROAS.', 'https://www.facebook.com/business/learn'),
(510, 5, 10, 'Advanced', 'Email Marketing & Marketing Automation', 'Design automated onboarding sequences, cart recovery, and list hygiene.', 'https://mailchimp.com/resources/email-marketing-field-guide/'),
(511, 5, 11, 'Advanced', 'Conversion Rate Optimization (CRO)', 'Conduct heatmapping, form friction audits, and multivariate landing page tests.', 'https://cxl.com/blog/cro-guide/'),
(512, 5, 12, 'Advanced', 'Marketing Analytics & ROI Reporting', 'Build executive dashboards in Looker Studio, blended CAC/MER, and forecasts.', 'https://lookerstudio.google.com/overview')
ON DUPLICATE KEY UPDATE skill_name = VALUES(skill_name);
`,
  },
  {
    path: 'config/db.php',
    name: 'db.php',
    category: 'config',
    description: 'PDO Database Connection with Prepared Statements and Error Handling',
    content: `<?php
/**
 * Database Connection Handler
 * Career Roadmap Generator - BCA Mini-Project
 * Uses PHP Data Objects (PDO) with prepared statement enforcement
 */

declare(strict_types=1);

define('DB_HOST', 'localhost');
define('DB_NAME', 'career_roadmap_db');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

/**
 * Establishes and returns a singleton-style PDO connection
 * @return PDO
 */
function get_db_connection(): PDO {
    static $pdo = null;

    if ($pdo === null) {
        $dsn = sprintf('mysql:host=%s;dbname=%s;charset=%s', DB_HOST, DB_NAME, DB_CHARSET);
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false, // Enforce real prepared statements
        ];

        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            // Log error in production, show clean error message in academic demo
            error_log('Database Connection Error: ' . $e->getMessage());
            die('Database connection failure. Please verify MySQL is running in XAMPP.');
        }
    }

    return $pdo;
}

/**
 * Escapes HTML output safely
 * @param mixed $value
 * @return string
 */
function e($value): string {
    return htmlspecialchars((string)$value, ENT_QUOTES, 'UTF-8');
}
`,
  },
  {
    path: 'includes/header.php',
    name: 'header.php',
    category: 'includes',
    description: 'Shared HTML5 Semantic Header, CSS links, and Meta Tags',
    content: `<?php
/**
 * Shared Application Header Component
 */
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
$is_logged_in = isset($_SESSION['user_id']);
$current_page = basename($_SERVER['PHP_SELF'], '.php');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= isset($page_title) ? e($page_title) . ' | ' : '' ?>Career Roadmap Generator</title>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <!-- Chart.js CDN -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
    <!-- Custom CSS -->
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <header class="site-header">
        <div class="header-container">
            <a href="dashboard.php" class="brand-logo">
                <span class="logo-icon">🚀</span>
                <span class="brand-name">CareerPath<span class="brand-highlight">.ai</span></span>
            </a>

            <?php if ($is_logged_in): ?>
            <nav class="main-nav">
                <a href="dashboard.php" class="nav-link <?= $current_page === 'dashboard' ? 'active' : '' ?>">Dashboard</a>
                <a href="assessment.php" class="nav-link <?= $current_page === 'assessment' ? 'active' : '' ?>">Skill Assessment</a>
                <a href="roadmap.php" class="nav-link <?= $current_page === 'roadmap' ? 'active' : '' ?>">My Roadmap</a>
                <a href="profile.php" class="nav-link <?= $current_page === 'profile' ? 'active' : '' ?>">Profile & Export</a>
            </nav>

            <div class="user-menu">
                <span class="user-greeting">Hi, <strong><?= e($_SESSION['username'] ?? 'Student') ?></strong></span>
                <a href="logout.php" class="btn btn-secondary btn-sm">Logout</a>
            </div>
            <?php else: ?>
            <div class="auth-actions">
                <a href="login.php" class="btn btn-secondary btn-sm">Sign In</a>
                <a href="register.php" class="btn btn-primary btn-sm">Get Started</a>
            </div>
            <?php endif; ?>
        </div>
    </header>
    <main class="main-content">
`,
  },
  {
    path: 'includes/footer.php',
    name: 'footer.php',
    category: 'includes',
    description: 'Shared Footer and Toast Container',
    content: `    </main>
    <footer class="site-footer">
        <div class="footer-container">
            <p>&copy; <?= date('Y') ?> Career Roadmap Generator &bull; BCA Final Mini-Project &bull; Built with PHP, MySQL & Vanilla JS</p>
        </div>
    </footer>
    <!-- Toast Notifications Root -->
    <div id="toast-container" class="toast-container"></div>
    <script src="assets/js/main.js"></script>
</body>
</html>
`,
  },
  {
    path: 'register.php',
    name: 'register.php',
    category: 'pages',
    description: 'Module 1: User Registration with Client & Server Validation',
    content: `<?php
/**
 * Module 1: User Registration Page
 */
require_once __DIR__ . '/config/db.php';
session_start();

if (isset($_SESSION['user_id'])) {
    header('Location: dashboard.php');
    exit;
}

$errors = [];
$username = '';
$email = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim(filter_input(INPUT_POST, 'username', FILTER_DEFAULT) ?? '');
    $email = trim(filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL) ?? '');
    $password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';

    // Server-side validations
    if (empty($username) || strlen($username) < 3 || strlen($username) > 50) {
        $errors[] = 'Username must be between 3 and 50 characters.';
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Please provide a valid email address.';
    }
    if (strlen($password) < 8) {
        $errors[] = 'Password must be at least 8 characters long.';
    }
    if ($password !== $confirm_password) {
        $errors[] = 'Passwords do not match.';
    }

    if (empty($errors)) {
        $pdo = get_db_connection();
        
        // Check for existing user
        $stmt = $pdo->prepare('SELECT user_id FROM users WHERE username = :u OR email = :e LIMIT 1');
        $stmt->execute([':u' => $username, ':e' => $email]);
        if ($stmt->fetch()) {
            $errors[] = 'A user with that username or email already exists.';
        } else {
            // Hash password securely with BCRYPT
            $password_hash = password_hash($password, PASSWORD_BCRYPT);
            $insert = $pdo->prepare('INSERT INTO users (username, email, password_hash) VALUES (:u, :e, :p)');
            $insert->execute([
                ':u' => $username,
                ':e' => $email,
                ':p' => $password_hash
            ]);

            $new_user_id = (int)$pdo->lastInsertId();
            $_SESSION['user_id'] = $new_user_id;
            $_SESSION['username'] = $username;

            header('Location: assessment.php');
            exit;
        }
    }
}

$page_title = 'Create an Account';
require_once __DIR__ . '/includes/header.php';
?>

<section class="auth-split-wrapper">
    <div class="auth-card">
        <div class="auth-card-hero">
            <h2>Accelerate Your Tech Career</h2>
            <p>Generate intelligent skill roadmaps, track learning progress, and access curated resources for high-demand tech careers.</p>
            <ul class="feature-bullets">
                <li>✨ Tailored paths based on what you already know</li>
                <li>📊 Real-time completion analytics & charts</li>
                <li>🎯 Curated links to free, high-yield resources</li>
            </ul>
        </div>
        <div class="auth-card-form">
            <h1 class="auth-title">Create Account</h1>
            <p class="auth-subtitle">Join aspiring developers & designers</p>

            <?php if (!empty($errors)): ?>
                <div class="alert alert-error">
                    <?php foreach ($errors as $error): ?>
                        <p><?= e($error) ?></p>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>

            <form action="register.php" method="POST" id="registerForm" novalidate>
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" class="form-control" value="<?= e($username) ?>" required minlength="3">
                </div>
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" name="email" class="form-control" value="<?= e($email) ?>" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" class="form-control" required minlength="8" placeholder="At least 8 characters">
                </div>
                <div class="form-group">
                    <label for="confirm_password">Confirm Password</label>
                    <input type="password" id="confirm_password" name="confirm_password" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary btn-block">Sign Up & Start Assessment</button>
            </form>
            <p class="auth-switch">Already have an account? <a href="login.php">Sign In</a></p>
        </div>
    </div>
</section>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
`,
  },
  {
    path: 'login.php',
    name: 'login.php',
    category: 'pages',
    description: 'Module 1: User Login with Secure Password Verification',
    content: `<?php
/**
 * Module 1: User Login Page
 */
require_once __DIR__ . '/config/db.php';
session_start();

if (isset($_SESSION['user_id'])) {
    header('Location: dashboard.php');
    exit;
}

$error = '';
$username_or_email = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username_or_email = trim($_POST['username_or_email'] ?? '');
    $password = $_POST['password'] ?? '';

    if (empty($username_or_email) || empty($password)) {
        $error = 'Please enter both your credentials.';
    } else {
        $pdo = get_db_connection();
        $stmt = $pdo->prepare('SELECT user_id, username, password_hash FROM users WHERE username = :ident OR email = :ident LIMIT 1');
        $stmt->execute([':ident' => $username_or_email]);
        $user = $stmt->fetch();

        // Generic error message for security
        if ($user && password_verify($password, $user['password_hash'])) {
            $_SESSION['user_id'] = (int)$user['user_id'];
            $_SESSION['username'] = $user['username'];
            header('Location: dashboard.php');
            exit;
        } else {
            $error = 'Invalid username/email or password.';
        }
    }
}

$page_title = 'Sign In';
require_once __DIR__ . '/includes/header.php';
?>

<section class="auth-split-wrapper">
    <div class="auth-card auth-card-single">
        <h1 class="auth-title">Welcome Back</h1>
        <p class="auth-subtitle">Sign in to access your customized roadmaps</p>

        <?php if ($error): ?>
            <div class="alert alert-error"><?= e($error) ?></div>
        <?php endif; ?>

        <form action="login.php" method="POST" id="loginForm">
            <div class="form-group">
                <label for="username_or_email">Username or Email</label>
                <input type="text" id="username_or_email" name="username_or_email" class="form-control" value="<?= e($username_or_email) ?>" required autofocus>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" class="form-control" required>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Sign In</button>
        </form>
        <p class="auth-switch">Don't have an account? <a href="register.php">Create an account</a></p>
    </div>
</section>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
`,
  },
  {
    path: 'assessment.php',
    name: 'assessment.php',
    category: 'pages',
    description: 'Module 2: Career & Skill Assessment Multi-Step Workflow',
    content: `<?php
/**
 * Module 2: Career & Skill Assessment Page
 */
require_once __DIR__ . '/config/db.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}

$pdo = get_db_connection();
$user_id = (int)$_SESSION['user_id'];

// Handle assessment form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'save_assessment') {
    $career_id = (int)($_POST['career_id'] ?? 0);
    $known_skills = isset($_POST['known_skills']) && is_array($_POST['known_skills']) ? array_map('intval', $_POST['known_skills']) : [];

    if ($career_id > 0) {
        // Fetch all valid skills for this career
        $stmt = $pdo->prepare('SELECT skill_id FROM skill_paths WHERE career_id = :cid ORDER BY step_order ASC');
        $stmt->execute([':cid' => $career_id]);
        $all_career_skills = $stmt->fetchAll(PDO::FETCH_COLUMN);

        if (!empty($all_career_skills)) {
            $pdo->beginTransaction();
            try {
                // Clear prior records for this career/user
                $delSkills = $pdo->prepare('DELETE FROM user_skills WHERE user_id = :uid AND career_id = :cid');
                $delSkills->execute([':uid' => $user_id, ':cid' => $career_id]);

                $delProg = $pdo->prepare('DELETE FROM user_progress WHERE user_id = :uid AND career_id = :cid');
                $delProg->execute([':uid' => $user_id, ':cid' => $career_id]);

                $insertSkill = $pdo->prepare('INSERT INTO user_skills (user_id, career_id, skill_id, already_known) VALUES (:uid, :cid, :sid, :ak)');
                $insertProg = $pdo->prepare('INSERT INTO user_progress (user_id, career_id, skill_id, status) VALUES (:uid, :cid, :sid, :status)');

                foreach ($all_career_skills as $sid) {
                    $is_known = in_array($sid, $known_skills, true);
                    $insertSkill->execute([
                        ':uid' => $user_id,
                        ':cid' => $career_id,
                        ':sid' => $sid,
                        ':ak'  => $is_known ? 1 : 0
                    ]);

                    $status = $is_known ? 'completed' : 'not_started';
                    $insertProg->execute([
                        ':uid' => $user_id,
                        ':cid' => $career_id,
                        ':sid' => $sid,
                        ':status' => $status
                    ]);
                }

                $pdo->commit();
                $_SESSION['active_career_id'] = $career_id;
                header('Location: roadmap.php?career_id=' . $career_id);
                exit;
            } catch (Exception $e) {
                $pdo->rollBack();
                $error = 'Failed to generate roadmap. Please try again.';
            }
        }
    }
}

// Fetch all careers
$stmt = $pdo->query('SELECT * FROM careers ORDER BY career_id ASC');
$careers = $stmt->fetchAll();

// Fetch all skills grouped by career
$stmt = $pdo->query('SELECT * FROM skill_paths ORDER BY career_id ASC, step_order ASC');
$raw_skills = $stmt->fetchAll();
$skills_by_career = [];
foreach ($raw_skills as $s) {
    $skills_by_career[$s['career_id']][] = $s;
}

$page_title = 'Career & Skill Assessment';
require_once __DIR__ . '/includes/header.php';
?>

<div class="assessment-container">
    <div class="stepper-header">
        <div class="step-indicator active" id="stepIndicator1">
            <span class="step-num">1</span>
            <span class="step-label">Select Career Track</span>
        </div>
        <div class="step-line"></div>
        <div class="step-indicator" id="stepIndicator2">
            <span class="step-num">2</span>
            <span class="step-label">Assess Current Skills</span>
        </div>
    </div>

    <form action="assessment.php" method="POST" id="assessmentForm">
        <input type="hidden" name="action" value="save_assessment">
        <input type="hidden" name="career_id" id="selectedCareerId" value="">

        <!-- Step 1: Career Track Selection -->
        <section id="step1View" class="step-view active">
            <h1 class="page-title">What is your dream career?</h1>
            <p class="page-subtitle">Pick a track to get a personalized, structured learning roadmap.</p>

            <div class="career-cards-grid">
                <?php foreach ($careers as $c): ?>
                    <article class="career-card" data-career-id="<?= e($c['career_id']) ?>" tabindex="0">
                        <div class="career-icon-wrapper">
                            <span class="career-icon">🎯</span>
                        </div>
                        <h3 class="career-card-title"><?= e($c['career_name']) ?></h3>
                        <p class="career-card-desc"><?= e($c['description']) ?></p>
                        <div class="career-card-meta">
                            <span class="badge"><?= count($skills_by_career[$c['career_id']] ?? []) ?> Curated Skills</span>
                            <span class="select-cta">Select &rarr;</span>
                        </div>
                    </article>
                <?php endforeach; ?>
            </div>
        </section>

        <!-- Step 2: Skill Checklist Grouped by Stage -->
        <section id="step2View" class="step-view">
            <div class="step-nav-bar">
                <button type="button" class="btn btn-secondary btn-sm" id="btnBackToStep1">&larr; Change Career</button>
                <div class="selected-career-banner">
                    Target Career: <strong id="selectedCareerNameDisplay"></strong>
                </div>
            </div>

            <h2 class="section-title">Check off what you already know</h2>
            <p class="page-subtitle">We will bypass known skills and point you directly to what to learn next.</p>

            <div id="skillsChecklistContainer" class="skills-checklist-container">
                <!-- Dynamically populated via JS using data attributes -->
            </div>

            <div class="sticky-footer-bar">
                <div class="selected-count-text">
                    <span id="checkedSkillsCount">0</span> skills marked as already known
                </div>
                <button type="submit" class="btn btn-primary btn-lg" id="btnGenerateRoadmap">
                    Generate My Roadmap &rarr;
                </button>
            </div>
        </section>
    </form>
</div>

<script>
window.CAREER_SKILLS_DATA = <?= json_encode($skills_by_career) ?>;
window.CAREERS_DATA = <?= json_encode($careers) ?>;
</script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
`,
  },
  {
    path: 'dashboard.php',
    name: 'dashboard.php',
    category: 'pages',
    description: 'Module 3: Student Dashboard with Chart.js Donut & Multi-Career Cards',
    content: `<?php
/**
 * Module 3: User Dashboard Page
 */
require_once __DIR__ . '/config/db.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}

$pdo = get_db_connection();
$user_id = (int)$_SESSION['user_id'];

// Fetch distinct careers the user has assessed
$query = "
    SELECT 
        c.career_id,
        c.career_name,
        c.career_slug,
        c.description,
        COUNT(sp.skill_id) AS total_skills,
        SUM(CASE WHEN up.status = 'completed' THEN 1 ELSE 0 END) AS completed_skills,
        SUM(CASE WHEN up.status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress_skills,
        MAX(up.updated_at) AS last_activity
    FROM user_skills us
    JOIN careers c ON us.career_id = c.career_id
    JOIN skill_paths sp ON c.career_id = sp.career_id
    LEFT JOIN user_progress up ON (us.user_id = up.user_id AND us.career_id = up.career_id AND sp.skill_id = up.skill_id)
    WHERE us.user_id = :uid
    GROUP BY c.career_id, c.career_name, c.career_slug, c.description
    ORDER BY last_activity DESC
";
$stmt = $pdo->prepare($query);
$stmt->execute([':uid' => $user_id]);
$tracked_careers = $stmt->fetchAll();

// For each career, find the next recommended skill
foreach ($tracked_careers as &$tc) {
    $nextStmt = $pdo->prepare("
        SELECT sp.skill_name, sp.stage_label, sp.step_order 
        FROM skill_paths sp
        LEFT JOIN user_progress up ON (up.user_id = :uid AND up.skill_id = sp.skill_id AND up.career_id = :cid)
        WHERE sp.career_id = :cid AND (up.status IS NULL OR up.status != 'completed')
        ORDER BY sp.step_order ASC
        LIMIT 1
    ");
    $nextStmt->execute([':uid' => $user_id, ':cid' => $tc['career_id']]);
    $tc['next_skill'] = $nextStmt->fetch();
    
    $total = (int)$tc['total_skills'];
    $completed = (int)$tc['completed_skills'];
    $tc['percentage'] = $total > 0 ? round(($completed / $total) * 100) : 0;
}
unset($tc);

$primary_career = !empty($tracked_careers) ? $tracked_careers[0] : null;

$page_title = 'Dashboard';
require_once __DIR__ . '/includes/header.php';
?>

<div class="dashboard-wrapper">
    <div class="dashboard-header-flex">
        <div>
            <h1 class="page-title">Learning Dashboard</h1>
            <p class="page-subtitle">Track your personalized skill roadmaps and monitor milestone achievements.</p>
        </div>
        <div class="dashboard-actions">
            <a href="assessment.php" class="btn btn-primary">+ Track New Career</a>
        </div>
    </div>

    <?php if (empty($tracked_careers)): ?>
        <!-- Empty State -->
        <section class="empty-state-card">
            <div class="empty-state-icon">🗺️</div>
            <h2>No Career Roadmap Active Yet</h2>
            <p>You haven't assessed your skills for any career track yet. Take a 2-minute assessment to generate your customized step-by-step roadmap!</p>
            <a href="assessment.php" class="btn btn-primary btn-lg">Start First Skill Assessment &rarr;</a>
        </section>
    <?php else: ?>
        <!-- Primary Career Hero Chart Section -->
        <section class="dashboard-hero-grid">
            <div class="card hero-stat-card">
                <div class="card-header">
                    <span class="badge badge-accent">Active Focus</span>
                    <h3><?= e($primary_career['career_name']) ?></h3>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar-track">
                        <div class="progress-bar-fill" style="width: <?= $primary_career['percentage'] ?>%;"></div>
                    </div>
                    <div class="progress-bar-labels">
                        <span><?= $primary_career['percentage'] ?>% Completed</span>
                        <span><?= $primary_career['completed_skills'] ?> / <?= $primary_career['total_skills'] ?> Skills</span>
                    </div>
                </div>

                <?php if ($primary_career['next_skill']): ?>
                    <div class="next-skill-callout">
                        <span class="callout-label">Next Recommended Step:</span>
                        <div class="callout-title">
                            <?= e($primary_career['next_skill']['skill_name']) ?>
                            <span class="stage-tag"><?= e($primary_career['next_skill']['stage_label']) ?></span>
                        </div>
                    </div>
                <?php else: ?>
                    <div class="callout-success">🎉 Congratulations! You have completed all skills in this track!</div>
                <?php endif; ?>

                <div class="hero-card-footer">
                    <a href="roadmap.php?career_id=<?= $primary_career['career_id'] ?>" class="btn btn-primary btn-block">
                        Continue <?= e($primary_career['career_name']) ?> Roadmap &rarr;
                    </a>
                </div>
            </div>

            <!-- Chart.js Donut Chart Card -->
            <div class="card chart-card">
                <h3>Skill Breakdown (<?= e($primary_career['career_name']) ?>)</h3>
                <div class="chart-canvas-wrapper">
                    <canvas id="primaryCareerChart"></canvas>
                </div>
            </div>
        </section>

        <!-- Tracked Careers Cards Grid -->
        <h2 class="section-title mt-8">All Tracked Career Paths</h2>
        <div class="tracked-careers-grid">
            <?php foreach ($tracked_careers as $tc): ?>
                <article class="card career-summary-card">
                    <div class="card-header">
                        <h3><?= e($tc['career_name']) ?></h3>
                        <span class="badge badge-success"><?= $tc['percentage'] ?>%</span>
                    </div>
                    <p class="text-secondary"><?= e($tc['description']) ?></p>
                    
                    <div class="skill-mini-stats">
                        <div><strong><?= $tc['completed_skills'] ?></strong> Completed</div>
                        <div><strong><?= $tc['in_progress_skills'] ?></strong> In Progress</div>
                        <div><strong><?= $tc['total_skills'] - $tc['completed_skills'] - $tc['in_progress_skills'] ?></strong> Upcoming</div>
                    </div>

                    <a href="roadmap.php?career_id=<?= $tc['career_id'] ?>" class="btn btn-secondary btn-block mt-4">
                        View Interactive Roadmap &rarr;
                    </a>
                </article>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>

<?php if ($primary_career): ?>
<script>
document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('primaryCareerChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'In Progress', 'Not Started'],
                datasets: [{
                    data: [
                        <?= (int)$primary_career['completed_skills'] ?>,
                        <?= (int)$primary_career['in_progress_skills'] ?>,
                        <?= (int)($primary_career['total_skills'] - $primary_career['completed_skills'] - $primary_career['in_progress_skills']) ?>
                    ],
                    backgroundColor: ['#22C55E', '#F59E0B', '#2A2E3B'],
                    borderWidth: 0,
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#F1F3F9', font: { family: 'Inter', size: 12 } }
                    }
                },
                cutout: '70%'
            }
        });
    }
});
</script>
<?php endif; ?>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
`,
  },
  {
    path: 'roadmap.php',
    name: 'roadmap.php',
    category: 'pages',
    description: 'Module 4: Interactive Roadmap, Real-time AJAX Progress & Resource Drawer',
    content: `<?php
/**
 * Module 4: Interactive Roadmap & Progress Tracking
 */
require_once __DIR__ . '/config/db.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}

$pdo = get_db_connection();
$user_id = (int)$_SESSION['user_id'];

// Determine career
$career_id = isset($_GET['career_id']) ? (int)$_GET['career_id'] : (int)($_SESSION['active_career_id'] ?? 1);

$stmt = $pdo->prepare('SELECT * FROM careers WHERE career_id = :cid LIMIT 1');
$stmt->execute([':cid' => $career_id]);
$career = $stmt->fetch();

if (!$career) {
    header('Location: assessment.php');
    exit;
}

// Fetch all skills for this career ordered by step_order
$query = "
    SELECT 
        sp.skill_id,
        sp.step_order,
        sp.stage_label,
        sp.skill_name,
        sp.description,
        sp.resource_link,
        COALESCE(up.status, 'not_started') AS status,
        COALESCE(us.already_known, 0) AS already_known
    FROM skill_paths sp
    LEFT JOIN user_progress up ON (up.user_id = :uid AND up.skill_id = sp.skill_id AND up.career_id = :cid)
    LEFT JOIN user_skills us ON (us.user_id = :uid AND us.skill_id = sp.skill_id AND us.career_id = :cid)
    WHERE sp.career_id = :cid
    ORDER BY sp.step_order ASC
";
$stmt = $pdo->prepare($query);
$stmt->execute([':uid' => $user_id, ':cid' => $career_id]);
$skills = $stmt->fetchAll();

$total_skills = count($skills);
$completed_count = 0;
$in_progress_count = 0;
$current_skill_id = null;

foreach ($skills as $s) {
    if ($s['status'] === 'completed') {
        $completed_count++;
    } elseif ($s['status'] === 'in_progress') {
        $in_progress_count++;
    }
    
    // First non-completed skill is the "current" active milestone
    if ($current_skill_id === null && $s['status'] !== 'completed') {
        $current_skill_id = (int)$s['skill_id'];
    }
}

$completion_percent = $total_skills > 0 ? round(($completed_count / $total_skills) * 100) : 0;

$page_title = $career['career_name'] . ' Roadmap';
require_once __DIR__ . '/includes/header.php';
?>

<div class="roadmap-page-container" data-career-id="<?= $career_id ?>">
    <!-- Top Roadmap Header & Live Progress -->
    <section class="roadmap-header card">
        <div class="roadmap-header-info">
            <a href="dashboard.php" class="back-link">&larr; Back to Dashboard</a>
            <h1 class="page-title"><?= e($career['career_name']) ?> Roadmap</h1>
            <p class="page-subtitle"><?= e($career['description']) ?></p>
        </div>

        <div class="roadmap-stats-widget">
            <div class="progress-bar-track">
                <div class="progress-bar-fill" id="roadmapProgressFill" style="width: <?= $completion_percent ?>%;"></div>
            </div>
            <div class="stats-label-row">
                <span id="roadmapPercentText"><strong><?= $completion_percent ?>%</strong> Complete</span>
                <span id="roadmapCountText"><?= $completed_count ?> of <?= $total_skills ?> Skills Mastered</span>
            </div>
        </div>
    </section>

    <!-- Interactive Visual Timeline -->
    <section class="timeline-wrapper">
        <div class="timeline-container" id="timelineContainer">
            <?php 
            $current_stage = '';
            foreach ($skills as $index => $skill): 
                $is_completed = $skill['status'] === 'completed';
                $is_current = ((int)$skill['skill_id'] === $current_skill_id);
                $node_class = $is_completed ? 'node-completed' : ($is_current ? 'node-current animate-pulse-node' : 'node-upcoming');
            ?>
                <?php if ($current_stage !== $skill['stage_label']): 
                    $current_stage = $skill['stage_label'];
                ?>
                    <div class="timeline-stage-divider">
                        <span class="stage-badge stage-<?= strtolower($current_stage) ?>"><?= e($current_stage) ?> Stage</span>
                    </div>
                <?php endif; ?>

                <div class="timeline-item <?= $node_class ?>" data-skill-id="<?= $skill['skill_id'] ?>">
                    <div class="timeline-connector"></div>
                    <div class="timeline-node" tabindex="0">
                        <?php if ($is_completed): ?>
                            <span class="node-icon">&#10003;</span>
                        <?php else: ?>
                            <span class="node-num"><?= $skill['step_order'] ?></span>
                        <?php endif; ?>
                    </div>
                    <div class="timeline-content card" onclick="openSkillModal(<?= htmlspecialchars(json_encode($skill), ENT_QUOTES, 'UTF-8') ?>)">
                        <div class="timeline-content-header">
                            <span class="step-badge">Step <?= $skill['step_order'] ?></span>
                            <span class="status-pill status-<?= $skill['status'] ?>"><?= ucfirst(str_replace('_', ' ', $skill['status'])) ?></span>
                        </div>
                        <h3 class="skill-name"><?= e($skill['skill_name']) ?></h3>
                        <p class="skill-desc-preview"><?= e($skill['description']) ?></p>
                        <div class="timeline-card-actions">
                            <button type="button" class="btn btn-secondary btn-xs">View Guide & Status &rarr;</button>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </section>

    <!-- Collapsible Curated Resource Library for this Path -->
    <section class="resources-section card mt-8">
        <div class="resources-header-flex">
            <div>
                <h2>Curated Learning Resources for <?= e($career['career_name']) ?></h2>
                <p class="text-secondary">High-quality handpicked documentation, courses, and interactive tutorials.</p>
            </div>
            <input type="text" id="resourceFilterInput" class="form-control resource-search" placeholder="Search resources...">
        </div>

        <div class="resource-cards-list" id="resourceCardsList">
            <?php foreach ($skills as $s): ?>
                <div class="resource-row" data-name="<?= strtolower(e($s['skill_name'])) ?>">
                    <div class="resource-info">
                        <strong><?= e($s['skill_name']) ?></strong>
                        <span class="stage-tag"><?= e($s['stage_label']) ?></span>
                    </div>
                    <a href="<?= e($s['resource_link']) ?>" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
                        Learn this &rarr;
                    </a>
                </div>
            <?php endforeach; ?>
        </div>
    </section>
</div>

<!-- Skill Node Detail Modal -->
<div id="skillModal" class="modal-backdrop hidden">
    <div class="modal-dialog card">
        <div class="modal-header">
            <h3 id="modalSkillName">Skill Details</h3>
            <button type="button" class="modal-close" onclick="closeSkillModal()">&times;</button>
        </div>
        <div class="modal-body">
            <p id="modalSkillDesc" class="modal-description"></p>
            
            <div class="form-group mt-4">
                <label for="modalStatusSelect">Update Learning Status:</label>
                <select id="modalStatusSelect" class="form-control">
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            <div class="resource-callout mt-4">
                <h4>Recommended Study Resource:</h4>
                <a id="modalResourceLink" href="#" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-block mt-2">
                    Open Official Resource &rarr;
                </a>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="closeSkillModal()">Close</button>
            <button type="button" class="btn btn-primary" id="btnSaveSkillStatus">Save Changes</button>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
`,
  },
  {
    path: 'update_progress.php',
    name: 'update_progress.php',
    category: 'api',
    description: 'Module 4: AJAX Progress Update API with JSON Response',
    content: `<?php
/**
 * AJAX API: Update User Skill Progress
 * Method: POST
 * Accepts: JSON payload { career_id, skill_id, status }
 * Returns: JSON { success: true, completionPercentage, completedCount, totalCount, status }
 */

declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/config/db.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Unauthorized']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = $_POST;
}

$user_id = (int)$_SESSION['user_id'];
$career_id = (int)($input['career_id'] ?? 0);
$skill_id = (int)($input['skill_id'] ?? 0);
$status = (string)($input['status'] ?? 'not_started');

$allowed_statuses = ['not_started', 'in_progress', 'completed'];
if (!in_array($status, $allowed_statuses, true) || $career_id <= 0 || $skill_id <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid parameters provided.']);
    exit;
}

$pdo = get_db_connection();

try {
    // Insert or update progress record
    $query = "
        INSERT INTO user_progress (user_id, career_id, skill_id, status)
        VALUES (:uid, :cid, :sid, :st)
        ON DUPLICATE KEY UPDATE status = :st, updated_at = CURRENT_TIMESTAMP
    ";
    $stmt = $pdo->prepare($query);
    $stmt->execute([
        ':uid' => $user_id,
        ':cid' => $career_id,
        ':sid' => $skill_id,
        ':st'  => $status
    ]);

    // Recalculate stats
    $statQuery = "
        SELECT 
            COUNT(sp.skill_id) AS total_count,
            SUM(CASE WHEN up.status = 'completed' THEN 1 ELSE 0 END) AS completed_count
        FROM skill_paths sp
        LEFT JOIN user_progress up ON (up.user_id = :uid AND up.career_id = :cid AND up.skill_id = sp.skill_id)
        WHERE sp.career_id = :cid
    ";
    $statStmt = $pdo->prepare($statQuery);
    $statStmt->execute([':uid' => $user_id, ':cid' => $career_id]);
    $stats = $statStmt->fetch();

    $total = (int)($stats['total_count'] ?? 0);
    $completed = (int)($stats['completed_count'] ?? 0);
    $percentage = $total > 0 ? round(($completed / $total) * 100) : 0;

    echo json_encode([
        'success' => true,
        'data' => [
            'skill_id' => $skill_id,
            'career_id' => $career_id,
            'status' => $status,
            'completedCount' => $completed,
            'totalCount' => $total,
            'completionPercentage' => $percentage,
            'message' => 'Progress updated successfully.'
        ]
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database error occurred.']);
}
`,
  },
  {
    path: 'profile.php',
    name: 'profile.php',
    category: 'pages',
    description: 'Module 5: Profile Management, Password Update & Data Export',
    content: `<?php
/**
 * Module 5: User Profile & Data Export Page
 */
require_once __DIR__ . '/config/db.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}

$pdo = get_db_connection();
$user_id = (int)$_SESSION['user_id'];
$success_msg = '';
$error_msg = '';

// Fetch current user details
$stmt = $pdo->prepare('SELECT user_id, username, email, created_at FROM users WHERE user_id = :uid LIMIT 1');
$stmt->execute([':uid' => $user_id]);
$user = $stmt->fetch();

// Handle Password Change
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'change_password') {
    $current_pass = $_POST['current_password'] ?? '';
    $new_pass = $_POST['new_password'] ?? '';
    $confirm_pass = $_POST['confirm_password'] ?? '';

    if (strlen($new_pass) < 8) {
        $error_msg = 'New password must be at least 8 characters long.';
    } elseif ($new_pass !== $confirm_pass) {
        $error_msg = 'New passwords do not match.';
    } else {
        // Verify current password
        $authStmt = $pdo->prepare('SELECT password_hash FROM users WHERE user_id = :uid LIMIT 1');
        $authStmt->execute([':uid' => $user_id]);
        $hashRow = $authStmt->fetch();

        if ($hashRow && password_verify($current_pass, $hashRow['password_hash'])) {
            $new_hash = password_hash($new_pass, PASSWORD_BCRYPT);
            $upStmt = $pdo->prepare('UPDATE users SET password_hash = :nh WHERE user_id = :uid');
            $upStmt->execute([':nh' => $new_hash, ':uid' => $user_id]);
            $success_msg = 'Password updated successfully!';
        } else {
            $error_msg = 'Current password is incorrect.';
        }
    }
}

$page_title = 'My Profile & Data Export';
require_once __DIR__ . '/includes/header.php';
?>

<div class="profile-container">
    <h1 class="page-title">Profile & Settings</h1>
    <p class="page-subtitle">Manage your account credentials, view milestones, and export your roadmap data.</p>

    <?php if ($success_msg): ?>
        <div class="alert alert-success"><?= e($success_msg) ?></div>
    <?php endif; ?>
    <?php if ($error_msg): ?>
        <div class="alert alert-error"><?= e($error_msg) ?></div>
    <?php endif; ?>

    <div class="profile-grid">
        <!-- Account Information Card -->
        <div class="card">
            <h3>Account Details</h3>
            <div class="profile-field-group">
                <div class="profile-field">
                    <span class="field-label">Username:</span>
                    <span class="field-value"><strong><?= e($user['username']) ?></strong></span>
                </div>
                <div class="profile-field">
                    <span class="field-label">Email:</span>
                    <span class="field-value"><?= e($user['email']) ?></span>
                </div>
                <div class="profile-field">
                    <span class="field-label">Member Since:</span>
                    <span class="field-value"><?= date('F j, Y', strtotime($user['created_at'])) ?></span>
                </div>
            </div>
        </div>

        <!-- Change Password Card -->
        <div class="card">
            <h3>Change Password</h3>
            <form action="profile.php" method="POST">
                <input type="hidden" name="action" value="change_password">
                <div class="form-group">
                    <label for="current_password">Current Password</label>
                    <input type="password" id="current_password" name="current_password" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="new_password">New Password</label>
                    <input type="password" id="new_password" name="new_password" class="form-control" required minlength="8">
                </div>
                <div class="form-group">
                    <label for="confirm_password">Confirm New Password</label>
                    <input type="password" id="confirm_password" name="confirm_password" class="form-control" required minlength="8">
                </div>
                <button type="submit" class="btn btn-primary">Update Password</button>
            </form>
        </div>

        <!-- Data Export Card -->
        <div class="card data-export-card">
            <h3>Export Learning Data</h3>
            <p class="text-secondary">Download a complete JSON snapshot of all your assessed skills, roadmap completion rates, and learning progress.</p>
            <div class="mt-4">
                <a href="export_data.php" class="btn btn-secondary btn-lg">
                    📥 Export My Data (.JSON)
                </a>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
`,
  },
  {
    path: 'export_data.php',
    name: 'export_data.php',
    category: 'api',
    description: 'Module 5: Secure JSON File Download Header Attachment',
    content: `<?php
/**
 * Module 5: Export User Data as JSON Download
 */
declare(strict_types=1);

require_once __DIR__ . '/config/db.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}

$pdo = get_db_connection();
$user_id = (int)$_SESSION['user_id'];

// Fetch user profile
$userStmt = $pdo->prepare('SELECT user_id, username, email, created_at FROM users WHERE user_id = :uid LIMIT 1');
$userStmt->execute([':uid' => $user_id]);
$user = $userStmt->fetch();

// Fetch all user skills and progress
$query = "
    SELECT 
        c.career_name,
        c.career_slug,
        sp.step_order,
        sp.stage_label,
        sp.skill_name,
        sp.resource_link,
        COALESCE(us.already_known, 0) AS already_known,
        COALESCE(up.status, 'not_started') AS status,
        up.updated_at
    FROM user_skills us
    JOIN careers c ON us.career_id = c.career_id
    JOIN skill_paths sp ON us.skill_id = sp.skill_id
    LEFT JOIN user_progress up ON (up.user_id = us.user_id AND up.career_id = us.career_id AND up.skill_id = us.skill_id)
    WHERE us.user_id = :uid
    ORDER BY c.career_id ASC, sp.step_order ASC
";
$stmt = $pdo->prepare($query);
$stmt->execute([':uid' => $user_id]);
$records = $stmt->fetchAll();

$export_payload = [
    'export_generated_at' => date('Y-m-d H:i:s'),
    'project_title' => 'Career Roadmap Generator: Personalized Skill Path & Progress Tracking Platform',
    'student_user' => [
        'username' => $user['username'],
        'email' => $user['email'],
        'member_since' => $user['created_at'],
    ],
    'total_tracked_records' => count($records),
    'skill_records' => $records
];

// Serve as downloadable JSON attachment
header('Content-Type: application/json; charset=utf-8');
header('Content-Disposition: attachment; filename="career_roadmap_export_' . $user['username'] . '.json"');
header('Pragma: no-cache');
header('Expires: 0');

echo json_encode($export_payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
exit;
`,
  },
  {
    path: 'logout.php',
    name: 'logout.php',
    category: 'pages',
    description: 'Destroys PHP session and redirects to login',
    content: `<?php
/**
 * Session Termination / Logout Handler
 */
session_start();
$_SESSION = [];

if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params['path'],
        $params['domain'],
        $params['secure'],
        $params['httponly']
    );
}

session_destroy();
header('Location: login.php');
exit;
`,
  },
  {
    path: 'assets/css/style.css',
    name: 'style.css',
    category: 'assets',
    description: 'Custom SaaS Design System CSS (Variables, Grid, Flex, Timeline, Toasts)',
    content: `/**
 * Career Roadmap Generator - Modern SaaS Dark Design System
 * Pure CSS3 (Flexbox + CSS Grid + Custom Properties)
 */

:root {
    --bg-primary: #0F1117;
    --bg-surface: #171A23;
    --bg-surface-hover: #1E212C;
    --accent-primary: #6366F1;
    --accent-primary-hover: #4F46E5;
    --accent-success: #22C55E;
    --accent-warning: #F59E0B;
    --text-primary: #F1F3F9;
    --text-secondary: #9CA3B8;
    --border-subtle: #2A2E3B;
    --radius-sm: 8px;
    --radius-md: 14px;
    --radius-lg: 20px;
    --font-sans: 'Inter', system-ui, sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
    --transition-fast: all 0.2s ease;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: var(--font-sans);
    background-color: var(--bg-primary);
    color: var(--text-primary);
    line-height: 1.6;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

/* Header & Nav */
.site-header {
    background-color: var(--bg-surface);
    border-bottom: 1px solid var(--border-subtle);
    position: sticky;
    top: 0;
    z-index: 100;
}

.header-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.brand-logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: var(--text-primary);
    font-weight: 700;
    font-size: 1.25rem;
}

.brand-highlight {
    color: var(--accent-primary);
}

.main-nav {
    display: flex;
    gap: 1.5rem;
}

.nav-link {
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 500;
    transition: var(--transition-fast);
}

.nav-link:hover, .nav-link.active {
    color: var(--text-primary);
}

/* Layout */
.main-content {
    flex: 1;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 2.5rem 1.5rem;
}

.site-footer {
    border-top: 1px solid var(--border-subtle);
    padding: 1.5rem;
    text-align: center;
    color: var(--text-secondary);
    font-size: 0.875rem;
}

/* Cards & Containers */
.card {
    background-color: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    padding: 1.75rem;
    transition: var(--transition-fast);
}

.card:hover {
    border-color: #3b4254;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

/* Typography & Headings */
.page-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    letter-spacing: -0.02em;
}

.page-subtitle {
    color: var(--text-secondary);
    font-size: 1.05rem;
    margin-bottom: 2rem;
}

.section-title {
    font-size: 1.35rem;
    font-weight: 600;
    margin-bottom: 1.25rem;
}

/* Buttons */
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.65rem 1.35rem;
    border-radius: var(--radius-sm);
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    text-decoration: none;
    border: 1px solid transparent;
    transition: var(--transition-fast);
}

.btn-primary {
    background-color: var(--accent-primary);
    color: #FFFFFF;
}

.btn-primary:hover {
    background-color: var(--accent-primary-hover);
}

.btn-secondary {
    background-color: transparent;
    border-color: var(--border-subtle);
    color: var(--text-primary);
}

.btn-secondary:hover {
    background-color: var(--bg-surface-hover);
    border-color: #4b5563;
}

.btn-block {
    width: 100%;
}

.btn-sm {
    padding: 0.4rem 0.85rem;
    font-size: 0.85rem;
}

.btn-lg {
    padding: 0.85rem 1.75rem;
    font-size: 1.05rem;
}

/* Forms */
.form-group {
    margin-bottom: 1.25rem;
}

.form-group label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.4rem;
    color: var(--text-secondary);
}

.form-control {
    width: 100%;
    padding: 0.75rem 1rem;
    background-color: var(--bg-primary);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-sm);
    color: var(--text-primary);
    font-size: 0.95rem;
    outline: none;
    transition: var(--transition-fast);
}

.form-control:focus {
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

/* Timeline Components */
.timeline-wrapper {
    position: relative;
    padding: 2rem 0;
}

.timeline-item {
    display: flex;
    align-items: flex-start;
    gap: 1.5rem;
    position: relative;
    margin-bottom: 2rem;
}

.timeline-connector {
    position: absolute;
    top: 40px;
    left: 20px;
    width: 2px;
    height: calc(100% + 2rem);
    background-color: var(--border-subtle);
}

.timeline-node {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    z-index: 2;
    background-color: var(--bg-surface);
    border: 2px solid var(--border-subtle);
}

.node-completed .timeline-node {
    background-color: var(--accent-success);
    border-color: var(--accent-success);
    color: #FFFFFF;
}

.node-current .timeline-node {
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 8px rgba(99, 102, 241, 0.2);
    color: var(--accent-primary);
}

/* Toast Root */
.toast-container {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.toast {
    background-color: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    padding: 1rem 1.25rem;
    border-radius: var(--radius-sm);
    color: var(--text-primary);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    gap: 0.75rem;
}
`,
  },
];
