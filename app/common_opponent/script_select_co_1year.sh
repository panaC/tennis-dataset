#! /bin/bash
set PGPASSWORD=dataset1747

psql -h 10.164.0.2 -U dataset -d dataset-dump1 -a -f ft_set_commonopponent_1year.sql

for i in {2001..2018}; do
  echo "\x \\ SELECT ft_set_commonopponent_1year_year('$i');" | psql -h 10.164.0.2 -U dataset -d dataset-dump1 -a &
done
