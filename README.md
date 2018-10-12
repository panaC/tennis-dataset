# tennis-dataset

### This repo allow both scraping flashscore website and merging every CSV file into a POSTRESQL DB

 - flashscore scraper that fill database for each new match with statistics / odds / live-score
 - CSV merger that fill database for each match line
 
### the database setup contains 6 tables :
  - heads
    - flashscore
    - csv
    - players
    - weather
      - gps
      
## flashscore scraper

this scraper crawl the entire flashscore.com website, more precisely all the ATP tournament begin 2001 and the player page

 - The tools are the puppeter module and sequelize for the orm

### the prod architecture


## CSV merger

this tools merge all the csv file dataset grab into github repo to the database


## how to use
