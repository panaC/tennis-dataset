CREATE OR REPLACE FUNCTION ft_opponent(delay integer, moment date, str varchar)
 RETURNS TABLE (
 opponent varchar
) AS $$
BEGIN
 RETURN QUERY SELECT atpworldtours.winner as Result from atpworldtours
 WHERE atpworldtours.loser = str AND
	extract(epoch from age(moment, atpworldtours.date))/31540000 <= delay
 UNION
 SELECT atpworldtours.loser as Result from atpworldtours
 WHERE atpworldtours.winner = str AND
	extract(epoch from age(moment, atpworldtours.date))/31540000 <= delay;
END; $$
LANGUAGE 'plpgsql';

						   ------------------

CREATE OR REPLACE FUNCTION ft_common_opponent(delay integer, moment date, p1 varchar, p2 varchar)
 RETURNS TABLE (
 opponent varchar
) AS $$
BEGIN
 RETURN QUERY SELECT ft_opponent.opponent FROM ft_opponent(delay, moment, p1)
	WHERE ft_opponent.opponent IN (
		SELECT ft_opponent.opponent FROM ft_opponent(delay, moment, p2)
	);
END; $$
LANGUAGE 'plpgsql';
