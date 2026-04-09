create table  if not exists schools(
    id int auto_increment primary key,
    name varchar(255) not null,
    address varchar(255) not null,
    latitude float not null,
    longitude float not null,
    unique key unique_school (name,address)
);