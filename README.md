# OracleFPL - James Attrill Side Project

Site is live at: <a href="http://www.oracleFPL.co.uk" target="_blank">www.oracleFPL.co.uk</a>

## Project Overview

This project is an FPL site including Fixture Calendar (shows the upcoming fixtures for each Premier League team and ranks them based on their difficulty) and Player Comparison (compares stats of players) tools. I aim to use this side project to practice my React, JS and CSS skills. It uses the official FPL API to display fixtures and incorporates my very own custom 1-10 difficulty ranking system (found here: https://docs.google.com/spreadsheets/d/1wYS6wyRkHiP-9zlJAkd_V9vjnxXslpNinz-CLg6BILs/edit#gid=0) to better plan upcoming transfers compared to the official FPL 1-5 simplified rating system. Any suggestions welcome!

There is a blog below showing my ongoing progress and planned to-do list.

## Deployment and Info

To run: Clone repo, navigate to fpl-fixtures folder and enter 'npm start' in command line. Will load the site in browser (the serverless function is deployed on Vercel in a separate repo)

Deployed at: <a href="https://fpl-fixture-calendar.vercel.app/" target="_blank">https://fpl-fixture-calendar.vercel.app/</a>

E-mail address: oraclefplcontact@gmail.com

## Current To-Do List

#### Long-Term Goals

- Add testing
- Ensure accessibility
- Scrape betting site for odds
- Clean sheet percentage odds
- Launch site as a mobile app
- Promote further on Twitter FPL with content creators
- Add a logo to the site and navbar
- Add an AI chat to recommend players to pick
- Add a database of historical data
- Transition all data to be stored in a DB (mongoDB)

#### Home Page

- Insert a Twitter / X feed on the right hand size of this page to show live post updates
- Show some top 10s below the welcome message on this page
- Add a change log of new features and tweaks made to the site
- Nicer way of having articles pages and then teaser summaries added to the homepage which can be expanded or visited when clicked on

#### Calendar Page

- Insert a better sorting method (click the column itself to sort ASC / DESC)
- Improve the Google Sheets calculations using more automated data (form, injuries, xG, home / away performance etc)
- Find a more detailed API to add extra stats to the Player Searcher tool (Opta perhaps?)
- Allow users to be able to set their own custom FDR ratings

#### Player Comparison Page

- If player has no photo, add a blank default one (e.g. the shirt from the Top 10 page)
- Fix the keyboard still displaying on mobile after selecting a player (focus/blue solution?)

#### Top 10 Page

- Use a new API to get more accurate xG stats - https://footystats.org/api/
- Add a season filter to add in historical data here

#### Site Changes

- Blog page / contact us / version update log
- Add page location name in the Navbar on mobile site
- Add a login feature so custom FDR can be set per user

#### Issues

- Add a cache to prevent no fixtures displaying when the server occasionally goes down
- Needs less of a margin / padding either side of the FDR toggle switch

## 29/7/25

Made some tweaks this evening to add the new 'Defensive Contributions' stat to the Top 10 Page and Player Comparison tool, as shown below with 2 of last season's top performers for this category (currently both showing 0 for last season as a new stat):

<img width="1664" height="926" alt="Screenshot 2025-07-29 at 22 18 11" src="https://github.com/user-attachments/assets/eca37d0a-b761-45c4-ac0b-86189338018b" />

Also commented out all mention of manager stats, as it looks like the Assistant Manager chip will not be returning for this season after proving way too overpowered and swingy! Added some new ideas to the To-Do List including adding a login feature so users can set their own custom FDR data and to also investigate whether data from previous seasons can be accessed so a season dropdown can be added to the stats pages for historical comparisons.

## 20/7/25

Been a while! Made a few more small changes to the site during the PL run-in, but nothing large enough to warrant a blog post, but made some big styling changes to the site this weekend with the help of experimenting with Claude Code so thought I'd share them here:

<img width="1906" height="910" alt="Screenshot 2025-07-20 at 19 27 00" src="https://github.com/user-attachments/assets/fd753912-4599-467a-bb0e-f3de348359c1" />
<img width="1898" height="890" alt="Screenshot 2025-07-20 at 19 27 15" src="https://github.com/user-attachments/assets/73ae1f97-6923-4d00-8cd1-9740e57eea3b" />

Looking a lot nicer! Added some alternating colour blocks for the home page, along with some font improvements and additional emojis and had a streamlining of the calendar tools to fit onto one line. Also, finally was able to remove the repeated column titles on the calendar by adding in some conditional statements to check if it is actually a populated row or not. All looks much better on desktop especially, but also spent some time ensuring that it looks slick on mobile too.

Updated the new FDR ratings for the promoted teams, but waiting for the FPL game to be launched and the API to be updated before rolling out the changes. Will probably stash the Assistant Manager code, as that seems to be gone for the season and looking forward to seeing if I can access the new defensive contributions data!

## 17/2/25

Logged back in after a little while away, and realised that managers have now been added and were messing up the site with no images and dominating the Top 10s page! Added a new option to the position dropdown for them, turned them off by default and orrectly mapped their images. Here we go:

![Screenshot 2025-03-12 at 20 42 12](https://github.com/user-attachments/assets/312d8993-ee56-43a6-b13d-5d5b56fa3a33)

Ahh, looks like I forgot to post an update that I have also successfully added a price filter to this page recently too! Shows options in 0.5m increments up to £10 and then £1m increments up to the max priced player. Did a fair bit of stylistic fixing too, especially for mobile. Here's a nice image of how this works in tandem with the other filters:

![Screenshot 2025-03-12 at 20 47 38](https://github.com/user-attachments/assets/91c714ad-de58-40bc-a547-0d0cbf7f8bd5)


## 13/11/24

Added a position filter to the Top 10 page:

![Screenshot 2024-11-13 at 21 56 38](https://github.com/user-attachments/assets/708f53fa-80e9-4932-a293-5d3d062ab9bb)

Had to learn about event.stopPropagation() to ensure that the clicks don't bubble up and prevent the dropdowns from closing when being clicked outside. The styling was also a problem here, as struggled to get both the dropdown lists to be displayed below their dropdown box - this was eventually fixed by using position: absolute. Will add a price slider next!

## 8/11/24

Added some cool new functionality to the Top 10 Page:

![Screenshot 2024-11-08 at 19 35 31](https://github.com/user-attachments/assets/554752f3-27e8-42f1-8a29-74824af43890)

Can now filter by club! Added the ability to select multiple clubs too by initiating an array to hold the state of selected teams, and then update the count in the name of the dropdown. Really useful now for seeing the best selections from a range of teams that you may be consdiering because of their good fixtures. Going to add a cost filter and position filter too, to refine this page even further!

## 27/10/24

Some recent minor tweaks to the site - updated the Active GW input field to hae increment / decrement buttons, which will be especially useful when updating on mobile:

![Screenshot 2024-10-27 at 12 53 27](https://github.com/user-attachments/assets/b4566dc3-9995-4486-bbf6-0229bf512de0)

Also fixed an issue where all Wolves players had different ratio images strangely, so updated them all to be 250x250 instead and therefore also made some ratio changes on the Player Comparison tool:

![Screenshot 2024-10-27 at 13 02 50](https://github.com/user-attachments/assets/3f65adb0-1421-4adc-821c-93132f8f0f07)

Everything working pretty well right now, might next to update the homepage with more live data (players of the week / Twitter feed) or integrate the Footy Stats API to have more accurate xG data

## 10/10/24

I've been slowly adding more Top 10s to this page, including fetching xG and xGC data and combining with a different endpoint to get the total goals scored and conceded to create some club top 10s:

![Screenshot 2024-10-10 at 19 42 14](https://github.com/user-attachments/assets/8e9b553c-d42f-4cd0-8a82-328705192557)

Also added some more player stats regarding bonus points and also a request from a colleague to work out the 10 best value players as price per million - shockingly goalkeepers Onana and Sanchez were the top 2! Spent a bit of time making the Brighton Points App which is working well and was very satisfying to make that get up and running so quickly.

Been recommended a new API from https://footystats.org/api/ which I'll explore looking into when I come back to working on this app again soon.

## 26/9/24

Started working on these top 10 lists a few weeks ago, but now decided to give them their own separate page and new link in the navbar. These show a range of stats pulled from the API and help managers select a player in good form, who has been producing good underlying stats:

![Screenshot 2024-09-26 at 19 53 39](https://github.com/user-attachments/assets/4d313eab-f610-40f0-a202-d0526dade126)

Will maybe take a little break from this app from a while, as I plan to work on a little side project to help track the FPL points of Brighton players in a live format.

## 6/9/24

Finishd off the FAQs page and added a link to the Navbar, and styled it for both desktop and mobile:

![Screenshot 2024-09-06 at 12 15 54](https://github.com/user-attachments/assets/559c4f20-fb39-4c40-a688-0b0cd8604520)

Will have a play at adding more top 10 player images onto the Player Comparison Tool page and look into adding a Twitter / X sidebar on the homepage to display the updates I've been posting there.

## 1/9/24

Started adding the FAQs page this weekend, got boxes to appear / disappear on click and wrote the copy for the Fixture Difficulty Calendar here:

![Screenshot 2024-09-01 at 18 05 44](https://github.com/user-attachments/assets/a2e72300-13e0-4245-9bce-d92eb880b74c)

Will finish off sections on the Player Comparison tool and general site questions before routing the page to the navbar.

## 26/8/24

Completed the redesign of the Player Comparison page, including:

- Reduced the size of the player photo and moved the generic stats in line, with specific attacking / defending stats below
- Changed the hardcoded player faces at the top of the page, to be a live Top 10 scorers of the GW
- Added a new Goals Conceded Per 90 defensive stat, and improved styling and responsiveness across the whole page

Pretty pleased with the result, here's what it now looks like on desktop:

![Screenshot 2024-08-26 at 12 11 29](https://github.com/user-attachments/assets/f9204d05-b77c-4d74-865a-724eb7b9c1b3)

Was a bit more fiddly than expected, and still haven't fixed the issue with multiple players with the same name. Will add a new FAQs page next!

## 20/8/24

Quick update after sharing my site with a group of friends, one of them pointed out that this didn't look very clear:

![Screenshot 2024-08-20 at 18 58 24](https://github.com/user-attachments/assets/7cf78ce3-3911-44c0-a812-d7536771eeda)

So decided to re-word the heading and add a 'date posted' section on articles shared to the home page like this:

![Screenshot 2024-08-20 at 18 58 41](https://github.com/user-attachments/assets/259de7cf-60ef-40af-8e9a-3640e2d38507)

Good to gain some constructive criticism and put in plave an easy win to make things easier to understand!

## 10/8/24

Got the mobile navbar working! Completed a long-term goal today, by successfully getting the navbar to collapse to a 'burger menu' on mobile screens, which then displays a dropdown of the pages to navigate to across the site. Also added the OracleFPL brand name into the far left of the navbar across the site and played about with adding a new Google Font - which I quite like for now: 

![Screenshot 2024-08-10 at 21 12 15](https://github.com/user-attachments/assets/47ab3db1-1ac1-41f9-a703-75036542d494)
![Screenshot 2024-08-10 at 21 12 34](https://github.com/user-attachments/assets/17d68dfa-10f2-4c7c-9de7-cab21c9cba51)

Next task will be to add a FAQs page to the site, so some of the logic and explanation can be stripped out into here to make the other pages less cluttered. Also, want to redesign the Player Comparison player images to be a bit smaller so more information can be fitted in one screen without having to scroll. Good progress this weekend!

## 9/8/24

Just a quick fix today as went to deploy the site locally with 'npm run start' and it no longer worked! Had to remove a lot of deprecated code that was preventing it from compiling properly after some updates and now works again with 'npm start'. Going to dive into updating the navbar this weekend!

## 26/7/24

My site offically has a new home - <a href="http://www.oracleFPL.co.uk" target="_blank">www.oracleFPL.co.uk</a>! Bought the domain from 123reg.com for 95p for the year, what a bargain! Decided to rename the Player Searcher tool to 'Player Comparison Tool' instead, as more descriptive of what it actually does - so seems sensible!

Also reordered the content on the home page to diaplay the overall FDR for each team first, as that's a more useful overview when you first land on the page and then readers can scroll down if they want a more detailed breakdown of each team's opening fixtures. This all needs to move to a blog page eventually though, and only most recent posts can be promoted on the homepage, whilst the rest is archived away. Would look a more modern design overhual to this page too, but that can come in time - it's functional for now!

Will start promoting the site on LinkedIn and X over this weekend, whilst also working on making the navbar more slick too. Also going to launch a 'Beat The Robot' weekly competition, but will just tease that for now until I'm back from a holiday in Poland. Next update in a couple of weeks!

## 21/7/24

Made some good changes across the site this weekend, mostly focussing on consistency of responsiveness when switching to mobile. Added some more copy to the homepage and added the new slogan "Crystal clear insights for FPL success", which ties in quite nicely with the OracleFPL branding! Here's how it looks on desktop:

![Screenshot 2024-07-21 at 22 07 22](https://github.com/user-attachments/assets/545e8e49-25c8-4b33-aece-5eb5a87e88bd)

Lots more work to do, but starting to look a bit more inviting now! Main focus that needs fixing is the navbar, and then will give the site another push!

## 20/7/24

Updated the site ready for the 2024/25 season, following the launch of FPL this week. Was surprisingly easy, just a case of updating the 20 teams for the season ahead and adding the badges for newcomers Ipswich Town and welcoming back Southampton and Leicester City. Added some new faces of last season's top performers to the Player Searcher tool and here's how things are looking with a month to go until the season begins:

![Screenshot 2024-07-20 at 13 38 05](https://github.com/user-attachments/assets/cd39bbb7-6850-40af-af4e-de6c0b2b954b)
![Screenshot 2024-07-20 at 13 39 14](https://github.com/user-attachments/assets/a3dae527-aa51-4c93-b26b-9ffda363b505)

Hoping to give this site a bit of a push on socials before the start of the season, although need to check that club badges can be used for commercial use like this. Also plan to add / fix the following:

- Fix the menu bar to be responsive, especially on mobile
- Add more text to the home page or add a FAQs page to explain how the custom FDR works
- Reduce the size of the player faces on the Player Searcher page

Got a few weeks before the season starts, but off to Poland next weekend for a trip - so hopefully will be able to make some progress before then!

## 6/5/24

Spent quite a lot of time the last few days to add a feature of displaying the matching players from the API to the input field value. Looks like this on mobile:

![Screenshot 2024-05-06 at 22 12 11](https://github.com/attrill20/FPLFixtureCalendar/assets/123314687/3880647e-5e8e-4513-9872-d0d7199ed7db)

Also ordered this by highest point scorers, reduced the full name if over 20 characters to use the web_name instead, changed the 'player not found' message and fixed an issue with nested <p>s. However, wasn't able to fully finish my experimenting with how to hide the keyboard on mobile after selecting a matching player from the dropdown. ALso, need to come up with a solution to differentiate and select different players who have the exact same web_name on FPL (which is weird anyway!) such as Wilson or Onana. Fun progress!

## 27/4/24

Finished off the checkboxes to allow conditonal rendering of the stats, added little titles to each category too and tidied up the CSS styling:

![Screenshot 2024-04-27 at 17 03 11](https://github.com/attrill20/FPLFixtureCalendar/assets/123314687/a716e285-fffb-4986-b63b-2cdfe473deb4)

Will look to add autocomplete and suggestion prompts for players on the search input.

## 23/4/24

Refactored the PlayerSearcher page to have separate 'FormResults' and 'Checkboxes' components to allow more control over the CSS styling and scalability. Started adding the ability to select which stats to display on the results page, started with Goals and Assists as shown below:

![Screenshot 2024-04-23 at 21 04 21](https://github.com/attrill20/FPLFixtureCalendar/assets/123314687/c6777216-10fd-44fa-a24a-5c367fc90eac)

Now that I've got this, will allow me to add a raft of different stats options here and style this all a bit nicer! Also added some logic to convert special characters to ASCII when searching for a player - will help with Ødegaard and Højlund!

## 21/4/24

Spent a bit of time this Sunday making improvements to the CSS styling of the Player Searcher page. Refactored my code to allow all the elements to be displayed as one player-searcher box, so had greater control over the column spacing of it - especially on mobile. Looking better, but not perfect! Will add some more stats to it next time I think.

## 17/4/24

Quick fix tonight of ensuring that the GW dropdown reduces the amount displayed if there are less available than previously selected (e.g. displays '5 Gameweeks' by default, but if only 4 were available then it would default to showing '1 gameweek'). Tried a few solutions, but the easiest and most elegant was to simply reverse the order they are listed in in the dropdown, so it now falls back to the highest available option - and is more intuitive this way round too :)

![Screenshot 2024-04-17 at 20 33 13](https://github.com/attrill20/FPLFixtureCalendar/assets/123314687/122c5da3-0187-48ba-a189-5b05fb97f6f8)

ALso, had a play around with generating some AI images for some theming of the site as 'OracleFPL', here's my pick of the bunch to use so far:

![Screenshot 2024-04-17 at 21 44 10](https://github.com/attrill20/FPLFixtureCalendar/assets/123314687/bb37ffd9-ee0f-40c3-9c2f-4f4167f12960)


## 15/4/24

Continued the work added a new input field to change the current active GW. This can be useful when planning future transfer plans and wanting to assess fixture swings from a specific future GW. Also helps when the FPL take a long time to rollover the active gameweek themselves and you may want to start planning for the next week. Nice little addition to the app, and I think a unique feature from currently available FPL fixture planners:

![Screenshot 2024-04-14 at 17 58 23](https://github.com/attrill20/FPLFixtureCalendar/assets/123314687/a79f1a7e-3e72-4b7b-a546-5f5f89ed84a3)

## 14/4/24

Noticed a slight issue as we approach the run-in to the end of the season - the dropdown was showing more gameweek options than are actually left in the season. This would then cause loads of blank gameweeks to be added on past GW38, as shown in this image below:

![Screenshot 2024-04-14 at 14 57 57](https://github.com/attrill20/FPLFixtureCalendar/assets/123314687/507f2211-8576-4acf-bde6-b71a639cc818)

Had a think about how to fix this, and decided the best approach was to pass the activeGameweek variable to the dropdown component and then create a new remainingGameweeks variable. Then it was a simple case of adding conditional checks to each of the dropdown options, and not to render the irrelevant ones. Here's how I did it:

![Screenshot 2024-04-14 at 15 38 39](https://github.com/attrill20/FPLFixtureCalendar/assets/123314687/975ce876-9858-4104-adb9-ae478f1b980f)

Now it successfully only displays the remaining gameweek options for the rest of the season:

![Screenshot 2024-04-14 at 15 51 40](https://github.com/attrill20/FPLFixtureCalendar/assets/123314687/a3963208-7992-4fc2-80b7-146141a02cf3)

Next focus is to try and add an option to select the active gameweek, so you can move it forward to plan future transfer from a particular GW. Oh, and the navbar still needs work!

## 2/3/24

Been a while since I've worked on the project, as got a little disheartened with my failure to scrape the data previously so thought I'd get back into it with a nice, easy win - add a navbar to the site! Started off by trying to import one from Bootstrap, but ran into issues with it overwriting my css styling. So decided to make one from scratch, and it was pretty straightforward. Added links to my Fixture Difficulty Calendar, Player Searcher and new Home Page, even added a little bit of styling with the hover feature. Think it looks pretty good:

![Screenshot 2024-03-02 at 21 40 21](https://github.com/attrill20/FPLFixtureCalendar/assets/123314687/ad67d899-84b2-4692-8b0d-5473dc3c7935)

Need to test it on mobile (collapse into burger menu?) and design a proper homepage and other details across the site. Might also focus on improving the usability of the Player Searcher next too - good to be back on it!

## 23/1/24

Just a quick hot fix today as noticed that the Custom FDR wasn't poperly calculating the DGW score, so went in and ensured that the logic matched the Original FPL logic and all looks good now.

Been spending quite a lot of time on trying to scrape some xG data from Understat to use within my Google Sheet as part of the Custom FDR calculation. Got it working locally a couple of weeks back, but been blocked getting it to be hosted by Vercel - unsure if it's the third party software being used (Puppeteer / AWS Lambda) or th site itself blocking my requests. Sure I'll crack the problem soon! Talking of cracks, my laptop screen broke the other day also making things trickier until that gets fixed too!

## 13/12/23

Made lots of small iterative changes over the past few days including: replaced the button with a toggle switch to change between Custom FDR / Original FPL, moved the sorting to the right button (want to change this to be imbedded within the table columns soon), tidied up a lot of CSS styling to get the ratios better for mobile and the mobile site now looks like this:

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

Haven't quite been able to add the opponent badge in yet, but the basic data is correct. Also updated the dropdown to select more games, but formatting starts to go a bit crazy after 5 fixtures shown so will need to allow the table to scroll. Next goals are to show overall fixture difficulty, colour code based on this, reorder based on difficulty of fixtures, fix the opponent badge issue and try to resolve the blank / DGW issue. Oh, and should probably think about splitting the site across multiple pages now using React Router. Lots to do!


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

However, still finding it difficult to work out how to pull 2 separate APIs (https://fantasy.premierleague.com/api/bootstrap-static/ for player info and https://fantasy.premierleague.com/api/fixtures/ for fixtures) as await Promise.all and then mapping through them is just creating errors. Will get back to this after the weekend I think!

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

Spent a bit of time today improving the look of the site, and added a badge icon for each of the clubs which now renders below their name in the team list, and does so smaller now under the initials of the team in the GW column. A surprisingly simple job, but got caught for a while when I asked ChatGPT to reorder the dummy arrays for me, but for some reason it only generated 18 for one of them so kept getting errors that took me far too long to realise were being caused by this! 

Tidied up the UI of the site with a slightly brighter background and clear black text for the teams. Added some padding and display issues too. Good recap of some CSS and React essential skills today. All the basic information is displaying nicely now, so will look to add a filter search bar next, and start thinking about how to add in the calculation of fixture difficulty (which will have to factor in home / away considerations). Here's how the site is currently looking:

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




