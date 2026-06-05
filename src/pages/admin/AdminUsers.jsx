import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import AdminSidebar from '../../components/admin/AdminSidebar';
import API from '../../api/api';

/* ─── Avatar colour palette ─── */
const AVATAR_COLORS = [
  '#e94560','#3b82f6','#10b981','#f59e0b',
  '#8b5cf6','#ef4444','#06b6d4','#84cc16','#f97316','#ec4899',
];
const avatarColor = (name = '') => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
};
const initials = (name = '') =>
  name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

/* ─── Role badge colours ─── */
const ROLE_STYLE = {
  admin: { bg: 'rgba(233,69,96,0.15)',  color: '#e94560', label: 'Admin' },
  user:  { bg: 'rgba(59,130,246,0.15)', color: '#3b82f6', label: 'User'  },
};
const roleStyle = (role) => ROLE_STYLE[role] || ROLE_STYLE.user;

/* ─── Skeleton row ─── */
const SkeletonRow = () => (
  <tr className="skeleton-row">
    {[40, 160, 180, 90, 100, 80].map((w, i) => (
      <td key={i}><div className="skel" style={{ width: w }} /></td>
    ))}
  </tr>
);

/* ─── Confirm Modal ─── */
const ConfirmModal = ({ user, onConfirm, onCancel }) => (
  <div className="modal-overlay" onClick={onCancel}>
    <div className="modal-box" onClick={e => e.stopPropagation()}>
      <div className="modal-icon">🗑️</div>
      <h3>Delete User?</h3>
      <p>
        You're about to permanently delete <strong>{user?.name}</strong>
        {user?.email ? ` (${user.email})` : ''}.
        This action cannot be undone.
      </p>
      <div className="modal-actions">
        <button className="modal-btn cancel" onClick={onCancel}>Cancel</button>
        <button className="modal-btn confirm" onClick={onConfirm}>Yes, Delete</button>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   AdminUsers
═══════════════════════════════════════════════════════════ */
const AdminUsers = () => {
  const [users,       setUsers]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState('');
  const [roleFilter,  setRoleFilter]  = useState('all');
  const [sortKey,     setSortKey]     = useState('createdAt');
  const [sortDir,     setSortDir]     = useState('desc');
  const [toDelete,    setToDelete]    = useState(null);
  const [editingRole, setEditingRole] = useState(null);

  /* ── fetch ── */
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/admin/users');
      setUsers(Array.isArray(data) ? data : data.data || data.users || []);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  /* Ctrl+K → focus search */
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('user-search')?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  /* ── delete ── */
  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await API.delete(`/admin/users/${toDelete._id}`);
      setUsers(prev => prev.filter(u => u._id !== toDelete._id));
      toast.success(`${toDelete.name} deleted`);
    } catch {
      toast.error('Delete failed');
    } finally {
      setToDelete(null);
    }
  };

  /* ── role update ── */
  const handleRoleChange = async (userId, newRole) => {
    try {
      await API.put(`/admin/users/${userId}`, { role: newRole });
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
      toast.success('Role updated');
    } catch {
      toast.error('Role update failed');
    } finally {
      setEditingRole(null);
    }
  };

  /* ── sort toggle ── */
  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };
  const SortArrow = ({ col }) =>
    sortKey === col
      ? <span style={{ marginLeft: 4, opacity: 0.9 }}>{sortDir === 'asc' ? '↑' : '↓'}</span>
      : <span style={{ marginLeft: 4, opacity: 0.25 }}>↕</span>;

  /* ── derived list ── */
  const filtered = users
    .filter(u => {
      const q = search.toLowerCase();
      const matchSearch = !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
      const matchRole   = roleFilter === 'all' || u.role === roleFilter;
      return matchSearch && matchRole;
    })
    .sort((a, b) => {
      let va = a[sortKey] ?? '', vb = b[sortKey] ?? '';
      if (typeof va === 'string') { va = va.toLowerCase(); vb = vb.toLowerCase(); }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const adminCount = users.filter(u => u.role === 'admin').length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@400;500&display=swap');
        .au-root { display:flex; min-height:100vh; background:#0f1224; font-family:'DM Sans',sans-serif; color:#e2e8f0; }
        .au-main { flex:1; padding:2rem 2.5rem; overflow-x:hidden; }
        .au-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:2rem; flex-wrap:wrap; gap:1rem; }
        .au-title  { font-family:'Sora',sans-serif; font-size:1.6rem; font-weight:700; color:#fff; }
        .au-subtitle { color:#64748b; font-size:0.88rem; margin-top:0.25rem; }
        .au-badge  { display:inline-flex; align-items:center; gap:0.4rem; background:rgba(233,69,96,0.12); color:#e94560; border:1px solid rgba(233,69,96,0.25); border-radius:20px; padding:0.3rem 0.85rem; font-size:0.82rem; font-weight:600; }
        .au-stats { display:flex; gap:1rem; margin-bottom:1.75rem; flex-wrap:wrap; }
        .au-stat { background:#1a1f35; border:1px solid #252b45; border-radius:12px; padding:0.9rem 1.4rem; display:flex; align-items:center; gap:0.75rem; min-width:140px; }
        .au-stat__icon { font-size:1.4rem; }
        .au-stat__val  { font-family:'Sora',sans-serif; font-size:1.3rem; font-weight:700; color:#fff; line-height:1; }
        .au-stat__lbl  { font-size:0.78rem; color:#64748b; margin-top:2px; }
        .au-toolbar { display:flex; gap:0.75rem; margin-bottom:1.5rem; flex-wrap:wrap; align-items:center; }
        .au-search { display:flex; align-items:center; gap:0.5rem; background:#1a1f35; border:1px solid #252b45; border-radius:10px; padding:0.55rem 1rem; flex:1; min-width:220px; transition:border-color 0.2s; }
        .au-search:focus-within { border-color:#e94560; }
        .au-search input { background:transparent; border:none; outline:none; color:#e2e8f0; font-size:0.9rem; flex:1; }
        .au-search input::placeholder { color:#475569; }
        .au-search .kbd { font-size:0.7rem; color:#475569; background:#252b45; border-radius:4px; padding:1px 5px; font-family:monospace; }
        .au-select { background:#1a1f35; border:1px solid #252b45; border-radius:10px; color:#e2e8f0; padding:0.55rem 1rem; font-size:0.88rem; outline:none; cursor:pointer; transition:border-color 0.2s; }
        .au-select:focus { border-color:#e94560; }
        .au-table-wrap { background:#1a1f35; border:1px solid #252b45; border-radius:16px; overflow:hidden; }
        .au-table { width:100%; border-collapse:collapse; font-size:0.88rem; }
        .au-table thead tr { background:#151929; border-bottom:1px solid #252b45; }
        .au-table thead th { padding:0.85rem 1.1rem; text-align:left; font-family:'Sora',sans-serif; font-size:0.78rem; font-weight:600; color:#64748b; letter-spacing:0.06em; text-transform:uppercase; white-space:nowrap; }
        .au-table thead th.sortable { cursor:pointer; user-select:none; }
        .au-table thead th.sortable:hover { color:#e94560; }
        .au-table tbody tr { border-bottom:1px solid rgba(37,43,69,0.6); transition:background 0.15s; }
        .au-table tbody tr:last-child { border-bottom:none; }
        .au-table tbody tr:hover { background:rgba(233,69,96,0.04); }
        .au-table tbody tr:hover .del-btn { opacity:1; }
        .au-table td { padding:0.9rem 1.1rem; vertical-align:middle; }
        .au-avatar { width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.78rem; font-weight:700; color:#fff; flex-shrink:0; }
        .au-user-cell { display:flex; align-items:center; gap:0.75rem; }
        .au-user-name { font-weight:600; color:#f1f5f9; }
        .role-badge { display:inline-flex; align-items:center; gap:0.3rem; padding:0.25rem 0.7rem; border-radius:100px; font-size:0.78rem; font-weight:600; cursor:pointer; border:1px solid transparent; transition:opacity 0.2s; }
        .role-badge:hover { opacity:0.8; }
        .role-select { background:#252b45; border:1px solid #e94560; border-radius:6px; color:#e2e8f0; padding:0.25rem 0.5rem; font-size:0.82rem; outline:none; }
        .del-btn { background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.25); color:#ef4444; border-radius:8px; padding:0.35rem 0.75rem; font-size:0.8rem; font-weight:600; cursor:pointer; opacity:0; transition:background 0.2s,opacity 0.2s; }
        .del-btn:hover { background:rgba(239,68,68,0.22); }
        .skel { height:14px; border-radius:6px; background:linear-gradient(90deg,#1e2438 25%,#252b45 50%,#1e2438 75%); background-size:200% 100%; animation:shimmer 1.4s infinite; }
        @keyframes shimmer { to { background-position:-200% 0; } }
        .au-footer { margin-top:1rem; padding:0.75rem 1.1rem; font-size:0.82rem; color:#64748b; text-align:right; }
        .au-empty { padding:4rem; text-align:center; color:#475569; }
        .au-empty__icon { font-size:3rem; margin-bottom:1rem; }
        .au-empty h3 { color:#94a3b8; font-size:1rem; margin-bottom:0.4rem; }
        .au-empty button { margin-top:1rem; background:rgba(233,69,96,0.12); color:#e94560; border:1px solid rgba(233,69,96,0.3); border-radius:8px; padding:0.45rem 1.1rem; font-size:0.85rem; font-weight:600; cursor:pointer; }
        .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.65); backdrop-filter:blur(4px); z-index:999; display:flex; align-items:center; justify-content:center; }
        .modal-box { background:#1a1f35; border:1px solid #252b45; border-radius:18px; padding:2.25rem 2rem; max-width:400px; width:90%; text-align:center; animation:popIn 0.22s ease; }
        @keyframes popIn { from{transform:scale(0.92);opacity:0} to{transform:scale(1);opacity:1} }
        .modal-icon { font-size:2.5rem; margin-bottom:0.75rem; }
        .modal-box h3 { font-family:'Sora',sans-serif; font-size:1.2rem; color:#fff; margin-bottom:0.6rem; }
        .modal-box p  { font-size:0.9rem; color:#94a3b8; line-height:1.6; }
        .modal-box strong { color:#e2e8f0; }
        .modal-actions { display:flex; gap:0.75rem; justify-content:center; margin-top:1.75rem; }
        .modal-btn { padding:0.6rem 1.5rem; border-radius:8px; font-size:0.9rem; font-weight:600; cursor:pointer; border:none; transition:background 0.2s; }
        .modal-btn.cancel  { background:#252b45; color:#94a3b8; }
        .modal-btn.cancel:hover { background:#2e3550; }
        .modal-btn.confirm { background:#e94560; color:#fff; }
        .modal-btn.confirm:hover { background:#c73652; }
        @media(max-width:768px){ .au-main{padding:1.25rem;} .au-stats{gap:0.6rem;} .au-stat{min-width:110px;padding:0.7rem 1rem;} }
      `}</style>

      <div className="au-root">
        <AdminSidebar />
        <main className="au-main">

          {/* Header */}
          <div className="au-header">
            <div>
              <div className="au-title">User Management</div>
              <div className="au-subtitle">Manage accounts, roles, and permissions</div>
            </div>
            <div className="au-badge">👥 {users.length} Total Users</div>
          </div>

          {/* Stats */}
          <div className="au-stats">
            {[
              { icon: '👤', val: users.length,              lbl: 'Total Users'    },
              { icon: '🔴', val: adminCount,                lbl: 'Admins'         },
              { icon: '🔵', val: users.length - adminCount, lbl: 'Regular Users'  },
              { icon: '🔍', val: filtered.length,           lbl: 'Showing'        },
            ].map(({ icon, val, lbl }) => (
              <div className="au-stat" key={lbl}>
                <span className="au-stat__icon">{icon}</span>
                <div>
                  <div className="au-stat__val">{val}</div>
                  <div className="au-stat__lbl">{lbl}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="au-toolbar">
            <div className="au-search">
              <span>🔍</span>
              <input
                id="user-search"
                type="text"
                placeholder="Search by name or email…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <span className="kbd">Ctrl K</span>
            </div>
            <select className="au-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          {/* Table */}
          <div className="au-table-wrap">
            <table className="au-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th className="sortable" onClick={() => toggleSort('name')}>User <SortArrow col="name" /></th>
                  <th className="sortable" onClick={() => toggleSort('email')}>Email <SortArrow col="email" /></th>
                  <th>Role</th>
                  <th className="sortable" onClick={() => toggleSort('createdAt')}>Joined <SortArrow col="createdAt" /></th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
                  : filtered.length === 0
                  ? (
                    <tr><td colSpan={6}>
                      <div className="au-empty">
                        <div className="au-empty__icon">👤</div>
                        <h3>No users found</h3>
                        <p>Try adjusting your search or filter</p>
                        <button onClick={() => { setSearch(''); setRoleFilter('all'); }}>Clear Filters</button>
                      </div>
                    </td></tr>
                  )
                  : filtered.map((u, idx) => {
                    const rs = roleStyle(u.role);
                    const isEditingThis = editingRole?.id === u._id;
                    return (
                      <tr key={u._id}>
                        <td style={{ color: '#475569', fontWeight: 600 }}>{idx + 1}</td>
                        <td>
                          <div className="au-user-cell">
                            <div className="au-avatar" style={{ background: avatarColor(u.name) }}>
                              {initials(u.name)}
                            </div>
                            <div className="au-user-name">{u.name}</div>
                          </div>
                        </td>
                        <td style={{ color: '#94a3b8' }}>{u.email}</td>
                        <td>
                          {isEditingThis ? (
                            <select
                              className="role-select"
                              defaultValue={u.role}
                              autoFocus
                              onBlur={() => setEditingRole(null)}
                              onChange={e => handleRoleChange(u._id, e.target.value)}
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                          ) : (
                            <span
                              className="role-badge"
                              style={{ background: rs.bg, color: rs.color, borderColor: rs.color + '44' }}
                              onClick={() => setEditingRole({ id: u._id, role: u.role })}
                              title="Click to change role"
                            >
                              {u.role === 'admin' ? '🔴' : '🔵'} {rs.label}
                            </span>
                          )}
                        </td>
                        <td style={{ color: '#64748b' }}>
                          {u.createdAt
                            ? new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                            : '—'}
                        </td>
                        <td>
                          <button className="del-btn" onClick={() => setToDelete(u)}>Delete</button>
                        </td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>

            {!loading && filtered.length > 0 && (
              <div className="au-footer">
                Showing <strong style={{ color: '#e2e8f0' }}>{filtered.length}</strong> of{' '}
                <strong style={{ color: '#e2e8f0' }}>{users.length}</strong> users
              </div>
            )}
          </div>

        </main>
      </div>

      {toDelete && (
        <ConfirmModal
          user={toDelete}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </>
  );
};

export default AdminUsers;