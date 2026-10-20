'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const { profile, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleLogout() {
    await logout();
    router.replace('/login');
  }

  const navLinks = [
    { href: '/ai-studio', label: 'AI Studio' },
    { href: '/drafts', label: 'Drafts' },
    { href: '/calendar', label: 'Calendar' },
    { href: '/sentiment', label: 'Sentiment' },
  ];

  return (
    <nav style={{ backgroundColor: '#111C31', borderBottom: '1px solid #1E293B', padding: '12px 0' }}>
      <div style={{ maxWidth: '1050px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <Link href="/ai-studio" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#3B82F6' }}>TechProject</span>
            <span style={{ fontSize: '11px', fontWeight: 'bold', backgroundColor: '#1E3A8A', color: '#93C5FD', padding: '2px 8px', borderRadius: '4px' }}>
              Team C
            </span>
          </Link>

          {/* Navigation Links */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: isActive ? '600' : '400',
                    color: isActive ? '#FFFFFF' : '#94A3B8',
                    backgroundColor: isActive ? '#1E293B' : 'transparent',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* User Info & Authentication Actions */}
        {mounted && !loading && (
          profile ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '13px', color: '#CBD5E1' }}>
                {profile.name || profile.email}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #334155',
                  color: '#CBD5E1',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div>
              <Link
                href="/login"
                style={{
                  textDecoration: 'none',
                  backgroundColor: '#3B82F6',
                  color: '#FFFFFF',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '500'
                }}
              >
                Login
              </Link>
            </div>
          )
        )}
      </div>
    </nav>
  );
}