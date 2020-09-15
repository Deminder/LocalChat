CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(128) NOT NULL,
    enabled BOOLEAN NOT NULL,
    authorities VARCHAR(30) NOT NULL,
    register_date TIMESTAMP NOT NULL
);

create table persistent_logins (
    username varchar(64) not null,
    series varchar(64) primary key,
    token varchar(64) not null,
    last_used timestamp not null
);