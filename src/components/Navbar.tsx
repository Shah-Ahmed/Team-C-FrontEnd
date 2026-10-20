'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { profile, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.replace('/login');
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" href="/ai-studio">
          TechProject <span className="badge bg-primary text-wrap fs-6">Team C</span>
        </Link>

        {/* Navigation Links */}
        <div className="d-flex gap-3 align-items-center">
          <Link href="/ai-studio" className="nav-link text-white text-decoration-none">
            AI Studio
          </Link>
          <Link href="/drafts" className="nav-link text-white text-decoration-none">
            Drafts
          </Link>
          <Link href="/calendar" className="nav-link text-white text-decoration-none">
            Calendar
          </Link>
          <Link href="/sentiment" className="nav-link text-white text-decoration-none">
            Sentiment
          </Link>
        </div>

        {/* User Info & Logout */}
        {profile && (
          <div className="d-flex align-items-center gap-3 text-white">
            <span>
              {profile.name || profile.email}{' '}
            </span>
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}