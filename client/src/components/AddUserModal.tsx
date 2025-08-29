import { useState } from 'react';
import { createUser } from '../services/users';
import type { Modal, Role } from '../types/types';
import styles from './UserModal.module.css';

export default function AddUserModal({ onDone, onClose }: Modal) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createUser({ email, password, name, role });
      onDone();
      onClose();
    } catch {
      setError('Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h3>Add New User</h3>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email:</label>
            <input
              className={styles.input}
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Password:</label>
            <input
              className={styles.input}
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Role:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
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
              {loading ? 'Creating...' : 'Create User'}
            </button>
            <button
              className={styles.secondaryBtn}
              type='button'
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
