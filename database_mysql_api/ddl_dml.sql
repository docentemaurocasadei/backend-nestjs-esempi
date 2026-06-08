CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NULL,

    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    content TEXT,

    active BOOLEAN DEFAULT true,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_posts_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE SET NULL
);

INSERT INTO categories (name, description) VALUES
('Tecnologia', 'Articoli sul mondo tech e sviluppo software'),
('Marketing', 'Contenuti marketing e social media');

INSERT INTO posts (
    category_id,
    title,
    slug,
    content,
    active
) VALUES

(
    1,
    'Introduzione a NestJS',
    'introduzione-nestjs',
    'NestJS è un framework Node.js basato su TypeScript.',
    true
),

(
    1,
    'Creare API REST con Node',
    'api-rest-node',
    'Le API REST permettono la comunicazione tra client e server.',
    true
),

(
    1,
    'Guida base MySQL',
    'guida-base-mysql',
    'MySQL è uno dei database relazionali più utilizzati.',
    true
),

(
    2,
    'Strategie Social Media',
    'strategie-social-media',
    'Una strategia efficace migliora la presenza online.',
    true
),

(
    2,
    'SEO per principianti',
    'seo-per-principianti',
    'La SEO aiuta i motori di ricerca a indicizzare i contenuti.',
    true
);