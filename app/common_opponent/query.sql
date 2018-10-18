SELECT
'looser Baghdatis' as info,
COUNT(*) as count,
AVG(winner_rank) as wrank,
AVG(loser_rank) as lrank,
AVG(minutes) as minutes,
AVG(l_ace) as ace,
AVG(l_df) as df,
AVG(l_svpt) as svpt,
AVG("l_1stIn") as firstin,
AVG("l_1stWon") as firstwon,
AVG("l_2ndWon") as secondwon,
AVG("l_SvGms") as svgms,
AVG("l_bpSaved") as bpSaved,
AVG("l_bpFaced") as bpFaced from csvs
WHERE csvs.winner_name in (
	SELECT Result FROM
	(
		select csvs.winner_name as Result from csvs
		where csvs.loser_name = 'Marcos Baghdatis'
		union
		select csvs.loser_name as Result from csvs
		where csvs.winner_name = 'Marcos Baghdatis'
	)tt
		where Result in (
			select csvs.winner_name as Result2 from csvs
			where csvs.loser_name = 'Roger Federer'
			union
			select csvs.loser_name as Result2 from csvs
			where csvs.winner_name = 'Roger Federer'
		)
) AND csvs.loser_name = 'Marcos Baghdatis'
union
SELECT
'winner Baghdatis' as info,
COUNT(*) as count,
AVG(winner_rank) as wrank,
AVG(loser_rank) as lrank,
AVG(minutes) as minutes,
AVG(w_ace) as ace,
AVG(w_df) as df,
AVG(w_svpt) as svpt,
AVG("l_1stIn") as firstin,
AVG("w_1stWon") as firstwon,
AVG("w_2ndWon") as secondwon,
AVG("w_SvGms") as svgms,
AVG("w_bpSaved") as bpSaved,
AVG("w_bpFaced") as bpFaced  from csvs
WHERE csvs.loser_name in (
	SELECT Result FROM
	(
		select csvs.winner_name as Result from csvs
		where csvs.loser_name = 'Marcos Baghdatis'
		union
		select csvs.loser_name as Result from csvs
		where csvs.winner_name = 'Marcos Baghdatis'
	)tt
		where Result in (
			select csvs.winner_name as Result2 from csvs
			where csvs.loser_name = 'Roger Federer'
			union
			select csvs.loser_name as Result2 from csvs
			where csvs.winner_name = 'Roger Federer'
		)
) AND csvs.winner_name = 'Marcos Baghdatis'
union
SELECT
'loose Federer' as info,
COUNT(*) as count,
AVG(winner_rank) as wrank,
AVG(loser_rank) as lrank,
AVG(minutes) as minutes,
AVG(l_ace) as ace,
AVG(l_df) as df,
AVG(l_svpt) as svpt,
AVG("l_1stIn") as firstin,
AVG("l_1stWon") as firstwon,
AVG("l_2ndWon") as secondwon,
AVG("l_SvGms") as svgms,
AVG("l_bpSaved") as bpSaved,
AVG("l_bpFaced") as bpFaced from csvs
WHERE csvs.winner_name in (
	SELECT Result FROM
	(
		select csvs.winner_name as Result from csvs
		where csvs.loser_name = 'Marcos Baghdatis'
		union
		select csvs.loser_name as Result from csvs
		where csvs.winner_name = 'Marcos Baghdatis'
	)tt
		where Result in (
			select csvs.winner_name as Result2 from csvs
			where csvs.loser_name = 'Roger Federer'
			union
			select csvs.loser_name as Result2 from csvs
			where csvs.winner_name = 'Roger Federer'
		)
) AND csvs.loser_name = 'Roger Federer'
union
SELECT
'winner Federer' as info,
COUNT(*) as count,
AVG(winner_rank) as wrank,
AVG(loser_rank) as lrank,
AVG(minutes) as minutes,
AVG(w_ace) as ace,
AVG(w_df) as df,
AVG(w_svpt) as svpt,
AVG("l_1stIn") as firstin,
AVG("w_1stWon") as firstwon,
AVG("w_2ndWon") as secondwon,
AVG("w_SvGms") as svgms,
AVG("w_bpSaved") as bpSaved,
AVG("w_bpFaced") as bpFaced  from csvs
WHERE csvs.loser_name in (
	SELECT Result FROM
	(
		select csvs.winner_name as Result from csvs
		where csvs.loser_name = 'Marcos Baghdatis'
		union
		select csvs.loser_name as Result from csvs
		where csvs.winner_name = 'Marcos Baghdatis'
	)tt
		where Result in (
			select csvs.winner_name as Result2 from csvs
			where csvs.loser_name = 'Roger Federer'
			union
			select csvs.loser_name as Result2 from csvs
			where csvs.winner_name = 'Roger Federer'
		)
) AND csvs.winner_name = 'Roger Federer'
