import { useState, useEffect } from 'react';
import { updateUser } from '../services/users';
import type { EditModal } from '../types/types';
import styles from '../css/UserModal.module.css';

export default function EditUserModal({ user, onDone, onClose }: EditModal) {
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(user?.name || '');
  const [role, setRole] = useState<'admin' | 'user'>(
    (user?.role as 'admin' | 'user') ?? 'user'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setName(user.name);
      setRole(user.role as 'admin' | 'user');
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
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h3>Edit User</h3>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email:</label>
            <input
              className={styles.input}
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '5px' }}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Password:</label>
            <input
              className={styles.input}
              placeholder='Enter new password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '5px' }}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Name:</label>
            <input
              className={styles.input}
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: '100%', padding: '5px' }}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Role:</label>
            <select
              className={styles.input}
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'user')}
              style={{ width: '100%', padding: '5px' }}
            >
              <option value='user'>User</option>
              <option value='admin'>Admin</option>
            </select>
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.actions}>
            <button
              className={styles.primaryBtn}
              type='submit'
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update User'}
            </button>
            <button
              className={styles.secondaryBtn}
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
