CREATE TABLE conversation (
    id int primary key generated always as identity,
    name varchar(40) not null,
    creator varchar(40) not null,
    create_date timestamp not null
);

CREATE TABLE member (
    id int primary key generated always as identity,
    user_id int not null,
    conversation_id int not null,
    "read" boolean not null,
    "write" boolean not null,
    "voice" boolean not null,
    "moderate" boolean not null,
    "administrate" boolean not null,
    last_read timestamp not null,
    join_date timestamp not null,
    constraint fk_mem_conversation
              foreign key(conversation_id)
        	  references conversation(id)
        	  on delete cascade,
    constraint fk_mem_user
          foreign key(user_id)
    	  references "user"(id)
    	  on delete cascade
);

CREATE TABLE conversation_message (
    id int primary key generated always as identity,
    "text" text not null,
    author_id int,
    conversation_id int not null,
    author_date timestamp not null,
    last_change timestamp not null,
    constraint fk_msg_author
              foreign key(author_id)
        	  references "user"(id)
        	  on delete cascade,
    constraint fk_msg_conversation
          foreign key(conversation_id)
    	  references member(id)
    	  on delete cascade
);