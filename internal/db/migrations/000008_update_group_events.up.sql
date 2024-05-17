DROP TABLE IF EXISTS group_events;
DROP TABLE IF EXISTS reactions;
DROP TABLE IF EXISTS group_event_members;

CREATE TABLE group_events (
  id TEXT PRIMARY KEY,
  group_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL,
  FOREIGN KEY (group_id) REFERENCES groups(id)
);

CREATE TABLE reactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  post_id TEXT,
  reply_id TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE group_event_members (
  user_id TEXT NOT NULL,
  group_event_id TEXT NOT NULL,
  attendance INTEGER NOT NULL,
  PRIMARY KEY (user_id, group_event_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (group_event_id) REFERENCES group_events(id) ON DELETE CASCADE
);