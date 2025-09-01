import { useState } from 'react';
import { createUser } from '../services/users';
import type { Modal, Role, UserFormData } from '../types/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from '../css/UserModal.module.css';
import { UserSchema } from '../services/validation';

export default function AddUserModal({ onDone, onClose }: Modal) {
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(UserSchema),
  });

  const onSubmit = async (data: UserFormData) => {
    setLoading(true);
    setError(null);

    try {
      await createUser({ ...data, role });

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
        <h3 className={styles.title}>Add New User</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGroup}>
            <input
              placeholder='Email'
              className={styles.input}
              {...register('email')}
              type='email'
              required
            />
            {errors.email && (
              <p className={styles.error}>{errors.email.message}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <input
              placeholder='Password'
              className={styles.input}
              {...register('password')}
              type='password'
            />
            {errors.password && (
              <p className={styles.error}>{errors.password.message}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <input
              placeholder='Name'
              className={styles.input}
              {...register('name')}
              type='text'
            />
            {errors.name && (
              <p className={styles.error}>{errors.name.message}</p>
            )}
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
