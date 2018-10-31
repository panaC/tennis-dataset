CREATE OR REPLACE FUNCTION ft_minutes_player(delay integer, moment date, p varchar)
 RETURNS TABLE (
 sum_minutes float
) AS $$
BEGIN
 RETURN QUERY select sum(csvs.minutes)::float as sum_minutes from csvs
	where extract(epoch from age(moment, csvs.tourney_date))/86400 <= delay AND
		(csvs.winner_name ILIKE p or csvs.loser_name ILIKE p);
END; $$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION ft_minutes(delay integer, moment date, p1 varchar, p2 varchar)
 RETURNS TABLE (
 sum_minutes float
) AS $$
BEGIN
	RETURN QUERY select (ft_minutes_player(delay, moment, p2) /
		ft_minutes_player(delay, moment, p1)) as sum_minutes;
END; $$
LANGUAGE 'plpgsql';
