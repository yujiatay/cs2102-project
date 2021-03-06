CREATE TABLE Restaurants (
  username varchar(25) PRIMARY KEY CHECK (LENGTH(username) > 0),
  password text NOT NULL,
  email varchar(255) UNIQUE NOT NULL CHECK (email ~ '^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$'),
  name varchar(100) NOT NULL,
  cuisine_type integer NOT NULL CHECK (cuisine_type > 0),
  branch_location varchar(255) NOT NULL,
  opening_hours varchar(255) NOT NULL,
  capacity integer NOT NULL,
  created_at bigint NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)
);

CREATE TABLE Diners (
  username varchar(25) PRIMARY KEY CHECK (LENGTH(username) > 0),
  password text NOT NULL,
  email varchar(255) UNIQUE NOT NULL CHECK (email ~ '^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$'),
  points integer NOT NULL DEFAULT 0,
  referral_code varchar(25) UNIQUE NOT NULL,
  referrer varchar(255) REFERENCES Diners (username),
  created_at bigint NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)
);

CREATE TABLE MenuItems (
  username varchar(25) REFERENCES Restaurants (username) ON UPDATE CASCADE ON DELETE CASCADE,
  name varchar(100) NOT NULL CHECK (LENGTH(name) > 0),
  type integer NOT NULL CHECK (type > 0),
  price numeric(10, 2) NOT NULL CHECK (price > 0.0),
  description text NOT NULL,
  image varchar(255),
  created_at bigint NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000),
  PRIMARY KEY (username, name)
);

CREATE TABLE AvailableSlots (
  username varchar(25) REFERENCES Restaurants (username) ON UPDATE CASCADE ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  created_at bigint NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000),
  PRIMARY KEY (username, day_of_week, start_time, end_time),
  CHECK (start_time < end_time)
);

CREATE TABLE Tags (
  name varchar(100) PRIMARY KEY CHECK (LENGTH(name) > 0),
  created_at bigint NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)
);

CREATE TABLE RestaurantTags (
  username varchar(25) REFERENCES Restaurants (username) ON UPDATE CASCADE ON DELETE CASCADE,
  tag varchar(100) REFERENCES Tags (name) ON UPDATE CASCADE ON DELETE CASCADE,
  created_at bigint NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000),
  PRIMARY KEY (username, tag)
);

CREATE TABLE Bookings (
  rusername varchar(25) REFERENCES Restaurants (username) ON UPDATE CASCADE ON DELETE CASCADE,
  dusername varchar(25) REFERENCES Diners (username) ON UPDATE CASCADE ON DELETE CASCADE,
  day_of_week integer NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  booking_date bigint NOT NULL,
  pax integer NOT NULL CHECK (pax > 0),
  message text,
  is_confirmed boolean DEFAULT FALSE,
  created_at bigint NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000),
  PRIMARY KEY (dusername, rusername, day_of_week, start_time, end_time, booking_date),
  FOREIGN KEY (rusername, day_of_week, start_time, end_time) REFERENCES AvailableSlots (username, day_of_week, start_time, end_time)
);

CREATE TABLE Bookmarks (
  dusername varchar(25) REFERENCES Diners (username) ON UPDATE CASCADE ON DELETE CASCADE,
  rusername varchar(25) REFERENCES Restaurants (username) ON UPDATE CASCADE ON DELETE CASCADE,
  created_at bigint NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000),
  PRIMARY KEY (dusername, rusername)
);

CREATE TABLE Reviews (
  rusername varchar(25) REFERENCES Restaurants (username) ON UPDATE CASCADE ON DELETE CASCADE,
  dusername varchar(25) REFERENCES Diners (username),
  comment text,
  rating integer NOT NULL CHECK (rating >= 0 AND rating <= 5),
  created_at bigint NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000),
  updated_at bigint NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000),
  PRIMARY KEY (rusername, dusername)
);

CREATE TABLE Articles (
  username varchar(25) REFERENCES Diners (username) ON UPDATE CASCADE ON DELETE CASCADE,
  title varchar(255) NOT NULL CHECK (LENGTH(title) > 0),
  content text NOT NULL CHECK (LENGTH(content) > 0),
  created_at bigint NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000),
  updated_at bigint NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000),
  PRIMARY KEY (username, created_at)
);

CREATE TABLE Comments (
  ausername varchar(25) REFERENCES Diners (username),
  acreated_at bigint,
  username varchar(25) REFERENCES Diners (username),
  content text NOT NULL CHECK (LENGTH(content) > 0),
  created_at bigint NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000),
  updated_at bigint NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000),
  PRIMARY KEY (ausername, acreated_at, username, created_at),
  FOREIGN KEY (ausername, acreated_at) REFERENCES Articles (username, created_at)
);
