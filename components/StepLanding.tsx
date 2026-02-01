import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { LOCATIONS } from '../constants';
import { Sprout, Wind, Shield, Users, ArrowDown, Sparkles, Heart, Briefcase, Baby, Ghost, BrainCircuit, Star, MapPin, Feather } from 'lucide-react';

interface Props {
  onNext: (user: UserProfile) => void;
}

const StepLanding: React.FC<Props> = ({ onNext }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [error, setError] = useState<string | null>(null);

  // Scroll Reveal Logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location !== 'Dubai, UAE') {
      setError('🌿 We are currently planting roots only in Dubai. Join our waitlist.');
      return;
    }
    if (!name.trim() || !email.trim()) {
      setError('Please fill in all fields to continue.');
      return;
    }
    onNext({ name, email, location });
  };

  const scrollToForm = () => {
    document.getElementById('join-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Reusable Butterfly Component
  const Butterfly = ({ className, color1, color2 }: { className: string, color1: string, color2: string }) => (
    <div className={`butterfly-container ${className}`}>
      <svg width="50" height="50" viewBox="0 0 24 24" fill="none" className="drop-shadow-xl">
        <g className="butterfly-wings">
           {/* Top Wings */}
           <path d="M12 12 C 12 12, 2 -5, 2 8 C 2 14, 12 18, 12 18" fill={color1} stroke="rgba(255,255,255,0.4)" strokeWidth="0.5"/>
           <path d="M12 12 C 12 12, 22 -5, 22 8 C 22 14, 12 18, 12 18" fill={color1} stroke="rgba(255,255,255,0.4)" strokeWidth="0.5"/>
           
           {/* Bottom Wings */}
           <path d="M12 18 C 12 18, 5 22, 5 15 C 5 12, 12 12, 12 12" fill={color2} opacity="0.9" />
           <path d="M12 18 C 12 18, 19 22, 19 15 C 19 12, 12 12, 12 12" fill={color2} opacity="0.9" />
        </g>
        {/* Body & Antennae */}
        <path d="M12 8 V 18" stroke="#3E2723" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 8 L 10 4" stroke="#3E2723" strokeWidth="0.5" />
        <path d="M12 8 L 14 4" stroke="#3E2723" strokeWidth="0.5" />
      </svg>
    </div>
  );

  return (
    <div className="w-full overflow-x-hidden font-sans text-sage-900">
      
      {/* --- HERO SECTION --- */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 hero-bg overflow-hidden">
        
        {/* Gradient Overlay - Darkened for Text Visibility */}
        <div className="absolute inset-0 bg-black/20" /> 
        {/* Removed the bottom white fade to keep text crisp */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40 pointer-events-none"></div>
        
        {/* Butterflies */}
        <Butterfly className="path-1" color1="#FFA726" color2="#FFCC80" /> {/* Orange Monarch */}
        <Butterfly className="path-2" color1="#4FC3F7" color2="#B3E5FC" /> {/* Blue Morpho */}
        <Butterfly className="path-3" color1="#FFF59D" color2="#FFF9C4" /> {/* Yellow Swallowtail */}

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto space-y-12 animate-fade-in-up flex flex-col items-center">
          
          <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md px-8 py-3 rounded-full border border-white/30 text-white shadow-xl hover:bg-white/20 transition-all cursor-default">
             <Sprout className="w-5 h-5 text-green-200" />
             <span className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-white/90">Sanctuary for the Soul</span>
          </div>
          
          {/* Main Title - Single Line */}
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-serif font-medium text-white tracking-tight drop-shadow-2xl whitespace-nowrap">
            Mentra Sphere
          </h1>
          
          {/* Quote - Enhanced Visibility */}
          <div className="max-w-3xl mx-auto relative group">
             {/* Subtle backdrop behind text for readability */}
             <div className="absolute -inset-4 bg-black/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
             <p className="relative text-xl md:text-3xl text-white font-light leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
               "Connect with souls who speak your language, in a silence that understands."
             </p>
          </div>

        </div>

        {/* Scroll Prompt */}
        <button 
           onClick={scrollToForm}
           className="absolute bottom-12 flex flex-col items-center space-y-4 text-white hover:text-green-100 transition-all cursor-pointer z-20 group"
        >
           <span className="text-xs font-bold tracking-widest uppercase opacity-80 group-hover:opacity-100 transition-opacity drop-shadow-md">Begin Journey</span>
           <div className="p-4 bg-white/10 backdrop-blur-md rounded-full border border-white/30 group-hover:bg-white/20 transition-all animate-bounce shadow-lg">
             <ArrowDown className="w-6 h-6" />
           </div>
        </button>
      </section>


      {/* --- MISSION STATEMENT --- */}
      <section className="py-32 px-6 relative bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-8 reveal-on-scroll">
           <Feather className="w-12 h-12 text-sage-400 mx-auto opacity-50" />
           <h2 className="text-4xl md:text-6xl font-serif text-sage-900 leading-tight">
             A safe harbor in a <br/>
             <span className="text-sage-500 italic">noisy world.</span>
           </h2>
           <p className="text-xl md:text-2xl text-sage-600 font-light leading-relaxed">
             We believe true healing happens when we realize we are not the only ones carrying the weight. Mentra Sphere matches you with a small, curated circle of peers who share your specific journey and your joys.
           </p>
        </div>
      </section>


      {/* --- GROUP TYPES SHOWCASE --- */}
      <section className="py-24 bg-sage-50 relative overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-sage-200/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-green-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20 reveal-on-scroll">
            <h2 className="text-3xl md:text-5xl font-serif text-sage-900 mb-6">Find Your Tribe</h2>
            <p className="text-sage-600 max-w-2xl mx-auto text-lg font-light">
              We create micro-communities based on shared struggles and shared interests. 
              Here is how we might match you.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="reveal-on-scroll glass-panel p-8 rounded-[2.5rem] hover:-translate-y-2 transition-transform duration-500 hover:shadow-2xl hover:shadow-sage-200/50 group">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-white rounded-2xl shadow-sm text-sage-700 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-8 h-8" />
                </div>
              </div>
              <h3 className="text-2xl font-serif font-bold text-sage-900 mb-2">Career Climbers</h3>
              <p className="text-sage-500 mb-6 leading-relaxed">For those feeling the weight of professional expectations and burnout.</p>
              <div className="flex items-center gap-2 text-sage-700 text-sm font-bold bg-white/50 p-3 rounded-xl backdrop-blur-sm">
                 <Wind className="w-4 h-4" /> Bonding over Nature
              </div>
            </div>

            {/* Card 2 */}
            <div className="reveal-on-scroll glass-panel p-8 rounded-[2.5rem] hover:-translate-y-2 transition-transform duration-500 hover:shadow-2xl hover:shadow-sage-200/50 group delay-100">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-white rounded-2xl shadow-sm text-sage-700 group-hover:scale-110 transition-transform">
                  <Ghost className="w-8 h-8" />
                </div>
              </div>
              <h3 className="text-2xl font-serif font-bold text-sage-900 mb-2">Art of Healing</h3>
              <p className="text-sage-500 mb-6 leading-relaxed">Processing grief and loss through the beauty of creative expression.</p>
              <div className="flex items-center gap-2 text-sage-700 text-sm font-bold bg-white/50 p-3 rounded-xl backdrop-blur-sm">
                 <Sparkles className="w-4 h-4" /> Bonding over Art
              </div>
            </div>

            {/* Card 3 */}
            <div className="reveal-on-scroll glass-panel p-8 rounded-[2.5rem] hover:-translate-y-2 transition-transform duration-500 hover:shadow-2xl hover:shadow-sage-200/50 group delay-200">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-white rounded-2xl shadow-sm text-sage-700 group-hover:scale-110 transition-transform">
                  <Baby className="w-8 h-8" />
                </div>
              </div>
              <h3 className="text-2xl font-serif font-bold text-sage-900 mb-2">Mums United</h3>
              <p className="text-sage-500 mb-6 leading-relaxed">Navigating the complex emotions of postpartum life together.</p>
              <div className="flex items-center gap-2 text-sage-700 text-sm font-bold bg-white/50 p-3 rounded-xl backdrop-blur-sm">
                 <Users className="w-4 h-4" /> Bonding over Stories
              </div>
            </div>

             {/* Card 4 */}
             <div className="reveal-on-scroll glass-panel p-8 rounded-[2.5rem] hover:-translate-y-2 transition-transform duration-500 hover:shadow-2xl hover:shadow-sage-200/50 group delay-300">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-white rounded-2xl shadow-sm text-sage-700 group-hover:scale-110 transition-transform">
                  <Heart className="w-8 h-8" />
                </div>
              </div>
              <h3 className="text-2xl font-serif font-bold text-sage-900 mb-2">Heart Menders</h3>
              <p className="text-sage-500 mb-6 leading-relaxed">Finding yourself again after relationship challenges or heartbreak.</p>
              <div className="flex items-center gap-2 text-sage-700 text-sm font-bold bg-white/50 p-3 rounded-xl backdrop-blur-sm">
                 <BrainCircuit className="w-4 h-4" /> Bonding over Gaming
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* --- INTAKE SECTION --- */}
      <section id="join-section" className="relative py-32 px-6 md:px-12 min-h-screen flex items-center justify-center bg-white overflow-hidden">
        
        {/* Soft Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-sage-50 to-white"></div>
        <div className="absolute top-0 right-0 w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center relative z-10">
          
          {/* Left: Content */}
          <div className="space-y-10 text-left reveal-on-scroll">
            <h2 className="text-6xl md:text-7xl font-serif font-bold text-sage-900 leading-tight">
              Ready to feel <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sage-600 to-green-400">
                lighter?
              </span>
            </h2>
            
            <p className="text-xl text-sage-600 font-light leading-relaxed max-w-lg">
              The first step is often the quietest. Enter the sanctuary to meet your guide and find your circle.
            </p>

            <div className="flex flex-col space-y-6 pt-6 border-t border-sage-100">
               <div className="flex items-center space-x-3 text-sage-800 font-medium bg-sage-50 px-6 py-3 rounded-full w-fit">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span>1,240 Members online now</span>
               </div>
               
               <div className="flex items-center gap-4">
                 <div className="flex -space-x-4">
                    {[1, 2, 3, 4].map(i => (
                      <img key={i} src={`https://picsum.photos/seed/${i + 140}/100`} className="w-14 h-14 rounded-full border-[3px] border-white shadow-md grayscale hover:grayscale-0 transition-all" alt="Member" />
                    ))}
                    <div className="w-14 h-14 rounded-full border-[3px] border-white bg-sage-200 flex items-center justify-center text-sage-700 font-bold text-sm shadow-md">
                      +1k
                    </div>
                 </div>
                 <div className="text-sm text-sage-500">
                    <div className="flex text-yellow-400 mb-1">
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                    <p>Trusted by thousands</p>
                 </div>
               </div>
            </div>
          </div>

          {/* Right: Floating Form */}
          <div className="w-full reveal-on-scroll delay-200">
             <form onSubmit={handleSubmit} className="glass-panel p-10 md:p-14 rounded-[3rem] shadow-2xl shadow-sage-200/50 border border-white/60 space-y-8 relative overflow-hidden backdrop-blur-xl">
                
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sage-200 to-transparent rounded-bl-[100%] opacity-50"></div>

                <div className="space-y-2 relative z-10">
                  <h3 className="text-3xl font-serif font-bold text-sage-900">Begin Application</h3>
                  <p className="text-sage-500">Secure, confidential, and judgment-free.</p>
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="group">
                    <label className="block text-xs font-bold text-sage-400 mb-2 ml-1 uppercase tracking-widest group-focus-within:text-sage-700 transition-colors">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-6 py-5 rounded-2xl bg-sage-50/50 border border-sage-100 focus:border-sage-400 focus:bg-white focus:ring-4 focus:ring-sage-100 transition-all outline-none text-lg text-sage-900 placeholder-sage-300"
                      placeholder="e.g. Sarah Smith"
                    />
                  </div>
                  
                  <div className="group">
                    <label className="block text-xs font-bold text-sage-400 mb-2 ml-1 uppercase tracking-widest group-focus-within:text-sage-700 transition-colors">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-6 py-5 rounded-2xl bg-sage-50/50 border border-sage-100 focus:border-sage-400 focus:bg-white focus:ring-4 focus:ring-sage-100 transition-all outline-none text-lg text-sage-900 placeholder-sage-300"
                      placeholder="sarah@example.com"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-xs font-bold text-sage-400 mb-2 ml-1 uppercase tracking-widest group-focus-within:text-sage-700 transition-colors">Location</label>
                    <div className="relative">
                      <select
                        value={location}
                        onChange={(e) => {
                          setLocation(e.target.value);
                          setError(null);
                        }}
                        className="w-full px-6 py-5 rounded-2xl bg-sage-50/50 border border-sage-100 focus:border-sage-400 focus:bg-white focus:ring-4 focus:ring-sage-100 appearance-none cursor-pointer outline-none transition-all text-lg text-sage-900"
                      >
                        {LOCATIONS.map(loc => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                      <MapPin className="absolute right-6 top-1/2 transform -translate-y-1/2 pointer-events-none text-sage-400 w-5 h-5" />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 animate-pulse text-center">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-6 bg-sage-900 text-white rounded-2xl font-bold text-lg hover:bg-sage-800 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-sage-900/20 flex items-center justify-center space-x-3 group"
                >
                  <span>Enter the Sanctuary</span>
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </button>
                
                <div className="flex items-center justify-center space-x-2 text-xs text-sage-400 pt-2">
                  <Shield className="w-3 h-3" />
                  <span>256-bit AES Encrypted & HIPAA Compliant</span>
                </div>
             </form>
          </div>
        </div>
      </section>


      {/* --- FOOTER --- */}
      <footer className="bg-sage-900 text-sage-100 py-20 border-t border-sage-800 relative overflow-hidden">
        {/* Footer Texture */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>
        
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Sprout className="w-10 h-10 text-sage-300" />
              <span className="font-serif font-bold text-3xl tracking-tight text-white">Mentra Sphere</span>
            </div>
            <p className="text-sage-400 max-w-sm text-lg font-light leading-relaxed">
              Designed with love for the quiet souls. <br/>
              Finding peace, one circle at a time.
            </p>
          </div>
          <div className="flex flex-col md:items-end space-y-6">
            <div className="flex space-x-8 text-sm text-sage-300 font-medium tracking-widest uppercase">
              <a href="#" className="hover:text-white transition-colors border-b border-transparent hover:border-white pb-1">Privacy</a>
              <a href="#" className="hover:text-white transition-colors border-b border-transparent hover:border-white pb-1">Terms</a>
              <a href="#" className="hover:text-white transition-colors border-b border-transparent hover:border-white pb-1">Support</a>
            </div>
            <p className="text-sage-600 text-sm">© 2024 Mentra Sphere. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default StepLanding;