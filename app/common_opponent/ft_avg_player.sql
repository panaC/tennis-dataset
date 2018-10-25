CREATE OR REPLACE FUNCTION ft_avg_player_(delay integer, moment date, player varchar, p_oppo varchar)
 RETURNS TABLE(
	 count bigint,
	 avg_serve_rating float,
	 avg_aces float,
	 avg_double_faults float,
	 avg_first_serve float,
	 avg_first_serve_point_won float,
	 avg_second_serve_point_won float,
	 avg_bp_saved float,
	 avg_service_game_played float,
	 avg_return_rating float,
	 avg_first_serve_return_point_won float,
	 avg_second_serve_return_point_won float,
	 avg_bp_converted float,
	 avg_return_games_played float,
	 avg_service_point_won float,
	 avg_return_point_won float,
	 avg_total_point_won float
 )
 AS $$
 DECLARE
     r record;
	BEGIN
		FOR r in (select * from ft_common_opponent(delay, moment, player, p_oppo))
		LOOP
			return query select * from ft_avg(delay, moment, player, r.opponent);
		END LOOP;
		RETURN;
	END;
 $$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION ft_avg_player(delay integer, moment date, player varchar, p_oppo varchar)
 RETURNS TABLE (
	 count numeric,
	 avg_serve_rating float,
	 avg_aces float,
	 avg_double_faults float,
	 avg_first_serve float,
	 avg_first_serve_point_won float,
	 avg_second_serve_point_won float,
	 avg_bp_saved float,
	 avg_service_game_played float,
	 avg_return_rating float,
	 avg_first_serve_return_point_won float,
	 avg_second_serve_return_point_won float,
	 avg_bp_converted float,
	 avg_return_games_played float,
	 avg_service_point_won float,
	 avg_return_point_won float,
	 avg_total_point_won float
) AS $$
BEGIN
 RETURN QUERY select sum(f.count) as count,
	avg(f.avg_serve_rating) as avg_serve_rating,
	avg(f.avg_aces) as avg_aces,
	avg(f.avg_double_faults) as avg_double_faults,
	avg(f.avg_first_serve) as avg_first_serve,
	avg(f.avg_first_serve_point_won) as avg_first_serve_point_won,
	avg(f.avg_second_serve_point_won) as avg_second_serve_point_won,
	avg(f.avg_bp_saved) as avg_bp_saved,
	avg(f.avg_service_game_played) as avg_service_game_played,
	avg(f.avg_return_rating) as avg_return_rating,
	avg(f.avg_first_serve_return_point_won) as avg_first_serve_return_point_won,
	avg(f.avg_second_serve_return_point_won) as avg_second_serve_return_point_won,
	avg(f.avg_bp_converted) as avg_bp_converted,
	avg(f.avg_return_games_played) as avg_return_games_played,
	avg(f.avg_service_point_won) as avg_service_point_won,
	avg(f.avg_return_point_won) as avg_return_point_won,
	avg(f.avg_total_point_won) as avg_total_point_won
	from ft_avg_player_(delay, moment, player, p_oppo) as f;
END; $$
LANGUAGE 'plpgsql';

-- select * from ft_avg_player(1, '2018-11-24', 'Marcos Baghdatis', 'Roger Federer')
