'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch, errorMessage } from '@/lib/api';

interface ScheduledPost {
  id: string;
  topic: string;
  platform: string;
  content?: string;
  draftId?: string;
  scheduledTime: string;
  status: 'Scheduled' | 'Published' | 'Failed';
}

interface SavedDraft {
  id: string;
  title?: string;
  promptSettings?: {
    topic?: string;
    platform?: string;
  };
  generatedContent: string;
}

export default function CalendarPage() {
  const { profile, loading: authLoading } = useAuth();

  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [drafts, setDrafts] = useState<SavedDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Schedule Post Form State
  const [selectedDraftId, setSelectedDraftId] = useState('');
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [content, setContent] = useState('');
  const [scheduledDateTime, setScheduledDateTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Load scheduled posts from C3 backend
  const fetchPosts = () => {
    setLoading(true);
    apiFetch<Array<{
      id: string;
      topic?: string;
      content?: string;
      platform?: string;
      draftId?: string;
      scheduledIso?: string;
      scheduledTime?: number;
      status: string;
    }>>('/api/ai/schedule')
      .then((data) => {
        if (Array.isArray(data)) {
          setPosts(
            data.map((item) => {
              const statusCapitalized =
                item.status === 'published'
                  ? 'Published'
                  : item.status === 'failed'
                  ? 'Failed'
                  : 'Scheduled';
              const timeDisplay = item.scheduledIso
                ? new Date(item.scheduledIso).toLocaleString()
                : item.scheduledTime
                ? new Date(item.scheduledTime).toLocaleString()
                : 'Pending';
              return {
                id: item.id,
                topic: item.topic || item.content?.slice(0, 40) || 'Untitled Post',
                platform: item.platform ? item.platform.charAt(0).toUpperCase() + item.platform.slice(1) : 'General',
                content: item.content,
                draftId: item.draftId,
                scheduledTime: timeDisplay,
                status: statusCapitalized as ScheduledPost['status'],
              };
            })
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  // Load saved drafts for easy one-click scheduling
  const fetchDrafts = () => {
    apiFetch<SavedDraft[]>('/api/ai/drafts')
      .then((data) => {
        if (Array.isArray(data)) {
          setDrafts(data);

          // If draftId is present in URL search query (e.g. redirected from Drafts Library)
          if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const queryDraftId = params.get('draftId');
            if (queryDraftId) {
              const targetDraft = data.find((d) => d.id === queryDraftId);
              if (targetDraft) {
                setSelectedDraftId(targetDraft.id);
                setTopic(targetDraft.title || targetDraft.promptSettings?.topic || 'Untitled Draft');
                if (targetDraft.promptSettings?.platform) {
                  const p = targetDraft.promptSettings.platform;
                  setPlatform(p.charAt(0).toUpperCase() + p.slice(1));
                }
                setContent(targetDraft.generatedContent);
              }
            }
          }
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (!authLoading) {
      fetchPosts();
      fetchDrafts();
    }
  }, [authLoading]);

  // Handle draft selection from dropdown
  const handleDraftSelect = (draftId: string) => {
    setSelectedDraftId(draftId);
    if (!draftId) return;

    const draft = drafts.find((d) => d.id === draftId);
    if (draft) {
      setTopic(draft.title || draft.promptSettings?.topic || 'Untitled Draft');
      if (draft.promptSettings?.platform) {
        const p = draft.promptSettings.platform;
        setPlatform(p.charAt(0).toUpperCase() + p.slice(1));
      }
      setContent(draft.generatedContent);
    }
  };

  // Handle creating a new scheduled post: POST /api/ai/schedule
  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!topic.trim() || !content.trim() || !scheduledDateTime) {
      setFormError('Please fill in topic, content, and scheduled date/time.');
      return;
    }

    const parsedEpoch = new Date(scheduledDateTime).getTime();
    if (isNaN(parsedEpoch)) {
      setFormError('Please choose a valid date and time.');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiFetch('/api/ai/schedule', {
        method: 'POST',
        body: {
          draftId: selectedDraftId || undefined,
          topic: topic.trim(),
          content: content.trim(),
          platform: platform.toLowerCase(),
          scheduledTime: parsedEpoch,
          timezone: 'UTC',
          status: 'scheduled'
        }
      });

      setTopic('');
      setContent('');
      setScheduledDateTime('');
      setSelectedDraftId('');
      fetchPosts();
    } catch (err) {
      setFormError(errorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Trigger simulated publication: POST /api/ai/schedule/:id/publish
  const handlePublish = async (id: string) => {
    setPublishingId(id);
    try {
      await apiFetch(`/api/ai/schedule/${id}/publish`, { method: 'POST' });
      fetchPosts();
    } catch {
    } finally {
      setPublishingId(null);
    }
  };

  // Delete scheduled post: DELETE /api/ai/schedule/:id
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await apiFetch(`/api/ai/schedule/${id}`, { method: 'DELETE' });
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch {
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status: ScheduledPost['status']) => {
    switch (status) {
      case 'Published':
        return { bg: '#064E3B', color: '#10B981', label: 'Published' };
      case 'Scheduled':
        return { bg: '#451A03', color: '#F59E0B', label: 'Scheduled' };
      default:
        return { bg: '#4C0519', color: '#F43F5E', label: 'Failed' };
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#FFFFFF', marginBottom: '6px' }}>Social Scheduling Calendar</h1>
        <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>
          Plan, schedule, and track automated publication times across platforms.
        </p>
      </div>

      {/* Schedule New Post Section */}
      <div style={{ backgroundColor: '#111C31', padding: '24px', borderRadius: '12px', border: '1px solid #1E293B', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#3B82F6' }}>
          Schedule a Social Post
        </h2>
        <p style={{ color: '#94A3B8', fontSize: '13px', margin: '0 0 20px 0' }}>
          Plan an automated publication for your social accounts, or choose an existing draft to schedule.
        </p>

        <form onSubmit={handleCreateSchedule} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Draft selector */}
          {drafts.length > 0 && (
            <div style={{ backgroundColor: '#0B1220', padding: '12px 16px', borderRadius: '8px', border: '1px solid #1E293B' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#8B5CF6', marginBottom: '6px' }}>
                Load from Saved AI Drafts (Optional)
              </label>
              <select
                value={selectedDraftId}
                onChange={(e) => handleDraftSelect(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#111C31',
                  border: '1px solid #8B5CF6',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">-- Compose new custom post or choose a draft --</option>
                {drafts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title || d.promptSettings?.topic || 'Untitled Draft'} ({d.promptSettings?.platform || 'General'})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94A3B8', marginBottom: '6px' }}>
                Topic / Headline
              </label>
              <input
                type="text"
                placeholder="e.g. Weekly Product Spotlight"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
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

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94A3B8', marginBottom: '6px' }}>
                Target Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
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
              >
                <option value="Instagram">Instagram</option>
                <option value="Twitter">Twitter / X</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Facebook">Facebook</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94A3B8', marginBottom: '6px' }}>
                Scheduled Publish Date & Time
              </label>
              <input
                type="datetime-local"
                value={scheduledDateTime}
                onChange={(e) => setScheduledDateTime(e.target.value)}
                required
                style={{
                  width: '100%',
                  backgroundColor: '#0B1220',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  colorScheme: 'dark',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94A3B8', marginBottom: '6px' }}>
              Post Content / Copy
            </label>
            <textarea
              rows={3}
              placeholder="Write the full post caption or content to publish..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              style={{
                width: '100%',
                backgroundColor: '#0B1220',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#FFFFFF',
                fontSize: '14px',
                boxSizing: 'border-box',
                resize: 'vertical'
              }}
            />
          </div>

          {formError && (
            <div style={{ color: '#F43F5E', fontSize: '13px' }}>{formError}</div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={isSubmitting || !topic.trim() || !content.trim() || !scheduledDateTime}
              style={{
                padding: '10px 24px',
                backgroundColor: '#3B82F6',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: isSubmitting || !topic.trim() || !content.trim() || !scheduledDateTime ? 'not-allowed' : 'pointer',
                opacity: isSubmitting || !topic.trim() || !content.trim() || !scheduledDateTime ? 0.6 : 1
              }}
            >
              {isSubmitting ? 'Scheduling...' : selectedDraftId ? 'Schedule Selected Draft' : 'Schedule Post'}
            </button>
          </div>
        </form>
      </div>

      {/* Scheduled Posts List */}
      <div style={{ backgroundColor: '#111C31', padding: '24px', borderRadius: '12px', border: '1px solid #1E293B' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#3B82F6' }}>
          Upcoming & Past Publications
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#64748B', fontSize: '14px' }}>
              Loading scheduled publications...
            </div>
          ) : posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#64748B', fontSize: '14px' }}>
              No scheduled posts found. Fill out the form above to schedule your first post.
            </div>
          ) : (
            posts.map((post) => {
              const badge = getStatusBadge(post.status);
              return (
                <div
                  key={post.id}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#F8FAFC' }}>
                        {post.topic}
                      </span>
                      <span style={{ fontSize: '12px', color: '#8B5CF6', backgroundColor: '#1E1B4B', padding: '2px 8px', borderRadius: '4px' }}>
                        {post.platform}
                      </span>
                      {post.draftId && (
                        <span style={{ fontSize: '11px', color: '#38BDF8', backgroundColor: '#082F49', padding: '2px 6px', borderRadius: '4px' }}>
                          Draft Linked
                        </span>
                      )}
                    </div>

                    {post.content && (
                      <p style={{ fontSize: '13px', color: '#CBD5E1', margin: '0 0 6px 0', lineHeight: '1.4' }}>
                        {post.content}
                      </p>
                    )}

                    <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                      Scheduled: {post.scheduledTime}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                    {post.status === 'Scheduled' && (
                      <button
                        onClick={() => handlePublish(post.id)}
                        disabled={publishingId === post.id}
                        style={{
                          backgroundColor: '#2563EB',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '6px 14px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: publishingId === post.id ? 'not-allowed' : 'pointer',
                          opacity: publishingId === post.id ? 0.6 : 1
                        }}
                      >
                        {publishingId === post.id ? 'Publishing...' : 'Publish Now'}
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(post.id)}
                      disabled={deletingId === post.id}
                      style={{
                        backgroundColor: 'transparent',
                        color: '#F43F5E',
                        border: '1px solid #F43F5E',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: deletingId === post.id ? 'not-allowed' : 'pointer',
                        opacity: deletingId === post.id ? 0.6 : 1
                      }}
                    >
                      {deletingId === post.id ? 'Deleting...' : 'Delete'}
                    </button>

                    <span
                      style={{
                        backgroundColor: badge.bg,
                        color: badge.color,
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      {badge.label}
                    </span>
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