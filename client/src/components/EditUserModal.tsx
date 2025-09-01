import { useState } from 'react';
import { updateUser } from '../services/users';
import type { EditModal, Role, UserFormData } from '../types/types';
import styles from '../css/UserModal.module.css';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserSchema } from '../services/validation';

export default function EditUserModal({ user, onDone, onClose }: EditModal) {
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      email: user?.email,
      name: user?.name,
    },
  });

  const onSubmit = async (data: UserFormData) => {
    if (!user) {
      setError('Failed to get user');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await updateUser(user.id, { ...data, role });

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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGroup}>
            <input
              placeholder='Email'
              className={styles.input}
              {...register('email')}
              type='email'
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
              {loading ? 'Saving...' : 'Edit User'}
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
