import React from 'react';
import { MatchResult, UserProfile } from '../types';
import { CheckCircle, Heart, Gamepad2, Mountain, Palette, User as UserIcon, ArrowRight, BookOpen, Sparkles } from 'lucide-react';

interface Props {
  user: UserProfile;
  match: MatchResult;
  onJoin: () => void;
}

const HobbyIcon = ({ hobby }: { hobby: string }) => {
  if (hobby === 'Gaming') return <Gamepad2 className="w-4 h-4" />;
  if (hobby === 'Hiking') return <Mountain className="w-4 h-4" />;
  if (hobby === 'Art') return <Palette className="w-4 h-4" />;
  if (hobby === 'Reading') return <BookOpen className="w-4 h-4" />;
  return <UserIcon className="w-4 h-4" />;
};

const StepDashboard: React.FC<Props> = ({ user, match, onJoin }) => {
  
  const focusLabel = match.userCategories.length > 1 
    ? "Personalized Support" 
    : match.userCategories[0];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10 animate-slide-up pb-12">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold text-sage-900">You are not alone.</h2>
        <div className="flex flex-col items-center gap-2">
            <p className="text-xl text-sage-700">
                Welcome to <span className="font-semibold text-sage-900 bg-sage-100 px-3 py-1 rounded-full">{match.groupName}</span>
            </p>
            <div className="inline-flex items-center space-x-2 bg-white/60 px-4 py-2 rounded-full border border-sage-200 mt-2 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-sage-500" />
                <span className="text-sage-600 text-sm font-medium">Shared Focus:</span>
                <span className="text-sage-900 font-bold">{focusLabel}</span>
            </div>
            {match.userCategories.length > 1 && (
              <p className="text-xs text-sage-500 mt-1">
                Matched for: {match.userCategories.join(" & ")}
              </p>
            )}
        </div>
      </div>

      {/* The Squad */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {match.peers.map((peer, idx) => (
          <div 
            key={peer.id}
            className="bg-white p-6 rounded-[2rem] shadow-lg shadow-sage-100/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-sage-50 flex flex-col items-center text-center space-y-4"
            style={{ animationDelay: `${idx * 150}ms` }}
          >
            <div className="relative">
              <img src={peer.avatar} alt={peer.name} className="w-24 h-24 rounded-full object-cover border-4 border-sage-50" />
              <div className="absolute bottom-0 right-0 p-2 bg-sage-100 rounded-full text-sage-700">
                <HobbyIcon hobby={peer.hobby} />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-sage-900">{peer.name}</h3>
              <p className="text-sage-500 text-sm font-medium uppercase tracking-wider mt-1">{peer.category}</p>
            </div>
            <div className="w-full pt-4 border-t border-sage-50">
              <p className="text-sage-600 text-sm flex items-center justify-center gap-2">
                <Heart className="w-4 h-4 text-red-400 fill-current" /> 
                Loves: {peer.hobby}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Commitment Action */}
      <div className="mt-12 max-w-2xl mx-auto">
        <div className="bg-white border-2 border-sage-100 p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-sage-200/50">
            <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-sage-900 mb-2">Commit to Healing</h3>
                <p className="text-sage-600">Secure your spot with {match.groupName}. Taking the first step is the hardest.</p>
            </div>
            <button 
                onClick={onJoin}
                className="flex-shrink-0 flex items-center justify-center space-x-2 bg-sage-900 text-white py-4 px-8 rounded-xl font-bold hover:bg-sage-800 hover:scale-105 transition-all shadow-lg group"
            >
                <span>Confirm Attendance</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default StepDashboard;