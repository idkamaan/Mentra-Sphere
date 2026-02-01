import React, { useState, useRef, useEffect } from 'react';
import { IntakeData, UserProfile } from '../types';
import { MessageCircleHeart, Send, User, Sparkles, MoreHorizontal, Volume2, VolumeX } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Props {
  user: UserProfile;
  onNext: (data: IntakeData) => void;
}

type Sender = 'bot' | 'user';
type FlowState = 'ASK_FEELINGS' | 'ASK_HOBBY' | 'DONE';

interface Message {
  id: string;
  sender: Sender;
  text: React.ReactNode;
  rawText?: string; // For TTS
}

const StepIntake: React.FC<Props> = ({ user, onNext }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [flowState, setFlowState] = useState<FlowState>('ASK_FEELINGS');
  const [isTyping, setIsTyping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  // Store the collected data
  const [feelings, setFeelings] = useState('');
  const [hobby, setHobby] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechSynthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    speechSynthRef.current = window.speechSynthesis;
    return () => {
      speechSynthRef.current?.cancel();
    };
  }, []);

  const speak = (text: string) => {
    if (isMuted || !speechSynthRef.current) return;
    
    // Cancel any current speaking
    speechSynthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    // Try to find a calm, female voice if available
    const voices = speechSynthRef.current.getVoices();
    const calmVoice = voices.find(v => v.name.includes('Samantha') || v.name.includes('Female')) || voices[0];
    
    if (calmVoice) utterance.voice = calmVoice;
    utterance.rate = 0.9; // Slightly slower for calming effect
    utterance.pitch = 1;
    
    speechSynthRef.current.speak(utterance);
  };

  // Initialize Chat
  useEffect(() => {
    // Initial greeting delay
    const initTimeout = setTimeout(() => {
      const msg1 = `Welcome, ${user.name}. I am Mentra. This is a safe space.`;
      addBotMessage(msg1, msg1);
      
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        const msg2 = "In your own words, what has been weighing on your heart lately?";
        addBotMessage(msg2, msg2);
      }, 2500); // Increased delay slightly to allow speaking
    }, 500);

    return () => clearTimeout(initTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const addBotMessage = (text: React.ReactNode, rawText: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'bot', text, rawText }]);
    speak(rawText);
  };

  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text }]);
  };

  const generateAIResponse = async (prompt: string, fallback: string): Promise<string> => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          temperature: 1.1, // Higher temperature for more varied, natural responses
        }
      });
      return result.text || fallback;
    } catch (error) {
      console.error("AI Generation Error:", error);
      return fallback;
    }
  };

  // Perform detailed sentiment analysis and categorization via LLM
  const analyzeSentimentAndCategory = async (userFeelings: string, userHobby: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Analyze the following user input about their mental state: "${userFeelings}".
        
        Task 1: Identify the most relevant categories from this specific list: 
        ["Postpartum Depression", "Relationship Issues", "Workplace Stress", "Grief Support", "Anxiety Management"].
        If it fits multiple, list up to 2. If it fits none clearly, use "Anxiety Management".
        
        Task 2: Analyze the sentiment/tone (e.g., Overwhelmed, Sad, Hopeful, Angry).

        Return ONLY a JSON object:
        {
          "categories": ["Category1", "Category2"],
          "sentiment": "One word sentiment"
        }
      `;

      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const data = JSON.parse(result.text || '{"categories": ["Anxiety Management"]}');
      return data.categories;

    } catch (e) {
      console.error("Analysis failed", e);
      return []; // Return empty to fall back to regex
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    addUserMessage(userText);
    setInputValue('');
    setIsTyping(true);

    // Chat Logic Flow
    if (flowState === 'ASK_FEELINGS') {
      setFeelings(userText);
      
      // Generate empathetic response using AI
      const prompt = `
        You are Mentra, a compassionate and human-like mental health companion.
        User input: "${userText}"
        
        Task: Respond with genuine, varied empathy.
        Guidelines:
        1. Detect the specific emotion (sadness, exhaustion, anger, fear, etc.).
        2. Start with a natural, varied conversational filler or acknowledgment appropriate to that emotion.
           - Examples: "I hear how heavy that is," "That sounds incredibly draining," "It takes so much strength to carry that," "I'm so sorry you're navigating this," "Ah, that is a heavy burden."
        3. Do NOT use robotic phrases like "I understand" or "I am an AI". 
        4. Validate their experience deeply but briefly.
        5. Keep it under 35 words.
        6. Tone: Warm, Safe, Serene, Non-judgmental.
      `;
      const fallback = "I hear you. Thank you for trusting me with this vulnerability.";
      
      const aiResponse = await generateAIResponse(prompt, fallback);
      
      setIsTyping(false);
      addBotMessage(aiResponse, aiResponse);

      // Transition to Hobby Question
      setIsTyping(true);
      setTimeout(() => {
         setIsTyping(false);
         const msg = "To match you with friends, not just patients... what is one activity that brings you peace?";
         const uiMsg = (
           <span>
             {msg} <br/>
             <span className="text-sm opacity-80 mt-1 block">(e.g., Gaming, Art, Nature, Reading)</span>
           </span>
         );
         addBotMessage(uiMsg, msg);
         setFlowState('ASK_HOBBY');
      }, aiResponse.length * 60 + 1000); // Dynamic delay based on reading time

    } else if (flowState === 'ASK_HOBBY') {
      setHobby(userText);
      
      // Generate hobby validation using AI
      const prompt = `
        You are Mentra. The user finds peace in: "${userText}".
        Task: Validate this coping mechanism with a warm, poetic touch.
        Guidelines:
        1. Start with an appreciative, varied filler.
           - Examples: "Ah, what a beautiful escape," "Oh, that sounds lovely," "There is so much healing in that," "Wonderful choice."
        2. Connect this activity to inner peace or the soul.
        3. Max 25 words.
        4. Tone: Peaceful, Appreciative, Serene.
      `;
      const fallback = `Ah, ${userText} is a beautiful way to find grounding.`;
      
      const aiResponse = await generateAIResponse(prompt, fallback);

      setIsTyping(false);
      addBotMessage(aiResponse, aiResponse);
      
      // Transition to Done
      setIsTyping(true);
      setTimeout(() => {
         setIsTyping(false);
         const msg = "I have found a circle that resonates with your journey. Are you ready to meet them?";
         addBotMessage(msg, msg);
         setFlowState('DONE');
      }, 2000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleComplete = async () => {
    // Trigger analysis before moving next
    // We pass the raw data immediately, but we could add a loading spinner here if we wanted strict analysis waiting
    // For smoothness, we'll try to get it done quickly or pass it along.
    
    // Actually, let's just do it here to ensure accuracy
    const aiCategories = await analyzeSentimentAndCategory(feelings, hobby);
    onNext({ feelings, hobby, aiCategories });
  };

  return (
    <div className="w-full max-w-2xl mx-auto h-[600px] flex flex-col bg-white rounded-[2rem] shadow-xl shadow-sage-100/50 overflow-hidden border border-sage-50 animate-fade-in-up">
      
      {/* Header */}
      <div className="bg-sage-50 p-4 border-b border-sage-100 flex items-center justify-between">
         <div className="flex items-center space-x-3">
            <div className="p-2 bg-sage-200 rounded-full">
               <MessageCircleHeart className="w-5 h-5 text-sage-800" />
            </div>
            <div>
               <h2 className="font-bold text-sage-900">Mentra Guide</h2>
               <div className="flex items-center space-x-1">
                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                 <span className="text-xs text-sage-500">Online</span>
               </div>
            </div>
         </div>
         
         {/* Mute Toggle */}
         <button 
           onClick={() => {
             setIsMuted(!isMuted);
             if (!isMuted) speechSynthRef.current?.cancel();
           }}
           className="p-2 text-sage-500 hover:text-sage-800 hover:bg-sage-100 rounded-full transition-colors"
           title={isMuted ? "Unmute Voice" : "Mute Voice"}
         >
           {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
         </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-white to-sage-50/30">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
             <div className={`flex max-w-[80%] md:max-w-[70%] items-end space-x-2 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'bot' ? 'bg-sage-100 text-sage-700' : 'bg-sage-900 text-white'}`}>
                   {msg.sender === 'bot' ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div 
                  className={`p-4 rounded-2xl text-sm md:text-base leading-relaxed shadow-sm
                    ${msg.sender === 'bot' 
                      ? 'bg-white border border-sage-100 text-sage-800 rounded-bl-none' 
                      : 'bg-sage-900 text-white rounded-br-none'
                    }`}
                >
                  {msg.text}
                </div>
             </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
           <div className="flex w-full justify-start animate-fade-in">
              <div className="flex items-end space-x-2">
                 <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center flex-shrink-0 text-sage-700">
                    <Sparkles className="w-4 h-4" />
                 </div>
                 <div className="bg-white border border-sage-100 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center space-x-1">
                    <span className="w-2 h-2 bg-sage-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-sage-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-sage-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                 </div>
              </div>
           </div>
        )}

        {/* Final CTA Button inside chat flow */}
        {flowState === 'DONE' && !isTyping && (
          <div className="flex justify-center pt-4 animate-fade-in">
             <button 
                onClick={handleComplete}
                className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center space-x-2"
             >
                <span>Find My Sphere</span>
                <Sparkles className="w-4 h-4" />
             </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {flowState !== 'DONE' && (
        <div className="p-4 bg-white border-t border-sage-100">
           <div className="relative flex items-center">
              <input 
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your answer..."
                disabled={isTyping}
                className="w-full pl-6 pr-14 py-4 rounded-full bg-sage-50 border border-sage-100 focus:ring-2 focus:ring-sage-300 focus:bg-white transition-all outline-none text-sage-900 placeholder-sage-400 disabled:opacity-50 disabled:cursor-not-allowed"
                autoFocus
              />
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="absolute right-2 p-2 bg-sage-900 text-white rounded-full hover:bg-sage-800 disabled:bg-sage-200 disabled:cursor-not-allowed transition-all"
              >
                 <Send className="w-5 h-5" />
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default StepIntake;