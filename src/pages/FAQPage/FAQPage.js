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
      question: "What is this page about? HI",
      answer: [
        "This page provides answers to some of the most frequently asked questions.",
        "Feel free to explore and learn more about our offerings."
      ]
    },
    {
      question: "How do I use this FAQ page? HI",
      answer: [
        "Simply click on any question to expand and see the answer."
      ]
    },
    {
      question: "Can I add more questions? HI",
      answer: [
        "Yes, you can easily add more questions by modifying the FAQ data in the code."
      ]
    }
  ];

  const faqs3 = [
    {
      question: "What is this page about? NOW",
      answer: [
        "This page provides answers to some of the most frequently asked questions.",
        "We are constantly updating this section with new content to help our users."
      ]
    },
    {
      question: "How do I use this FAQ page? NOW",
      answer: [
        "Simply click on any question to expand and see the answer."
      ]
    },
    {
      question: "Can I add more questions? NOW",
      answer: [
        "Yes, you can easily add more questions by modifying the FAQ data in the code."
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

      {/* <div className="faq-section-container">
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
              <p key={`answer3-${index}-${i}`} className="faq-answer">{paragraph}</p>
            ))}
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default FAQPage;
