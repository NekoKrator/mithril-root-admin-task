import { useState, useEffect } from 'react';
import { updateUser } from '../services/users';
import type { EditModal, Role } from '../types/types';
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
        <h3 className={styles.title}>Edit this User</h3>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <input
              placeholder='Email'
              className={styles.input}
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <input
              placeholder='Password'
              className={styles.input}
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <input
              placeholder='Name'
              className={styles.input}
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <select
              className={styles.select}
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
