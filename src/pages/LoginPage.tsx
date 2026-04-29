import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { loginUser, clearError } from '../store/slices/authSlice';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useAppSelector(s => s.auth);

  const [email, setEmail] = useState('doctor@clinicsage.com');
  const [password, setPassword] = useState('clinic123');
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) navigate('/dashboard');
  };

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.brand}>
          <Activity size={28} strokeWidth={1.4} />
          <span>Clinic Sage</span>
        </div>
        <div className={styles.tagline}>
          <h1>Clinical calm.<br />Delivered clearly.</h1>
          <p>A modern healthcare platform for clinical teams who care about clarity as much as outcomes.</p>
        </div>
        <div className={styles.stats}>
          {[['1,240+', 'Patients managed'], ['98%', 'Uptime SLA'], ['24/7', 'Critical monitoring']].map(([num, label]) => (
            <div key={label} className={styles.stat}>
              <span className={styles.statNum}>{num}</span>
              <span className={styles.statLabel}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.right}>
        <form className={styles.card} onSubmit={handleSubmit} noValidate>
          <div className={styles.formHeader}>
            <h2>Welcome back</h2>
            <p>Sign in to your clinical workspace</p>
          </div>

          {error && (
            <div className={styles.error}>
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="doctor@clinicsage.com"
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <div className={styles.passWrap}>
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <button type="button" className={styles.eyeBtn} onClick={() => setShowPass(p => !p)}>
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? <span className={styles.spinner} /> : 'Sign in'}
          </button>

          <p className={styles.hint}>
            Demo: <code>doctor@clinicsage.com</code> / <code>clinic123</code>
          </p>
        </form>
      </div>
    </div>
  );
}
