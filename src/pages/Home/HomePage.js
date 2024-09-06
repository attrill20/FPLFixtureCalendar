import React from 'react';
import { Link } from 'react-router-dom';
import "./HomePage.css";
import oracle_fpl_2 from '../../components/images/oracle_fpl_2.jpeg';
import july_24_fdr from '../../components/images/july_24_fdr.png';
import july_24_fdr_top from '../../components/images/july_24_fdr_top.png';
import july_24_fdr_bottom from '../../components/images/july_24_fdr_bottom.png';

const HomePage = () => {
  return (
    <div>
      
      <div className="content">
        <img src={oracle_fpl_2} className="oracle-fpl-image" alt="OracleFPL" />
        <header className="app-header">
          <h1>Welcome to OracleFPL</h1>
          <h3><i>Crystal clear insights for FPL success!</i></h3>
        </header>
      </div>
        
      <div className="home-sub-heading">
        <p>
          This is the homepage of the OracleFPL tools - we hope they hope you find them useful and improve your FPL rank! Use the Navbar or links below to select the tool you need:
        </p>
        <ul>
          <li><Link to="/calendar"><strong>Fixture Difficulty Calendar</strong></Link> - check here for a custom FDR calendar to identify which teams have favourable upcoming fixtures </li>
          <li><Link to="/search"><strong>Player Comparison Tool</strong></Link> - allows comparison between player's stats to help you pick your next transfer </li>
          <li><Link to="/faq"><strong>FAQs</strong></Link> - read how the custom FDR is calculated, how to use the Player Comparison tool and other information about the site</li>
        </ul>
        <p>
          Good luck for the season ahead - enjoy the site and any questions or feedback welcome!
        </p>
      </div>

      <div>
        <div className="fdr-wrapper">
          <div className="fdr-heading">  
            <h2>2024/25 Season FDR Update</h2>
            <p className="date-posted">Posted: <strong>July 2024</strong></p>
            <p>Hello everyone, welcome back to a new season with OracleFPL! Southgate might not have brought it home, but hopefully with our tools you'll be bringing home your mini-league titles come May next year!</p>
            <p>The site has been updated with the new 24/25 fixtures and the inital FDR values. Here are some initial thoughts:</p>
            <ul>
              <li><strong>Man City</strong>, <strong>Arsenal</strong> and <strong>Liverpool</strong> retain their strong scores of 8s and 9s from the end of last season, although none judged high enough for a 10 currently based on their home PPG of 2.5 not getting close to Man City's in 22/23 of 2.74. Liverpool's patchy away record is recognised and could drop further under new manager Arne Slot.</li>
              <li>Recently promoted teams <strong>Ipswich Town</strong>, <strong>Leicester City</strong> and <strong>Southampton</strong> all are given the same ratings (H:2, A:3), due to being the 3 favourites for relegation. Early results may give us an indication for how each will fare in this current season and if any adjustments are needed.</li>
              <li><strong>Newcastle United</strong> and <strong>Chelsea</strong> have the current largest gaps between home and away FDR, due to their large discrepancies last season. <strong>Brentford</strong> are the only team that start the season with equal ratings (H:3, A:3) due to their poor form last season, but this will be amended if they show signs of their stronger home form from previous seasons.</li>
            </ul>
            <p>If there are any major transfers or clear indications of form in pre-season friendlies, then these figures will be updated - but hopefully these should give a much fuller picture of the early fixture calendar. We'll break that down and post our recommendations in a future post - happy planning!</p>
          </div>
          <div class="fdr-image-container">
            <img src={july_24_fdr} className="fdr-image" />
          </div>
        </div>
        
        <div className="fdr-wrapper">
          <div class="fdr-image-container">
            <img src={july_24_fdr_top} className="fdr-image-grid" />
          </div>
          <div className="fdr-heading">  
            <h2>Early Season Fixture Guidance - Top Teams</h2>
            <p className="date-posted">Posted: <strong>July 2024</strong></p>
            <p>Top of the pile for the opening set of fixtures are <strong>Liverpool</strong> and <strong>Fulham</strong>, with some very inviting home games and the hardest away day is at an Old Trafford that was leaking goals last season. Based on this, Salah looks like a much better premium pick than Haaland in an opening draft - as long as he stays amid current transfer rumours. Alexander-Arnold is probably the stand out defender in the game, and should hopefully justify his 7.0m price tag, although rotation could limit other attacking options such as Nunez, Jota or Diaz. Muniz is a very solid budget pick as a 6.0m forward, although I'd limit it to one pick from Fulham as Leno and Andreas are not that tempting at their price points.</p>
            <p>As a promoted team, I'd avoid <strong>Southampton</strong> players on an early draft despite their favourable early schedule - possible exception if you fancy taking a punt on one of their 4.0m defenders as a bench option. <strong>Aston Villa</strong> have a nice stretch of games from GW3 onwards, so going with reliable performer Watkins on a first draft makes a lot of sense to me. <strong>Crystal Palace</strong> will likely be without Mateta after playing at the Olympics so could struggle to reach the heights of last season having sold Olise too, but Eze is proving popular in early drafts and plays against some shaky defences early on.</p>
            <p><strong>Manchester United</strong> kick off the 24/25 season on Friday night v Fulham and have a slightly above average set of fixtures, so players like Fernandes, Garnacho and Hojlund could get off to a strong start. There doesn't seem to be a stand out goalkeeper at a low price this season, so you could do a lot worse than going for Pickford from an <strong>Everton</strong> team that have a set of home fixtures that could yield clean sheets. Finally, <strong>Brighton</strong> and <strong>Chelsea</strong> are slap bang in the middle of the FDR table, so don't overload on their players!</p>
          </div>
        </div>

        <div className="fdr-wrapper">
          <div className="fdr-heading">  
            <h2>Early Season Fixture Guidance - Bottom Teams</h2>
            <p className="date-posted">Posted: <strong>July 2024</strong></p>
            <p>Bottom of the fixture ticker for the opening games are <strong>Brentford</strong> - so recommended avoiding their top assets like Mbuemo and Toney, especially with questions marks over his future too. Same for <strong>Wolves</strong>, who have a very tricky start so maybe best to wait until a bit later in the season to see if last season's bargain picks of Hwang, Cunha, Ait-Nouri etc will come good again.</p>
            <p>Interestingly last season's top 2 in <strong>Manchester City</strong> and <strong>Arsenal</strong> also feature quite low in the opening FDR with scores of 34 and 35 respectively. Their star players are always likely to shine, so I wouldn't advise missing out on their players completely - but it might make a decision to go without Haaland for an initial draft a little easier, especially at his hefty new price point of 15.0m. However, they have both got some pretty tasty home games against lower ranked teams - so maybe selecting some attacking threats would be preferable to defenders with difficult away fixtures early doors for both teams.</p>
            <p>Finally, there are middling FDR scores for <strong>Chelsea</strong>, <strong>Spurs</strong> and <strong>Newcastle</strong> who all had periods of good form last season, but struggled for consistency. With this opening set of fixtures it may be wise to just go for 1 standout player from each team, 2 at most - certainly no tripling up at this stage! Players like Palmer (who has had a huge price hike to 10.5m), Son and Isak all regularly find ways to points no matter the fixtures, thanks partly to penalty taking responsibilities, so are worth holding for the long haul. I wouldn't be looking to pick up many defenders from teams in this half of the FDR table, try and target bargains from those coming up in Part 2 from the top teams.</p>
          </div>
          <div class="fdr-image-container">
            <img src={july_24_fdr_bottom} className="fdr-image-grid" />
          </div>
        </div>
      </div>

    </div>
  );
};

export default HomePage;
