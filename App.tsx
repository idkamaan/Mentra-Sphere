import React, { useState, useMemo } from 'react';
import { Step, UserProfile, IntakeData, MatchResult } from './types';
import { findMatches } from './utils/matching';
import StepLanding from './components/StepLanding';
import StepIntake from './components/StepIntake';
import StepLoading from './components/StepLoading';
import StepDashboard from './components/StepDashboard';
import StepPayment from './components/StepPayment';

const App: React.FC = () => {
  const [step, setStep] = useState<Step>('landing');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [intake, setIntake] = useState<IntakeData | null>(null);

  // Derive matches only when we have intake data
  const matchResult: MatchResult | null = useMemo(() => {
    if (!intake) return null;
    return findMatches(intake);
  }, [intake]);

  const handleLandingSubmit = (userData: UserProfile) => {
    setUser(userData);
    setStep('intake');
  };

  const handleIntakeSubmit = (intakeData: IntakeData) => {
    setIntake(intakeData);
    setStep('loading');
  };

  const handleLoadingComplete = () => {
    setStep('dashboard');
  };

  const handleJoin = () => {
    setStep('payment');
  };

  return (
    <div className="min-h-screen bg-sage-50 text-sage-900 font-sans">
      
      {/* Navbar - Hidden on Landing for immersion, shown on app steps */}
      {step !== 'landing' && (
        <nav className="max-w-7xl mx-auto flex justify-between items-center py-6 px-6 md:px-8 animate-fade-in">
          <div className="flex items-center space-x-2">
             <span className="text-2xl">🌿</span>
             <span className="font-bold text-xl tracking-tight text-sage-900">Mentra Sphere</span>
          </div>
          <div className="text-sm text-sage-500 font-medium">
            {step === 'intake' && 'Step 2 of 3'}
            {step === 'loading' && 'Connecting...'}
            {step === 'dashboard' && 'Your Sphere'}
            {step === 'payment' && 'Secure Spot'}
          </div>
        </nav>
      )}

      {/* Main Content Area */}
      {/* We use specific container classes for non-landing steps to maintain layout, while Landing gets full width */}
      <main className={step === 'landing' ? 'w-full' : 'max-w-7xl mx-auto px-6 md:px-8 pb-12'}>
        {step === 'landing' && <StepLanding onNext={handleLandingSubmit} />}
        {step === 'intake' && user && <StepIntake user={user} onNext={handleIntakeSubmit} />}
        {step === 'loading' && <StepLoading onComplete={handleLoadingComplete} />}
        {step === 'dashboard' && user && matchResult && <StepDashboard user={user} match={matchResult} onJoin={handleJoin} />}
        {step === 'payment' && matchResult && user && <StepPayment match={matchResult} user={user} />}
      </main>
    </div>
  );
};

export default App;