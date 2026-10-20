'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { apiFetch, errorMessage } from '@/lib/api';
import type {
  AIContentType,
  AIGenerateRequest,
  AIGenerateResponse,
  AIPlatform,
  AIPromptSettings,
  AITone,
  AIDraft
} from '@/types';

export default function AIStudioPage() {
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState<AIContentType>('caption');
  const [platform, setPlatform] = useState<AIPlatform>('instagram');
  const [tone, setTone] = useState<AITone>('professional');
  const [targetAudience, setTargetAudience] = useState('');

  const [generatedResponse, setGeneratedResponse] = useState<AIGenerateResponse | null>(null);
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Calls the backend AI generation endpoint: POST /api/ai/generate
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const payload: AIGenerateRequest = {
      topic: topic.trim(),
      contentType,
      platform,
      tone,
      ...(targetAudience.trim() ? { targetAudience: targetAudience.trim() } : {})
    };

    try {
      const response = await apiFetch<AIGenerateResponse>('/api/ai/generate', {
        method: 'POST',
        body: payload
      });
      setGeneratedResponse(response);
      setGeneratedContent(response.content);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Saves the generated output to the Firestore draft collection: POST /api/ai/drafts
  const handleSaveDraft = async () => {
    if (!generatedContent.trim()) return;

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    const promptSettings: AIPromptSettings = {
      topic: topic.trim(),
      contentType,
      platform,
      tone,
      ...(targetAudience.trim() ? { targetAudience: targetAudience.trim() } : {})
    };

    try {
      await apiFetch<AIDraft>('/api/ai/drafts', {
        method: 'POST',
        body: {
          title: topic.trim() || 'Untitled Post',
          promptSettings,
          generatedContent,
          hashtags: generatedResponse?.hashtags || [],
          status: 'draft',
          providerUsed: generatedResponse?.provider || 'mock'
        }
      });
      setSuccessMessage('Draft saved successfully to library.');
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#FFFFFF', marginBottom: '6px' }}>AI Content Studio</h1>
        <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>
          Generate social captions, product descriptions, hashtags, and campaign ideas using AI.
        </p>
      </div>

        {/* Feedback banners */}
        {error && (
          <div
            style={{
              backgroundColor: '#4C0519',
              border: '1px solid #F43F5E',
              color: '#FECDD3',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px'
            }}
          >
            {error}
          </div>
        )}

        {successMessage && (
          <div
            style={{
              backgroundColor: '#064E3B',
              border: '1px solid #10B981',
              color: '#A7F3D0',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>{successMessage}</span>
            <Link
              href="/drafts"
              style={{ color: '#6EE7B7', textDecoration: 'underline', fontWeight: '600', fontSize: '13px' }}
            >
              View Drafts
            </Link>
          </div>
        )}

        {/* Main Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          {/* Controls Form Card */}
          <div style={{ backgroundColor: '#111C31', padding: '20px', borderRadius: '12px', border: '1px solid #1E293B' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px', color: '#8B5CF6' }}>
              Content Settings
            </h2>

            <form onSubmit={handleGenerate}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#CBD5E1' }}>
                  Topic or Product Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sustainable Coffee Subscription"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    backgroundColor: '#0B1220',
                    border: '1px solid #334155',
                    color: '#FFF',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#CBD5E1' }}>
                  Content Format
                </label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value as AIContentType)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    backgroundColor: '#0B1220',
                    border: '1px solid #334155',
                    color: '#FFF',
                    outline: 'none'
                  }}
                >
                  <option value="caption">Post Caption</option>
                  <option value="product_description">Product Description</option>
                  <option value="hashtags">Hashtags Only</option>
                  <option value="campaign_ideas">Campaign Ideas</option>
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#CBD5E1' }}>
                  Target Platform
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as AIPlatform)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    backgroundColor: '#0B1220',
                    border: '1px solid #334155',
                    color: '#FFF',
                    outline: 'none'
                  }}
                >
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="twitter">Twitter / X</option>
                  <option value="facebook">Facebook</option>
                  <option value="general">General</option>
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#CBD5E1' }}>
                  Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as AITone)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    backgroundColor: '#0B1220',
                    border: '1px solid #334155',
                    color: '#FFF',
                    outline: 'none'
                  }}
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="excited">Excited</option>
                  <option value="witty">Witty</option>
                  <option value="urgent">Urgent</option>
                  <option value="informative">Informative</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#CBD5E1' }}>
                  Target Demographic (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Remote workers, Eco-conscious shoppers"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    backgroundColor: '#0B1220',
                    border: '1px solid #334155',
                    color: '#FFF',
                    outline: 'none'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#3B82F6',
                  color: '#FFF',
                  fontWeight: 'bold',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Generating...' : 'Generate Content'}
              </button>
            </form>
          </div>

          {/* Generated Result Output */}
          <div style={{ backgroundColor: '#111C31', padding: '20px', borderRadius: '12px', border: '1px solid #1E293B', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: '#3B82F6' }}>
                Generated Preview
              </h2>
              {generatedResponse && (
                <span style={{ fontSize: '11px', color: '#94A3B8', backgroundColor: '#0B1220', padding: '2px 8px', borderRadius: '4px', border: '1px solid #334155' }}>
                  Provider: {generatedResponse.provider}
                </span>
              )}
            </div>

            {generatedContent ? (
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <textarea
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  rows={8}
                  style={{
                    width: '100%',
                    backgroundColor: '#0B1220',
                    color: '#F8FAFC',
                    padding: '12px',
                    borderRadius: '6px',
                    border: '1px solid #334155',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    outline: 'none'
                  }}
                />

                {/* Hashtag Badges */}
                {generatedResponse?.hashtags && generatedResponse.hashtags.length > 0 && (
                  <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {generatedResponse.hashtags.map((tag, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '12px',
                          color: '#A78BFA',
                          backgroundColor: '#1E1B4B',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontWeight: '500'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={saving}
                    style={{
                      flex: 1,
                      padding: '10px',
                      backgroundColor: '#10B981',
                      color: '#FFF',
                      fontWeight: '600',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    {saving ? 'Saving...' : 'Save to Drafts'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setGeneratedContent('');
                      setGeneratedResponse(null);
                      setSuccessMessage(null);
                    }}
                    style={{
                      padding: '10px 14px',
                      backgroundColor: 'transparent',
                      color: '#94A3B8',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#64748B', paddingTop: '60px', flex: 1 }}>
                Configure your settings and click generate to view AI results.
              </div>
            )}
          </div>
        </div>
      </div>
    );
}