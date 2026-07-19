'use client';

import React from 'react';
import { BrainCircuit, Award, Star, ThumbsUp, ThumbsDown, Lightbulb, Download } from 'lucide-react';

const getFeedbackData = (company: string, role: string) => {
  const normCompany = company.toLowerCase();
  
  if (normCompany.includes('google')) {
    return {
      scores: [
        { name: 'Overall Score', score: 92, desc: 'Top 5% of candidate pool' },
        { name: 'Technical Depth', score: 94, desc: 'Outstanding neural architecture explanation and CUDA thread utilization' },
        { name: 'Communication Pacing', score: 88, desc: 'Very articulate, well-structured layout description' },
        { name: 'Confidence & Tone', score: 90, desc: 'Stable sound level, low usage of filler words' },
        { name: 'Problem Solving Method', score: 95, desc: 'Excellent trade-off analysis of fine-tuning LLMs vs using RAG' },
        { name: 'Cultural Fit Score', score: 86, desc: 'Highly collaborative tone, receptive feedback indicators' }
      ],
      strengths: [
        "Expert level structure when explaining backpropagation optimization in deep networks.",
        "Clear articulation of memory footprint reductions during high-throughput inference.",
        "Excellent reasoning on when to build vs when to buy pre-trained LLM checkpoints."
      ],
      weaknesses: [
        "Missed explaining concrete latency metrics of cross-region edge inferences.",
        "Could elaborate more on data profiling strategies for fine-tuning sets."
      ],
      suggestions: [
        "Read latest Google Research publications on memory-efficient attention layers.",
        "Examine pipeline parallelism configurations for massive parameter models."
      ]
    };
  }

  if (normCompany.includes('stripe')) {
    return {
      scores: [
        { name: 'Overall Score', score: 88, desc: 'Strong candidate for senior positions' },
        { name: 'Technical Depth', score: 85, desc: 'Good grasp of React closures, custom hooks, and memoization hooks' },
        { name: 'Communication Pacing', score: 92, desc: 'Excellent empathy and clear business-aligned explanations' },
        { name: 'Confidence & Tone', score: 89, desc: 'Calm, authoritative demeanor throughout response' },
        { name: 'Problem Solving Method', score: 86, desc: 'Structured approach to micro-frontend layout rendering' },
        { name: 'Cultural Fit Score', score: 90, desc: 'Highly aligned with Stripe product engineering principles' }
      ],
      strengths: [
        "Great reasoning about dynamic regional payment checkouts with zero layout shifts.",
        "Solid handling of network drop scenarios and payment session local storage state.",
        "Outstanding user empathy when designing accessible layout hierarchies."
      ],
      weaknesses: [
        "Missed detailed security auditing steps for embedded third-party JS scripts.",
        "Could clarify backend database schema design for concurrent payment events."
      ],
      suggestions: [
        "Read Stripe's design engineering blog on dashboard visualization systems.",
        "Review state management patterns under slow network emulation profiles."
      ]
    };
  }

  if (normCompany.includes('vercel')) {
    return {
      scores: [
        { name: 'Overall Score', score: 95, desc: 'Exceptional technical profile' },
        { name: 'Technical Depth', score: 98, desc: 'Expert on Next.js render hooks, React concurrent features, and SSR' },
        { name: 'Communication Pacing', score: 90, desc: 'Clear, concise technical answers without rambling' },
        { name: 'Confidence & Tone', score: 92, desc: 'Extremely confident handling deep framework architecture questions' },
        { name: 'Problem Solving Method', score: 96, desc: 'Flawless step-by-step optimization of edge caching configurations' },
        { name: 'Cultural Fit Score', score: 90, desc: 'Strong team orientation with clear developer advocacy mindset' }
      ],
      strengths: [
        "Masterful breakdown of edge middleware routing and prefetching limits.",
        "Correct identification of React Server Components bundle splitting constraints.",
        "Clean description of viewport virtualization algorithms (60 FPS rendering)."
      ],
      weaknesses: [
        "Could expand on the exact security mechanisms of JSON Web Tokens inside client cookiestore.",
        "Minor slip in explaining CSS hydration overhead details."
      ],
      suggestions: [
        "Review security best practices for cross-origin resource sharing headers.",
        "Experiment with concurrent rendering boundaries under network throttling."
      ]
    };
  }

  if (normCompany.includes('github')) {
    return {
      scores: [
        { name: 'Overall Score', score: 86, desc: 'Solid developer advocate experience' },
        { name: 'Technical Depth', score: 84, desc: 'Strong frontend fundamentals, great custom component styling' },
        { name: 'Communication Pacing', score: 94, desc: 'Outstanding public presenter, very engaging speech flow' },
        { name: 'Confidence & Tone', score: 90, desc: 'Highly warm, positive, and conversational communication' },
        { name: 'Problem Solving Method', score: 82, desc: 'Good design patterns, could be more mathematically rigorous' },
        { name: 'Cultural Fit Score', score: 92, desc: 'Excellent mentor candidate, highly community-driven' }
      ],
      strengths: [
        "Exceptional technical storytelling and developer relations positioning.",
        "Clear and engaging explanation of design system accessibility guidelines.",
        "Strong understanding of community onboarding best practices."
      ],
      weaknesses: [
        "Could go deeper into client-side state synchronization protocols (e.g. WebSockets).",
        "Explain browser repaint profiles in more detail."
      ],
      suggestions: [
        "Check out GitHub's Primer Design System codebases for component architecture patterns.",
        "Build a demo of live collaborative coding templates using CRDT structures."
      ]
    };
  }

  return {
    scores: [
      { name: 'Overall Score', score: 90, desc: 'Excellent candidate profile' },
      { name: 'Technical Depth', score: 90, desc: 'Solid technical background and framework usage' },
      { name: 'Communication Pacing', score: 88, desc: 'Clear and well-paced discussion of the solution' },
      { name: 'Confidence & Tone', score: 91, desc: 'Confident presentation style, very articulate' },
      { name: 'Problem Solving Method', score: 90, desc: 'Correct step-by-step resolution of tasks' },
      { name: 'Cultural Fit Score', score: 90, desc: 'Collaborative, professional, and receptive team player' }
    ],
    strengths: [
      "Good comprehension of modern frontend design systems.",
      "Clear explanation of state scoping and component life cycle logic."
    ],
    weaknesses: [
      "Could elaborate slightly more on testing environments.",
      "Could detail security constraints in client environments."
    ],
    suggestions: [
      "Practice coding under tight layout constraints.",
      "Review edge runtime configurations."
    ]
  };
};

interface FeedbackTabProps {
  selectedItem?: {
    company: string;
    role: string;
    score: number;
    date: string;
  } | null;
}

export const FeedbackTab: React.FC<FeedbackTabProps> = ({ selectedItem }) => {
  const item = selectedItem || {
    company: 'Google',
    role: 'Staff UI Engineer',
    score: 92,
    date: '2026-07-12'
  };

  const details = getFeedbackData(item.company, item.role);

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div id="scorecard-print-area" className="space-y-6 text-left max-w-4xl mx-auto">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #scorecard-print-area, #scorecard-print-area * {
            visibility: visible;
          }
          #scorecard-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            padding: 24px !important;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      
      {/* Overview Header Card */}
      <div className="bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-3xl p-6 relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
        <div className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-blue-500/5 blur-2xl" />
        
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-450 shrink-0">
            <BrainCircuit className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-855 dark:text-white">AI Evaluation Scorecard</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">{item.company} &bull; {item.role} Evaluation Assessment</p>
          </div>
        </div>

        <button 
          onClick={handlePrintReport}
          className="no-print px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl transition-all shadow-md shadow-blue-600/10 flex items-center gap-1.5 active:scale-95 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF Report</span>
        </button>
      </div>

      {/* Grid of Scores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {details.scores.map((item) => (
          <div 
            key={item.name}
            className="bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-2xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-450 block uppercase tracking-wider">{item.name}</span>
              <span className="text-xs font-extrabold text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-lg">{item.score}/100</span>
            </div>
            
            <div className="mt-2.5">
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" 
                  style={{ width: `${item.score}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-450 leading-relaxed font-semibold mt-2.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Analysis (Strengths, Weaknesses, Suggestions) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Strengths */}
        <div className="bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-150 dark:border-slate-800/40 pb-2">
            <ThumbsUp className="w-4.5 h-4.5 text-emerald-450" />
            <h4 className="text-xs font-bold text-slate-855 dark:text-white uppercase tracking-wider">Key Strengths</h4>
          </div>
          <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-semibold list-disc pl-4">
            {details.strengths.map((str, i) => (
              <li key={i}>{str}</li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-150 dark:border-slate-800/40 pb-2">
            <ThumbsDown className="w-4.5 h-4.5 text-rose-455" />
            <h4 className="text-xs font-bold text-slate-855 dark:text-white uppercase tracking-wider">Growth Areas</h4>
          </div>
          <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-semibold list-disc pl-4">
            {details.weaknesses.map((weak, i) => (
              <li key={i}>{weak}</li>
            ))}
          </ul>
        </div>

        {/* AI Recommendations */}
        <div className="bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-150 dark:border-slate-800/40 pb-2">
            <Lightbulb className="w-4.5 h-4.5 text-amber-400" />
            <h4 className="text-xs font-bold text-slate-855 dark:text-white uppercase tracking-wider">AI Suggestions</h4>
          </div>
          <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-semibold list-disc pl-4">
            {details.suggestions.map((sug, i) => (
              <li key={i}>{sug}</li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  );
};
