CREATE OR REPLACE FUNCTION ft_combine(delay integer, moment date, player varchar, p_oppo varchar)
 RETURNS TABLE(
   nb_match_win float,
   h2h float,
   minutes integer
 )
AS $$
 DECLARE
     r record;
	BEGIN
		FOR r in (select * from ft_minutes(delay, moment, p_oppo, player))
		LOOP
			  minutes := r.sum_minutes;
			  FOR r in (select * from ft_h2h(p_oppo, player))
				LOOP
					  h2h := r.h2h;
						FOR r in (select * from ft_nb_match_win(p_oppo, player))
						LOOP
								nb_match_win := r.nb_win;
								RETURN NEXT;
						END LOOP;
				END LOOP;
		END LOOP;
		RETURN;
	END;
 $$
LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION ft_set_combine_year(var_year varchar(255))
 returns void
 AS $$
 DECLARE
 	 var_id integer;
     r record;
	BEGIN
		ALTER TABLE heads ADD COLUMN combineId integer;
    EXCEPTION
        WHEN duplicate_column THEN RAISE NOTICE 'column combineId already exists in heads.';
		FOR r in (SELECT heads.id as heads_id, atpworldtours.date as date, atpworldtours.winner as winner, atpworldtours.loser as loser FROM "heads"
				INNER JOIN "atpworldtours" ON atpworldtours."hashId" = "heads"."atpWorldTourId" and atpworldtours.year = var_year)
		LOOP
			insert into combines select * from ft_combine(1, r.date::date, r.winner, r.loser)
				returning id into var_id;
			update heads set combineId = var_id where heads.id = r.heads_id;
		END LOOP;
		RETURN;
	END;
 $$
LANGUAGE 'plpgsql';
