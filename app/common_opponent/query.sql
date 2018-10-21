SELECT
'surface & year' as info,
count as count_total,
first_value(wage) over (ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)
	- last_value(wage) over (ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) as wage,
first_value(lage) over (ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)
	- last_value(lage) over (ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) as lage,
first_value(count) over (ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)
	- last_value(count) over (ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) as count,
first_value(wrank) over (ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)
	- last_value(wrank) over (ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) as wrank,
first_value(lrank) over (ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)
	- last_value(lrank) over (ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) as lrank,
first_value(minutes) over (ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)
	- last_value(minutes) over (ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) as minutes,
first_value(ace) over (ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)
	- last_value(ace) over (ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) as ace,
first_value(df) over (ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)
	- last_value(df) over (ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) as df,
first_value(svpt) over (ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)
	- last_value(svpt) over (ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) as svpt,
first_value(firstin) over (ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)
	- last_value(firstin) over (ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) as firstin,
first_value(firstwon) over (ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)
	- last_value(firstwon) over (ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) as firstwon,
first_value(secondwon) over (ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)
	- last_value(secondwon) over (ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) as secondwon,
first_value(svgms) over (ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)
	- last_value(svgms) over (ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) as svgms,
first_value(bpsaved) over (ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)
	- last_value(bpsaved) over (ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) as bpsaved,
first_value(bpfaced) over (ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)
	- last_value(bpfaced) over (ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) as bpfaced
FROM (
	SELECT
	AVG(wage) as wage,
	AVG(lage) as lage,
	SUM (count) as count,
	AVG(wrank) as wrank,
	AVG(lrank) as lrank,
	AVG(minutes) as minutes,
	AVG(ace) as ace,
	AVG(df) as df,
	AVG(svpt) as svpt,
	AVG("firstin") as firstin,
	AVG("firstwon") as firstwon,
	AVG("secondwon") as secondwon,
	AVG("svgms") as svgms,
	AVG("bpsaved") as bpsaved,
	AVG("bpfaced") as bpfaced
	FROM (
		SELECT
		'looser Baghdatis' as info,
		stddev(winner_age) as wage,
		stddev(loser_age) as lage,
		COUNT(*) as count,
		stddev(winner_rank) as wrank,
		stddev(loser_rank) as lrank,
		AVG(minutes) as minutes,
		AVG(l_ace) as ace,
		AVG(l_df) as df,
		AVG(l_svpt) as svpt,
		AVG("l_1stIn") as firstin,
		AVG("l_1stWon") as firstwon,
		AVG("l_2ndWon") as secondwon,
		AVG("l_SvGms") as svgms,
		AVG("l_bpSaved") as bpsaved,
		AVG("l_bpFaced") as bpfaced from csvs
		WHERE csvs.winner_name in (
			SELECT Result FROM
			(
				select csvs.winner_name as Result from csvs
				where csvs.loser_name = 'Marcos Baghdatis' AND
				csvs.tourney_date ~ '^2018' AND
				csvs.surface = 'Clay'
				union
				select csvs.loser_name as Result from csvs
				where csvs.winner_name = 'Marcos Baghdatis' AND
				csvs.tourney_date ~ '^2018' AND
				csvs.surface = 'Clay'
			)tt
				where Result in (
					select csvs.winner_name as Result2 from csvs
					where csvs.loser_name = 'Roger Federer' AND
					csvs.tourney_date ~ '^2018' AND
					csvs.surface = 'Clay'
					union
					select csvs.loser_name as Result2 from csvs
					where csvs.winner_name = 'Roger Federer' AND
					csvs.tourney_date ~ '^2018' AND
					csvs.surface = 'Clay'
				)
		) AND csvs.loser_name = 'Marcos Baghdatis'
		union
		SELECT
		'winner Baghdatis' as info,
		stddev(winner_age) as wage,
		stddev(loser_age) as lage,
		COUNT(*) as count,
		stddev(winner_rank) as wrank,
		stddev(loser_rank) as lrank,
		AVG(minutes) as minutes,
		AVG(w_ace) as ace,
		AVG(w_df) as df,
		AVG(w_svpt) as svpt,
		AVG("l_1stIn") as firstin,
		AVG("w_1stWon") as firstwon,
		AVG("w_2ndWon") as secondwon,
		AVG("w_SvGms") as svgms,
		AVG("w_bpSaved") as bpsaved,
		AVG("w_bpFaced") as bpfaced  from csvs
		WHERE csvs.loser_name in (
			SELECT Result FROM
			(
				select csvs.winner_name as Result from csvs
				where csvs.loser_name = 'Marcos Baghdatis' AND
				csvs.tourney_date ~ '^2018' AND
				csvs.surface = 'Clay'
				union
				select csvs.loser_name as Result from csvs
				where csvs.winner_name = 'Marcos Baghdatis' AND
				csvs.tourney_date ~ '^2018' AND
				csvs.surface = 'Clay'
			)tt
				where Result in (
					select csvs.winner_name as Result2 from csvs
					where csvs.loser_name = 'Roger Federer' AND
					csvs.tourney_date ~ '^2018' AND
					csvs.surface = 'Clay'
					union
					select csvs.loser_name as Result2 from csvs
					where csvs.winner_name = 'Roger Federer' AND
					csvs.tourney_date ~ '^2018' AND
					csvs.surface = 'Clay'
				)
		) AND csvs.winner_name = 'Marcos Baghdatis'
	)pp
	union
	SELECT
	AVG(wage) as wage,
	AVG(lage) as lage,
	SUM(count) as count,
	AVG(wrank) as wrank,
	AVG(lrank) as lrank,
	AVG(minutes) as minutes,
	AVG(ace) as ace,
	AVG(df) as df,
	AVG(svpt) as svpt,
	AVG("firstin") as firstin,
	AVG("firstwon") as firstwon,
	AVG("secondwon") as secondwon,
	AVG("svgms") as svgms,
	AVG("bpsaved") as bpsaved,
	AVG("bpfaced") as bpfaced
	FROM (
		SELECT
		'loose Federer' as info,
		stddev(winner_age) as wage,
		stddev(loser_age) as lage,
		COUNT(*) as count,
		stddev(winner_rank) as wrank,
		stddev(loser_rank) as lrank,
		AVG(minutes) as minutes,
		AVG(l_ace) as ace,
		AVG(l_df) as df,
		AVG(l_svpt) as svpt,
		AVG("l_1stIn") as firstin,
		AVG("l_1stWon") as firstwon,
		AVG("l_2ndWon") as secondwon,
		AVG("l_SvGms") as svgms,
		AVG("l_bpSaved") as bpsaved,
		AVG("l_bpFaced") as bpfaced from csvs
		WHERE csvs.winner_name in (
			SELECT Result FROM
			(
				select csvs.winner_name as Result from csvs
				where csvs.loser_name = 'Marcos Baghdatis' AND
				csvs.tourney_date ~ '^2018' AND
				csvs.surface = 'Clay'
				union
				select csvs.loser_name as Result from csvs
				where csvs.winner_name = 'Marcos Baghdatis' AND
				csvs.tourney_date ~ '^2018' AND
				csvs.surface = 'Clay'
			)tt
				where Result in (
					select csvs.winner_name as Result2 from csvs
					where csvs.loser_name = 'Roger Federer' AND
					csvs.tourney_date ~ '^2018' AND
					csvs.surface = 'Clay'
					union
					select csvs.loser_name as Result2 from csvs
					where csvs.winner_name = 'Roger Federer' AND
					csvs.tourney_date ~ '^2018' AND
					csvs.surface = 'Clay'
				)
		) AND csvs.loser_name = 'Roger Federer'
		union
		SELECT
		'winner Federer' as info,
		stddev(winner_age) as wage,
		stddev(loser_age) as lage,
		COUNT(*) as count,
		stddev(winner_rank) as wrank,
		stddev(loser_rank) as lrank,
		AVG(minutes) as minutes,
		AVG(w_ace) as ace,
		AVG(w_df) as df,
		AVG(w_svpt) as svpt,
		AVG("l_1stIn") as firstin,
		AVG("w_1stWon") as firstwon,
		AVG("w_2ndWon") as secondwon,
		AVG("w_SvGms") as svgms,
		AVG("w_bpSaved") as bpsaved,
		AVG("w_bpFaced") as bpfaced  from csvs
		WHERE csvs.loser_name in (
			SELECT Result FROM
			(
				select csvs.winner_name as Result from csvs
				where csvs.loser_name = 'Marcos Baghdatis' AND
				csvs.tourney_date ~ '^2018' AND
				csvs.surface = 'Clay'
				union
				select csvs.loser_name as Result from csvs
				where csvs.winner_name = 'Marcos Baghdatis' AND
				csvs.tourney_date ~ '^2018' AND
				csvs.surface = 'Clay'
			)tt
				where Result in (
					select csvs.winner_name as Result2 from csvs
					where csvs.loser_name = 'Roger Federer' AND
					csvs.tourney_date ~ '^2018' AND
					csvs.surface = 'Clay'
					union
					select csvs.loser_name as Result2 from csvs
					where csvs.winner_name = 'Roger Federer' AND
					csvs.tourney_date ~ '^2018' AND
					csvs.surface = 'Clay'
				)
		) AND csvs.winner_name = 'Roger Federer'
	)kk
)aa
LIMIT 1
