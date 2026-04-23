import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import axiosInstance from '../../api/axiosInstance';
import useAuth from '../../hooks/useAuth';
import Spinner from '../../components/common/Spinner';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import getApiError from '../../utils/apiError';

const EMPTY_FORM = { name: '', email: '', password: '', role: 'author' };

export default function UsersManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  // modal state
  const [modal, setModal] = useState(null); // null | { mode: 'add' } | { mode: 'edit', user }
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
    background: role === 'admin' ? '#1a2a4a' : '#1a3a2a',
    color: role === 'admin' ? '#4fc3f7' : '#4caf7d',
    padding: '0.15rem 0.65rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>User Management</h1>
          <p style={{ color: '#888', marginTop: '0.4rem', fontSize: '0.9rem' }}>
            {users.length} registered user{users.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={openAdd}>+ Add User</Button>
      </div>

      {error && (
        <div style={{ background: '#3a0010', border: '1px solid #e94560', color: '#e94560', padding: '0.75rem 1rem', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      {loading ? <Spinner /> : (
        <div style={{ background: '#1a1a2e', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#0f0f1a', borderBottom: '1px solid #2a2a3e' }}>
                {['Name', 'Email', 'Role', 'Joined', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', color: '#888', fontWeight: 500, fontSize: '0.85rem' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isSelf = u._id === currentUser?.id;
                const roleLoading = actionLoading === u._id + '-role';
                const deleteLoading = actionLoading === u._id + '-delete';

                return (
                  <tr key={u._id} style={{ borderBottom: '1px solid #2a2a3e', opacity: deleteLoading ? 0.5 : 1 }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 500 }}>
                      {u.name}
                      {isSelf && <span style={{ color: '#888', fontSize: '0.75rem', marginLeft: '0.4rem' }}>(you)</span>}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#aaa', fontSize: '0.9rem' }}>{u.email}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={roleBadge(u.role)}>{u.role}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#888', fontSize: '0.85rem' }}>
                      {format(new Date(u.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => openEdit(u)}
                          style={{ background: '#2a2a3e', color: '#fff', border: 'none', padding: '0.3rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                          Edit
                        </button>
                        {!isSelf && (
                          <>
                            <button
                              disabled={roleLoading}
                              onClick={() => handleRoleChange(u._id, u.role === 'admin' ? 'author' : 'admin')}
                              style={{
                                background: u.role === 'admin' ? '#2a2a3e' : '#1a2a4a',
                                color: u.role === 'admin' ? '#f0a500' : '#4fc3f7',
                                border: 'none', padding: '0.3rem 0.8rem', borderRadius: '4px',
                                cursor: roleLoading ? 'not-allowed' : 'pointer', fontSize: '0.8rem',
                                opacity: roleLoading ? 0.6 : 1,
                              }}
                            >
                              {roleLoading ? '...' : u.role === 'admin' ? 'Demote' : 'Make Admin'}
                            </button>
                            <button
                              disabled={deleteLoading}
                              onClick={() => handleDelete(u._id, u.name)}
                              style={{ background: 'none', border: 'none', color: '#e94560', cursor: deleteLoading ? 'not-allowed' : 'pointer', fontSize: '0.85rem', padding: '0.3rem 0.5rem', opacity: deleteLoading ? 0.5 : 1 }}
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
            <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>No users found.</p>
          )}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#1a1a2e', border: '1px solid #2a2a3e', borderRadius: '8px', padding: '2rem', width: '100%', maxWidth: '440px' }}>
            <h2 style={{ margin: '0 0 1.5rem' }}>{modal.mode === 'add' ? 'Add User' : 'Edit User'}</h2>

            {formError && (
              <div style={{ background: '#3a0010', border: '1px solid #e94560', color: '#e94560', padding: '0.65rem 1rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem' }}>
                {formError}
              </div>
            )}

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
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: '#aaa' }}>Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', background: '#0f0f1a', border: '1px solid #2a2a3e', borderRadius: '4px', color: '#fff', fontSize: '0.9rem' }}
                >
                  <option value="author">Author</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <Button type="submit" disabled={formLoading} style={{ flex: 1 }}>
                  {formLoading ? 'Saving...' : modal.mode === 'add' ? 'Create User' : 'Save Changes'}
                </Button>
                <button type="button" onClick={closeModal} style={{ flex: 1, background: '#2a2a3e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}>
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
