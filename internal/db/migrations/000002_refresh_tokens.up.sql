CREATE TABLE IF NOT EXISTS refresh_tokens (
    token TEXT UNIQUE NOT NULL,
    user_id INTEGER NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
