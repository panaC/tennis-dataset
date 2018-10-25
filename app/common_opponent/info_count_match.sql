SELECT 'atp' as name, count(*) as count from atpworldtours
WHERE extract(epoch from age('2018-11-24', atpworldtours.date))/31540000 <= 1
union
SELECT 'csv' as name, count(*) as count from csvs
WHERE extract(epoch from age('2018-11-24', csvs.tourney_date))/31540000 <= 1			
