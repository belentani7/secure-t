-- ============================================================================
-- secure-t · Seed inicial para PostgreSQL real (Supabase / Railway)
-- Generado a partir de drizzle/schema.ts + server/data/curriculum.ts
-- Uso: pegar en el SQL Editor de Supabase, o `psql -f sql/seed.sql`
-- Idempotente: DROP + CREATE de las tablas del core académico.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- ENUMS
-- ---------------------------------------------------------------------------
DO $$ BEGIN CREATE TYPE role AS ENUM ('STUDENT','FACULTY','MENTOR','EXAMINER','LAB_INSTRUCTOR','ADMIN','AI_AGENT','SYSTEM'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE submission_status AS ENUM ('DRAFT','SUBMITTED','REVIEWED','RETURNED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE lab_status AS ENUM ('READY','RUNNING','COMPLETED','EXPIRED','DESTROYED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE enrollment_status AS ENUM ('ENROLLED','IN_PROGRESS','COMPLETED','DROPPED','FAILED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE mastery_level AS ENUM ('BEGINNING','DEVELOPING','PROFICIENT','ADVANCED','MASTERED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------------------
-- CORE TABLES
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS task_events CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS module_lessons CASCADE;
DROP TABLE IF EXISTS modules CASCADE;
DROP TABLE IF EXISTS academic_years CASCADE;
DROP TABLE IF EXISTS ai_audit_events CASCADE;
DROP TABLE IF EXISTS student_evaluations_history CASCADE;
DROP TABLE IF EXISTS student_evaluations CASCADE;
DROP TABLE IF EXISTS evaluations CASCADE;
DROP TABLE IF EXISTS student_lesson_progress CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS academic_terms CASCADE;
DROP TABLE IF EXISTS student_competencies CASCADE;
DROP TABLE IF EXISTS evidence CASCADE;
DROP TABLE IF EXISTS competencies CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS programs CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id varchar(255) UNIQUE,
  email varchar(320) NOT NULL UNIQUE,
  display_name varchar(180) NOT NULL,
  role role NOT NULL DEFAULT 'STUDENT',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(40) NOT NULL UNIQUE,
  title varchar(240) NOT NULL,
  credits integer NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid REFERENCES programs(id),
  code varchar(40) NOT NULL UNIQUE,
  title varchar(240) NOT NULL,
  credits integer NOT NULL,
  year integer NOT NULL,
  term varchar(40) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS competencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(60) NOT NULL UNIQUE,
  title varchar(240) NOT NULL,
  description text NOT NULL,
  framework varchar(120) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  competency_id uuid NOT NULL REFERENCES competencies(id),
  kind varchar(60) NOT NULL,
  uri text,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS student_competencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  competency_id uuid NOT NULL REFERENCES competencies(id),
  mastery real NOT NULL DEFAULT 0,
  confidence real NOT NULL DEFAULT 0,
  evidence_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS academic_terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(20) NOT NULL UNIQUE,
  name varchar(120) NOT NULL,
  start_date timestamptz,
  end_date timestamptz,
  is_current boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  course_id uuid NOT NULL REFERENCES courses(id),
  academic_term_id uuid REFERENCES academic_terms(id),
  status enrollment_status NOT NULL DEFAULT 'ENROLLED',
  grade real,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id),
  code varchar(40) NOT NULL UNIQUE,
  title varchar(240) NOT NULL,
  description text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS student_lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  lesson_id uuid NOT NULL REFERENCES lessons(id),
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  time_spent_minutes integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid REFERENCES lessons(id),
  title varchar(240) NOT NULL,
  description text NOT NULL,
  kind varchar(60) NOT NULL,
  criteria jsonb NOT NULL DEFAULT '{}',
  passing_score real NOT NULL DEFAULT 70,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS student_evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  evaluation_id uuid NOT NULL REFERENCES evaluations(id),
  score real,
  status submission_status NOT NULL DEFAULT 'DRAFT',
  submitted_at timestamptz,
  feedback text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS student_evaluations_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  evaluation_id uuid NOT NULL REFERENCES evaluations(id),
  previous_score real,
  change real,
  changed_at timestamptz,
  changed_by varchar(100),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id),
  title varchar(240) NOT NULL,
  "order" integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS module_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES modules(id),
  title varchar(240) NOT NULL,
  content text NOT NULL,
  type varchar(40) NOT NULL,
  "order" integer NOT NULL,
  learning_objectives jsonb NOT NULL DEFAULT '[]',
  competencies jsonb NOT NULL DEFAULT '[]',
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS academic_years (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year integer NOT NULL UNIQUE,
  title varchar(180) NOT NULL,
  description text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  agent_id varchar(80) NOT NULL,
  action varchar(120) NOT NULL,
  tool varchar(120),
  authorization varchar(40) NOT NULL,
  input_metadata jsonb NOT NULL DEFAULT '{}',
  output_metadata jsonb NOT NULL DEFAULT '{}',
  result varchar(40) NOT NULL,
  error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  kind varchar(40) NOT NULL,
  status varchar(40) NOT NULL,
  progress integer NOT NULL DEFAULT 0,
  error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS task_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES tasks(id),
  state varchar(40) NOT NULL,
  message text,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  title varchar(240) NOT NULL,
  message text NOT NULL,
  type varchar(40) NOT NULL,
  read boolean NOT NULL DEFAULT false,
  data jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_agents (
  id varchar(80) PRIMARY KEY,
  description text NOT NULL,
  capabilities jsonb NOT NULL DEFAULT '[]',
  permissions jsonb NOT NULL DEFAULT '[]',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  agent_id varchar(80) NOT NULL REFERENCES ai_agents(id),
  action varchar(120) NOT NULL,
  authorization varchar(40) NOT NULL,
  result varchar(40) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS academic_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  program_id uuid REFERENCES programs(id),
  status varchar(40) NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  kind varchar(40) NOT NULL,
  title varchar(240) NOT NULL,
  status varchar(40) NOT NULL DEFAULT 'draft',
  verification_url text,
  evidence_ids jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS research_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title varchar(240) NOT NULL,
  uri text NOT NULL,
  source_type varchar(50) NOT NULL,
  approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- SEED: PROGRAMA + CURSOS + MODULOS + LECCIONES + COMPETENCIAS
-- UUIDs fijos para referencias cruzadas estables.
-- ---------------------------------------------------------------------------

-- Programa
INSERT INTO programs (id, code, title, credits, description) VALUES
  ('00000000-0000-0000-0000-000000000001', 'BSCY', 'Bachelor of Cybersecurity', 120, 'A comprehensive 4-year cybersecurity program combining theory, labs, and real-world incident response.')
ON CONFLICT (code) DO NOTHING;

-- Competencias
INSERT INTO competencies (id, code, title, description, framework) VALUES
  ('00000000-0000-0000-0000-000000000101', 'LINUX', 'Linux & OS hardening', 'Manage users, permissions and harden Linux systems.', 'internal'),
  ('00000000-0000-0000-0000-000000000102', 'NETWORK', 'Network protocols & defense', 'OSI layers, TCP/IP, defense mechanisms.', 'internal'),
  ('00000000-0000-0000-0000-000000000103', 'CRYPTO', 'Cryptography & PKI', 'Symmetric/asymmetric crypto and public key infrastructure.', 'internal'),
  ('00000000-0000-0000-0000-000000000104', 'WEB', 'Web security & OWASP', 'OWASP Top 10 and secure coding.', 'internal'),
  ('00000000-0000-0000-0000-000000000105', 'CLOUD', 'Cloud security (AWS/Azure)', 'Cloud architecture security.', 'internal'),
  ('00000000-0000-0000-0000-000000000106', 'FORENSICS', 'Forensics & incident response', 'Incident handling and digital forensics.', 'internal'),
  ('00000000-0000-0000-0000-000000000107', 'REVERSE', 'Reverse engineering', 'Malware analysis and binary reverse engineering.', 'internal'),
  ('00000000-0000-0000-0000-000000000108', 'THREAT', 'Threat modeling', 'Threat modeling methodologies.', 'internal'),
  ('00000000-0000-0000-0000-000000000109', 'COMPLIANCE', 'Compliance (SOC2, ISO27001)', 'Audit and compliance frameworks.', 'internal'),
  ('00000000-0000-0000-0000-000000000110', 'SOC', 'Security operations (SOC)', 'SOC monitoring and response.', 'internal')
ON CONFLICT (code) DO NOTHING;

-- Cursos
INSERT INTO courses (id, program_id, code, title, credits, year, term) VALUES
  ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000001', 'CY-101',  'Cybersecurity Fundamentals',      3, 1, 'Y1-S1'),
  ('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000001', 'CS-110',  'Python for Cybersecurity',        4, 1, 'Y1-S1'),
  ('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000001', 'NET-201', 'Networks & Protocols',            4, 1, 'Y1-S2'),
  ('00000000-0000-0000-0000-000000000204', '00000000-0000-0000-0000-000000000001', 'LX-105',  'Linux Administration',            4, 1, 'Y1-S2'),
  ('00000000-0000-0000-0000-000000000205', '00000000-0000-0000-0000-000000000001', 'WEB-301', 'Web Application Security',        4, 2, 'Y2-S1'),
  ('00000000-0000-0000-0000-000000000206', '00000000-0000-0000-0000-000000000001', 'IR-401',  'Incident Response & Forensics',   4, 3, 'Y3-S1')
ON CONFLICT (code) DO NOTHING;

-- Modulos
INSERT INTO modules (id, course_id, title, "order") VALUES
  ('00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000201', 'Security Foundations', 1),
  ('00000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000202', 'Python Basics for Security', 1),
  ('00000000-0000-0000-0000-000000000303', '00000000-0000-0000-0000-000000000203', 'OSI Model & TCP/IP', 1),
  ('00000000-0000-0000-0000-000000000304', '00000000-0000-0000-0000-000000000204', 'Linux Basics & Hardening', 1),
  ('00000000-0000-0000-0000-000000000305', '00000000-0000-0000-0000-000000000205', 'OWASP & Common Vulns', 1),
  ('00000000-0000-0000-0000-000000000306', '00000000-0000-0000-0000-000000000206', 'Incident Response Lifecycle', 1)
ON CONFLICT (id) DO NOTHING;

-- Lecciones (module_lessons) por curso
INSERT INTO module_lessons (id, module_id, title, content, type, "order", learning_objectives, competencies, published) VALUES
  ('00000000-0000-0000-0000-000000000311', '00000000-0000-0000-0000-000000000301', 'What is cybersecurity?',      'Introduction to security principles.',        'video',   1, '["Understand core security concepts"]', '["THREAT"]', true),
  ('00000000-0000-0000-0000-000000000312', '00000000-0000-0000-0000-000000000301', 'CIA Triad deep dive',         'Confidentiality, integrity, availability.',   'reading', 2, '["Apply the CIA triad"]',               '["THREAT"]', true),
  ('00000000-0000-0000-0000-000000000313', '00000000-0000-0000-0000-000000000301', 'Risk assessment workshop',    'Hands-on risk assessment.',                   'lab',     3, '["Assess risks"]',                      '["THREAT"]', false),
  ('00000000-0000-0000-0000-000000000321', '00000000-0000-0000-0000-000000000302', 'Python setup & environment', 'Environment setup for security automation.',  'video',   1, '["Set up Python"]',                     '[]', true),
  ('00000000-0000-0000-0000-000000000322', '00000000-0000-0000-0000-000000000302', 'Network scanning script',    'Wrap nmap in Python.',                        'lab',     2, '["Automate scanning"]',                 '["NETWORK"]', true),
  ('00000000-0000-0000-0000-000000000331', '00000000-0000-0000-0000-000000000303', 'OSI model explained',        'Seven layers explained.',                     'video',   1, '["Understand OSI layers"]',             '["NETWORK"]', true),
  ('00000000-0000-0000-0000-000000000332', '00000000-0000-0000-0000-000000000303', 'Packet capture & analysis',  'Wireshark lab.',                              'lab',     2, '["Analyze traffic"]',                   '["NETWORK"]', true),
  ('00000000-0000-0000-0000-000000000341', '00000000-0000-0000-0000-000000000304', 'Linux file system hierarchy','Filesystem basics.',                          'video',   1, '["Navigate Linux filesystem"]',         '["LINUX"]', true),
  ('00000000-0000-0000-0000-000000000342', '00000000-0000-0000-0000-000000000304', 'User management & sudo',     'Manage users and privileges.',                'lab',     2, '["Manage users"]',                      '["LINUX"]', true),
  ('00000000-0000-0000-0000-000000000343', '00000000-0000-0000-0000-000000000304', 'Firewall & SELinux hardening','System hardening.',                           'lab',     3, '["Harden a system"]',                   '["LINUX"]', false),
  ('00000000-0000-0000-0000-000000000351', '00000000-0000-0000-0000-000000000305', 'SQL injection mastery',      'OWASP injection lab.',                        'lab',     1, '["Exploit SQLi"]',                      '["WEB"]', false),
  ('00000000-0000-0000-0000-000000000361', '00000000-0000-0000-0000-000000000306', 'IR playbooks & runbooks',    'Incident response lifecycle.',                'reading', 1, '["Run an IR playbook"]',                '["FORENSICS"]', false)
ON CONFLICT (id) DO NOTHING;

-- Términos académicos
INSERT INTO academic_terms (id, code, name, start_date, end_date, is_current) VALUES
  ('00000000-0000-0000-0000-000000000401', 'Y1-S1', 'Year 1 - Semester 1', now(), now() + interval '6 months', true)
ON CONFLICT (code) DO NOTHING;

-- Años académicos
INSERT INTO academic_years (year, title, description, active) VALUES
  (1, 'Year 1', 'Foundation year', true),
  (2, 'Year 2', 'Core technical year', true),
  (3, 'Year 3', 'Specialization', true),
  (4, 'Year 4', 'Capstone & thesis', false)
ON CONFLICT (year) DO NOTHING;

-- Agentes IA registrados
INSERT INTO ai_agents (id, description, capabilities, permissions, active) VALUES
  ('curriculum_mentor',  'Guides learners through the curriculum.',   '["curriculum","study_plan"]', '["read:curriculum"]', true),
  ('lab_coach',          'Coaches through hands-on labs.',            '["labs","shell"]',           '["run:lab"]', true),
  ('evaluator',          'Evaluates submissions against criteria.',   '["evaluation","rubric"]',    '["grade:evaluation"]', true),
  ('career_coach',       'Advises on career paths and credentials.',  '["career","credentials"]',   '["read:credentials"]', true),
  ('security_simulator', 'Simulates attack scenarios.',               '["simulation","threat"]',    '["run:simulation"]', true),
  ('audit_agent',        'Performs audit and compliance checks.',     '["audit","compliance"]',     '["read:audit"]', true),
  ('research_assistant', 'Assists research and RAG retrieval.',       '["rag","research"]',         '["read:research"]', true),
  ('voice_coach',        'Spoken interaction tutor.',                 '["voice","tts"]',            '["run:tts"]', true)
ON CONFLICT (id) DO NOTHING;

-- Usuario demo (admin)
INSERT INTO users (id, email, display_name, role, active) VALUES
  ('00000000-0000-0000-0000-000000000501', 'admin@secure-t.local', 'Admin Secure-T', 'ADMIN', true),
  ('00000000-0000-0000-0000-000000000502', 'student@secure-t.local', 'Demo Student', 'STUDENT', true)
ON CONFLICT (email) DO NOTHING;

-- Registro académico del alumno demo
INSERT INTO academic_records (id, user_id, program_id, status) VALUES
  ('00000000-0000-0000-0000-000000000601', '00000000-0000-0000-0000-000000000502', '00000000-0000-0000-0000-000000000001', 'active')
ON CONFLICT (id) DO NOTHING;

-- Matrículas demo (primeros dos cursos)
INSERT INTO enrollments (id, user_id, course_id, academic_term_id, status) VALUES
  ('00000000-0000-0000-0000-000000000701', '00000000-0000-0000-0000-000000000502', '00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000401', 'IN_PROGRESS'),
  ('00000000-0000-0000-0000-000000000702', '00000000-0000-0000-0000-000000000502', '00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000401', 'ENROLLED')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Fin de seed
-- ============================================================================
