CREATE TABLE messages (
    id TEXT NOT NULL,
    sender TEXT NOT NULL,
    receiver TEXT NOT NULL,
    message TEXT NOT NULL,
    group_id TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender) REFERENCES users(id),
    FOREIGN KEY (receiver) REFERENCES users(id)
);