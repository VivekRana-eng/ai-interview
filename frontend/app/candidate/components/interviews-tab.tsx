'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  ExternalLink, 
  Camera, 
  Mic, 
  CheckCircle, 
  AlertCircle, 
  ShieldAlert, 
  CheckCircle2, 
  UserCheck, 
  ArrowRight,
  Info,
  ChevronRight,
  MicOff,
  Volume2,
  Send,
  Sparkles,
  Wifi,
  Smile,
  X
} from 'lucide-react';

interface InterviewsTabProps {
  initialStep?: 'list' | 1 | 2 | 3 | 4 | 5 | 6;
}

export const InterviewsTab: React.FC<InterviewsTabProps> = ({ initialStep = 'list' }) => {
  const [step, setStep] = useState<'list' | 1 | 2 | 3 | 4 | 5 | 6>(initialStep);
  
  // List of Scheduled Interviews
  const scheduledInterviews = [
    { id: 1, role: 'Staff UI Engineer', company: 'Google', date: 'Today, 2026-07-19', time: '4:30 PM (45m)', type: 'AI Technical Interview', status: 'Active' },
    { id: 2, role: 'React Framework Engineer', company: 'Vercel', date: '2026-07-22', time: '11:00 AM (30m)', type: 'AI Technical Screening', status: 'Scheduled' },
    { id: 3, role: 'Senior Product Engineer', company: 'Stripe', date: '2026-07-25', time: '2:00 PM (60m)', type: 'System Architecture Screening', status: 'Scheduled' },
    { id: 4, role: 'DevSecOps Specialist', company: 'GitHub', date: '2026-07-28', time: '10:00 AM (45m)', type: 'Security Protocols Assessment', status: 'Scheduled' },
    { id: 5, role: 'Machine Learning Specialist', company: 'OpenAI', date: '2026-08-02', time: '3:30 PM (90m)', type: 'Neural Architectures Deep-Dive', status: 'Scheduled' }
  ];

  // Step 2: System Check Verification State
  const [sysChecks, setSysChecks] = useState({
    camera: 'checking',
    mic: 'checking',
    browser: 'checking',
    internet: 'checking',
    face: 'checking',
    lighting: 'checking'
  });

  // Step 3: Integrity Agreement Checks
  const [integrityChecked, setIntegrityChecked] = useState({
    conduct: false,
    noHelp: false,
    focus: false,
    monitoring: false
  });

  // Step 4: Waiting Room Countdown
  const [waitingCountdown, setWaitingCountdown] = useState(10); // 10 seconds for mock demo wait
  
  // Step 5: AI Interview Screen Chat State
  const questions = [
    "Welcome! Let's start by exploring your experience with state management. Can you explain why you would choose Zustand over Redux for a modern Next.js SaaS app?",
    "Excellent explanation. How would you design a custom virtualized grid component to render 100,000 active candidate records without dropping frame rate?",
    "Perfect. Final question: How do you optimize hydration performance when serving dynamic client-specific modules with Next.js Server Components?"
  ];
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answerInput, setAnswerInput] = useState('');
  const [isVoiceMode, setIsVoiceMode] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [interviewTimer, setInterviewTimer] = useState(180); // 3 minutes per question
  
  // Trigger system check animation simulation
  useEffect(() => {
    if (step === 2) {
      const timers = [
        setTimeout(() => setSysChecks(prev => ({ ...prev, camera: 'success' })), 800),
        setTimeout(() => setSysChecks(prev => ({ ...prev, mic: 'success' })), 1400),
        setTimeout(() => setSysChecks(prev => ({ ...prev, browser: 'success' })), 2000),
        setTimeout(() => setSysChecks(prev => ({ ...prev, internet: 'success' })), 2600),
        setTimeout(() => setSysChecks(prev => ({ ...prev, face: 'success' })), 3200),
        setTimeout(() => setSysChecks(prev => ({ ...prev, lighting: 'success' })), 3800)
      ];
      return () => timers.forEach(t => clearTimeout(t));
    }
  }, [step]);

  // Waiting Room Countdown simulation
  useEffect(() => {
    if (step === 4 && waitingCountdown > 0) {
      const timer = setTimeout(() => setWaitingCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, waitingCountdown]);

  // Interview Screen Question Timer simulation
  useEffect(() => {
    if (step === 5 && interviewTimer > 0) {
      const timer = setTimeout(() => setInterviewTimer(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, interviewTimer]);

  const handleIntegritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(integrityChecked).every(v => v === true)) {
      setStep(4);
    }
  };

  const handleVoiceToggle = () => {
    if (isVoiceMode) {
      setIsVoiceMode(false);
      setIsRecording(false);
    } else {
      setIsVoiceMode(true);
      setIsRecording(true);
      setTranscription("Listening...");
      setTimeout(() => {
        setTranscription("I prefer Zustand because it is lightweight, doesn't require a wrapping Context Provider, and works directly with React closures...");
      }, 3000);
    }
  };

  const handleAnswerSubmit = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setAnswerInput('');
      setTranscription('');
      setInterviewTimer(180);
    } else {
      setStep(6);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-6 text-left min-h-[500px]">
      
      <AnimatePresence mode="wait">
        
        {/* ==========================================================================
           STEP 'list': SCHEDULED LISTINGS
           ========================================================================== */}
        {step === 'list' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-center mb-4 border-b border-slate-200 dark:border-slate-800/60 pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4.5 h-4.5 text-blue-400" />
                  <h3 className="text-sm font-bold text-slate-850 dark:text-white">Scheduled Interview Invites</h3>
                </div>
              </div>

              <div className="space-y-4">
                {scheduledInterviews.map((inv) => (
                  <div 
                    key={inv.id} 
                    className="p-4 bg-slate-50 dark:bg-slate-100 dark:bg-slate-900/50 hover:bg-slate-100 dark:bg-slate-900 border border-slate-150 dark:border-slate-800/60 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                        <Calendar className="w-5.5 h-5.5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold text-blue-400 block uppercase tracking-wider">{inv.type}</span>
                        <h4 className="text-sm font-bold text-slate-850 dark:text-white mt-0.5">{inv.role}</h4>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1 block">{inv.company} &bull; {inv.date} &bull; {inv.time}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {inv.status === 'Active' ? (
                        <button
                          onClick={() => setStep(1)}
                          className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl transition-all shadow-md shadow-indigo-600/10 active:scale-95 flex items-center justify-center gap-1.5"
                        >
                          <span>Join Assessment</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          disabled
                          className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-500 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1.5 cursor-not-allowed"
                        >
                          <span>System Check Open</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ==========================================================================
           STEP 1: INVITE LANDING PAGE
           ========================================================================== */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="max-w-2xl mx-auto bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-3xl p-6 lg:p-8 shadow-md relative overflow-hidden"
          >
            <div className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-blue-500/5 blur-2xl" />
            
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-400 tracking-widest uppercase ring-1 ring-blue-500/20">
                Evaluation Setup
              </span>
              <button 
                onClick={() => setStep('list')}
                className="p-1 rounded-lg text-slate-500 dark:text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-850 dark:text-white">Staff UI Engineer Interview</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                You have been invited by Vercel for an automated AI Interview. This is a technical screening module assessing React internals, layout architecture, state stores, and communication metrics.
              </p>

              <div className="p-4 bg-slate-50 dark:bg-slate-100 dark:bg-slate-900/60 rounded-2xl border border-slate-150 dark:border-slate-800/60 space-y-3.5">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 block uppercase">Rules & Guidelines:</h4>
                <ul className="text-xs text-slate-500 dark:text-slate-400 font-semibold space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    <span>Duration: <strong>45 minutes</strong> total. (3-4 questions)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    <span>Requirements: Enabled Camera, Microphone, and stable connection.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    <span>Proctoring: Tab locks, face detection, and copy-paste locks are active.</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-2xl transition-all shadow-md shadow-blue-600/10 flex items-center justify-center gap-1 active:scale-95"
              >
                <span>Proceed to System Check</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ==========================================================================
           STEP 2: SYSTEM CHECK
           ========================================================================== */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-2xl mx-auto bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-3xl p-6 lg:p-8 shadow-md"
          >
            <h2 className="text-lg font-bold text-slate-850 dark:text-white mb-2">Hardware & Connection Verification</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-6">
              Checking compatibility to ensure smooth live voice transcription and secure video proctoring feed.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {Object.entries(sysChecks).map(([key, value]) => {
                const getIcon = () => {
                  switch (key) {
                    case 'camera': return Camera;
                    case 'mic': return Mic;
                    case 'browser': return UserCheck;
                    default: return Clock;
                  }
                };
                const Icon = getIcon();
                
                return (
                  <div 
                    key={key}
                    className="p-4 bg-slate-50 dark:bg-slate-100 dark:bg-slate-900/60 border border-slate-150 dark:border-slate-800/60 rounded-2xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-slate-800 text-slate-500 dark:text-slate-400">
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200 capitalize">{key.replace('internet', 'Internet Speed').replace('face', 'Face Position').replace('lighting', 'Environment Light')}</span>
                    </div>
                    <div>
                      {value === 'checking' ? (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-700 border-t-blue-500 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 bg-slate-100 dark:bg-slate-900 hover:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-white text-xs font-extrabold rounded-2xl transition-colors active:scale-95"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={Object.values(sysChecks).some(v => v === 'checking')}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-xs font-extrabold rounded-2xl transition-all shadow-md shadow-blue-600/10 active:scale-95"
              >
                Continue Setup
              </button>
            </div>
          </motion.div>
        )}

        {/* ==========================================================================
           STEP 3: INTEGRITY AGREEMENT
           ========================================================================== */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="max-w-2xl mx-auto bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-3xl p-6 lg:p-8 shadow-md"
          >
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="w-5.5 h-5.5 text-rose-450" />
              <h2 className="text-lg font-bold text-slate-850 dark:text-white">Integrity & Conduct Agreement</h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-6">
              Please review and sign the proctoring agreement. Any violation will be logged in your final AI evaluation dashboard report.
            </p>

            <form onSubmit={handleIntegritySubmit} className="space-y-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <label className="flex items-start gap-3 p-3.5 bg-slate-50 dark:bg-slate-100 dark:bg-slate-900/50 hover:bg-slate-100 dark:bg-slate-900/80 border border-slate-150 dark:border-slate-800/60 rounded-2xl cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={integrityChecked.conduct}
                  onChange={(e) => setIntegrityChecked({ ...integrityChecked, conduct: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-0 shrink-0 mt-0.5"
                />
                <span>I will solve the evaluation exercises independently without external help or other tabs open.</span>
              </label>

              <label className="flex items-start gap-3 p-3.5 bg-slate-50 dark:bg-slate-100 dark:bg-slate-900/50 hover:bg-slate-100 dark:bg-slate-900/80 border border-slate-150 dark:border-slate-800/60 rounded-2xl cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={integrityChecked.noHelp}
                  onChange={(e) => setIntegrityChecked({ ...integrityChecked, noHelp: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-0 shrink-0 mt-0.5"
                />
                <span>I will keep my face within camera view at all times. Face detection monitoring is active.</span>
              </label>

              <label className="flex items-start gap-3 p-3.5 bg-slate-50 dark:bg-slate-100 dark:bg-slate-900/50 hover:bg-slate-100 dark:bg-slate-900/80 border border-slate-150 dark:border-slate-800/60 rounded-2xl cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={integrityChecked.focus}
                  onChange={(e) => setIntegrityChecked({ ...integrityChecked, focus: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-0 shrink-0 mt-0.5"
                />
                <span>I consent to window focus tracking. Switching windows/apps will record violations.</span>
              </label>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 bg-slate-100 dark:bg-slate-900 hover:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-white text-xs font-extrabold rounded-2xl transition-colors active:scale-95"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!Object.values(integrityChecked).every(v => v === true)}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-xs font-extrabold rounded-2xl transition-all shadow-md shadow-blue-600/10 active:scale-95"
                >
                  Agree & Sign
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* ==========================================================================
           STEP 4: WAITING ROOM
           ========================================================================== */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-2xl mx-auto bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-3xl p-8 shadow-md text-center space-y-6"
          >
            <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-400 animate-pulse">
              <Clock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-850 dark:text-white">Connecting with evaluation agent...</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold max-w-sm mx-auto">
                Setting up voice channels, proctor feeds, and downloading the interview questions.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-100 dark:bg-slate-900/60 rounded-2xl border border-slate-150 dark:border-slate-800/60 max-w-sm mx-auto text-left flex items-center gap-3">
              <Info className="w-5 h-5 text-indigo-400 shrink-0" />
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                When you enter the room, the AI will welcome you and ask the first question. You can toggle between <strong>Voice Answer</strong> and <strong>Text Answer</strong>.
              </div>
            </div>

            <div className="pt-2">
              {waitingCountdown > 0 ? (
                <div className="text-xs font-extrabold text-blue-400 uppercase tracking-widest">
                  Entering room in {waitingCountdown} seconds...
                </div>
              ) : (
                <button
                  onClick={() => setStep(5)}
                  className="w-full max-w-xs py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-extrabold rounded-2xl transition-all shadow-md shadow-blue-600/10 active:scale-95 animate-bounce"
                >
                  Enter AI Interview Room
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* ==========================================================================
           STEP 5: AI INTERVIEW SCREEN
           ========================================================================== */}
        {step === 5 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full"
          >
            {/* Left/Main Column - AI Avatar, Chat interface, Voice controls */}
            <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">
              
              {/* Interview header (Timer / Progress) */}
              <div className="bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-3xl p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-400 uppercase tracking-wider">
                    Question {currentQuestionIdx + 1} of {questions.length}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-bold">
                    <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Lobby: Stable</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <Clock className="w-4 h-4 text-rose-400" />
                  <span className="text-xs text-rose-400 font-extrabold">{formatTimer(interviewTimer)}</span>
                </div>
              </div>

              {/* AI Avatar Display Box */}
              <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0 bg-radial-glow opacity-30 pointer-events-none" />
                
                {/* Glowing Avatar circle */}
                <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white text-3xl font-extrabold shadow-xl shadow-blue-500/15 border border-white/10 ring-4 ring-blue-500/10">
                  <Sparkles className="w-12 h-12 text-white animate-pulse" />
                  {/* Floating visual equalizer indicators */}
                  {isRecording && (
                    <span className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-emerald-500 text-[9px] font-extrabold text-slate-850 dark:text-white animate-bounce tracking-wide uppercase">
                      Speaking
                    </span>
                  )}
                </div>

                <div className="mt-4 text-center z-10 space-y-1">
                  <h4 className="text-xs font-extrabold text-slate-500 dark:text-slate-400 block uppercase tracking-widest">HireAI Evaluation Agent</h4>
                  <p className="text-sm font-bold text-slate-850 dark:text-white max-w-md mt-2 leading-relaxed">
                    "{questions[currentQuestionIdx]}"
                  </p>
                </div>
              </div>

              {/* Response Workspace */}
              <div className="bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-3xl p-5 shadow-sm space-y-4">
                
                {/* Voice / Text Toggle */}
                <div className="flex justify-between items-center border-b border-slate-150 dark:border-slate-800/40 pb-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Your Answer Mode</span>
                  <div className="flex gap-1.5 p-0.5 bg-slate-50 dark:bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
                    <button
                      onClick={() => setIsVoiceMode(true)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all active:scale-95 ${
                        isVoiceMode 
                          ? 'bg-blue-600 text-white' 
                          : 'text-slate-500 dark:text-slate-400 hover:text-white'
                      }`}
                    >
                      Voice Answer
                    </button>
                    <button
                      onClick={() => setIsVoiceMode(false)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all active:scale-95 ${
                        !isVoiceMode 
                          ? 'bg-blue-600 text-white' 
                          : 'text-slate-500 dark:text-slate-400 hover:text-white'
                      }`}
                    >
                      Text Editor
                    </button>
                  </div>
                </div>

                {isVoiceMode ? (
                  // Voice Mode controls
                  <div className="space-y-4 text-center py-4">
                    
                    {transcription && (
                      <div className="p-4 bg-slate-50 dark:bg-slate-100 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-800/60 rounded-2xl text-left">
                        <span className="text-[10px] text-blue-400 font-bold block uppercase tracking-wider mb-1">Live Transcription</span>
                        <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-semibold italic">
                          "{transcription}"
                        </p>
                      </div>
                    )}

                    <div className="flex flex-col items-center gap-3">
                      <button
                        onClick={handleVoiceToggle}
                        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-90 ${
                          isRecording 
                            ? 'bg-rose-500 hover:bg-rose-600 animate-pulse text-white shadow-rose-500/10' 
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/10'
                        }`}
                      >
                        {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                      </button>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        {isRecording ? 'Click mic button to Stop recording and submit' : 'Click mic button to Start recording and talk'}
                      </span>
                    </div>

                  </div>
                ) : (
                  // Text Answer Input
                  <div className="space-y-3">
                    <textarea
                      value={answerInput}
                      onChange={(e) => setAnswerInput(e.target.value)}
                      placeholder="Type your structured answer here..."
                      rows={5}
                      className="w-full text-xs p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800/60 rounded-2xl focus:border-blue-500 focus:outline-none font-semibold text-slate-700 dark:text-slate-200"
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleAnswerSubmit}
                    disabled={isVoiceMode ? !transcription : !answerInput}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-xs font-extrabold rounded-2xl transition-all shadow-md shadow-blue-600/10 flex items-center justify-center gap-2 active:scale-95"
                  >
                    <span>Submit & Next Question</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>

            {/* Right/Sidebar Column - Proctoring Feed, Webcam preview, indicators */}
            <div className="space-y-6">
              
              {/* Webcam Proctoring Widget */}
              <div className="bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-3xl p-5 shadow-sm relative overflow-hidden flex flex-col gap-4">
                <div className="relative w-full aspect-video rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center">
                  
                  {/* Mock Webcam active graphic */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                    <UserCheck className="w-12 h-12 text-slate-600 animate-pulse mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Webcam Proctor Feed Active</span>
                  </div>
                  
                  {/* Local preview video overlays */}
                  <div className="absolute bottom-2 right-2 w-1/4 aspect-video rounded-lg bg-slate-800/85 border border-slate-700/50 flex items-center justify-center">
                    <Smile className="w-4 h-4 text-blue-400" />
                  </div>
                  
                  {/* Face detection grid overlay mock */}
                  <div className="absolute inset-0 border border-emerald-500/20 pointer-events-none flex items-center justify-center">
                    <div className="w-1/2 h-2/3 border border-emerald-500/35 rounded-full border-dashed animate-pulse flex items-center justify-center">
                      <span className="text-[8px] text-emerald-400 font-extrabold uppercase">Face Logged</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-500 dark:text-slate-400">Mic Input Status</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5" /> Live Levels OK
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-2/3 transition-all duration-300 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Proctor Warnings / Status indicators */}
              <div className="bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-3xl p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-slate-850 dark:text-white uppercase tracking-wider mb-2 border-b border-slate-150 dark:border-slate-800/40 pb-2">Proctor Checks</h3>
                
                <div className="space-y-3 text-xs font-bold text-slate-600 dark:text-slate-350">
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-100 dark:bg-slate-900/40 rounded-xl border border-slate-150 dark:border-slate-800/60">
                    <span>Proctor Focus Monitoring</span>
                    <span className="text-emerald-500">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-100 dark:bg-slate-900/40 rounded-xl border border-slate-150 dark:border-slate-800/60">
                    <span>Copy-Paste Locks</span>
                    <span className="text-emerald-500">Enforced</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-100 dark:bg-slate-900/40 rounded-xl border border-slate-150 dark:border-slate-800/60">
                    <span>Violations Detected</span>
                    <span className="text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-lg">0</span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* ==========================================================================
           STEP 6: COMPLETION SCREEN
           ========================================================================== */}
        {step === 6 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-2xl mx-auto bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-3xl p-8 shadow-md text-center space-y-6"
          >
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-500/5">
              <CheckCircle2 className="w-8 h-8 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-850 dark:text-white">Interview Assessment Completed!</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold max-w-sm mx-auto">
                Thank you for completing your evaluation. Your responses, transcription logs, and webcam analytics are being processed by the AI evaluator model.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-100 dark:bg-slate-900/60 rounded-2xl border border-slate-150 dark:border-slate-800/60 max-w-md mx-auto text-left space-y-3.5">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">Next steps in processing:</h4>
              <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-2.5 font-semibold">
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-450 text-[10px]">1</div>
                  <span>Audio transcript analysis and keyword match: <strong>Completed</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-450 text-[10px]">2</div>
                  <span>Behavioral confidence & facial micro-expression mapping: <strong>Completed</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-450 text-[10px] animate-pulse">3</div>
                  <span>Generation of overall score report: <strong>In Progress (2-3m)</strong></span>
                </li>
              </ul>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setStep('list')}
                className="w-full max-w-xs py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-2xl transition-all shadow-md shadow-blue-600/10 active:scale-95"
              >
                Return to Interview List
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
};
