import React, { useState } from 'react';
import { User } from '../../types';
import { DzenCard } from '../ui/Card';
import { DzenButton } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface UserProfileManagerProps {
  user: User;
  onUpdate: (updatedUser: Partial<User>) => void;
  onComplete: () => void;
}

export const UserProfileManager: React.FC<UserProfileManagerProps> = ({
  user,
  onUpdate,
  onComplete
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user.name || '',
    email: user.email || '',
    currency: 'USD',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Update user profile
      await onUpdate({
        name: formData.fullName,
        email: formData.email
      });

      // Mark step as completed
      onComplete();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DzenCard>
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--dzen-gray900)', marginBottom: '8px' }}>
            Complete Your Profile
          </h2>
          <p style={{ color: 'var(--dzen-gray600)' }}>
            Tell us a bit about yourself to personalize your experience
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--dzen-gray700)', marginBottom: '4px' }}>
              Full Name *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid var(--dzen-gray300)',
                borderRadius: '6px',
                outline: 'none',
                fontFamily: 'var(--dzen-font-family-primary)'
              }}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--dzen-gray700)', marginBottom: '4px' }}>
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid var(--dzen-gray300)',
                borderRadius: '6px',
                outline: 'none',
                fontFamily: 'var(--dzen-font-family-primary)'
              }}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--dzen-gray700)', marginBottom: '4px' }}>
                Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid var(--dzen-gray300)',
                  borderRadius: '6px',
                  outline: 'none',
                  fontFamily: 'var(--dzen-font-family-primary)'
                }}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--dzen-gray700)', marginBottom: '4px' }}>
                Timezone
              </label>
              <select
                value={formData.timezone}
                onChange={(e) => handleInputChange('timezone', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid var(--dzen-gray300)',
                  borderRadius: '6px',
                  outline: 'none',
                  fontFamily: 'var(--dzen-font-family-primary)'
                }}
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London</option>
                <option value="Asia/Kolkata">India</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px' }}>
            <DzenButton
              type="submit"
              disabled={isLoading || !formData.fullName || !formData.email}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  Updating...
                </>
              ) : (
                'Save Profile'
              )}
            </DzenButton>
          </div>
        </form>
      </div>
    </DzenCard>
  );
}; 