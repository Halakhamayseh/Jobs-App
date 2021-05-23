DROP TABLE IF EXISTS job;
CREATE TABLE job (
    id SERIAL PRIMARY KEY,
    title varchar(255),
    company varchar(255),
    location varchar(255),
    url varchar(255),
    description varchar(255)
);