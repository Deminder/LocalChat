CREATE TABLE "user" (
    id int primary key generated always as identity,
    username varchar(20) not null unique,
    password varchar(128) not null,
    enabled BOOLEAN not null,
    authorities varchar(30) not null,
    register_date timestamp not null
);

create table login_token (
    id int primary key generated always as identity,
    token varchar(64) not null unique,
    user_id int not null,
    description varchar(128) not null,
    last_used timestamp not null,
    create_date timestamp not null,
    constraint fk_user_id_token
              foreign key(user_id)
              references "user"(id)
              on delete cascade
);