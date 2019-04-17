INSERT INTO users
values('abcdefghijklmnopqrstuvwxyzabcdef', 'zeph', 'password');

SELECT * FROM users;


INSERT INTO tournaments
values('abcdefghijklmnopqrstuvwxyzabcdef', 'TOURNAMENT1');

SELECT * FROM tournaments;


INSERT INTO options
values('abcdefghijklmnopqrstuvwxyzabcdef', 'MARIO KART: DOUBLE DASH', 'abcdefghijklmnopqrstuvwxyzabcdef');

SELECT * FROM options;


INSERT INTO tournament_users
values('abcdefghijklmnopqrstuvwxyzabcdef', 'abcdefghijklmnopqrstuvwxyzabcdef');

SELECT * FROM tournament_users;


INSERT INTO votes_on_options
values('abcdefghijklmnopqrstuvwxyzabcdef', 'abcdefghijklmnopqrstuvwxyzabcdef', FALSE);

SELECT * FROM votes_on_options;

UPDATE votes_on_options
SET in_favor = true
WHERE option_id = 'abcdefghijklmnopqrstuvwxyzabcdef' AND user_id = 'abcdefghijklmnopqrstuvwxyzabcdef';

SELECT * FROM votes_on_options;


