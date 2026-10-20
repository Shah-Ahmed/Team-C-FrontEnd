'use client';

import React, { useState } from 'react';

interface ScheduledPost {
  id: string;
  topic: string;
  platform: string;
  scheduledTime: string;
  status: 'Scheduled' | 'Published' | 'Failed';
}

export default function CalendarPage() {
  const [posts, setPosts] = useState<ScheduledPost[]>([
    {
      id: '1',
      topic: 'Weekly Product Spotlight',
      platform: 'Instagram',
      scheduledTime: '2026-10-22 10:00 AM',
      status: 'Scheduled'
    },
    {
      id: '2',
      topic: 'AI Industry Trends Report',
      platform: 'LinkedIn',
      scheduledTime: '2026-10-21 02:30 PM',
      status: 'Scheduled'
    },
    {
      id: '3',
      topic: 'Customer Success Story',
      platform: 'Twitter / X',
      scheduledTime: '2026-10-19 09:00 AM',
      status: 'Published'
    }
  ]);

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

        {/* Scheduled Posts List */}
        <div style={{ backgroundColor: '#111C31', padding: '24px', borderRadius: '12px', border: '1px solid #1E293B' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#3B82F6' }}>
            Upcoming & Past Publications
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {posts.map((post) => {
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
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#F8FAFC' }}>
                        {post.topic}
                      </span>
                      <span style={{ fontSize: '12px', color: '#8B5CF6', backgroundColor: '#1E1B4B', padding: '2px 8px', borderRadius: '4px' }}>
                        {post.platform}
                      </span>
                    </div>
                    <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                      Scheduled: {post.scheduledTime}
                    </span>
                  </div>

                  <div>
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
            })}
          </div>
        </div>
      </div>
    );
}