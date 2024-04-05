CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATETIME NOT NULL,
  image BLOB,
  nickname TEXT,
  about_me TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  privacy TEXT NOT NULL DEFAULT 'public' CHECK(privacy IN ('private', 'public'))
);

CREATE TABLE reactions (
  id TEXT PRIMARY KEY,
  reply_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  post_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('like', 'dislike')),
  FOREIGN KEY (reply_id) REFERENCES replies(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (post_id) REFERENCES posts(id)
);

CREATE TABLE replies (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  post_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (post_id) REFERENCES posts(id)
);

CREATE TABLE followers (
  user_id TEXT NOT NULL,
  follower_id TEXT NOT NULL,
  PRIMARY KEY(user_id, follower_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (follower_id) REFERENCES users(id)
);

CREATE TABLE follow_requests (
  user_id TEXT NOT NULL,
  follower_id TEXT NOT NULL,
  PRIMARY KEY(user_id, follower_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (follower_id) REFERENCES users(id)
);

CREATE TABLE posts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image BLOB,
  privacy TEXT NOT NULL CHECK(privacy IN ('private', 'public', 'almost_private')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE groups (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE group_invitations (
  group_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  FOREIGN KEY (group_id) REFERENCES groups(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE group_events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  group_id TEXT NOT NULL,
  FOREIGN KEY (group_id) REFERENCES groups(id)
);

CREATE TABLE group_event_members (
  user_id TEXT,
  group_event_id TEXT,
  attendance TEXT CHECK(attendance IN ('going', 'not going')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (group_event_id) REFERENCES group_events(id)
);

CREATE TABLE group_members (
  group_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  PRIMARY KEY(group_id, user_id),
  FOREIGN KEY (group_id) REFERENCES groups(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE sessions (
  token TEXT PRIMARY KEY,
  data BLOB NOT NULL,
  expiry TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    token TEXT UNIQUE NOT NULL,
    user_id INTEGER NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX sessions_index_0 ON sessions (expiry);
