CREATE OR REPLACE FUNCTION ft_nb_match_win(p1 varchar, p2 varchar)
 RETURNS TABLE (
 nb_win float
) AS $$
BEGIN
 RETURN QUERY select count(*)::float as nb_win from atpworldtours
	where atpworldtours.winner = p1 and atpworldtours.loser = p2;
END; $$
LANGUAGE 'plpgsql';

--select * from ft_nb_match_win('Roger Federer', 'Rafael Nadal')
--union
--select * from ft_nb_match_win('Rafael Nadal', 'Roger Federer')

CREATE OR REPLACE FUNCTION ft_h2h(p1 varchar, p2 varchar)
 RETURNS TABLE (
 h2h float
) AS $$
BEGIN
	RETURN QUERY select ((ft_nb_match_win(p2, p1) - ft_nb_match_win(p1, p2)) /
		(ft_nb_match_win(p2, p1) + ft_nb_match_win(p1, p2))) as h2h;
END; $$
LANGUAGE 'plpgsql';

--select 'r' as n, * from ft_h2h('Roger Federer', 'Rafael Nadal')
--union
--select 'n' as n, * from ft_h2h('Rafael Nadal', 'Roger Federer')
