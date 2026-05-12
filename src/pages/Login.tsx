import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LogIn, UserPlus, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import CitizenRegister from '../components/certificates/CitizenRegister';
import { CitizenRegistration } from '../types';
import '../styles/pages/Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, register, isAuthenticated, loading } = useAuth();
  const { t } = useLanguage();
  const [showRegister, setShowRegister] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    village: '',
    role: 'citizen' as 'citizen' | 'staff' | 'admin'
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await login(formData.email, formData.password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        village: formData.village,
        role: formData.role
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCitizenRegister = async (registration: CitizenRegistration) => {
    setIsSubmitting(true);
    setError('');

    try {
      await register({
        name: registration.name,
        email: registration.email,
        password: registration.password,
        phone: registration.phone,
        village: registration.village,
        role: 'citizen',
        aadharNumber: registration.aadharNumber,
        dateOfBirth: registration.dateOfBirth,
        address: registration.address
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="login-container">
        <div className="loading-spinner">{t('common.loading')}</div>
      </div>
    );
  }

  if (showRegister) {
    return (
      <CitizenRegister
        onRegister={handleCitizenRegister}
        onCancel={() => {
          setShowRegister(false);
          setError('');
        }}
        error={error}
      />
    );
  }

  return (
    <div className="login-container">
      <div className="login-header">
        <h1>{t('login.title')}</h1>
        <p>{isLogin ? t('login.subtitle') : t('login.subtitle')}</p>
      </div>

      <div className="login-content">
        <div className="auth-form-container">
          <div className="auth-tabs">
            <button
              className={`auth-tab ${isLogin ? 'active' : ''}`}
              onClick={() => {
                setIsLogin(true);
                setError('');
                setFormData({
                  name: '',
                  email: '',
                  password: '',
                  phone: '',
                  village: '',
                  role: 'citizen'
                });
              }}
            >
              <LogIn size={18} />
              {t('login.button')}
            </button>
            <button
              className={`auth-tab ${!isLogin ? 'active' : ''}`}
              onClick={() => {
                setIsLogin(false);
                setError('');
                setFormData({
                  name: '',
                  email: '',
                  password: '',
                  phone: '',
                  village: '',
                  role: 'citizen'
                });
              }}
            >
              <UserPlus size={18} />
              Register
            </button>
          </div>

          <form onSubmit={isLogin ? handleLogin : handleRegister} className="auth-form">
            {error && <div className="error-message">{error || t('login.error')}</div>}

            {!isLogin && (
              <>
                <div className="form-group">
                  <label htmlFor="name">{t('admin.name')}</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required={!isLogin}
                    placeholder={t('login.username')}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">{t('admin.phone')}</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required={!isLogin}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="village">{t('admin.address')}</label>
                  <input
                    type="text"
                    id="village"
                    name="village"
                    value={formData.village}
                    onChange={handleInputChange}
                    required={!isLogin}
                    placeholder="Enter your village"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="role">{t('admin.role')}</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option value="citizen">Citizen</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="email">{t('admin.email')}</label>
              <div className="input-with-icon">
                <Mail size={18} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder={t('login.username')}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">{t('login.password')}</label>
              <div className="input-with-icon">
                <Lock size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder={t('login.password')}
                  minLength={6}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('common.loading') : (isLogin ? t('login.button') : t('admin.addUser'))}
            </button>
          </form>
        </div>

        {isLogin && (
          <div className="citizen-register-section">
            <p>New to the system?</p>
            <button className="btn-register-citizen" onClick={() => {
              setError('');
              setShowRegister(true);
            }}>
              <UserPlus size={18} />
              Register as Citizen
            </button>
          </div>
        )}
      </div>

      <div className="login-footer">
        <p>🏛️ Serving the village community</p>
      </div>
    </div>
  );
};

export default Login;
