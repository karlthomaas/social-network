DROP TABLE reactions;

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
