"use client";

// Page for normal users (role "user").
import RequireRole from "@/components/RequireRole";
import { useAuth } from "@/context/AuthContext";
import { ROLE_LABEL } from "@/lib/roles";

function DashboardContent() {
  const { profile } = useAuth();
  if (!profile) return null;

  return (
    <div style={{ backgroundColor: '#111C31', border: '1px solid #1E293B', borderRadius: '12px', padding: '28px', color: '#FFF' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFFFFF', marginBottom: '16px' }}>
        Welcome, {profile.name || profile.email}
      </h1>
      <dl className="row mb-4" style={{ color: '#CBD5E1', fontSize: '14px' }}>
        <dt className="col-sm-3 text-secondary">Email</dt>
        <dd className="col-sm-9">{profile.email}</dd>
        <dt className="col-sm-3 text-secondary">Role</dt>
        <dd className="col-sm-9">{ROLE_LABEL[profile.role]}</dd>
        <dt className="col-sm-3 text-secondary">Organization</dt>
        <dd className="col-sm-9">{profile.organization?.name ?? "-"}</dd>
      </dl>
      <div style={{ display: 'flex', gap: '12px', paddingTop: '16px', borderTop: '1px solid #1E293B' }}>
        <a href="/ai-studio" style={{ padding: '10px 18px', backgroundColor: '#3B82F6', color: '#FFF', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>
          Open AI Content Studio
        </a>
        <a href="/drafts" style={{ padding: '10px 18px', backgroundColor: '#1E293B', color: '#CBD5E1', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: '500' }}>
          View Drafts Library
        </a>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <RequireRole roles={["user"]}>
      <DashboardContent />
    </RequireRole>
  );
}
