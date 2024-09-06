import React, { useState } from 'react';
import "./FAQPage.css";

const FAQPage = () => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section, index) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [index]: !prev[section]?.[index]
      }
    }));
  };

  const faqs = [
    {
        question: "How should I use the Fixture Difficulty Calendar?",
        answer: [
            "The main use of the Fixture Difficulty Calendar is to help you identify difficulty shifts in the fixtures, allowing you to target teams with more favourable fixtures and hopefully score more points. The higher the total score in the FDR (Fixture Diffficulty Ranking) column, the better the overall fixtures during the period selected. The table can be sorted by ascending or descending points, teams with the lowest score have difficult fixtures coming up so should be avoided.",
            "The number of gameweeks displayed can be adjusted via the dropdown (up to 10GWs) to help you decide to either take a short term punt or a longer term hold with good fixtures. The active gameweek can also be change by shifting it forwards to an upcoming GW number, use this to help plan future transfers by being aware of when the fixture difficulty swings are. Finally, the FDR system can be toggled between the Official FPL FDR or the Custom Oracle FDR, which is explained more below."
        ]
    },
    {
        question: "What is the Oracle FDR?",
        answer: [
            "The Oracle FDR is a 1-10 custom scoring system that aims to add more nuance to studying fixture difficulty than the standard 1-5 Official FPL FDR scoring system. This was the original purpose for creating this site - creating a more useful fixture calendar that utilises a custom scoring system that reflects a wider differentiation between fixture difficulty.",
            "The Official FPL scoring system is very 'bunched' with no fixtures in the 24/25 season being deemed worthy of a 1/5 rating, and only Man City (a) and Liverpool (a) scoring 5/5. This leads to lots of vastly different fixtures being judged as having the same difficulty. As an example, in the 24/25 season FPL have rated both Ipswich (H) and West Ham (a) as equal difficulty at 2/5. The Oracle FDR rates these as 2/10 and 5/10 respectively, better reflecting the gap in difficulty between these two fixtures - allowing managers to take advantage of teams with these more appealing fixtures."
        ]
    },
    {
        question: "How is the Oracle FDR calculated?",
        answer: [
            'The scoring system for the 1-10 Oracle FDR is manually calculated and displayed on the Google Sheet here: <a href="https://docs.google.com/spreadsheets/d/1wYS6wyRkHiP-9zlJAkd_V9vjnxXslpNinz-CLg6BILs/edit#gid=0" target="_blank" rel="noopener noreferrer">Oracle FDR Sheet</a>, this supplies the data for the Fixture Difficulty Calendar.',
            "The scoring ranking is largely based off the average PPG (points per game) for each team, with historical data stored for reference in the 'PL History' tab of the sheet. This is then used to give an indication of overall strength of each team when playing home and away, with the 'Average PPG Guidelines' on the 'Calculations' tab showing the boundaries e.g. 1.5 PPG = 5/10, 2.6+ PPG = 10/10 etc. These ratings are calculated at the start of each season and any adjustments that take place throughout the season will be announced on <a href=\"https://x.com/OracleFPL1\" target=\"_blank\" rel=\"noopener noreferrer\">The Oracle X Account</a> and on the home page of the site."
        ]
    }
  ];

  const faqs2 = [
    {
      question: "What is the Player Comparison Tool?",
      answer: [
        "This allows the comparison between two FPL players of their current season stats, to help decide which would be the better pick. Enter their surname (or preferred player name from their shirt) and then select them from the dropdown of matching players.",
        "By default it displays their player stats, selection stats, points stats, attacking stats and bonus stats. If you wish to add defending stats or remove the attacking stats then these can be customised via the checkboxes."
      ]
    },
    {
      question: "What are the xG, xA and xGC stats?",
      answer: [
        "These are very useful stats that are being used more frequently in modern football to determine the underlying performance of players, and stand for expected goals, expected assists and expected goals conceded. These are calculated based on the likeliness of that specific shot or pass resulting in a goal or assist, for example a shot from the 6-yard box in the middle of the goal would result in an xG of 0.9+ whereas a shot from long distance at a wide angle would be less than 0.1. xGC is the total of all these shots that teams have accumulated throughout the season",
        "This can be used to identify players that are over or underperforming their underlying stats, and decisions can be based on the assumption that these figures are often likely to regress to the mean over the course of a whole season. Whether you decide to pick players that have good underlying numbers and hope they eventually come good, or prefer to back players in form to continue overperforming their xG - well that choice is up to you!"
      ]
    },
    {
      question: "What are the per 90 stats?",
      answer: [
        "These take the total stats and divide these per 90 minutes played for each player. This is useful to identify more proficient strikers, for example a striker that has scored 5 goals in 1000 minutes will have a higher goals per 90 figure than one who has scored 10 goals in 3000 minutes so could be a better pick than purely judging on total goals scored.",
        "These can also be applied to defenders by looking at the goals conceded per 90 to identify defences that are likely to get clean sheets. Total clean sheets are also displayed, with a percentage per start as players likely need to start in order to get to 60 minutes and claim the clean sheet points."
      ]
    }
  ];

  const faqs3 = [
    {
      question: "Who is The Oracle?",
      answer: [
        "The Oracle is the FPL alter ego of me - James, an FPL enthusiast and software developer from Brighton.",
        "This site is a personal passion project to help bring to fruition some useful FPL tools that I had envisioned and practice my coding skills. The original objective of the site was to create a more useful fixture difficulty calendar using a custom rating system to help identify players with better fixtures and get an edge in FPL!"
      ]
    },
    { 
      question: "What are your historic performances on FPL?",
      answer: [
        "Not great! I've been an avid FPL fan for almost 20 years, my account says I've played every season since 07/08 but I'm sure I've been playing even longer than that on the old site. My best ever finish is a not especially impressive 36k in 08/09.",
        "I've only really been taking it more seriously in the last few years having gotten interested in understanding how the player price changes worked and how to build team value by planning transfers properly. My current benchmark is to finish in the top 1% of managers, which I achieved in 21/22 (67k) and 22/23 (75k), but missed out on in a disappointing 23/24 (178k)."
      ]
    },
    {
        question: "What is Beat The Robot?",
        answer: [
          "Beat The Robot is an ongoing competition for the 23/24 season that pits Erling 'The Robot' Haaland against a different opposition player each week to see who scores the most FPL points. This experiment arose from the fact that he was so heavily captained last season, I wanted to see if his total score could be beaten by selecting a different player with a better fixture as generated from the Fixture Difficulty Calendar.",
          'The ongoing total will be tracked on the Beat The Robot tab on the <a href="https://docs.google.com/spreadsheets/d/1wYS6wyRkHiP-9zlJAkd_V9vjnxXslpNinz-CLg6BILs/edit#gid=0" target="_blank" rel="noopener noreferrer">Oracle FDR Google Sheet</a> and weekly updates posted on <a href="https://x.com/OracleFPL1" target="_blank" rel="noopener noreferrer">The Oracle X Account</a>.',
        ]
    },
    {
        question: "Where else can I stay in touch with The Oracle?",
        answer: [
          'Follow updates on <a href="https://x.com/OracleFPL1" target="_blank" rel="noopener noreferrer">The Oracle X Account</a> for FPL team reveals, GW points, FDR updates and Beat The Robot.',
          'Alternatively, if you have any queries, please direct them to <a href="mailto:oraclefplcontact@gmail.com">oraclefplcontact@gmail.com</a>.'
        ]
    }
  ];

  return (
    <div className="faq-page-container">
      <h1>Frequently Asked Questions</h1>

      <div className="faq-section-container">
        <h3 className="faq-section-title">1. Fixture Difficulty Calendar</h3>
        {faqs.map((faq, index) => (
          <div key={`section1-${index}`} className="faq-content">
            <h2 onClick={() => toggleSection("section1", index)} className="faq-question">
              {faq.question}
            </h2>
            {expandedSections["section1"]?.[index] && faq.answer.map((paragraph, i) => (
              <p
                key={`answer1-${index}-${i}`}
                className="faq-answer"
                dangerouslySetInnerHTML={{ __html: paragraph }}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="faq-section-container">
        <h3 className="faq-section-title">2. Player Comparison Tool</h3>
        {faqs2.map((faq, index) => (
          <div key={`section2-${index}`} className="faq-content">
            <h2 onClick={() => toggleSection("section2", index)} className="faq-question">
              {faq.question}
            </h2>
            {expandedSections["section2"]?.[index] && faq.answer.map((paragraph, i) => (
              <p key={`answer2-${index}-${i}`} className="faq-answer">{paragraph}</p>
            ))}
          </div>
        ))}
      </div>

      <div className="faq-section-container">
        <h3 className="faq-section-title">3. OracleFPL</h3>
        {faqs3.map((faq, index) => (
          <div key={`section3-${index}`} className="faq-content">
            <h2 onClick={() => toggleSection("section3", index)} className="faq-question">
              {faq.question}
            </h2>
            {expandedSections["section3"]?.[index] && faq.answer.map((paragraph, i) => (
                <p
                key={`answer1-${index}-${i}`}
                className="faq-answer"
                dangerouslySetInnerHTML={{ __html: paragraph }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;
