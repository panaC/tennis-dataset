CREATE OR REPLACE FUNCTION ft_diff_co(delay integer, moment date, player varchar, p_oppo varchar)
 RETURNS TABLE(
	 uncertainty float,
	 count bigint,
	 serve_rating float,
	 aces float,
	 double_faults float,
	 first_serve float,
	 first_serve_point_won float,
	 second_serve_point_won float,
	 bp_saved float,
	 service_game_played float,
	 return_rating float,
	 first_serve_return_point_won float,
	 second_serve_return_point_won float,
	 bp_converted float,
	 return_games_played float,
	 service_point_won float,
	 return_point_won float,
	 total_point_won float
 )
AS $$
 DECLARE
     r record;
	BEGIN
		FOR r in (select * from ft_avg_player(delay, moment, p_oppo, player))
		LOOP
			 count := r.count;
			 serve_rating := r.avg_serve_rating;
			 aces := r.avg_aces;
			 double_faults := r.avg_double_faults;
			 first_serve := r.avg_first_serve;
			 first_serve_point_won := r.avg_first_serve_point_won;
			 second_serve_point_won := r.avg_second_serve_point_won;
			 bp_saved := r.avg_bp_saved;
			 service_game_played := r.avg_service_game_played;
			 return_rating := r.avg_return_rating;
			 first_serve_return_point_won := r.avg_first_serve_return_point_won;
			 second_serve_return_point_won := r.avg_second_serve_return_point_won;
			 bp_converted := r.avg_bp_converted;
			 return_games_played := r.avg_return_games_played;
			 service_point_won := r.avg_service_point_won;
			 return_point_won := r.avg_return_point_won;
			 total_point_won := r.avg_total_point_won;

			FOR r in (select * from ft_avg_player(delay, moment, player, p_oppo))
				LOOP
					 serve_rating := serve_rating - r.avg_serve_rating;
					 aces := aces - r.avg_aces;
					 double_faults := double_faults - r.avg_double_faults;
					 first_serve := first_serve - r.avg_first_serve;
					 first_serve_point_won := first_serve_point_won - r.avg_first_serve_point_won;
					 second_serve_point_won := second_serve_point_won - r.avg_second_serve_point_won;
					 bp_saved := bp_saved - r.avg_bp_saved;
					 service_game_played := service_game_played - r.avg_service_game_played;
					 return_rating := return_rating - r.avg_return_rating;
					 first_serve_return_point_won := first_serve_return_point_won - r.avg_first_serve_return_point_won;
					 second_serve_return_point_won := second_serve_return_point_won - r.avg_second_serve_return_point_won;
					 bp_converted := bp_converted - r.avg_bp_converted;
					 return_games_played := return_games_played - r.avg_return_games_played;
					 service_point_won := service_point_won - r.avg_service_point_won;
					 return_point_won := return_point_won - r.avg_return_point_won;
					 total_point_won := total_point_won - r.avg_total_point_won;
						FOR r in (select * from ft_uncertainty(delay, moment, player, p_oppo))
						LOOP
								uncertainty := R.uncertainty;
								RETURN NEXT;
						END LOOP;
				END LOOP;
		END LOOP;
		RETURN;
	END;
 $$
LANGUAGE 'plpgsql';

--select * from ft_diff_co(1, '2018-11-24', 'Marcos Baghdatis', 'Roger Federer')
