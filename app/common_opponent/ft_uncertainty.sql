
CREATE OR REPLACE FUNCTION ft_u_co_(delay integer, moment date, player varchar, oppo varchar)
 RETURNS TABLE(
	 uncertainty float
 )
 AS $$
 DECLARE
     r record;
	BEGIN
		FOR r in (select extract(epoch from age(moment, atpworldtours.date))/31540000 as year from atpworldtours
			where ((atpworldtours.winner = player AND atpworldtours.loser = oppo) or
				  (atpworldtours.loser = player AND atpworldtours.winner = oppo)) and
			extract(epoch from age(moment, atpworldtours.date))/31540000 <= delay)
		LOOP
					if power(0.8, r.year) > 0.8 then
						uncertainty := 0.8;
					else
						uncertainty := power(0.8, r.year);
					end if;
						RETURN NEXT;
		END LOOP;
		RETURN;
	END;
 $$
LANGUAGE 'plpgsql';

						-----------------

CREATE OR REPLACE FUNCTION ft_u_co(delay integer, moment date, player varchar, oppo varchar)
 RETURNS TABLE (
	 uncertainty float
) AS $$
BEGIN
 RETURN QUERY select sum(f.uncertainty) as uncertainty
	from ft_u_co_(delay, moment, player, oppo) as f;
END; $$
LANGUAGE 'plpgsql';

					-------------------


CREATE OR REPLACE FUNCTION ft_u_mul(delay integer, moment date, player varchar, p_oppo varchar)
 RETURNS TABLE(
	 uncertainty float
 )
 AS $$
 DECLARE
     r record;
	BEGIN
		FOR r in (select * from ft_common_opponent(delay, moment, player, p_oppo))
		LOOP
			uncertainty := ft_u_co(delay, moment, player, r.opponent) * ft_u_co(delay, moment, r.opponent, p_oppo);
						RETURN NEXT;
		END LOOP;
		RETURN;
	END;
 $$
LANGUAGE 'plpgsql';
					-----------------

CREATE OR REPLACE FUNCTION ft_u_sum(delay integer, moment date, player varchar, p_oppo varchar)
 RETURNS TABLE (
	 uncertainty float
) AS $$
BEGIN
 RETURN QUERY select sum(f.uncertainty) as uncertainty
	from ft_u_mul(delay, moment, player, p_oppo) as f;
END; $$
LANGUAGE 'plpgsql';
				   ------------------------

CREATE OR REPLACE FUNCTION ft_uncertainty(delay integer, moment date, player varchar, p_oppo varchar)
 RETURNS TABLE(
	 uncertainty float
 )
 AS $$
 DECLARE
     r record;
	BEGIN
		FOR r in (select * from ft_u_sum(delay, moment, player, p_oppo))
		LOOP
			uncertainty := 1 / r.uncertainty;
						RETURN NEXT;
		END LOOP;
		RETURN;
	END;
 $$
LANGUAGE 'plpgsql';

--select * from ft_uncertainty(1, '2018-11-24', 'Nicolas Mahut', 'Marcos Baghdatis')
--select * from ft_diff_co(10, '2018-11-24', 'Nicolas Mahut', 'Marcos Baghdatis')
