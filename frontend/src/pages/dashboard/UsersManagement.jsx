import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import axiosInstance from '../../api/axiosInstance';
import useAuth from '../../hooks/useAuth';
import Spinner from '../../components/common/Spinner';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import getApiError from '../../utils/apiError';

const EMPTY_FORM = { name: '', email: '', password: '', role: 'author' };

const surface = {
  background: 'var(--color-surface-solid)',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  boxShadow: 'var(--shadow-card)',
};

const alertStyle = {
  background: 'var(--color-alert-bg)',
  border: '1px solid var(--color-alert-border)',
  color: 'var(--color-accent)',
  padding: '0.75rem 1rem',
  borderRadius: 'var(--radius-sm)',
  marginBottom: '1.5rem',
  fontSize: '0.9rem',
};

export default function UsersManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/users');
      setUsers(data);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const openAdd = () => { setForm(EMPTY_FORM); setFormError(''); setModal({ mode: 'add' }); };
  const openEdit = (u) => { setForm({ name: u.name, email: u.email, password: '', role: u.role }); setFormError(''); setModal({ mode: 'edit', user: u }); };
  const closeModal = () => { setModal(null); setFormError(''); };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    try {
      if (modal.mode === 'add') {
        const { data } = await axiosInstance.post('/users', form);
        setUsers((prev) => [data, ...prev]);
      } else {
        const payload = { name: form.name, email: form.email, role: form.role };
        if (form.password) payload.password = form.password;
        const { data } = await axiosInstance.put(`/users/${modal.user._id}`, payload);
        setUsers((prev) => prev.map((u) => (u._id === data._id ? data : u)));
      }
      closeModal();
    } catch (err) {
      setFormError(getApiError(err));
    } finally {
      setFormLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setActionLoading(userId + '-role');
    setError('');
    try {
      const { data } = await axiosInstance.patch(`/users/${userId}/role`, { role: newRole });
      setUsers((prev) => prev.map((u) => (u._id === userId ? data : u)));
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (userId, userName) => {
    if (!confirm(`Delete user "${userName}"? This cannot be undone.`)) return;
    setActionLoading(userId + '-delete');
    setError('');
    try {
      await axiosInstance.delete(`/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setActionLoading(null);
    }
  };

  const roleBadge = (role) => ({
    display: 'inline-block',
    background: role === 'admin' ? 'var(--color-admin-badge-bg)' : 'var(--color-author-badge-bg)',
    color: role === 'admin' ? 'var(--color-admin-badge-text)' : 'var(--color-author-badge-text)',
    padding: '0.15rem 0.65rem',
    borderRadius: 'var(--radius-pill)',
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    border: role === 'admin' ? '1px solid rgba(91, 93, 240, 0.35)' : '1px solid rgba(255, 61, 107, 0.35)',
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, fontWeight: 800, fontSize: '1.75rem' }}>User Management</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.4rem', fontSize: '0.9rem' }}>
            {users.length} registered user{users.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={openAdd}>+ Add User</Button>
      </div>

      {error && <div style={alertStyle}>{error}</div>}

      {loading ? <Spinner /> : (
        <div style={{ ...surface, overflow: 'hidden', padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--color-inset)', borderBottom: '1px solid var(--color-border)' }}>
                {['Name', 'Email', 'Role', 'Joined', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isSelf = u._id === currentUser?.id;
                const roleLoading = actionLoading === u._id + '-role';
                const deleteLoading = actionLoading === u._id + '-delete';

                return (
                  <tr key={u._id} style={{ borderBottom: '1px solid var(--color-border)', opacity: deleteLoading ? 0.5 : 1 }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>
                      {u.name}
                      {isSelf && <span style={{ color: 'var(--color-text-dim)', fontSize: '0.75rem', marginLeft: '0.4rem' }}>(you)</span>}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{u.email}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={roleBadge(u.role)}>{u.role}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-dim)', fontSize: '0.85rem' }}>
                      {format(new Date(u.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => openEdit(u)}
                          style={{
                            background: 'var(--color-surface-raised)',
                            color: 'var(--color-text)',
                            border: '1px solid var(--color-border)',
                            padding: '0.3rem 0.85rem',
                            borderRadius: 'var(--radius-pill)',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                          }}
                        >
                          Edit
                        </button>
                        {!isSelf && (
                          <>
                            <button
                              type="button"
                              disabled={roleLoading}
                              onClick={() => handleRoleChange(u._id, u.role === 'admin' ? 'author' : 'admin')}
                              style={{
                                background: u.role === 'admin' ? 'var(--color-warn-bg)' : 'var(--color-admin-badge-bg)',
                                color: u.role === 'admin' ? 'var(--color-warn)' : 'var(--color-link)',
                                border: '1px solid var(--color-border)',
                                padding: '0.3rem 0.85rem',
                                borderRadius: 'var(--radius-pill)',
                                cursor: roleLoading ? 'not-allowed' : 'pointer',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                opacity: roleLoading ? 0.6 : 1,
                              }}
                            >
                              {roleLoading ? '...' : u.role === 'admin' ? 'Demote' : 'Make Admin'}
                            </button>
                            <button
                              type="button"
                              disabled={deleteLoading}
                              onClick={() => handleDelete(u._id, u.name)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--color-danger)',
                                cursor: deleteLoading ? 'not-allowed' : 'pointer',
                                fontSize: '0.85rem',
                                padding: '0.3rem 0.5rem',
                                opacity: deleteLoading ? 0.5 : 1,
                                fontWeight: 600,
                              }}
                            >
                              {deleteLoading ? '...' : 'Delete'}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {users.length === 0 && (
            <p style={{ color: 'var(--color-text-dim)', textAlign: 'center', padding: '2rem' }}>No users found.</p>
          )}
        </div>
      )}

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(5, 2, 12, 0.82)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ ...surface, padding: '2rem', width: '100%', maxWidth: '440px', borderColor: 'var(--color-border-glow)' }}>
            <h2 style={{ margin: '0 0 1.5rem', fontWeight: 800 }}>{modal.mode === 'add' ? 'Add User' : 'Edit User'}</h2>

            {formError && <div style={{ ...alertStyle, marginBottom: '1rem' }}>{formError}</div>}

            <form onSubmit={handleFormSubmit}>
              <Input
                label="Full Name"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
              <Input
                label={modal.mode === 'edit' ? 'New Password (leave blank to keep)' : 'Password'}
                type="password"
                placeholder="Min 6 characters"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                required={modal.mode === 'add'}
              />
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    background: 'var(--color-inset)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-text)',
                    fontSize: '0.9rem',
                  }}
                >
                  <option value="author">Author</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <Button type="submit" disabled={formLoading} style={{ flex: 1 }}>
                  {formLoading ? 'Saving...' : modal.mode === 'add' ? 'Create User' : 'Save Changes'}
                </Button>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    flex: 1,
                    background: 'var(--color-surface-raised)',
                    color: 'var(--color-text)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-pill)',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
