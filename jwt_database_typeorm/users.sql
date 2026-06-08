--username: admin
--password: password

--username: user
--password: password

INSERT INTO users (username, password, role, active)
VALUES
('admin', '$2b$10$mIgvz2ZX8hKcj0YpXB0ZZefx7OKGjWZivwAokNEwhuTa4JKxx/kXW', 'admin', 1);

INSERT INTO users (username, password, role, active)
VALUES
('user', '$2b$10$mIgvz2ZX8hKcj0YpXB0ZZefx7OKGjWZivwAokNEwhuTa4JKxx/kXW', 'user', 1);