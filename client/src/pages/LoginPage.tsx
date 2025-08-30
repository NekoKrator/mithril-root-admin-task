import { useState } from 'react';
import { login } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import styles from '../css/LoginPage.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);

  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await login(email, password);

      if (user.role === 'root_admin' || user.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch {
      setErr('Invalid email or password');
    }
  };

  return (
    <div className={styles.background}>
      <form className={styles.form} onSubmit={onSubmit}>
        <h2 className={styles.title}>Login</h2>

        <div className={styles.formGroup}>
          <input
            className={styles.input}
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <input
            className={styles.input}
            placeholder='Password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className={styles.button} type='submit'>
          Login
        </button>

        {err && <div style={{ color: 'red' }}>{err}</div>}
      </form>
    </div>
  );
}
