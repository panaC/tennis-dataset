#! /bin/bash
export PGPASSWORD=dataset1747

psql -h 10.164.0.2 -U dataset -d dataset-dump1 -a -f create_table.sql

psql -h 10.164.0.2 -U dataset -d dataset-dump1 -a -f ft_h2h.sql
psql -h 10.164.0.2 -U dataset -d dataset-dump1 -a -f ft_minutes.sql
psql -h 10.164.0.2 -U dataset -d dataset-dump1 -a -f ft_set_combine.sql

for i in {2001..2018}; do
  echo "SELECT ft_set_combine_year('$i');" | psql -h 10.164.0.2 -U dataset -d dataset-dump1 -a &
done
