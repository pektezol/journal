CREATE TABLE "users" (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE "tasks" (
    id INTEGER PRIMARY KEY,
    owner INT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    finished BOOLEAN NOT NULL DEFAULT false,
    position INT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (owner) REFERENCES "users"(id)
);

CREATE TABLE "folders" (
    id INTEGER PRIMARY KEY,
    owner INT NOT NULL,
    parent INT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (parent) REFERENCES "folders"(id),
    FOREIGN KEY (owner) REFERENCES "users"(id)
);

CREATE TABLE "notes" (
    id INTEGER PRIMARY KEY,
    owner INT NOT NULL,
    folder INT NOT NULL,
    note TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (folder) REFERENCES "folders"(id),
    FOREIGN KEY (owner) REFERENCES "users"(id)
);
