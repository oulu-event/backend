drop table if exists events cascade;
drop table if exists users cascade;
drop table if exists join_request cascade;
drop table if exists comments cascade;
drop table if exists notification cascade;
drop table if exists participants cascade;

create table users (
	id serial primary key,
	firstname varchar(100),
	lastname varchar(100),
	email varchar(100),
	password varchar(100),
	dob date
);

create table events (
	id serial primary key,
	name varchar(100),
	location varchar(100),
	description varchar(255),
	datetime date,
	total_participants int,
	photo varchar(100),
	user_id int not null,
		constraint fk_user
			foreign key(user_id)
				references users(id)
);

create table join_request (
	id serial primary key,
	status int,
	event_id int not null,
		constraint fk_event
			foreign key(event_id)
				references events(id),
	user_id int not null,
		constraint fk_user
			foreign key(user_id)
				references users(id)
);

create table comments (
	id serial primary key,
	content varchar(255),
	datetime date,
	event_id int not null,
		constraint fk_event
			foreign key(event_id)
				references events(id),
	user_id int not null,
		constraint fk_user
			foreign key(user_id)
				references users(id)
);

create table notification (
	id serial primary key,
	title varchar(100),
	description varchar(255),
	datetime date,
	user_id int not null,
		constraint fk_user
			foreign key(user_id)
				references users(id)
);

create table participants (
	id serial primary key,
	event_id int not null,
		constraint fk_event
			foreign key(event_id)
				references events(id),
	user_id int not null,
		constraint fk_user
			foreign key(user_id)
				references users(id)
)