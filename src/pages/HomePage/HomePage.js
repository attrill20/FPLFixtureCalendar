import React from 'react';
import { Link } from 'react-router-dom';
import "./HomePage.css";
import GWRecapPost from '../../components/GWRecapPost/GWRecapPost';
import { useFDRMovers } from '../../hooks/useFDRMovers';
import { useMidSeasonUpdate } from '../../hooks/useMidSeasonUpdate';
import { teams } from '../../components/dummyArrays/dummy';

const HomePage = ({ fixturesData }) => {
  const { recaps, loading } = useFDRMovers();
  const { data: midSeasonData, loading: msLoading } = useMidSeasonUpdate();
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

      {/* Auto-generated GW Recap Movers + Mid-Season Updates */}
      {!loading && !msLoading && (() => {
        const allPosts = [];

        recaps.forEach(recap => {
          allPosts.push({
            type: 'recap',
            data: recap,
            date: recap.lastKickoff || recap.updatedAt || '1970-01-01T00:00:00Z'
          });
        });

        if (midSeasonData) {
          allPosts.push({
            type: 'midseason',
            data: midSeasonData,
            date: midSeasonData.update.created_at
          });
        }

        allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

        return allPosts.map((post, index) => {
          if (post.type === 'recap') {
            const recap = post.data;
            return (
              <GWRecapPost
                key={recap.gameweekId}
                currentSnapshots={recap.currentSnapshots}
                previousSnapshots={recap.previousSnapshots}
                gameweekName={recap.gameweekName}
                lastKickoff={recap.lastKickoff}
                teams={teams}
                isLight={index % 2 === 0}
                isLive={recap.isLive}
                matchesPlayed={recap.matchesPlayed}
                updatedAt={recap.updatedAt}
                fixturesData={fixturesData}
              />
            );
          } else {
            const ms = post.data;
            return (
              <GWRecapPost
                key={`midseason-${ms.update.id}`}
                currentSnapshots={ms.currentSnapshots}
                previousSnapshots={ms.baselineSnapshots}
                gameweekName={ms.currentGWName}
                teams={teams}
                isLight={index % 2 === 0}
                isMidSeason
                gameweeksElapsed={ms.update.gameweeks_elapsed}
                baselineGWName={ms.baselineGWName}
                currentGWName={ms.currentGWName}
                nextFixtureDate={ms.update.next_fixture_date}
                createdAt={ms.update.created_at}
              />
            );
          }
        });
      })()}



    </div>
  );
};

export default HomePage;
