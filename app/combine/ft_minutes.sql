CREATE OR REPLACE FUNCTION ft_minutes(delay integer, moment date, p1 varchar, p2 varchar)
 RETURNS TABLE (
 sum_minutes integer
) AS $$
BEGIN
 RETURN QUERY select sum(csvs.minutes) as sum_minutes from csvs
	where extract(epoch from age(moment, csvs.tourney_date))/86400 <= delay AND
		(csvs.winner_name ILIKE p1 or csvs.loser_name ILIKE p2);
END; $$
LANGUAGE 'plpgsql';
