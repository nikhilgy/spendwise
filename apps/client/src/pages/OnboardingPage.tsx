import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { DzenCard } from '../components/ui/Card';
import { DzenButton } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
  isCompleted: boolean;
}

interface OnboardingPageProps {
  user: User;
  onComplete: () => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ user, onComplete }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'profile',
      title: 'Complete Your Profile',
      description: 'Tell us a bit about yourself',
      component: <ProfileSetupStep user={user} onComplete={() => handleStepComplete('profile')} />,
      isCompleted: false
    },
    {
      id: 'bank-accounts',
      title: 'Add Bank Accounts',
      description: 'Connect your bank accounts for transaction tracking',
      component: <BankAccountsStep onComplete={() => handleStepComplete('bank-accounts')} />,
      isCompleted: false
    },
    {
      id: 'cards',
      title: 'Add Credit/Debit Cards',
      description: 'Add your cards to track spending',
      component: <CardsStep onComplete={() => handleStepComplete('cards')} />,
      isCompleted: false
    },
    {
      id: 'import',
      title: 'Import Transactions',
      description: 'Import your transaction history from PDF statements',
      component: <ImportTransactionsStep onComplete={() => handleStepComplete('import')} />,
      isCompleted: false
    }
  ]);

  const handleStepComplete = (stepId: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, isCompleted: true } : step
    ));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Mark all steps as completed
      setSteps(prev => prev.map(step => ({ ...step, isCompleted: true })));
      onComplete();
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const canProceed = currentStepData.isCompleted;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{ width: '100%', maxWidth: '800px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: 'white', 
            marginBottom: '8px' 
          }}>
            Welcome to SpendWise, {user.name}! 👋
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Let's set up your account to start tracking your finances
          </p>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '8px' 
          }}>
            {steps.map((step, index) => (
              <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '500',
                  backgroundColor: index <= currentStep ? '#3B82F6' : '#E5E7EB',
                  color: index <= currentStep ? 'white' : '#6B7280'
                }}>
                  {step.isCompleted ? '✓' : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div style={{
                    width: '64px',
                    height: '4px',
                    margin: '0 8px',
                    backgroundColor: index < currentStep ? '#3B82F6' : '#E5E7EB'
                  }} />
                )}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
        </div>

        {/* Current Step */}
        <DzenCard>
          <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: '600', 
                color: 'var(--dzen-gray900)', 
                marginBottom: '8px' 
              }}>
                {currentStepData.title}
              </h2>
              <p style={{ color: 'var(--dzen-gray600)' }}>
                {currentStepData.description}
              </p>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              {currentStepData.component}
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <DzenButton
                onClick={handlePrevious}
                disabled={currentStep === 0}
                variant="secondary"
              >
                Previous
              </DzenButton>
              
              <DzenButton
                onClick={handleNext}
                disabled={!canProceed}
              >
                {isLastStep ? 'Complete Setup' : 'Next'}
              </DzenButton>
            </div>
          </div>
        </DzenCard>

        {/* Skip Option */}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ 
              color: 'rgba(255, 255, 255, 0.7)', 
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Skip for now, I'll set this up later
          </button>
        </div>
      </div>
    </div>
  );
};

// Step Components
const ProfileSetupStep: React.FC<{ user: User; onComplete: () => void }> = ({ user, onComplete }) => {
  const [formData, setFormData] = useState({
    fullName: user.name || '',
    email: user.email || '',
    currency: 'USD',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.fullName && formData.email) {
      onComplete();
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--dzen-gray700)', marginBottom: '4px' }}>
          Full Name
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
        />
      </div>
      
      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--dzen-gray700)', marginBottom: '4px' }}>
          Email
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
    </form>
  );
};

const BankAccountsStep: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [accounts, setAccounts] = useState<Array<{
    id: string;
    name: string;
    accountNumber: string;
    bankName: string;
    accountType: 'savings' | 'checking';
  }>>([]);

  const [newAccount, setNewAccount] = useState<{
    name: string;
    accountNumber: string;
    bankName: string;
    accountType: 'savings' | 'checking';
  }>({
    name: '',
    accountNumber: '',
    bankName: '',
    accountType: 'savings'
  });

  const addAccount = () => {
    if (newAccount.name && newAccount.bankName) {
      setAccounts(prev => [...prev, { ...newAccount, id: Date.now().toString() }]);
      setNewAccount({ name: '', accountNumber: '', bankName: '', accountType: 'savings' });
      onComplete();
    }
  };

  const removeAccount = (id: string) => {
    setAccounts(prev => prev.filter(account => account.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ 
        backgroundColor: '#EBF8FF', 
        padding: '16px', 
        borderRadius: '8px',
        border: '1px solid #BEE3F8'
      }}>
        <h3 style={{ fontWeight: '500', color: '#2B6CB0', marginBottom: '8px' }}>Add Bank Accounts</h3>
        <p style={{ color: '#2C5282', fontSize: '14px' }}>
          Connect your bank accounts to automatically import transactions and track your balances.
        </p>
      </div>

      {/* Existing Accounts */}
      {accounts.length > 0 && (
        <div>
          <h4 style={{ fontWeight: '500', color: 'var(--dzen-gray900)', marginBottom: '8px' }}>Your Accounts</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {accounts.map(account => (
              <div key={account.id} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '12px', 
                backgroundColor: '#F9FAFB', 
                borderRadius: '8px' 
              }}>
                <div>
                  <p style={{ fontWeight: '500' }}>{account.name}</p>
                  <p style={{ fontSize: '14px', color: 'var(--dzen-gray600)' }}>
                    {account.bankName} • {account.accountType}
                  </p>
                </div>
                <button
                  onClick={() => removeAccount(account.id)}
                  style={{ color: '#DC2626', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Account */}
      <div style={{ borderTop: '1px solid var(--dzen-gray200)', paddingTop: '16px' }}>
        <h4 style={{ fontWeight: '500', color: 'var(--dzen-gray900)', marginBottom: '12px' }}>Add New Account</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--dzen-gray700)', marginBottom: '4px' }}>Account Name</label>
            <input
              type="text"
              value={newAccount.name}
              onChange={(e) => setNewAccount(prev => ({ ...prev, name: e.target.value }))}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid var(--dzen-gray300)',
                borderRadius: '6px',
                outline: 'none',
                fontFamily: 'var(--dzen-font-family-primary)'
              }}
              placeholder="e.g., Main Savings"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--dzen-gray700)', marginBottom: '4px' }}>Bank Name</label>
            <input
              type="text"
              value={newAccount.bankName}
              onChange={(e) => setNewAccount(prev => ({ ...prev, bankName: e.target.value }))}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid var(--dzen-gray300)',
                borderRadius: '6px',
                outline: 'none',
                fontFamily: 'var(--dzen-font-family-primary)'
              }}
              placeholder="e.g., Chase Bank"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--dzen-gray700)', marginBottom: '4px' }}>Account Number (Last 4)</label>
            <input
              type="text"
              value={newAccount.accountNumber}
              onChange={(e) => setNewAccount(prev => ({ ...prev, accountNumber: e.target.value }))}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid var(--dzen-gray300)',
                borderRadius: '6px',
                outline: 'none',
                fontFamily: 'var(--dzen-font-family-primary)'
              }}
              placeholder="****1234"
              maxLength={4}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--dzen-gray700)', marginBottom: '4px' }}>Account Type</label>
            <select
              value={newAccount.accountType}
              onChange={(e) => setNewAccount(prev => ({ ...prev, accountType: e.target.value as 'savings' | 'checking' }))}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid var(--dzen-gray300)',
                borderRadius: '6px',
                outline: 'none',
                fontFamily: 'var(--dzen-font-family-primary)'
              }}
            >
              <option value="savings">Savings</option>
              <option value="checking">Checking</option>
            </select>
          </div>
        </div>
        <DzenButton onClick={addAccount} style={{ marginTop: '12px' }} disabled={!newAccount.name || !newAccount.bankName}>
          Add Account
        </DzenButton>
      </div>
    </div>
  );
};

const CardsStep: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [cards, setCards] = useState<Array<{
    id: string;
    name: string;
    issuer: string;
    lastFour: string;
    cardType: 'credit' | 'debit';
    billingCycleDay?: number;
  }>>([]);

  const [newCard, setNewCard] = useState<{
    name: string;
    issuer: string;
    lastFour: string;
    cardType: 'credit' | 'debit';
    billingCycleDay: string;
  }>({
    name: '',
    issuer: '',
    lastFour: '',
    cardType: 'credit',
    billingCycleDay: ''
  });

  const addCard = () => {
    if (newCard.name && newCard.issuer && newCard.lastFour) {
      setCards(prev => [...prev, { 
        ...newCard, 
        id: Date.now().toString(),
        billingCycleDay: newCard.billingCycleDay ? parseInt(newCard.billingCycleDay) : undefined
      }]);
      setNewCard({ name: '', issuer: '', lastFour: '', cardType: 'credit', billingCycleDay: '' });
      onComplete();
    }
  };

  const removeCard = (id: string) => {
    setCards(prev => prev.filter(card => card.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ 
        backgroundColor: '#F0FDF4', 
        padding: '16px', 
        borderRadius: '8px',
        border: '1px solid #BBF7D0'
      }}>
        <h3 style={{ fontWeight: '500', color: '#166534', marginBottom: '8px' }}>Add Credit/Debit Cards</h3>
        <p style={{ color: '#15803D', fontSize: '14px' }}>
          Add your cards to track spending and manage rewards.
        </p>
      </div>

      {/* Existing Cards */}
      {cards.length > 0 && (
        <div>
          <h4 style={{ fontWeight: '500', color: 'var(--dzen-gray900)', marginBottom: '8px' }}>Your Cards</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {cards.map(card => (
              <div key={card.id} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '12px', 
                backgroundColor: '#F9FAFB', 
                borderRadius: '8px' 
              }}>
                <div>
                  <p style={{ fontWeight: '500' }}>{card.name}</p>
                  <p style={{ fontSize: '14px', color: 'var(--dzen-gray600)' }}>
                    {card.issuer} • ****{card.lastFour} • {card.cardType}
                  </p>
                </div>
                <button
                  onClick={() => removeCard(card.id)}
                  style={{ color: '#DC2626', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Card */}
      <div style={{ borderTop: '1px solid var(--dzen-gray200)', paddingTop: '16px' }}>
        <h4 style={{ fontWeight: '500', color: 'var(--dzen-gray900)', marginBottom: '12px' }}>Add New Card</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--dzen-gray700)', marginBottom: '4px' }}>Card Name</label>
            <input
              type="text"
              value={newCard.name}
              onChange={(e) => setNewCard(prev => ({ ...prev, name: e.target.value }))}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid var(--dzen-gray300)',
                borderRadius: '6px',
                outline: 'none',
                fontFamily: 'var(--dzen-font-family-primary)'
              }}
              placeholder="e.g., Chase Sapphire"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--dzen-gray700)', marginBottom: '4px' }}>Issuer</label>
            <input
              type="text"
              value={newCard.issuer}
              onChange={(e) => setNewCard(prev => ({ ...prev, issuer: e.target.value }))}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid var(--dzen-gray300)',
                borderRadius: '6px',
                outline: 'none',
                fontFamily: 'var(--dzen-font-family-primary)'
              }}
              placeholder="e.g., Chase Bank"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--dzen-gray700)', marginBottom: '4px' }}>Last 4 Digits</label>
            <input
              type="text"
              value={newCard.lastFour}
              onChange={(e) => setNewCard(prev => ({ ...prev, lastFour: e.target.value }))}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid var(--dzen-gray300)',
                borderRadius: '6px',
                outline: 'none',
                fontFamily: 'var(--dzen-font-family-primary)'
              }}
              placeholder="1234"
              maxLength={4}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--dzen-gray700)', marginBottom: '4px' }}>Card Type</label>
            <select
              value={newCard.cardType}
              onChange={(e) => setNewCard(prev => ({ ...prev, cardType: e.target.value as 'credit' | 'debit' }))}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid var(--dzen-gray300)',
                borderRadius: '6px',
                outline: 'none',
                fontFamily: 'var(--dzen-font-family-primary)'
              }}
            >
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select>
          </div>
          {newCard.cardType === 'credit' && (
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--dzen-gray700)', marginBottom: '4px' }}>Billing Cycle Day</label>
              <input
                type="number"
                value={newCard.billingCycleDay}
                onChange={(e) => setNewCard(prev => ({ ...prev, billingCycleDay: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid var(--dzen-gray300)',
                  borderRadius: '6px',
                  outline: 'none',
                  fontFamily: 'var(--dzen-font-family-primary)'
                }}
                placeholder="15"
                min="1"
                max="31"
              />
            </div>
          )}
        </div>
        <DzenButton onClick={addCard} style={{ marginTop: '12px' }} disabled={!newCard.name || !newCard.issuer || !newCard.lastFour}>
          Add Card
        </DzenButton>
      </div>
    </div>
  );
};

const ImportTransactionsStep: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    setUploadedFiles(prev => [...prev, ...pdfFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleImport = async () => {
    setIsUploading(true);
    try {
      // TODO: Implement PDF parsing and transaction import
      console.log('Importing transactions from:', uploadedFiles);
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      onComplete();
    } catch (error) {
      console.error('Error importing transactions:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ 
        backgroundColor: '#F3E8FF', 
        padding: '16px', 
        borderRadius: '8px',
        border: '1px solid #E9D5FF'
      }}>
        <h3 style={{ fontWeight: '500', color: '#7C3AED', marginBottom: '8px' }}>Import Transaction History</h3>
        <p style={{ color: '#6D28D9', fontSize: '14px' }}>
          Upload your bank statements (PDF) to import your transaction history and get started quickly.
        </p>
      </div>

      {/* File Upload */}
      <div style={{ 
        border: '2px dashed var(--dzen-gray300)', 
        borderRadius: '8px', 
        padding: '24px', 
        textAlign: 'center' 
      }}>
        <div style={{ marginBottom: '16px' }}>
          <svg style={{ margin: '0 auto', height: '48px', width: '48px', color: '#9CA3AF' }} stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
            <span style={{ color: '#3B82F6', fontWeight: '500' }}>Click to upload</span>
            <span style={{ color: '#6B7280' }}> or drag and drop</span>
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            accept=".pdf"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>
        <p style={{ fontSize: '12px', color: '#6B7280' }}>PDF files only, up to 10MB each</p>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div>
          <h4 style={{ fontWeight: '500', color: 'var(--dzen-gray900)', marginBottom: '8px' }}>Selected Files</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {uploadedFiles.map((file, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '12px', 
                backgroundColor: '#F9FAFB', 
                borderRadius: '8px' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <svg style={{ height: '20px', width: '20px', color: '#DC2626', marginRight: '8px' }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>{file.name}</span>
                  <span style={{ fontSize: '12px', color: '#6B7280', marginLeft: '8px' }}>
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  style={{ color: '#DC2626', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          
          <DzenButton 
            onClick={handleImport} 
            style={{ marginTop: '16px', width: '100%' }}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <LoadingSpinner />
                Processing...
              </>
            ) : (
              `Import ${uploadedFiles.length} File${uploadedFiles.length !== 1 ? 's' : ''}`
            )}
          </DzenButton>
        </div>
      )}

      {/* Import Tips */}
      <div style={{ 
        backgroundColor: '#FEF3C7', 
        padding: '16px', 
        borderRadius: '8px',
        border: '1px solid #FDE68A'
      }}>
        <h4 style={{ fontWeight: '500', color: '#92400E', marginBottom: '8px' }}>💡 Import Tips</h4>
        <ul style={{ color: '#78350F', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <li>• Supported formats: PDF bank statements</li>
          <li>• We'll automatically categorize your transactions</li>
          <li>• You can review and edit imported transactions</li>
          <li>• Import can take a few minutes for large files</li>
        </ul>
      </div>
    </div>
  );
}; 