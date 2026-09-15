CREATE TABLE surveys (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'active', 'closed')),
  version INTEGER NOT NULL,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE survey_questions (
  id TEXT PRIMARY KEY,
  survey_id TEXT NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('single', 'multiple', 'likert', 'score10', 'score5', 'yesno', 'text')),
  title TEXT NOT NULL,
  description TEXT,
  required BOOLEAN NOT NULL,
  config JSONB NOT NULL,
  UNIQUE (survey_id, position)
);

CREATE TABLE survey_options (
  id TEXT PRIMARY KEY,
  question_id TEXT NOT NULL REFERENCES survey_questions(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  position INTEGER NOT NULL
);

CREATE TABLE survey_responses (
  id UUID PRIMARY KEY,
  survey_id TEXT NOT NULL REFERENCES surveys(id),
  session_hash TEXT NOT NULL,
  survey_version INTEGER NOT NULL,
  consent_version TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  UNIQUE (survey_id, session_hash)
);
CREATE INDEX responses_survey_completed ON survey_responses (survey_id, completed_at);

CREATE TABLE survey_answers (
  response_id UUID NOT NULL REFERENCES survey_responses(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL REFERENCES survey_questions(id),
  value JSONB NOT NULL,
  PRIMARY KEY (response_id, question_id)
);

CREATE TABLE survey_participants (
  response_id UUID PRIMARY KEY REFERENCES survey_responses(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('google', 'manual')),
  verified BOOLEAN NOT NULL,
  consent_version TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE rate_limits (
  key TEXT PRIMARY KEY,
  hits INTEGER NOT NULL,
  expires_at BIGINT NOT NULL
);

CREATE TABLE contact_leads (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT '',
  audience TEXT NOT NULL,
  community_size TEXT NOT NULL DEFAULT '',
  interest TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  consent_version TEXT NOT NULL,
  session_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (session_hash, message)
);

-- Every team member gets their own account; all accounts carry the same powers.
CREATE TABLE team_users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  disabled BOOLEAN NOT NULL DEFAULT false,
  must_change_password BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES team_users(id) ON DELETE SET NULL,
  last_login_at TIMESTAMPTZ
);
CREATE INDEX team_users_email ON team_users (lower(email));

-- Sessions live server-side so an account can be revoked immediately.
CREATE TABLE team_sessions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES team_users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX team_sessions_user ON team_sessions (user_id);
