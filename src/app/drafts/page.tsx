'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch, errorMessage } from '@/lib/api';
import type { AIDraft } from '@/types';

export default function DraftLibraryPage() {
  const [drafts, setDrafts] = useState<AIDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Loads drafts belonging to the authenticated organization: GET /api/ai/drafts
  const fetchDrafts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<AIDraft[]>('/api/ai/drafts');
      setDrafts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrafts();
  }, [fetchDrafts]);

  // Deletes a draft from Firestore: DELETE /api/ai/drafts/:id
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setError(null);
    try {
      await apiFetch<{ success: boolean }>(`/api/ai/drafts/${id}`, {
        method: 'DELETE'
      });
      // Update UI only after server confirms successful deletion
      setDrafts((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (timestamp: number | string) => {
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? String(timestamp) : date.toLocaleDateString();
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#FFFFFF', marginBottom: '6px' }}>Draft and Creative Library</h1>
          <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>
            Manage, review, and organize all your saved AI generated social drafts.
          </p>
        </div>
          <Link
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
          </Link>
        </div>

        {/* Error notification */}
        {error && (
          <div
            style={{
              backgroundColor: '#4C0519',
              border: '1px solid #F43F5E',
              color: '#FECDD3',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>{error}</span>
            <button
              onClick={fetchDrafts}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #F43F5E',
                color: '#FECDD3',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading indicator */}
        {loading && (
          <div style={{ backgroundColor: '#111C31', padding: '40px', borderRadius: '12px', textAlign: 'center', color: '#94A3B8' }}>
            Loading saved drafts...
          </div>
        )}

        {/* Empty state */}
        {!loading && drafts.length === 0 && !error && (
          <div style={{ backgroundColor: '#111C31', padding: '40px', borderRadius: '12px', textAlign: 'center', color: '#64748B' }}>
            No saved drafts found. Go to AI Content Studio to generate and save your first post.
          </div>
        )}

        {/* Draft Cards Grid */}
        {!loading && drafts.length > 0 && (
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
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span
                      style={{
                        fontSize: '12px',
                        color: '#8B5CF6',
                        backgroundColor: '#1E1B4B',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        textTransform: 'capitalize'
                      }}
                    >
                      {draft.promptSettings?.platform || 'General'}
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>
                      {formatDate(draft.createdAt || draft.updatedAt)}
                    </span>
                  </div>
                  
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#F8FAFC' }}>
                    {draft.title || draft.promptSettings?.topic || 'Untitled Draft'}
                  </h3>

                  <p style={{ fontSize: '14px', color: '#CBD5E1', lineHeight: '1.5', whiteSpace: 'pre-wrap', marginBottom: '12px' }}>
                    {draft.generatedContent}
                  </p>

                  {/* Hashtags */}
                  {draft.hashtags && draft.hashtags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                      {draft.hashtags.map((tag, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '11px',
                            color: '#A78BFA',
                            backgroundColor: '#0B1220',
                            padding: '2px 6px',
                            borderRadius: '3px'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Metadata tags */}
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '10px', color: '#10B981', backgroundColor: '#064E3B', padding: '2px 6px', borderRadius: '3px', textTransform: 'uppercase' }}>
                      {draft.status || 'draft'}
                    </span>
                    {draft.version && (
                      <span style={{ fontSize: '10px', color: '#94A3B8', backgroundColor: '#0B1220', padding: '2px 6px', borderRadius: '3px' }}>
                        v{draft.version}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #1E293B' }}>
                  <button
                    onClick={() => handleDelete(draft.id)}
                    disabled={deletingId === draft.id}
                    style={{
                      flex: 1,
                      padding: '8px',
                      backgroundColor: 'transparent',
                      border: '1px solid #F43F5E',
                      color: '#F43F5E',
                      borderRadius: '6px',
                      cursor: deletingId === draft.id ? 'not-allowed' : 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      opacity: deletingId === draft.id ? 0.6 : 1
                    }}
                  >
                    {deletingId === draft.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
}