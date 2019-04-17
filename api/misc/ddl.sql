CREATE TABLE users (
  id uuid,
  name VARCHAR(128) NOT NULL UNIQUE,
  password VARCHAR(60) NOT NULL, /* bcrypt-hashed password is always 59 or 60 bytes */

  PRIMARY KEY (id)
);


CREATE TABLE tournaments (
  id SERIAL,
  name VARCHAR(128) NOT NULL,
  in_progress BOOLEAN DEFAULT FALSE,
  current_round INT DEFAULT 0,
  rounds_remaining INT DEFAULT 0,

  PRIMARY KEY (id)
);

CREATE TABLE tournament_users (
  user_id uuid,
  tournament_id SERIAL,
  is_admin BOOLEAN DEFAULT FALSE,
  can_vote BOOLEAN DEFAULT TRUE,

  PRIMARY KEY (user_id, tournament_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE
);

/* nested set or flat table ??? */
CREATE TABLE options (
  id SERIAL,
  tournament_id SERIAL,
  choice1 VARCHAR(128) NOT NULL,
  choice2 VARCHAR(128) NOT NULL,
  currently_active boolean DEFAULT TRUE,
  
  PRIMARY KEY (id),
  FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE
);

CREATE TABLE votes_on_options (
  option_id SERIAL,
  user_id uuid,
  vote_for_choice1 boolean NOT NULL,

  PRIMARY KEY (option_id, user_id),
  FOREIGN KEY (option_id) REFERENCES options(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);


  /* some trigger to ensure that tournament must have at least one admin or gets deleted? */
  /* some trigger to ensure that rounds_remaining is correct */
  /* some trigger to ensure that as current_round increases, rounds_remaining increases */
  /* some trigger to ensure that when rounds_remaining is 0, in_progress is false set in_progress to false */


CREATE TABLE "user_sessions" (
  "sid" varchar NOT NULL COLLATE "default",
	"session" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;