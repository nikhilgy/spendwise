import React, { useState } from 'react';
import { LightBulbIcon, LoginIcon } from '../assets';
import { authAPI } from '../services/api';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      if (isLogin) {
        const response = await authAPI.login({
          email: formData.email,
          password: formData.password
        });
        
        if (response.token) {
          localStorage.setItem('authToken', response.token);
          onLogin();
        }
      } else {
        const response = await authAPI.register({
          full_name: formData.name,
          email: formData.email,
          password: formData.password
        });
        
        if (response.token) {
          localStorage.setItem('authToken', response.token);
          onLogin();
        } else {
          setMessage('Registration successful! You can now log in.');
          setIsLogin(true); // Switch to login form
        }
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-050 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-neutral-000 rounded-lg shadow-card p-8">
        <div className="text-center mb-8">
          <div className="bg-teal p-3 rounded-lg inline-block mb-4">
            <LightBulbIcon className="w-8 h-8 text-neutral-000" />
          </div>
          <h1 className="text-2xl font-bold text-navy mb-2">Welcome to SpendWise</h1>
          <p className="text-neutral-500">Track your spending and manage your finances with ease.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-navy mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required={!isLogin}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-navy mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-navy mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
              {message}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-teal hover:bg-teal/80 disabled:bg-gray-400 text-neutral-000 font-medium py-3 px-4 rounded-md shadow-sm transition-all flex items-center justify-center"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <LoginIcon className="w-5 h-5 mr-2"/>
                {isLogin ? 'Sign In' : 'Sign Up'}
              </>
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setMessage('');
            }}
            className="text-sm text-navy hover:text-teal"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
        
        <p className="text-xs text-neutral-400 text-center mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}; 