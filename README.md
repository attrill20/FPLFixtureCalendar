# FPL Fixture Difficulty Calendar - James Attrill Side Project

## Project Overview

This project is an FPL Fixture Calendar that shows the upcoming fixtures for each Premier League team and ranks them based on their difficulty. I aim to use this side project to practice my React, JS and CSS skills. It uses official FPL API to display fixtures and encorporates my very own custom 1-10 difficulty ranking system (found here: https://docs.google.com/spreadsheets/d/1wYS6wyRkHiP-9zlJAkd_V9vjnxXslpNinz-CLg6BILs/edit#gid=0) to better plan upcoming transfers compared to the official FPL 1-5 simplified rating system. Any suggestions welcome!

There is a blog below showing my ongoing progress and planned to-do list.

## Deployment and Info

To run: Clone repo, navigate to FPL-fixtures folder and enter 'npm run start' in command line. Will load the site in browser (the serverless function is delpoyed on Vercel in a seperate repo)

Deployed at: https://fpl-fixture-calendar.vercel.app/

E-mail address: attrill20@gmail.com

## Current To-Do List

#### Long-Term Goals

- Add testing
- Ensure accessibility
- Link to betting site for odds
- Clean sheet percentage
- Launch site as a React App
- Promote further on Twitter FPL with content creators

#### Player Searcher Page

- Add auto-suggest options when searching
- Add more stats to the Player Searcher

#### Site Changes

- Add a header Navbar for the site
- Insert a better sorting method (click the column itself to sort ASC / DESC)
- Improve the Google Sheets calculations using more automated data (form, injuries, xG, home / away performance etc)
- Scrape the xG data from an external site

#### Issues

- Table repeats header on every row, change to display once and get the table to scroll (could use Material UI table)
- Add a cache to prevent no fixtures displaying when the server occasionally goes down

## 13/12/23

Made lots of small iterative changes over the past few days including: replaced the button with a toggle switch to change between Custom FDR / Original FPL, moved the sorting to the right button (want to change this to be imbedded within the table columns soon), tidied up a lot of CSS styling to get the ratios better for mobile and the moble site now looks like this:

<img width="519" alt="Screenshot 2023-12-13 at 17 10 04" src="https://github.com/attrill20/FPLFixtureCalendar/assets/123314687/4a001418-facd-47e2-99d9-70dd8456fae0">

Also, managed to get the values from my Google Sheet to be replicated on the app - had to use the Google Sheets API and ensure that the key was stored in the Vercel Environment Variables for safe keeping. Will look to further tweak these figures by implementing extra data such as form, injuries, xG, home / away performance etc. Good progress!
  

## 10/12/23

Updated the Google Sheet with the current custom difficulty ratings mostly based off the home / away form tables. Did quite a lot of CSS styling updates, particularly the mobile version of the site and added a link and explanation to the Google Sheet. Finally worked out how to remove the white margins that had existed before, think it looks much better like this back in it's original format:

<img width="1773" alt="Screenshot 2023-12-10 at 16 32 38" src="https://github.com/attrill20/FPLFixtureCalendar/assets/123314687/58eb6131-0b2c-4da2-9162-61ebd799bb0c">

Shared the site with some friends for feedback, and they suggested changing the buttons so one toggles between Original / Custom scoring systems and the other buttons sorts the table by ASC / DESC. Makes sense to me, will look to implement this during my next session.

## 9/12/23

Spent some good time with the app this afternoon and finally implemented my Custom FDR figures. Added a new button that switches between the two ranking systems and conditionally renders the correct total FDR score based on which is clicked. Added some new colours for the 1-10 scoring system (but still not completely happy with them yet):

<img width="1756" alt="Screenshot 2023-12-09 at 22 05 45" src="https://github.com/attrill20/FPLFixtureCalendar/assets/123314687/8b3f9e66-e39a-40c4-a8fa-c243c32adfaf">

My primary goal of the app is now complete, which makes me very proud! Will revisit my scoring system soon to ensure this feature is as useful as possible (sadly I might have overvalued Man United's difficulty...) and then look for some more user feedback. I'd like to add an explanation for how this ranking system works on the sit, and then potentially look into if the figures can be entered on a Google Sheet from anywhere and imported into my codebase. A good day!

## 18/11/23

Quick fix today as realised that blank gameweeks were being calculated incorrectly (adding the minimum amount to the FDR). So refactored the code to simply add the maximum amount per blank GW. Enjoyed getting back to this project, so will hopefully soon find time to integrate my new fixture difficulty scoring system:

<img width="315" alt="Screenshot 2023-11-18 at 21 41 29" src="https://github.com/attrill20/FPLFixtureCalendar/assets/123314687/f00a0c54-49ae-4d71-a989-8439c2e31ae0">

Saw a guy on Twitter had a similar idea, and created this model on a 1-7 scale:

<img width="541" alt="Screenshot 2023-11-18 at 21 40 04" src="https://github.com/attrill20/FPLFixtureCalendar/assets/123314687/ffe9ee29-1d28-45a0-a8b6-cfca0ccfd78a">


## 16/09/23

Had time to get back to this project having started my first role as a Junior PHP Engineer 2 weeks ago! Played around with the app for a bit today, it was already displaying the double gameweeks but they weren't being properly considered for the FDR caluclation. Went in and changed the card.js and cardlist.js to check for GWs with extra fixtures, sum their difficulty and then add an extra 6 to be subtracted from the reversed FDR. It works (load up on Luton and Burnley players everyone!):

<img width="1783" alt="Screenshot 2023-09-16 at 15 00 50" src="https://github.com/attrill20/FPLFixtureCalendar/assets/123314687/354f8fe9-ad63-43c7-ab57-1689f382c3da">


Will try to find time at some point to integrate my personalised fixture rating system to consider how poor Luton and Sheffield United really are.

## 15/08/23

Good test for the app today as the FPL site rolled over to GW2. My app was initially still displaying the GW1 fixtures as upcoming, so had to set a new state of 'activeGameweek' which searches the API for the first event (gameweek) marked as !finished and sets that as the new activeGameweek. Then had to go and pass this to all the children components and refactor the code to use this to display upcoming fixtures, as well as only calculate the FDR from this point onwards. Couple of hours playing, but working now! Here's an example of it now displaying the upcoming fixtures from GW2 onwards and on my redesigned mobile site that doesn't show the team names - (load up on those Chelsea assets it seems!):

<img width="842" alt="Screenshot 2023-08-15 at 11 45 13" src="https://github.com/attrill20/FPLFixtureCalendar/assets/123314687/87ca34ee-9b8a-47ae-a069-1ac75d4d2a67">

## 11/08/23

Launched the site! Managed to fix the FDR calculation, by basically having to move this up from the child card component into the card list, so it could be correctly calculated. It now fully works! Tidied up some of the basic styling, and made it a bit more responsive for mobile screens (the team names no longer display here, just the badges) and fixed the CSS so the Player Searcher shows two players side by side (show below):

<img width="1050" alt="Pic 2" src="https://github.com/attrill20/FPLFixtureCalendar/assets/123314687/f571c92b-22ab-4818-a2c7-38fa42fea6e7">

Got some good feedback from users suggesting I add an autocomplete function for the player searcher which is a good idea, and also adding more useful stats for this too. I also want to now look to add my custom fixture rating system (1-10, instead of 1-5) and improve the overall UX of the site. Need to check that fixtures update once a gameweek is complete, and we roll on to the next one - have a feeling quite a bit of work will have to be done to ensure that's working properly but will look into it next week. For now, here's what the MVP version of the FDR calendar looks like - it's been a great journey to get here!

<img width="1324" alt="Pic 1" src="https://github.com/attrill20/FPLFixtureCalendar/assets/123314687/fca15761-b8ba-48b5-a2b9-98edb051d3bf">


## 09/08/23

Got stuck into some difficult logic problems over the past day or so, but largely solved them! Managed to get blank GWs display for when a team doesn't have a fixture in that week. Odd way that FPL seem to manage this in the API, basically pushing it to the front of the array as it doesn't have a confirmed date. Then also, managed to get the displayed FDR to change based on that (with blanks adding 0 to the total difficulty ranking). However, still got a problem with the sorting logic, as that is worked out in the parent component so doesn't take into account the updated fixtures that have been added in the child. Might need to do some extreme refactoring to get this working next time!

<img width="1757" alt="Screenshot 2023-08-09 at 19 00 04" src="https://github.com/attrill20/FPLFixtureCalendar/assets/123314687/924d3798-7646-46b5-a8e4-42d80815ab6d">

Here's what it now looks like with the blank GW for Luton for example. Hoping to make the site presentable to share with friends on LinkedIn tomorrow as the FPL season is about to begin!

## 06/08/23

A lot of faff and restructuring today - but finally the host is now fully hosted and deployed on Vercel! Had to create a new repo to store the server and create a serverless function, which constantly runs in the background. Now the delpoyed Vercel site and any localhost version can access the API data by fetching this data. 

Doesn't sound like much, but felt like some huge wins today and learnt so much more about how serverless functions work and how to better restructure my project to allow access. Still need to do quite a lot of styling to the site, fix the blanl GW issue and add more detail to the player searcher. But go check it out - pleased with the progress: https://fpl-fixture-calendar.vercel.app/search

## 04/08/23

Had a good chat this morning with a former teammate from the course about his own FPL project, was nice to be able to share my progress and help him get going on his too!

Finally managed to get the table to be able to be sorted by FDR, which was a huge step forwards! Need to sort the UI for it, but the button works well enough for now. Then spent the evening refactoring my code - managed to reduce app.js from 190 lines of code to 38 lines, so much cleaner now. Added React Router to the project, and moved the player searcher app to a different page, meaning the calendar homepage is much neater.

Next job is to fix the blank GW issue and then try to get my server hosted somewhere, so I can actually deploy the site and share it with friends and on social media before the season actually starts next Friday!

## 30/07/23

Really pleased with the progress made this weekend - it's getting there! Managed to get the overall FDR displaying for each team, opponent badges and added some nice colours based on difficulty. But kept running into problems when trying to get the table to reorder based on overall FDR and also can't work out how to remove the repeated table headings (but not sure if that's a good thing or not?), but sure I'll fix it next time! Think later this week I'll split the other player finder stuff into a new page and tidy up the site a bit to make it navigable. Enjoyable tinkering today though, learnt lots!

<img width="1738" alt="Screenshot 2023-07-30 at 19 11 09" src="https://github.com/attrill20/FPLFixtureCalendar/assets/123314687/fed9a4d6-9387-4174-b524-87343f45912c">


## 29/07/23

A great day! Spent a bit of time integrating the previous week's play into the Fixture Calendar and it's actually showing real data now - very exciting! It is finally actually almost useful. Was quite daunting removing the dummy array and inputting the functions that the use the API into the pre-exisitng code for the calendar, but once I ironed out a few bugs (having to detract 1 from the teamIndex for example to match up with the incoming fixtures) it actually worked! Here it is:

<img width="1654" alt="Screenshot 2023-07-29 at 13 36 03" src="https://github.com/attrill20/FPLFixtureCalendar/assets/123314687/babf3c67-55ff-4d6c-9431-e87529cb8302">

Haven't quite been able to add the opponent badge in yet, but the basic data is correct. Also updated the dropwdown to select more games, but formatting starts to go a bit crazy after 5 fixtures shown so will need to allow the table to scroll. Next goals are to show overall fixture difficulty, colour code based on this, reorder based on difficulty of fixtures, fix the opponent badge issue and try to resolve the blank / DGW issue. Oh, and should probably think about splitting the site across multiple pages now using React Router. Lots to do!


## 27/07/23

Been a busy time with lots of job interviews this week and graduation from the School of Code! But had some time for playing with the app this morning, so made some progress on adding i  the fixture difficulty calculation. Managed to get it displaying the 1-5 rating for each fixture from the API, and also created a total fixture difficulty rating (FDR) for the displayed number of fixtures (once I realised that I hadn't been updating the line of code for each team properly haha!). 

<img width="477" alt="Screenshot 2023-07-27 at 10 42 09" src="https://github.com/attrill20/FPLFixtureCalendar/assets/123314687/248486eb-4b6e-49c1-9f54-f7b55973b00a">
<img width="988" alt="Screenshot 2023-07-27 at 10 42 00" src="https://github.com/attrill20/FPLFixtureCalendar/assets/123314687/39c892a9-3850-47b6-9cd7-1037ed503688">

However, then discovered some tricky edge cases as Luton for example have a blank GW coming up but that wasn't showing as my function purely searches for the next n fixtures for each team, so will probably need to later define GWs based on date and then search for fixtures within this (will also be important for when there are double gameweeks for teams too). I also added a reverse FDR variable, as this will make sense when teams do have DGWs etc as this is the best solution I can think of for incorporting these DGWs fixtures for teams - therefore a higher FDR rating will be a good thing for teams! Feel like I've really opened a can of worms with the calcuation side of it today, next time I might just move fowards with embedding the logic I currently do have into my table.


## 21/07/23

Had a bit of time to work on the side project between interview prep this afternoon, so started working out how I was actually going to be able to access the fixtures for each team from the APIs. Started by making a simple array of the 20 teams in my code and giving them an ID for simplicity and then found the first fixture of the season and took the two team IDs from this and matched them to the array to generate the first fixture shown below. Then created a function that maps all of Arsenal's fixtures based on their team ID, slices the next 10 and adds in home/away info. Decent start, looking forward to building this into the fixture calendar itself soon:

<img width="350" alt="Screenshot 2023-07-21 at 15 54 01" src="https://github.com/attrill20/FPLFixtureCalendar/assets/123314687/70d735b4-254b-4e3c-a97c-04efb471aee6">
<img width="706" alt="Screenshot 2023-07-21 at 15 53 46" src="https://github.com/attrill20/FPLFixtureCalendar/assets/123314687/f60c3376-f78f-4e65-bed7-e44d65b39e8e">

## 18/07/23

Came back to my app to find that all the player images had changed! Realised that I had targeted them within the img URL by bracket notation by their position in the array - which evidently changes when new players are added to the game. Quick fix by being more specific by identifying them by their player code and  all fixed (plus added a couple of extra favourite faces) - good lesson to be learned here about making sure my code is future proofed and won't have unexpected changes like this again!

Then added a player search feature, so you can now type in a player name and it will return their image and some basic stats. All good practice in understanding the API better, learned how the web_name can be different than their surname and that capital letters were important, so added a line of code that converts both to lowercase before searching. Good progress, but need to get onto focussing on the fixtures again next time.

<img width="1354" alt="Screenshot 2023-07-18 at 15 49 05" src="https://github.com/attrill20/FPLFixtureCalendar/assets/123314687/d3489fc5-e498-4d12-b953-9017e7c4852b">


## 13/07/23

Had a good play around with the API today, managed to find lots of player information and display it on the site. Here is some of the results of that:

<img width="1049" alt="Screenshot 2023-07-13 at 16 40 18" src="https://github.com/attrill20/FPLFixtureCalendar/assets/123314687/c021a862-3108-4bca-bc06-6d3d1af60298">

However, still finding it difficult to work out how to pull 2 seperate APIs (https://fantasy.premierleague.com/api/bootstrap-static/ for player info and https://fantasy.premierleague.com/api/fixtures/ for fixtures) as await Promise.all and then mapping through them is just creating errors. Will get back to this after the weekend I think!

## 09/07/23

Good progress made today! Sorted out the CORS error by building my own server using Node.js and Express.js to handle the GET request and then allows CORS so the data can be accessed in the main app.js. This screenshot below may not look like much, but it was a big breakthrough for me to finally see real data from the FPL API being accessed by my site:

<img width="733" alt="Screenshot 2023-07-09 at 19 12 46" src="https://github.com/attrill20/FPLFixtureCalendar/assets/123314687/87a14913-62fa-4bd1-9f60-a5c6d0ea299a">

Also deployed the site for the first time to Vercel to ensure that there is always a place to view my changes and will hopefully eventually be useful to users!

## 07/07/23

Back to it today! Spent some time reacquainting myself with the app, good to be back on it. Tried to make a fetch request to the FPL API now the new season has launched, but struggled! Kept getting blocked by a CORS request - tried lots of things including middleware and creating my own proxy server, but kept getting errors. Will take a step back, think it over and come back to it on Sunday!

## 04/06/23

Made some changes to the site with some help from my coding buddy, and we managed to fix the filtering system so it now shows the number of fixtures that is requested. Going to take a bit of a break for a few weeks whilst I focus on my SOC final project, and then will have time to give this my full attention!

## 02/06/23

Been a busy couple of weeks with my best friend's wedding and then starting the project week, but had a bit of time this evening to have a play with the project and added home(H) and away(a) tags to each fixture, which will later play into the difficulty calculation. Added a dropdown filter as you can see in the image below, but then had a lot of difficulty trying to actually link that up using useState and onChange! had a good chat with my coding mate about it and we tried a lot of things and think I may need to restructure the layout of my components to integrate what I was thinking. Will play that over and revisit it again soon. Here's the current look of it:

![Screenshot 2023-06-04 at 20 56 40](https://github.com/attrill20/FPLFixtureCalendar/assets/123314687/a2f11d02-e64e-49d7-af0d-37361bf0951d)

## 20/05/23

Spent a bit of time today improving the look of the site, and added a badge icon for each of the clubs which now renders below their name in the team list, and does so smaller now under the initials of the team in the GW column. A surprisngly simple job, but got caught for a while when I asked ChatGPT to reorder the dummy arrays for me, but for some reason it omly generated 18 for one of them so kept getting errors that took me far too long to realise were being caused by this! 

Tidied up the UI of the site with a slightly brighter background and clear black text for the teams. Added some padding and display issues too. Good recap of some CSS and React essential skills today. All the basic information is dispaying nciely now, so will look to add a filter search bar next, and start thinking about how to add in the calculation of fixture difficulty (which will have to factor in home / away considerations). Here's how the site is currently looking:

<img width="1768" alt="Screenshot 2023-05-21 at 20 22 01" src="https://github.com/attrill20/FPLFixtureCalendar/assets/123314687/b13a00c9-59ce-4836-af55-ab1753e0910e">

## 15/05/23

Did some reading and research as to what API I would need to use to implement in the project. Here are some useful links:

- Live FPL Rank: https://www.livefpl.net/rank (useful website displaying loads of data, nice new design)
- Official FPL API: https://fantasy.premierleague.com/api/fixtures/ (this is the full database, might need to filter for useful information)
- Medium article: https://medium.com/@frenzelts/fantasy-premier-league-api-endpoints-a-detailed-guide-acbd5598eb19 (explains how to use the API)
- Football Fallout Calendar: https://www.footballfallout.com/fpl/fixture-difficulty-planner (the current fixture calendar I use, aim to build on this)

Discovered that there is an inbuilt difficulty ranking buried within the FPL API ("team_h_difficulty": 4, "team_a_difficulty": 2) which ranks them out of 5. I presume this is what is being used by the other fixture difficulty calendars out there. Maybe I'll start with this, but would love to build my own algorithm for determining this possibly on a scale out of 10 for more control over this and to allow for a more refined way of navigating fixture difficulty for FPL managers.

The API seems to be divided into these sections:

1. General Information (Full URL: https://fantasy.premierleague.com/api/bootstrap-static/)
- events (basic information of every Gameweek such as average score, highest score, top scoring player, most captained, etc)
- teams (basic information of current Premier League clubs)
- total_players (total FPL players)
- elements (information of all Premier League players including points, status, value, match stats (goals, assists, etc.), ICT index, etc)
- element_types (basic information about player’s position (GK, DEF, MID, FWD))

2. Fixtures (Full URL: https://fantasy.premierleague.com/api/fixtures/)
- To get fixtures for specific Gameweek, you can add a parameter after the endpoint path (ex: fixtures?event=7)
- You can also request only the upcoming fixtures using future parameter (ex: fixtures?future=1)
- event (event id)
- team_a and team_h refers to the team id in teams section of the bootstrap-static data
- team_h_difficulty and team_a_difficulty is the FDR value calculated by FPL
- stats (contains a list of match facts that affect points of a player. It consists of goals_scored, assists, own_goals, penalties_saved, penalties_missed, yellow_cards, red_cards, saves, bonus, and bps data)

3. Player's Detailed Data (Full URL: https://fantasy.premierleague.com/api/element-summary/{element_id}/)
- fixtures (remaining fixtures), history (previous fixtures and match stats), history_past (previous season stats)

4. Gameweek Live Data (Full URL: https://fantasy.premierleague.com/api/event/{event_id}/live/)
- id (refers to element id from bootstrap-static), stats (player match stats), explain (breakdown of player's points)

5. Manager Basic Information (Full URL: https://fantasy.premierleague.com/api/entry/{manager_id}/)
- name, id, info, joined, team name, team value, leagues

6. Manager's History (Full URL: https://fantasy.premierleague.com/api/entry/{manager_id}/history/)
- previous GWs, chips used, past seasons

7. Classic League Standings (Full URL: https://fantasy.premierleague.com/api/leagues-classic/{league_id}/standings)
- league, standings, new entries

8. My Team (Full URL: https://fantasy.premierleague.com/api/my-team/{manager_id}/)
- picks (a list of players you have picked in your team), chips (list of unused chips), transfers (recent transfer information)

9. Manager's Team Per Gameweek (Full URL: https://fantasy.premierleague.com/api/entry/{manager_id}/event/{event_id}/picks/)
- automatic_subs, entry_history, picks

10. Event Status (Full URL: https://fantasy.premierleague.com/api/event-status/)
- Shows when bonus / league tables etc have been processed

11. Dream Team (Example URL: https://fantasy.premierleague.com/api/dream-team/8/)
- highest scoring team and overall star of the GW

12. Set Piece Taker Notes (Full URL: https://fantasy.premierleague.com/api/team/set-piece-notes/)
- Looks to be handwritten notes on team's set piece takers

Won't do anything with this data right now, but very interesting to have more information on how the API can be utilised. Started learning about SQL on the course today, so intrigued to see how that could possibly be implemeented into this project in the future too. A good day!

## 13/05/23

Initialised the repo on GitHub. Set up a new React project and made sure all the components are linked, passed down props of teams and GWs down from app.js down to cardlist and card. Felt good to see them successfully rendering! Set up dummy arrays of teams and GWs to check that they were diplaying properly and learnt about using [index] if mapping multiple arrays. 

Did some basic styling to check the files were all linked up properly, changed the background color and made some parts of the text bold to improve readability. Put all the fixtures into a table and ensured the width of the columns remained the same even when team name lengths changed. 

A good start. Here's the first screenshot of progress:

<img width="1652" alt="Screenshot 2023-05-13 at 23 42 55" src="https://github.com/attrill20/FPLFixtureCalendar/assets/123314687/4cfe2324-0614-45e3-b7b5-bb58264b75ad">




