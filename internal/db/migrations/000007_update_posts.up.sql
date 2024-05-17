DROP TABLE IF EXISTS posts;

CREATE TABLE posts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  group_id TEXT,
  image BLOB,
  privacy TEXT NOT NULL CHECK(
    privacy IN ('private', 'public', 'almost_private')
  ),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);