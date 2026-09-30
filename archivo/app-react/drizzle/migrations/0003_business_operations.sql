DO $$ BEGIN CREATE TYPE business_area AS ENUM ('TRUST_SAFETY','MODEL_EVALUATION','AUTOMATION_CONSULTING','DIGITAL_INCLUSION'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE account_status AS ENUM ('PROSPECT','ACTIVE','PAUSED','CLOSED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE opportunity_stage AS ENUM ('QUALIFIED','DISCOVERY','PROPOSAL','WON','LOST'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE project_status AS ENUM ('PLANNED','ACTIVE','REVIEW','DELIVERED','ARCHIVED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE pipeline_run_status AS ENUM ('BACKLOG','READY','IN_PROGRESS','BLOCKED','DONE','CANCELLED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS business_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name varchar(240) NOT NULL, area business_area NOT NULL,
  status account_status NOT NULL DEFAULT 'PROSPECT', owner varchar(180) NOT NULL, notes text,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS business_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), account_id uuid NOT NULL REFERENCES business_accounts(id),
  title varchar(240) NOT NULL, stage opportunity_stage NOT NULL DEFAULT 'QUALIFIED', value_cents integer NOT NULL,
  probability real NOT NULL CHECK (probability >= 0 AND probability <= 1), next_action text NOT NULL, due_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS business_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), account_id uuid NOT NULL REFERENCES business_accounts(id),
  opportunity_id uuid REFERENCES business_opportunities(id), title varchar(240) NOT NULL, area business_area NOT NULL,
  status project_status NOT NULL DEFAULT 'PLANNED', acceptance_criteria jsonb NOT NULL DEFAULT '[]', owner varchar(180) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS business_evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), project_id uuid REFERENCES business_projects(id), kind varchar(40) NOT NULL,
  title varchar(240) NOT NULL, uri text NOT NULL, hash varchar(128), verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS business_pipeline_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), type varchar(60) NOT NULL, status pipeline_run_status NOT NULL DEFAULT 'IN_PROGRESS',
  input jsonb NOT NULL DEFAULT '{}', output jsonb, error text, started_at timestamptz NOT NULL DEFAULT now(), finished_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS business_opportunities_account_idx ON business_opportunities(account_id);
CREATE INDEX IF NOT EXISTS business_projects_account_idx ON business_projects(account_id);
CREATE INDEX IF NOT EXISTS business_evidence_project_idx ON business_evidence(project_id);
CREATE INDEX IF NOT EXISTS business_pipeline_status_idx ON business_pipeline_runs(status);
