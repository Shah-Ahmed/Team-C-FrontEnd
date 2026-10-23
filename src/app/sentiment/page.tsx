'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch, errorMessage } from '@/lib/api';

interface Review {
  id: string;
  author: string;
  comment: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  score: number;
}

export default function SentimentDashboardPage() {
  const { profile, loading: authLoading } = useAuth();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    positive: { count: 0, percentage: 0 },
    neutral: { count: 0, percentage: 0 },
    negative: { count: 0, percentage: 0 },
  });

  // Analyze Review Form State
  const [author, setAuthor] = useState('');
  const [newText, setNewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Load real sentiment data and metrics from backend for the user's organization
  const loadSentimentData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<Array<{
        id: string;
        author?: string;
        text: string;
        sentiment: string;
        score: number;
      }>>('/api/ai/sentiment');

      if (Array.isArray(data)) {
        setReviews(
          data.map((item) => ({
            id: item.id,
            author: item.author || 'Anonymous User',
            comment: item.text,
            sentiment: (item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1).toLowerCase()) as Review['sentiment'],
            score: item.score,
          }))
        );
      }

      const sumData = await apiFetch<{
        positive: { count: number; percentage: number };
        neutral: { count: number; percentage: number };
        negative: { count: number; percentage: number };
      }>('/api/ai/sentiment/summary');

      if (sumData) {
        setSummary(sumData);
      }
    } catch {
      // Retain existing state on failure
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch only after AuthContext has resolved the user's session
  useEffect(() => {
    if (!authLoading) {
      loadSentimentData();
    }
  }, [authLoading, loadSentimentData]);

  // Submit feedback for real-time AI sentiment analysis: POST /api/ai/sentiment
  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!newText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await apiFetch<{
        id: string;
        author?: string;
        text: string;
        sentiment: string;
        score: number;
      }>('/api/ai/sentiment', {
        method: 'POST',
        body: {
          text: newText.trim(),
          author: author.trim() || undefined,
        }
      });

      // Optimistically add to reviews list so it is immediately visible
      if (result) {
        const capitalized = (result.sentiment.charAt(0).toUpperCase() + result.sentiment.slice(1).toLowerCase()) as Review['sentiment'];
        setReviews((prev) => [
          {
            id: result.id,
            author: result.author || author.trim() || 'Anonymous User',
            comment: result.text,
            sentiment: capitalized,
            score: result.score,
          },
          ...prev
        ]);
      }

      setNewText('');
      setAuthor('');
      loadSentimentData();
    } catch (err) {
      setFormError(errorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const setSample = (sampleAuthor: string, sampleText: string) => {
    setAuthor(sampleAuthor);
    setNewText(sampleText);
  };

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
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#FFFFFF', marginBottom: '6px' }}>Sentiment Dashboard</h1>
          <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>
            Analyze real-time customer feedback, comments, and post engagement sentiment.
          </p>
        </div>
        <button
          onClick={loadSentimentData}
          style={{
            padding: '8px 14px',
            backgroundColor: 'transparent',
            color: '#94A3B8',
            border: '1px solid #334155',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Refresh Data
        </button>
      </div>

      {/* Analytics Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#111C31', padding: '20px', borderRadius: '12px', border: '1px solid #1E293B', textAlign: 'center' }}>
          <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 'bold' }}>POSITIVE</span>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0', color: '#10B981' }}>{summary.positive.percentage}%</h2>
          <p style={{ fontSize: '12px', color: '#64748B' }}>Total {summary.positive.count} Comments</p>
        </div>

        <div style={{ backgroundColor: '#111C31', padding: '20px', borderRadius: '12px', border: '1px solid #1E293B', textAlign: 'center' }}>
          <span style={{ fontSize: '12px', color: '#F59E0B', fontWeight: 'bold' }}>NEUTRAL</span>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0', color: '#F59E0B' }}>{summary.neutral.percentage}%</h2>
          <p style={{ fontSize: '12px', color: '#64748B' }}>Total {summary.neutral.count} Comments</p>
        </div>

        <div style={{ backgroundColor: '#111C31', padding: '20px', borderRadius: '12px', border: '1px solid #1E293B', textAlign: 'center' }}>
          <span style={{ fontSize: '12px', color: '#F43F5E', fontWeight: 'bold' }}>NEGATIVE</span>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0', color: '#F43F5E' }}>{summary.negative.percentage}%</h2>
          <p style={{ fontSize: '12px', color: '#64748B' }}>Total {summary.negative.count} Comments</p>
        </div>
      </div>

      {/* Analyze Customer Review Section */}
      <div style={{ backgroundColor: '#111C31', padding: '24px', borderRadius: '12px', border: '1px solid #1E293B', marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: '#8B5CF6' }}>
            Analyze Customer Review or Feedback
          </h2>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: '#64748B' }}>Quick Samples:</span>
            <button
              type="button"
              onClick={() => setSample('Jessica L.', 'Absolutely love the new scheduling tool! Saved our team over 10 hours this week.')}
              style={{ fontSize: '11px', color: '#10B981', backgroundColor: '#064E3B', border: 'none', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer' }}
            >
              Positive
            </button>
            <button
              type="button"
              onClick={() => setSample('David R.', 'The content generation works fine, but I wish there were more custom prompt tone options.')}
              style={{ fontSize: '11px', color: '#F59E0B', backgroundColor: '#451A03', border: 'none', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer' }}
            >
              Neutral
            </button>
            <button
              type="button"
              onClick={() => setSample('Alex P.', 'Scheduled post failed to publish this morning due to an unexpected gateway timeout.')}
              style={{ fontSize: '11px', color: '#F43F5E', backgroundColor: '#4C0519', border: 'none', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer' }}
            >
              Negative
            </button>
          </div>
        </div>
        <p style={{ color: '#94A3B8', fontSize: '13px', margin: '0 0 16px 0' }}>
          Enter customer comments, reviews, or social feedback to classify sentiment and update metrics.
        </p>

        <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94A3B8', marginBottom: '6px' }}>
                Customer / Author Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Sarah K. or Verified Customer"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#0B1220',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94A3B8', marginBottom: '6px' }}>
                Review / Feedback Text
              </label>
              <input
                type="text"
                placeholder="e.g. Absolutely love this new content automation tool! Saved me hours."
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                required
                style={{
                  width: '100%',
                  backgroundColor: '#0B1220',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {formError && (
            <div style={{ color: '#F43F5E', fontSize: '13px' }}>{formError}</div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={isSubmitting || !newText.trim()}
              style={{
                padding: '10px 24px',
                backgroundColor: '#8B5CF6',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: isSubmitting || !newText.trim() ? 'not-allowed' : 'pointer',
                opacity: isSubmitting || !newText.trim() ? 0.6 : 1
              }}
            >
              {isSubmitting ? 'Analyzing Sentiment...' : 'Analyze & Save Review'}
            </button>
          </div>
        </form>
      </div>

      {/* Comment Inbox Section */}
      <div style={{ backgroundColor: '#111C31', padding: '24px', borderRadius: '12px', border: '1px solid #1E293B' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#8B5CF6' }}>
          Recent Comments & Sentiment Analysis
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#64748B', fontSize: '14px' }}>
              Loading analyzed comments...
            </div>
          ) : reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#64748B', fontSize: '14px' }}>
              No customer comments analyzed yet. Use the form above to analyze your first review.
            </div>
          ) : (
            reviews.map((item) => {
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
                    alignItems: 'center',
                    gap: '16px'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#F8FAFC', display: 'block', marginBottom: '4px' }}>
                      {item.author}
                    </span>
                    <p style={{ fontSize: '13px', color: '#CBD5E1', margin: 0, lineHeight: '1.4' }}>
                      "{item.comment}"
                    </p>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
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
            })
          )}
        </div>
      </div>
    </div>
  );
}