
CREATE OR REPLACE FUNCTION ft_avg_spec(delay integer, moment date, player varchar, oppo varchar)
 RETURNS TABLE(
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
		FOR r in (select * from atpworldtours
			where ((atpworldtours.winner = player AND atpworldtours.loser = oppo) or
				  (atpworldtours.loser = player AND atpworldtours.winner = oppo)) and
			extract(epoch from age(moment, atpworldtours.date))/31540000 <= delay)
		LOOP
			IF r.winner = player THEN
						avg_serve_rating := r.winner_serve_rating;
						avg_aces := r.winner_aces;
						avg_double_faults := r.winner_double_faults;
						avg_first_serve := r.winner_first_serve_ptg;
						avg_first_serve_point_won := r.winner_first_serve_point_won_ptg;
						avg_second_serve_point_won := r.winner_second_serve_point_won_ptg;
						avg_bp_saved := r.winner_bp_saved_ptg;
						avg_service_game_played := r.winner_service_game_played;
						avg_return_rating := r.winner_return_rating;
						avg_first_serve_return_point_won := r.winner_first_serve_return_point_won_ptg;
						avg_second_serve_point_won := r.winner_second_serve_return_point_won_ptg;
						avg_bp_converted := r.winner_bp_converted_ptg;
						avg_return_games_played := r.winner_return_games_played;
						avg_service_point_won := r.winner_service_point_won_ptg;
						avg_return_point_won := r.winner_return_point_won_ptg;
						avg_total_point_won := r.winner_total_point_won_ptg;
			ELSE
						avg_serve_rating := r.loser_serve_rating;
						avg_aces := r.loser_aces;
						avg_double_faults := r.loser_double_faults;
						avg_first_serve := r.loser_first_serve_ptg;
						avg_first_serve_point_won := r.loser_first_serve_point_won_ptg;
						avg_second_serve_point_won := r.loser_second_serve_point_won_ptg;
						avg_bp_saved := r.loser_bp_saved_ptg;
						avg_service_game_played := r.loser_service_game_played;
						avg_return_rating := r.loser_return_rating;
						avg_first_serve_return_point_won := r.loser_first_serve_return_point_won_ptg;
						avg_second_serve_return_point_won := r.loser_second_serve_return_point_won_ptg;
						avg_bp_converted := r.loser_bp_converted_ptg;
						avg_return_games_played := r.loser_return_games_played;
						avg_service_point_won := r.loser_service_point_won_ptg;
						avg_return_point_won := r.loser_return_point_won_ptg;
						avg_total_point_won := r.loser_total_point_won_ptg;
			END IF;
						RETURN NEXT;
		END LOOP;
		RETURN;
	END;
 $$
LANGUAGE 'plpgsql';

						-----------------

CREATE OR REPLACE FUNCTION ft_avg(delay integer, moment date, player varchar, oppo varchar)
 RETURNS TABLE (
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
) AS $$
BEGIN
 RETURN QUERY select count(*) as count,
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
	from ft_avg_spec(delay, moment, player, oppo) as f;
END; $$
LANGUAGE 'plpgsql';

 /*
 select 'fe' as n, * from ft_avg(20, '2018-11-24', 'Roger Federer', 'Marcos Baghdatis')
					union
 select 'ba' as n, * from ft_avg(20, '2018-11-24', 'Marcos Baghdatis' , 'Roger Federer')
 */
