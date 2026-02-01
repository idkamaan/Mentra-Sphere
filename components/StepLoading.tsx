import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

const StepLoading: React.FC<Props> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 bg-sage-200 rounded-full animate-ping opacity-25"></div>
        <div className="relative p-8 bg-white rounded-full shadow-2xl shadow-sage-200">
          <Loader2 className="w-16 h-16 text-sage-600 animate-spin" />
        </div>
      </div>
      <h3 className="mt-8 text-2xl font-light text-sage-800 animate-pulse">Connecting the dots...</h3>
      <p className="mt-2 text-sage-500">Breathing in, breathing out.</p>
    </div>
  );
};

export default StepLoading;