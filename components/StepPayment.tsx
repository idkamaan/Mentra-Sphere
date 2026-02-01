import React, { useState } from 'react';
import { MatchResult, UserProfile } from '../types';
import { CreditCard, Lock, ShieldCheck, Loader2, CheckCircle, FileDown, ArrowLeft, Mail } from 'lucide-react';
import { generateDossier } from '../utils/pdfGenerator';
import { GoogleGenAI } from "@google/genai";
import emailjs from '@emailjs/browser';

interface Props {
  match: MatchResult;
  user: UserProfile;
}

// ----------------------------------------------------------------------
// ⚠️ CONFIGURE THESE WITH YOUR EMAILJS CREDENTIALS
// ----------------------------------------------------------------------
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // e.g., 'service_gmail'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // e.g., 'template_welcome'
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // e.g., 'user_12345'
// ----------------------------------------------------------------------

const StepPayment: React.FC<Props> = ({ match, user }) => {
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Processing Payment...');
  
  // Mock form state
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');

  const generateAndSendEmail = async () => {
    setStatusMessage('Personalizing your welcome packet...');
    
    try {
      // 1. Generate Custom Content via Gemini
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Write a warm, deeply empathetic, and short welcome email for a user named "${user.name}".
        They are joining a support group called "${match.groupName}".
        They are dealing with: "${match.userCategories.join(', ')}".
        
        The tone must be: Peaceful, Trustworthy, Serene.
        Avoid clinical jargon. Make them feel safe and validated.
        
        Output format: JSON with keys "subject" and "body".
        Subject should be comforting.
        Body should be around 50-70 words.
      `;

      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const emailContent = JSON.parse(result.text || '{}');
      
      // 2. Send via EmailJS
      // Note: If you haven't set up the keys above, this part will log to console instead of crashing
      if (EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID') {
          setStatusMessage('Sending secure confirmation...');
          await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            {
              to_name: user.name,
              to_email: user.email,
              subject: emailContent.subject,
              message: emailContent.body,
              group_name: match.groupName
            },
            EMAILJS_PUBLIC_KEY
          );
      } else {
          console.log("SIMULATED EMAIL SENDING:");
          console.log("Subject:", emailContent.subject);
          console.log("Body:", emailContent.body);
          // Artificial delay if keys aren't set
          await new Promise(r => setTimeout(r, 1000));
      }

    } catch (error) {
      console.error("Email generation failed:", error);
      // We don't block success if email fails, we just log it
    }
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    
    // 1. Payment Simulation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 2. AI Email Generation & Sending
    await generateAndSendEmail();

    // 3. Success State
    setProcessing(false);
    setSuccess(true);
    window.confetti({
        particleCount: 200,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#33691E', '#8BC34A', '#DCEDC8']
    });
  };

  const handleDownloadBrief = () => {
    generateDossier(user, match);
  };

  // Formatting helpers
  const formatCard = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    }
    return value;
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-fade-in text-center space-y-6 max-w-2xl mx-auto">
        <div className="w-24 h-24 bg-sage-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-12 h-12 text-sage-700" />
        </div>
        
        <div className="space-y-2">
            <h2 className="text-4xl font-bold text-sage-900">You're All In!</h2>
            <p className="text-xl text-sage-600">
            Welcome to the family. Your spot in <span className="font-semibold text-sage-800">{match.groupName}</span> is confirmed.
            </p>
        </div>

        <div className="w-full bg-white p-8 rounded-[2rem] border border-sage-100 shadow-xl shadow-sage-200/50 mt-8 space-y-6">
           <div className="flex flex-col md:flex-row justify-between items-center border-b border-sage-50 pb-6 gap-4">
               <div className="text-left">
                   <p className="text-xs text-sage-500 uppercase tracking-widest font-semibold mb-1">First Session</p>
                   <p className="text-lg text-sage-900 font-medium">Tomorrow at 7:00 PM GST</p>
               </div>
               <div className="text-left md:text-right">
                   <p className="text-xs text-sage-500 uppercase tracking-widest font-semibold mb-1">Status</p>
                   <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold">
                       Confirmed
                   </div>
               </div>
           </div>

           <div className="bg-sage-50 rounded-xl p-6 text-left space-y-4">
               <div className="flex items-start space-x-3">
                   <div className="p-2 bg-white rounded-lg shadow-sm">
                       <Mail className="w-5 h-5 text-sage-700" />
                   </div>
                   <div>
                       <h4 className="font-bold text-sage-900">Check Your Inbox</h4>
                       <p className="text-sm text-sage-600 mt-1">
                           Mentra has just crafted and sent a personalized welcome letter to <b>{user.email}</b>.
                       </p>
                   </div>
               </div>
           </div>

           <div className="bg-sage-50 rounded-xl p-6 text-left space-y-4">
               <div className="flex items-start space-x-3">
                   <div className="p-2 bg-white rounded-lg shadow-sm">
                       <FileDown className="w-5 h-5 text-sage-700" />
                   </div>
                   <div>
                       <h4 className="font-bold text-sage-900">Therapist Briefing Document</h4>
                       <p className="text-sm text-sage-600 mt-1">
                           This confidential document contains your group details, icebreakers, and match summary. Please download it before your first session.
                       </p>
                   </div>
               </div>
               <button 
                  onClick={handleDownloadBrief}
                  className="w-full py-3 bg-sage-900 text-white rounded-lg font-semibold hover:bg-sage-800 transition-colors flex items-center justify-center space-x-2"
               >
                   <FileDown className="w-4 h-4" />
                   <span>Download Session Brief (PDF)</span>
               </button>
           </div>
        </div>

        <button className="mt-8 text-sage-700 font-semibold hover:text-sage-900 flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-start animate-fade-in-up">
      
      {/* Left: Summary */}
      <div className="space-y-6">
        <div className="bg-sage-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
          
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-start pb-4 border-b border-white/20">
              <div>
                <p className="font-semibold text-lg">{match.groupName}</p>
                <p className="text-sage-200 text-sm">Monthly Membership</p>
              </div>
              <p className="font-bold text-xl">$20.00</p>
            </div>
            <div className="flex justify-between items-center text-sage-200 text-sm">
              <p>Platform Fee</p>
              <p>$0.00</p>
            </div>
            <div className="flex justify-between items-center pt-4 font-bold text-xl">
              <p>Total</p>
              <p>$20.00</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sage-200 text-sm bg-white/10 p-3 rounded-xl">
             <ShieldCheck className="w-4 h-4" />
             <span>30-Day Money-Back Guarantee</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-sage-100 shadow-sm text-sage-600 text-sm">
          <h4 className="font-bold text-sage-900 mb-2">Why is there a fee?</h4>
          <p>
            We charge a small commitment fee to ensure safe, moderated spaces and to support our professional therapists who oversee the groups.
          </p>
        </div>
      </div>

      {/* Right: Payment Form */}
      <div className="bg-white p-8 rounded-[2rem] shadow-lg shadow-sage-100/50 border border-sage-50">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-sage-900">Payment Details</h3>
          <div className="flex space-x-2">
            <div className="w-8 h-5 bg-gray-200 rounded"></div>
            <div className="w-8 h-5 bg-gray-200 rounded"></div>
          </div>
        </div>

        <form onSubmit={handlePay} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-sage-700 ml-1">Card Number</label>
            <div className="relative">
              <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sage-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="0000 0000 0000 0000"
                className="w-full pl-12 pr-4 py-3 bg-sage-50 rounded-xl border-none focus:ring-2 focus:ring-sage-300 outline-none transition-all font-mono text-sage-800"
                value={formatCard(cardNumber)}
                onChange={(e) => setCardNumber(e.target.value)}
                maxLength={19}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-sage-700 ml-1">Expiry Date</label>
              <input 
                type="text" 
                placeholder="MM/YY"
                className="w-full px-4 py-3 bg-sage-50 rounded-xl border-none focus:ring-2 focus:ring-sage-300 outline-none transition-all font-mono text-sage-800"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                maxLength={5}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-sage-700 ml-1">CVC</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sage-400 w-4 h-4" />
                <input 
                  type="password" 
                  placeholder="123"
                  className="w-full pl-10 pr-4 py-3 bg-sage-50 rounded-xl border-none focus:ring-2 focus:ring-sage-300 outline-none transition-all font-mono text-sage-800"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  maxLength={3}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-sage-700 ml-1">Cardholder Name</label>
            <input 
              type="text" 
              placeholder="Full Name"
              className="w-full px-4 py-3 bg-sage-50 rounded-xl border-none focus:ring-2 focus:ring-sage-300 outline-none transition-all text-sage-800"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={processing}
            className="w-full py-4 bg-sage-900 text-white rounded-xl font-bold text-lg hover:bg-sage-800 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-sage-900/20 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {processing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{statusMessage}</span>
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                <span>Pay $20.00 & Join</span>
              </>
            )}
          </button>
          
          <div className="text-center">
            <p className="text-xs text-sage-400 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" /> Encrypted Payment Processing
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StepPayment;