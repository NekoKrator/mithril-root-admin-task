import { useState, useEffect, use } from 'react';
import { updateUser } from '../services/users';
import type { UserId } from '../types/types';

interface EditUserModalProps {
  user?: UserId;
  onDone: () => void;
  onClose: () => void;
}

export default function EditUserModal({
  user,
  onDone,
  onClose,
}: EditUserModalProps) {
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(user?.name || '');
  const [role, setRole] = useState<'admin' | 'user'>(user?.role || 'user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setName(user.name);
      setRole(user.role);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      await updateUser(user.id, { email, password, name, role });
      onDone();
      onClose();
    } catch {
      setError('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          minWidth: '300px',
        }}
      >
        <h3>Edit User</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label>Email:</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Password:</label>
            <input
              placeholder='Enter new password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Name:</label>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: '100%', padding: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Role:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'user')}
              style={{ width: '100%', padding: '5px' }}
            >
              <option value='user'>User</option>
              <option value='admin'>Admin</option>
            </select>
          </div>
          {error && (
            <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
          )}
          <div>
            <button type='submit' disabled={loading}>
              {loading ? 'Updating...' : 'Update User'}
            </button>
            <button
              type='button'
              onClick={onClose}
              style={{ marginLeft: '10px' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
