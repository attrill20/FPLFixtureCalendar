# FPL Fixture Difficulty Calendar - James Attrill Side Project

Side Project - A FPL Fixture Calendar that shows the upcoming fixtures for each Premier League team and ranks them based on their difficulty. I aim to use this side project to practice my React, JS and CSS skills. Will eventually merge with the official FPL API or perhaps even create my own one to practice more advanced back-end skills. Any suggestions welcome!

E-mail address: attrill20@gmail.com

## Current To-Do List

- Add club badges 
- Display fixtures in a table
- Add a search bar to filter fixtures
- Import the FPL API
- Colour code fixture difficulty
- Add home and away display
- Reorder table based on fixture difficulty (create own algorithm?)

## 13/05/23

Initialised the repo on GitHub. Set up a new React project and made sure all the components are linked, passed down props of teams and GWs down from app.js down to cardlist and card. Felt good to see them successfully rendering! Set up dummy arrays of teams and GWs to check that they were diplaying properly and learnt about using [index] if mapping multiple arrays. 

Did some basic styling to check the files were all linked up properly, changed the background color and made some parts of the text bold to improve readability. Put all the fixtures into a table and ensured the width of the columns remained the same even when team name lengths changed. 

A good start. Here's the first screenshot of progress:

<img width="1652" alt="Screenshot 2023-05-13 at 23 42 55" src="https://github.com/attrill20/FPLFixtureCalendar/assets/123314687/4cfe2324-0614-45e3-b7b5-bb58264b75ad">

## 15/05/23

Did some reading and research as to what API I would need to use to implement in the project. Here are some useful links:

- Live FPL Rank: https://www.livefpl.net/rank (useful website displaying loads of data, nice new design)
- Official FPL API: https://fantasy.premierleague.com/api/fixtures/ (this is the full database, might need to filter for useful information)
- Medium article: https://medium.com/@frenzelts/fantasy-premier-league-api-endpoints-a-detailed-guide-acbd5598eb19 (explains how to use the API)
- Football Fallout Calendar: https://www.footballfallout.com/fpl/fixture-difficulty-planner (the current fixture calendar I use, aim to build on this)
