import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/main.css';
import API_BASE_URL from '../services/config';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    max_students: 100,
    username: '',
    developer: 1, // for now use the default developer id
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'max_students' ? parseInt(value) || 0 : value.trim(),
    }));
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address.');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return false;
    }
    if (!formData.name || formData.name.length < 2) {
      toast.error('Organization name must be at least 2 characters long.');
      return false;
    }
    if (formData.max_students < 1) {
      toast.error('Max Students must be at least 1.');
      return false;
    }
    if (!formData.username || formData.username.length < 3) {
      toast.error('Username must be at least 3 characters long.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
  
    try {
      console.log('Sending registration data:', formData);
      
      const response = await fetch(`${API_BASE_URL}/user_management/organizations/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
  
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
  
      if (response.ok) {
        if (data.organization) {
          localStorage.setItem('orgId', data.organization.id);
          localStorage.setItem('orgName', data.organization.name);
          localStorage.setItem('isAuthenticated', 'true');
        }
        toast.success('Registration successful!');
        navigate('/dashboard');
      }
      else {
        console.error('Registration failed:', data);
        toast.error(data.error || data.detail || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An error occurred during registration');
    }
  };
  
  return (
    <div className="register-container">
      <div className="register-form-container">
        <h2 className="register-title">Register your organization</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="register-input-container">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="register-input register-input-top"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="register-input"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                minLength="6"
              />
            </div>
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="register-input"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                minLength="3"
              />
            </div>
            <div>
              <label htmlFor="org-name" className="sr-only">
                Organization Name
              </label>
              <input
                id="org-name"
                name="name"
                type="text"
                required
                className="register-input"
                placeholder="Organization Name"
                value={formData.name}
                onChange={handleChange}
                minLength="2"
              />
            </div>
            <div>
              <label htmlFor="max-students" className="sr-only">
                Max Students
              </label>
              <input
                id="max-students"
                name="max_students"
                type="number"
                required
                min="1"
                className="register-input register-input-bottom"
                placeholder="Max Students"
                value={formData.max_students}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <button type="submit" className="register-button">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;