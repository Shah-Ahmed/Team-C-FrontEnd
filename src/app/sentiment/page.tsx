'use client';

import React, { useState } from 'react';

interface Review {
  id: string;
  author: string;
  comment: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  score: number;
}

export default function SentimentDashboardPage() {
  const [reviews] = useState<Review[]>([
    {
      id: '1',
      author: 'Sarah K.',
      comment: 'Absolutely love this new content automation tool! Saved me hours.',
      sentiment: 'Positive',
      score: 0.94
    },
    {
      id: '2',
      author: 'David M.',
      comment: 'The posts are decent, but I wish there were more tone options.',
      sentiment: 'Neutral',
      score: 0.52
    },
    {
      id: '3',
      author: 'Alex P.',
      comment: 'Scheduled post failed to publish on time this morning.',
      sentiment: 'Negative',
      score: 0.12
    }
  ]);

  const getBadgeStyle = (sentiment: Review['sentiment']) => {
    switch (sentiment) {
      case 'Positive':
        return { bg: '#064E3B', color: '#10B981' };
      case 'Neutral':
        return { bg: '#451A03', color: '#F59E0B' };
      case 'Negative':
        return { bg: '#4C0519', color: '#F43F5E' };
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#FFFFFF', marginBottom: '6px' }}>Sentiment Dashboard</h1>
        <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>
          Analyze real-time customer feedback, comments, and post engagement sentiment.
        </p>
      </div>

        {/* Analytics Overview Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
          <div style={{ backgroundColor: '#111C31', padding: '20px', borderRadius: '12px', border: '1px solid #1E293B', textAlign: 'center' }}>
            <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 'bold' }}>POSITIVE</span>
            <h2 style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0', color: '#10B981' }}>68%</h2>
            <p style={{ fontSize: '12px', color: '#64748B' }}>Total 142 Comments</p>
          </div>

          <div style={{ backgroundColor: '#111C31', padding: '20px', borderRadius: '12px', border: '1px solid #1E293B', textAlign: 'center' }}>
            <span style={{ fontSize: '12px', color: '#F59E0B', fontWeight: 'bold' }}>NEUTRAL</span>
            <h2 style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0', color: '#F59E0B' }}>22%</h2>
            <p style={{ fontSize: '12px', color: '#64748B' }}>Total 46 Comments</p>
          </div>

          <div style={{ backgroundColor: '#111C31', padding: '20px', borderRadius: '12px', border: '1px solid #1E293B', textAlign: 'center' }}>
            <span style={{ fontSize: '12px', color: '#F43F5E', fontWeight: 'bold' }}>NEGATIVE</span>
            <h2 style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0', color: '#F43F5E' }}>10%</h2>
            <p style={{ fontSize: '12px', color: '#64748B' }}>Total 21 Comments</p>
          </div>
        </div>

        {/* Comment Inbox Section */}
        <div style={{ backgroundColor: '#111C31', padding: '24px', borderRadius: '12px', border: '1px solid #1E293B' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#8B5CF6' }}>
            Recent Comments & Sentiment Analysis
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {reviews.map((item) => {
              const badge = getBadgeStyle(item.sentiment);
              return (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: '#0B1220',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #334155',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#F8FAFC', display: 'block', marginBottom: '4px' }}>
                      {item.author}
                    </span>
                    <p style={{ fontSize: '13px', color: '#CBD5E1', margin: 0 }}>
                      "{item.comment}"
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        backgroundColor: badge.bg,
                        color: badge.color,
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        display: 'inline-block',
                        marginBottom: '4px'
                      }}
                    >
                      {item.sentiment}
                    </span>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>
                      Score: {item.score}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
}