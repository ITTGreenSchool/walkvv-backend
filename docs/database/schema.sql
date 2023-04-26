-- Totems table:
-- id: unique identifier
-- points: number of points
-- latitude: latitude of the totem
-- longitude: longitude of the totem
CREATE TABLE totems (
    id INTEGER AUTO_INCREMENT NOT NULL,
    points INTEGER NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    PRIMARY KEY (id)
);

-- Users table:
-- email: unique identifier
-- password: password of the user
-- username: username of the user
-- points: number of points of the user

CREATE TABLE users (
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    PRIMARY KEY (email)
);

-- Footpaths table:
-- id: unique identifier
-- name: name of the footpath
-- description: description of the footpath
-- length: length of the footpath
-- difficulty: difficulty of the footpath
-- starting_totem: id of the starting totem (foreign key)
-- ending_totem: id of the ending totem (foreign key)

CREATE TABLE footpaths (
    id INTEGER AUTO_INCREMENT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    length FLOAT NOT NULL,
    difficulty VARCHAR(255) NOT NULL,
    starting_totem INTEGER NOT NULL,
    ending_totem INTEGER NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (starting_totem) REFERENCES totems (id),
    FOREIGN KEY (ending_totem) REFERENCES totems (id)
);

-- Scans table:
-- scan_id: unique identifier
-- totem_id: id of the totem (foreign key)
-- user_id: id of the user (foreign key)
-- datetime: date and time of the scan
CREATE TABLE scans (
    scan_id INT NOT NULL AUTO_INCREMENT,
	totem_id INT NOT NULL,
    user_id INT NOT NULL,
    datetime DATETIME NOT NULL,
    FOREIGN KEY (totem_id) REFERENCES totems(id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    UNIQUE (totem_id, user_id),
    PRIMARY KEY	(scan_id)
);
