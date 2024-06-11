DROP TABLE IF EXISTS group_requests;
DROP TABLE IF EXISTS group_invitations;
DROP TABLE IF EXISTS follow_requests;

CREATE TABLE IF NOT EXISTS notifications (
    id TEXT NOT NULL,
    sender TEXT NOT NULL,
    receiver TEXT NOT NULL,
    follow_request_id TEXT,
    group_invitation_id TEXT,
    group_request_id TEXT,
    group_event_id TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE group_requests (
    id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    group_id TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(user_id, group_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
);
CREATE TABLE group_invitations (
    id TEXT NOT NULL,
    group_id TEXT NOT NULL,
    invited_by TEXT NOT NULL,
    user_id TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (invited_by) REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (group_id, user_id)
);

CREATE TABLE follow_requests (
  id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  follower_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(user_id, follower_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (follower_id) REFERENCES users(id)
);