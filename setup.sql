DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS players;

CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255),
    image TEXT,
    email_verified TIMESTAMP(3),
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    score INTEGER DEFAULT 0,
    steak INTEGER DEFAULT 0
);

CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    type VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    provider_account_id VARCHAR(255) NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type VARCHAR(255),
    scope VARCHAR(255),
    id_token TEXT,
    session_state VARCHAR(255),

    CONSTRAINT accounts_provider_provider_account_id_key
        UNIQUE (provider, provider_account_id),

    CONSTRAINT accounts_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES players(id)
        ON DELETE CASCADE
);
