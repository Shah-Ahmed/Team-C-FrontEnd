'use client';

import React, { useState } from 'react';

interface Draft {
  id: string;
  topic: string;
  platform: string;
  content: string;
  createdAt: string;
}

export default function DraftLibraryPage() {
  const [drafts, setDrafts] = useState<Draft[]>([
    {
      id: '1',
      topic: 'New Product Launch',
      platform: 'Instagram',
      content: '🚀 Super excited to announce our new product launch! Stay tuned for amazing features. #Launch #Innovation',
      createdAt: '2026-10-20'
    },
    {
      id: '2',
      topic: 'AI Automation Tips',
      platform: 'LinkedIn',
      content: 'Efficiency is key! Here are top 3 ways AI can streamline your weekly social workflow... #AI #Automation',
      createdAt: '2026-10-19'
    }
  ]);

  const handleDelete = (id: string) => {
    setDrafts(drafts.filter(draft => draft.id !== id));
  };

  return (
    <div style={{ backgroundColor: '#0B1220', minHeight: '100vh', color: '#FFFFFF', padding: '30px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#FFFFFF' }}>Draft & Creative Library</h1>
            <p style={{ color: '#94A3B8', fontSize: '14px' }}>
              Manage, edit, and review all your saved AI generated drafts.
            </p>
          </div>
          <a
            href="/ai-studio"
            style={{
              padding: '10px 16px',
              backgroundColor: '#3B82F6',
              color: '#FFF',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            + Create New Draft
          </a>
        </div>

        {/* Draft Cards Grid */}
        {drafts.length === 0 ? (
          <div style={{ backgroundColor: '#111C31', padding: '40px', borderRadius: '12px', textAlign: 'center', color: '#64748B' }}>
            No saved drafts found. Go to AI Content Studio to generate some!
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {drafts.map((draft) => (
              <div
                key={draft.id}
                style={{
                  backgroundColor: '#111C31',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid #1E293B',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '12px', color: '#8B5CF6', backgroundColor: '#1E1B4B', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                      {draft.platform}
                    </span>
                    <span style={{ fontSize: '12px', color: '#64748B' }}>{draft.createdAt}</span>
                  </div>
                  
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#F8FAFC' }}>
                    {draft.topic}
                  </h3>

                  <p style={{ fontSize: '14px', color: '#CBD5E1', lineHeight: '1.5', whiteSpace: 'pre-wrap', marginBottom: '15px' }}>
                    {draft.content}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #1E293B' }}>
                  <button
                    onClick={() => handleDelete(draft.id)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      backgroundColor: 'transparent',
                      border: '1px solid #F43F5E',
                      color: '#F43F5E',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}