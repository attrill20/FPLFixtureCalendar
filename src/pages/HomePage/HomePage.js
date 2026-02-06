import React from 'react';
import { Link } from 'react-router-dom';
import "./HomePage.css";
import july_24_fdr from '../../components/images/july_24_fdr.png';
import july_24_fdr_top from '../../components/images/july_24_fdr_top.png';
import july_24_fdr_bottom from '../../components/images/july_24_fdr_bottom.png';
import oct_24_fdr from '../../components/images/oct_24_fdr.png';
import nov_24_fdr from '../../components/images/nov_24_fdr.png';
import GWRecapPost from '../../components/GWRecapPost/GWRecapPost';
import { useFDRMovers } from '../../hooks/useFDRMovers';
import { teams } from '../../components/dummyArrays/dummy';

const HomePage = () => {
  const { recaps, loading } = useFDRMovers();
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to OracleFPL</h1>
          <p className="hero-subtitle">Crystal clear insights for FPL success!</p>
        </div>
      </section>

      {/* Tools Overview Section */}
      <section className="section-white">
        <div className="home-sub-heading">
          <div className="section-header">
            <h2 className="section-title">Explore your new FPL Toolkit!</h2>
          </div>
          <p>
            <strong>Transform your FPL strategy with our custom tools and deep statistical analysis that will give you the competitive edge you need. Choose from these tools:</strong>
          </p>
          <ul>
            <li><Link to="/calendar"><strong>Fixture Difficulty Calendar</strong></Link> - Our revolutionary custom FDR system reveals which teams have the most favorable upcoming fixtures 📅</li>
            <li><Link to="/comparison"><strong>Player Comparison Tool</strong></Link> - Advanced side-by-side statistical analysis to help you pick your next transfer with confidence 📊</li>
            <li><Link to="/players"><strong>Player Stats</strong></Link> - Explore a range of player lists for different point scoring metrics and filter by position, price or club 🏆 </li>
            <li><Link to="/teams"><strong>Team Stats</strong></Link> - Comprehensive analytics for all 20 Premier League teams to help identify underlying team trends to target the best club 🏟️</li>
            <li><Link to="/fdr-comparison"><strong>FDR Comparison</strong></Link> - See how our Oracle FDR ratings compare to the official FPL difficulty ratings for every team 🔍</li>
            <li><Link to="/faq"><strong>FAQs</strong></Link> - Learn how to get the very best out of our tools and understand the calculations behind our FDR ratings ❓</li>
          </ul>
          <p>
            <strong>Ready to start dominating your mini-league? Follow the Oracle's advice and watch your rank soar!</strong>
          </p>
        </div>
      </section>

      {/* Auto-generated GW Recap Movers */}
      {!loading && recaps.map((recap, index) => (
        <GWRecapPost
          key={recap.gameweekId}
          currentSnapshots={recap.currentSnapshots}
          previousSnapshots={recap.previousSnapshots}
          gameweekName={recap.gameweekName}
          teams={teams}
          isLight={index % 2 === 0}
        />
      ))}

      {/* Latest FDR Update Section - Light Green */}
      <section className="section-light">
        <div className="fdr-wrapper">
          <div className="fdr-heading">  
            <h2>🚨 GW11 International Break FDR Update</h2>
            <p className="date-posted">Posted: <strong>November 2024</strong></p>
            <p>The final international break of 2024 is here, so time for some major FDR revisions now that we've seen the first 11 GWs of the season and have some solid data to go on! The biggest risers are <strong>Nottingham Forest</strong>, whilst <strong>Arsenal</strong> the biggest fallers after their shaky start...</p>
            <p className="fdr-increase-title"><strong>📈 FDR Increases:</strong></p>
              <ul>
                <li><strong>Bournemouth</strong> (Away_diff up by 1 - big home wins in recent GWs)</li>
                <li><strong>Brentford</strong> (Away_diff up by 1 - free scoring, entertaining home games!)</li>
                <li><strong>Chelsea</strong> (Home_diff up by 1 - strong form continues, looking solid)</li>
                <li><strong>Fulham</strong> (Home_diff up by 1 - good form on the road, decent team)</li>
                <li><strong>Liverpool</strong> (Home_diff up by 1 - still unbeaten in away games so far)</li>
                <li><strong>Notts Forest</strong> (Home_diff up by 1 and Away_diff up by 1 - surprise package!)</li>
              </ul>
            <p><strong>📉 FDR Decreases:</strong></p>
              <ul>
                <li><strong>Arsenal</strong> (Home_diff and Away_diff down by 1 - struggling a bit recently)</li>
                <li><strong>Crystal Palace</strong> (Away_diff down by 1 - only 1 home win so far, poor)</li>
                <li><strong>Everton</strong> (Away_diff down by 1 - poor home form, not looking strong)</li>
                <li><strong>Ipswich</strong> (Away_diff down by 1 - no home wins yet, looking join worst)</li>
                <li><strong>Man City</strong> (Home_diff down by 1 - not as good without Rodri this year)</li>
                <li><strong>Southampton</strong> (Away_diff down by 1 - struggling at home, look weak)</li>
                <li><strong>Spurs</strong> (Home_diff down by 1 - 3 losses out of 5 away games so far, mid)</li>
                <li><strong>West Ham</strong> (Home_diff down by 1 - only 1 away win so far, underwhelming)</li>
              </ul>
            <p>There has also been changes for <strong>Man United</strong> with their Home_diff dropping, but Away_diff bumped after a revival under Ruud and new manager Amorim about to start. Will next update around the midpoint of the season!</p>
          </div>
          <div className="fdr-image-container">
            <img src={nov_24_fdr} className="fdr-image" alt="November 2024 FDR"/>
          </div>
        </div>
      </section>
        
      {/* October Update Section - White */}
      <section className="section-white">
        <div className="fdr-wrapper">
          <div className="fdr-image-container">
            <img src={oct_24_fdr} className="fdr-image" alt="October 2024 FDR"/>
          </div>
          <div className="fdr-heading">  
            <h2>🚨 GW7 International Break FDR Update</h2>
            <p className="date-posted">Posted: <strong>October 2024</strong></p>
            <p>Time for the first Oracle FDR updates of the season! Nothing has had to change since the initial ratings set back in July, as largely teams have performed as expected with the usual suspects already looking likely to contend for the title and the promoted teams only managing 1 win between them so far as they battle relegation. However, 7 games have now taken place so enough data to start noticing early patterns that are taking shape.</p>
            <p>So no major changes have taken place, but here are the details from the first FDR changes of the 24/25 season:</p>
            <p className="fdr-increase-title"><strong>📈 FDR Increases:</strong></p>
              <ul>
                <li><strong>Brentford</strong> (Away_diff up by 2 - strong home form, better than last season)</li>
                <li><strong>Brighton</strong> (Home_diff and Away_diff up by 1 - solid early results, better squad)</li>
                <li><strong>Chelsea</strong> (Home_diff up by 1 - won all away games so far, gelling much better)</li>
                <li><strong>Liverpool</strong> (Home_diff up by 1 - 4 out of 4 away wins so far, look tight)</li>
                <li><strong>Notts Forest</strong> (Home_diff up by 2 and Away_diff up by 1 - excellent start so far)</li>
              </ul>
            <p><strong>📉 FDR Decreases:</strong></p>
              <ul>
                <li><strong>Crystal Palace</strong> (Away_diff down by 1 - very disappointing so far,  missing Olise)</li>
                <li><strong>Everton</strong> (Home_diff down by 1 - very weak away form, no wins so far)</li>
                <li><strong>Southampton</strong> (Home_diff down by 1 - 4 losses on the road, down to 1/10)</li>
                <li><strong>West Ham</strong> (Away_diff down by 1 - only 1 home win from 4, not looking good)</li>
                <li><strong>Wolves</strong> (Home_diff and Away_diff down by 1 - poor start so far)</li>
              </ul>
            <p>Will update when more changes take place over the next few GWs, <strong>Man United</strong> and <strong>Bournemouth</strong> are very close to drops if current form continues...</p>
          </div>
        </div>
      </section>

      {/* Season FDR Update - Light Green */}
      <section className="section-light">
        <div className="fdr-wrapper">
          <div className="fdr-heading">  
            <h2>🚨 2024/25 Season FDR Update</h2>
            <p className="date-posted">Posted: <strong>July 2024</strong></p>
            <p>Hello everyone, welcome back to a new season with OracleFPL! Southgate might not have brought it home, but hopefully with our tools you'll be bringing home your mini-league titles come May next year!</p>
            <p>The site has been updated with the new 24/25 fixtures and the inital FDR values. Here are some initial thoughts:</p>
            <ul>
              <li><strong>Man City</strong>, <strong>Arsenal</strong> and <strong>Liverpool</strong> retain their strong scores of 8s and 9s from the end of last season, although none judged high enough for a 10 currently based on their home PPG of 2.5 not getting close to Man City's in 22/23 of 2.74.</li>
              <li><strong>Liverpool</strong>'s patchy away record from last season is recognised and could drop further under new manager Arne Slot during this time of transition for them.</li>
              <li>Recently promoted teams <strong>Ipswich Town</strong>, <strong>Leicester City</strong> and <strong>Southampton</strong> all are given the same ratings (H:2, A:3), due to being the 3 favourites for relegation. Early results may give us an indication for how each will fare in this current season and if any adjustments are needed.</li>
              <li><strong>Newcastle United</strong> and <strong>Chelsea</strong> have the current largest gaps between home and away FDR, due to their large discrepancies last season.</li>
              <li><strong>Brentford</strong> are the only team that start the season with equal ratings (H:3, A:3) due to their poor form last season, but this will be amended if they show signs of their stronger home form from previous seasons.</li>
            </ul>
            <p>If there are any major transfers or clear indications of form in pre-season friendlies, then these figures will be updated - but hopefully these should give a much fuller picture of the early fixture calendar. We'll break that down and post our recommendations in a future post - happy planning!</p>
          </div>
          <div className="fdr-image-container">
            <img src={july_24_fdr} className="fdr-image" alt="July 2024 FDR"/>
          </div>
        </div>
      </section>
        
      {/* Top Teams Guidance - White */}
      <section className="section-white">
        <div className="fdr-wrapper">
          <div className="fdr-image-container">
            <img src={july_24_fdr_top} className="fdr-image-grid" alt="July 2024 FDR"/>
          </div>
          <div className="fdr-heading">  
            <h2>🎯 Early Season Fixture Guidance - Top Teams</h2>
            <p className="date-posted">Posted: <strong>July 2024</strong></p>
            <p>Top of the pile for the opening set of fixtures are <strong>Liverpool</strong> and <strong>Fulham</strong>, with some very inviting home games and the hardest away day is at an Old Trafford that was leaking goals last season. Based on this, Salah looks like a much better premium pick than Haaland in an opening draft - as long as he stays amid current transfer rumours. Alexander-Arnold is probably the stand out defender in the game, and should hopefully justify his 7.0m price tag, although rotation could limit other attacking options such as Nunez, Jota or Diaz. Muniz is a very solid budget pick as a 6.0m forward, although I'd limit it to one pick from Fulham as Leno and Andreas are not that tempting at their price points.</p>
            <p>As a promoted team, I'd avoid <strong>Southampton</strong> players on an early draft despite their favourable early schedule - possible exception if you fancy taking a punt on one of their 4.0m defenders as a bench option.</p>
            <p><strong>Aston Villa</strong> have a nice stretch of games from GW3 onwards, so going with reliable performer Watkins on a first draft makes a lot of sense to me. <strong>Crystal Palace</strong> will likely be without Mateta after playing at the Olympics so could struggle to reach the heights of last season having sold Olise too, but Eze is proving popular in early drafts and plays against some shaky defences early on.</p>
            <p><strong>Manchester United</strong> kick off the 24/25 season on Friday night v Fulham and have a slightly above average set of fixtures, so players like Fernandes, Garnacho and Hojlund could get off to a strong start. There doesn't seem to be a stand out goalkeeper at a low price this season, so you could do a lot worse than going for Pickford from an <strong>Everton</strong> team that have a set of home fixtures that could yield clean sheets.</p>
            <p>Finally, <strong>Brighton</strong> and <strong>Chelsea</strong> are slap bang in the middle of the FDR table, so don't overload on their players!</p>
          </div>
        </div>
      </section>

      {/* Bottom Teams Guidance - Light Green */}
      <section className="section-light">
        <div className="fdr-wrapper">
          <div className="fdr-heading">  
            <h2>🎯 Early Season Fixture Guidance - Bottom Teams</h2>
            <p className="date-posted">Posted: <strong>July 2024</strong></p>
            <p>Bottom of the fixture ticker for the opening games are <strong>Brentford</strong> - so recommended avoiding their top assets like Mbuemo and Toney, especially with questions marks over his future too.</p>
            <p>Same for <strong>Wolves</strong>, who have a very tricky start so maybe best to wait until a bit later in the season to see if last season's bargain picks of Hwang, Cunha, Ait-Nouri etc will come good again.</p>
            <p>Interestingly last season's top 2 in <strong>Manchester City</strong> and <strong>Arsenal</strong> also feature quite low in the opening FDR with scores of 34 and 35 respectively. Their star players are always likely to shine, so I wouldn't advise missing out on their players completely - but it might make a decision to go without Haaland for an initial draft a little easier, especially at his hefty new price point of 15.0m.</p>
            <p>However, they have both got some pretty tasty home games against lower ranked teams - so maybe selecting some attacking threats would be preferable to defenders with difficult away fixtures early doors for both teams.</p>
            <p>Finally, there are middling FDR scores for <strong>Chelsea</strong>, <strong>Spurs</strong> and <strong>Newcastle</strong> who all had periods of good form last season, but struggled for consistency. With this opening set of fixtures it may be wise to just go for 1 standout player from each team, 2 at most - certainly no tripling up at this stage! Players like Palmer (who has had a huge price hike to 10.5m), Son and Isak all regularly find ways to points no matter the fixtures, thanks partly to penalty taking responsibilities, so are worth holding for the long haul.</p>
            <p>I wouldn't be looking to pick up many defenders from teams in this half of the FDR table, try and target bargains from those coming up in Part 2 from the top teams.</p>
          </div>
          <div className="fdr-image-container">
            <img src={july_24_fdr_bottom} className="fdr-image-grid" alt="July 2024 FDR"/>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
