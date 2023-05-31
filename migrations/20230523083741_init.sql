CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  user_id CHAR(26) NOT NULL UNIQUE,
  secret_code VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS trackings (
  id SERIAL PRIMARY KEY,
  tracking_id CHAR(26) NOT NULL,
  name VARCHAR(255) NOT NULL,
  owner_id INTEGER NOT NULL REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS sources (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  tracking_id INTEGER NOT NULL REFERENCES trackings(id),
  UNIQUE (tracking_id, name)
);
CREATE TABLE IF NOT EXISTS visitors (
  id SERIAL PRIMARY KEY,
  visitor_id CHAR(26) NOT NULL,
  referer VARCHAR(255) NOT NULL,
  user_agent VARCHAR(255) NOT NULL,
  user_agent_parsed JSON NOT NULL,
  source_id INTEGER NULL REFERENCES sources(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  tracking_id INTEGER NOT NULL REFERENCES trackings(id),
  UNIQUE (tracking_id, visitor_id)
);
CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  session_id CHAR(26) NOT NULL,
  visitor_id INTEGER NOT NULL REFERENCES visitors(id),
  start_timestamp TIMESTAMP NOT NULL,
  end_timestamp TIMESTAMP NULL,
  title VARCHAR(255) NOT NULL,
  pathname VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP NULL,
  tracking_id INTEGER NOT NULL REFERENCES trackings(id),
  UNIQUE (tracking_id, session_id)
);
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  session_id INTEGER NOT NULL REFERENCES sessions(id),
  type VARCHAR(255) NOT NULL,
  target VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  tracking_id INTEGER NOT NULL REFERENCES trackings(id)
);