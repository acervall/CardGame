DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS user_settings;

CREATE TABLE users (
  id serial PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  salt TEXT NOT NULL
);

CREATE TABLE user_settings (
  id serial PRIMARY KEY, 
  opacity integer, 
  background_color text,
  user_id integer,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE OR REPLACE FUNCTION create_basics_for_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_list_id INTEGER;
BEGIN
  INSERT INTO user_settings (opacity, background_color, user_id) VALUES (80, '#ffffff', NEW.id);
  -- INSERT INTO lists (name, homepage, user_id) VALUES ('To Do', true, NEW.id) RETURNING id INTO new_list_id;
  -- INSERT INTO tasks (name, list_id) VALUES ('First task', new_list_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_list_after_user_insert
AFTER INSERT
ON users
FOR EACH ROW
EXECUTE FUNCTION create_basics_for_new_user();


-- alla users har password 'Password' 
INSERT INTO users (username, email, password, salt, first_name, last_name) 
VALUES 
('jdoe', 'john.doe@example.com', 'bf304fdd3a7cca0b4eda193c5a23627e1360389b7f451393302ef47a7c8ca1aa', '9c868726245fa6876381b94ac8e9ce7b', 'John', 'Doe'),
('asmith', 'anna.smith@example.com', '7c8facbf4269ab8e6fd9214c281965f8377ba4de9c1c6fae6662b0c3f6f9bec8', 'f184d9868fc2899e3dcef4742b97aa32', 'Anna', 'Smith'),
('bclark', 'bob.clark@example.com', '22006c08a1a0649e5b20a2760e31d1ac8d36f9c2a221110cb5c186e8227fb26c', '48996742d9e94fc015e5717788bf88fb', 'Bob', 'Clark');