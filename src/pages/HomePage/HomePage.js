import React from 'react';
import { Link } from 'react-router-dom';
import "./HomePage.css";
import GWRecapPost from '../../components/GWRecapPost/GWRecapPost';
import { useFDRMovers } from '../../hooks/useFDRMovers';
import { useMidSeasonUpdate } from '../../hooks/useMidSeasonUpdate';
import { teams } from '../../components/dummyArrays/dummy';

const toolkitCards = [
  { emoji: '📅', title: 'Fixture Calendar', desc: 'Custom FDR ratings', to: '/calendar' },
  { emoji: '📊', title: 'Player Comparison', desc: 'Side-by-side stats', to: '/comparison' },
  { emoji: '🏆', title: 'Player Stats', desc: 'Rankings of top players', to: '/players' },
  { emoji: '🏟️', title: 'Team Stats', desc: 'Overall club analytics', to: '/teams' },
  { emoji: '🔍', title: 'FDR Comparison', desc: 'Oracle vs Official FPL', to: '/fdr-comparison' },
  { emoji: '❓', title: 'FAQs', desc: 'Understand our site!', to: '/faq' },
];

const HomePage = ({ fixturesData }) => {
  const { recaps, loading } = useFDRMovers();
  const { data: midSeasonData, loading: msLoading } = useMidSeasonUpdate();
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">OracleFPL</h1>
            <p className="hero-subtitle">Crystal clear insights for FPL success</p>
          </div>
          <Link to="/calendar" className="hero-cta"><span className="hero-cta-long">Explore Fixture Calendar →</span><span className="hero-cta-short">Fixture Calendar →</span></Link>
        </div>
      </section>

      {/* Toolkit Section */}
      <section className="toolkit-section">
        <div className="toolkit-scroll">
          {toolkitCards.map(card => (
            <Link to={card.to} key={card.to} className="toolkit-card">
              <span className="toolkit-icon">{card.emoji}</span>
              <span className="toolkit-card-title">{card.title}</span>
              <span className="toolkit-card-desc">{card.desc}</span>
            </Link>
          ))}
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
