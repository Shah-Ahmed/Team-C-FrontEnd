'use client';

import React, { useState } from 'react';

export default function AIStudioPage() {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [tone, setTone] = useState('Professional');
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Demo placeholder generation
    setTimeout(() => {
      setGeneratedContent(
        `✨ [${platform} Post - ${tone} Tone]\n\n` +
        `🚀 ${topic || 'Sample AI Post'}\n\n` +
        `Discover amazing insights and level up your strategy today! #AI #Automation #Growth`
      );
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={{ backgroundColor: '#0B1220', minHeight: '100vh', color: '#FFFFFF', padding: '30px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#FFFFFF' }}>AI Content Studio</h1>
          <p style={{ color: '#94A3B8', fontSize: '14px' }}>
            Generate captions, hashtags, and social posts using AI.
          </p>
        </div>

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
                  Topic / Product Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. New Product Launch"
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
                  Target Platform
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
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
                  <option value="Instagram">Instagram</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Twitter/X">Twitter / X</option>
                  <option value="Facebook">Facebook</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#CBD5E1' }}>
                  Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
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
                  <option value="Professional">Professional</option>
                  <option value="Casual">Casual</option>
                  <option value="Promotional">Promotional</option>
                  <option value="Witty">Witty</option>
                </select>
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
                  cursor: 'pointer'
                }}
              >
                {loading ? 'Generating...' : '✨ Generate Content'}
              </button>
            </form>
          </div>

          {/* Generated Result Output */}
          <div style={{ backgroundColor: '#111C31', padding: '20px', borderRadius: '12px', border: '1px solid #1E293B' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px', color: '#3B82F6' }}>
              Generated Preview
            </h2>

            {generatedContent ? (
              <div style={{ whiteSpace: 'pre-wrap', backgroundColor: '#0B1220', padding: '15px', borderRadius: '6px', border: '1px solid #334155', fontSize: '14px', lineHeight: '1.5' }}>
                {generatedContent}
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#64748B', paddingTop: '40px' }}>
                Fill the settings and click generate to view AI results.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}