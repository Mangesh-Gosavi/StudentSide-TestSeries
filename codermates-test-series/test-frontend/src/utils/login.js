import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/main.css';
import API_BASE_URL from '../services/config';

export default function Login() {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.trim(),
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        console.log('Attempting login with:', formData.identifier);

        const response = await fetch(`${API_BASE_URL}/user_management/organizations/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: formData.identifier,
                password: formData.password,
            }),
        });

        const data = await response.json();
        console.log('Login response:', data);

        if (response.ok) {
            // Store organization info
            localStorage.setItem('orgId', data.organization.id);
            localStorage.setItem('orgName', data.organization.name);
            localStorage.setItem('orgEmail', data.organization.email); // You might want to store the email too
            localStorage.setItem('isAuthenticated', 'true');

            toast.success('Login successful!');
            navigate('/dashboard');
        } else {
            toast.error(data.error || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        toast.error('An error occurred during login');
    }
};

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h2 className="login-title">Log in to your account</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-input-container">
            <div>
              <label htmlFor="identifier" className="sr-only">
                Email or Username
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                required
                className="login-input login-input-top"
                placeholder="Email or Username"
                value={formData.identifier}
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
                autoComplete="current-password"
                required
                className="login-input login-input-bottom"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <button type="submit" className="login-button">
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
