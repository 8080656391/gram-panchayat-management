import React, { useState } from 'react';
import { CitizenRegistration } from '../../types';
import '../../styles/pages/Login.css';
import { Lock, User, Mail, Phone, MapPin, Calendar } from 'lucide-react';

interface CitizenRegisterProps {
  onRegister: (registration: CitizenRegistration) => Promise<void>;
  onCancel: () => void;
  error?: string;
}

const CitizenRegister: React.FC<CitizenRegisterProps> = ({ onRegister, onCancel, error }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'male' as 'male' | 'female' | 'other',
    aadharNumber: '',
    address: '',
    village: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\+?[0-9]{10,}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    else {
      const age = new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear();
      if (age < 18) newErrors.dateOfBirth = 'You must be at least 18 years old';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.aadharNumber.trim()) newErrors.aadharNumber = 'Aadhar number is required';
    else if (!/^[0-9]{12}$/.test(formData.aadharNumber)) newErrors.aadharNumber = 'Aadhar must be 12 digits';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.village.trim()) newErrors.village = 'Village is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setServerError('');

    const registration: CitizenRegistration = {
      id: `citizen_${Date.now()}`,
      userId: `user_${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      age: new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear(),
      gender: formData.gender,
      aadharNumber: formData.aadharNumber,
      address: formData.address,
      village: formData.village,
      password: formData.password,
      registrationDate: new Date().toISOString(),
      status: 'active',
    };

    try {
      await onRegister(registration);
    } catch (err: any) {
      setServerError(err?.message || 'Registration failed');
    }
  };

  const calculateAge = (dateString: string) => {
    if (!dateString) return '';
    return new Date().getFullYear() - new Date(dateString).getFullYear();
  };

  return (
    <div className="login-container citizen-register">
      <div className="login-box register-box">
        <div className="register-header">
          <h1>Citizen Registration</h1>
          <p className="register-subtitle">Create your account to apply for certificates</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="step-indicator">
            <div className={`step ${step === 1 ? 'active' : 'completed'}`}>
              <span>1</span>
              <label>Personal Info</label>
            </div>
            <div className={`step ${step === 2 ? 'active' : ''}`}>
              <span>2</span>
              <label>Address & Password</label>
            </div>
          </div>

          {step === 1 ? (
            <>
              <div className="form-group">
                <label htmlFor="name">
                  <User size={18} /> Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <Mail size={18} /> Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  <Phone size={18} /> Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your 10-digit phone number"
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="dateOfBirth">
                    <Calendar size={18} /> Date of Birth *
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className={errors.dateOfBirth ? 'error' : ''}
                  />
                  {formData.dateOfBirth && (
                    <small className="age-info">Age: {calculateAge(formData.dateOfBirth)} years</small>
                  )}
                  {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="gender">Gender *</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="button-group">
                <button type="button" className="btn-cancel" onClick={onCancel}>
                  Cancel
                </button>
                <button type="button" className="btn-next" onClick={handleNext}>
                  Next →
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="aadharNumber">
                  Aadhar Number * (12 digits)
                </label>
                <input
                  type="text"
                  id="aadharNumber"
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={handleChange}
                  placeholder="Enter your 12-digit Aadhar number"
                  maxLength={12}
                  className={errors.aadharNumber ? 'error' : ''}
                />
                {errors.aadharNumber && <span className="error-message">{errors.aadharNumber}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="address">
                  <MapPin size={18} /> Address *
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your full address"
                  rows={3}
                  className={errors.address ? 'error' : ''}
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="village">
                  <MapPin size={18} /> Village *
                </label>
                <input
                  type="text"
                  id="village"
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                  placeholder="Enter your village name"
                  className={errors.village ? 'error' : ''}
                />
                {errors.village && <span className="error-message">{errors.village}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <Lock size={18} /> Password * (Min 8 characters)
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className={errors.password ? 'error' : ''}
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">
                  <Lock size={18} /> Confirm Password *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={errors.confirmPassword ? 'error' : ''}
                />
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>

              <div className="button-group">
                <button type="button" className="btn-back" onClick={handleBack}>
                  ← Back
                </button>
                <button type="submit" className="btn-register">
                  Complete Registration
                </button>
              </div>
            </>
          )}
          {serverError || error ? (
            <div className="error-message form-error">{serverError || error}</div>
          ) : null}
        </form>

        <p className="form-footer">
          Already registered? <a href="#" onClick={onCancel}>Login here</a>
        </p>
      </div>
    </div>
  );
};

export default CitizenRegister;
