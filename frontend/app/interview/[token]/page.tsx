'use client'
import * as tw from '@/lib/tailwindClasses'

import { useState, useEffect, useRef } from 'react'
import { startInterview, submitAnswer } from '@/lib/api'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function InterviewPage({ params }: { params: { token: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [session, setSession] = useState<any>(null)
  const [answer, setAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(90 * 60) // 90 minutes in seconds
  const [answerStartTime, setAnswerStartTime] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!completed) return
    const t = setTimeout(() => router.push(`/status/${params.token}`), 3000)
    return () => clearTimeout(t)
  }, [completed, router, params.token])

  useEffect(() => {
    async function loadInterview() {
      try {
        const sessionData = await startInterview(params.token)
        setSession(sessionData)
        setAnswerStartTime(Date.now())
      } catch (err: any) {
        setError(err.message || 'Invalid or expired interview token')
      } finally {
        setLoading(false)
      }
    }

    loadInterview()

    // Prevent back navigation
    window.history.pushState(null, '', window.location.href)
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href)
    }
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [params.token])

  useEffect(() => {
    if (timeRemaining <= 0) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getTimerColor = () => {
    if (timeRemaining <= 180) return 'text-red-600' // < 3 min
    if (timeRemaining <= 600) return 'text-yellow-600' // < 10 min
    return 'text-gray-900'
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!answer.trim()) return

    setSubmitting(true)
    const answerTimeSeconds = Math.floor((Date.now() - answerStartTime) / 1000)

    try {
      const result = await submitAnswer(
        params.token,
        session.applicationId,
        session.questionNumber,
        session.question,
        answer,
        answerTimeSeconds,
      )

      if (result.isComplete) {
        setCompleted(true)
      } else {
        setSession({
          ...session,
          question: result.nextQuestion,
          questionNumber: result.nextQuestionNumber,
        })
        setAnswer('')
        setAnswerStartTime(Date.now())
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit answer')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading interview...</div>
  }

  if (error) {
    return (
      <div className={tw.pageShellCentered}>
        <div className={tw.cardP8Centered}>
          <div className="w-16 h-16 bg-[#fef2f2] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#0F2744] mb-2">Interview Unavailable</h2>
          <p className="text-[#4a5568] mb-6">{error}</p>
          <Link
            href={`/status/${params.token}`}
            className="inline-block w-full text-center py-3 bg-[#0F2744] text-white font-semibold text-sm rounded-lg hover:bg-[#1a3a5c] transition-colors"
          >
            Check Application Status
          </Link>
        </div>
      </div>
    )
  }

  if (completed) {
    return (
      <div className={tw.pageShellCentered}>
        <div className={tw.cardP8Centered}>
          <div className="w-16 h-16 bg-[#e6f7f2] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 16 16" fill="none">
              <path d="M3 8l3.5 3.5 6.5-7" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#0F2744] mb-2">Interview Completed!</h2>
          <p className="text-[#4a5568] mb-6">Thank you for your time. Your responses have been submitted for evaluation.</p>
          <Link
            href={`/status/${params.token}`}
            className="inline-block w-full text-center py-3 bg-[#0F2744] text-white font-semibold text-sm rounded-lg hover:bg-[#1a3a5c] transition-colors"
          >
            View Your Status
          </Link>
          <p className="text-[11px] text-[#718096] mt-3">Redirecting in 3 seconds...</p>
        </div>
      </div>
    )
  }

  const timerStyle = timeRemaining <= 180 ? 'text-[#dc2626] bg-[#fef2f2] border-[#fca5a5] animate-[tick_1s_steps(1)_infinite]' :
    timeRemaining <= 600 ? 'text-[#d97706] bg-[#fffbeb] border-[#fde68a]' :
    'text-[#0F2744] bg-[#f7f9fc] border-[#e2e8f0]'

  return (
    <div className="h-screen bg-[#f7f9fc] flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="bg-white border-b border-[#e2e8f0] z-50 flex-shrink-0">
        <div className="h-14 grid grid-cols-[1fr_auto_1fr] items-center px-6 gap-4">
          <div className={tw.flexItemsGap2_5}>
            <div className="w-[30px] h-[30px] bg-[#0F2744] rounded-[5px] flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 22 22" fill="none" className={tw.iconMd}>
                <rect x="3" y="3" width="7" height="7" rx="1.5" fill="white" opacity="0.9"/>
                <rect x="12" y="3" width="7" height="7" rx="1.5" fill="white" opacity="0.5"/>
                <rect x="3" y="12" width="7" height="7" rx="1.5" fill="white" opacity="0.5"/>
                <rect x="12" y="12" width="7" height="7" rx="1.5" fill="#1D9E75"/>
              </svg>
            </div>
            <div>
              <div className={tw.textPrimary13}>SelectAI Interview</div>
              <div className="text-[10px] text-[#718096]">Govt. of India</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-[13px] font-semibold text-[#0F2744] whitespace-nowrap">
            <div className="flex gap-1">
              {Array.from({ length: session.totalQuestions || 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i < (session.questionNumber - 1) ? 'bg-[#1D9E75]' :
                    i === (session.questionNumber - 1) ? 'bg-[#0F2744]' :
                    'bg-[#e2e8f0]'
                  }`}
                />
              ))}
            </div>
            <span className="text-[#718096] text-xs">Q{session.questionNumber}/{session.totalQuestions || 5}</span>
          </div>

          <div className="flex justify-end">
            <div className={`inline-flex items-center gap-1.5 text-sm font-bold tabular-nums border rounded-lg px-3 py-1 ${timerStyle}`}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4"/><path d="M8 5v3.5l2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
              {formatTime(timeRemaining)}
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-[3px] bg-[#e2e8f0]">
          <div className="h-full bg-[#1D9E75] transition-[width] duration-[600ms] ease-out"
            style={{ width: `${((session.questionNumber) / (session.totalQuestions || 5)) * 100}%` }}
          />
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-6 py-7">
        <div className="max-w-[720px] mx-auto flex flex-col gap-5">
          {/* AI Question */}
          <div className="flex flex-col gap-1 animate-[fadeSlideIn_0.4s_ease_both]">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.05em] text-[#718096] mb-1">
              <div className="w-[18px] h-[18px] bg-[#0F2744] rounded flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><rect x="2" y="2" width="3" height="3" rx="0.5" fill="white" opacity="0.9"/><rect x="5.5" y="2" width="3" height="3" rx="0.5" fill="white" opacity="0.5"/><rect x="2" y="5.5" width="3" height="3" rx="0.5" fill="white" opacity="0.5"/><rect x="5.5" y="5.5" width="3" height="3" rx="0.5" fill="#1D9E75"/></svg>
              </div>
              AI Interviewer
            </div>
            <div className="bg-[#f1f5f9] rounded-xl rounded-bl-[4px] p-4 text-sm leading-relaxed text-[#0F2744] max-w-[90%]">
              {session.question}
            </div>
          </div>

          {/* User answer preview */}
          {answer && (
            <div className="flex flex-col gap-1 self-end max-w-[88%]">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.05em] text-[#718096] mb-1 self-end">
                You
                <div className="w-[18px] h-[18px] bg-[#1D9E75] rounded-full flex items-center justify-center text-[9px] font-bold text-white">Y</div>
              </div>
              <div className="bg-white border border-[#e2e8f0] rounded-xl rounded-br-[4px] p-4 text-sm leading-relaxed text-[#0F2744]">
                {answer}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="bg-white border-t border-[#e2e8f0] p-4 flex-shrink-0">
        <div className="max-w-[720px] mx-auto">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {error && <p className="text-[#dc2626] text-xs">{error}</p>}
            <div className="flex gap-3">
              <textarea
                ref={textareaRef}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onPaste={handlePaste}
                rows={3}
                className="flex-1 px-4 py-3 border border-[#e2e8f0] rounded-xl text-sm text-[#0F2744] bg-white outline-none focus:border-[#0F2744] resize-none leading-relaxed"
                placeholder="Type your answer here..."
                disabled={submitting}
              />
              <button
                type="submit"
                disabled={submitting || !answer.trim()}
                className="px-5 bg-[#0F2744] text-white font-semibold text-sm rounded-xl hover:bg-[#1a3a5c] disabled:bg-[#e2e8f0] disabled:text-[#718096] transition-colors flex items-center gap-2 self-end h-10"
              >
                {submitting ? '...' : (
                  <>
                    <span>Submit</span>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </>
                )}
              </button>
            </div>
            <div className="flex justify-between text-[11px] text-[#718096]">
              <span>{answer.split(/\s+/).filter((w) => w.length > 0).length} words</span>
              <span>Paste is disabled for integrity</span>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes tick {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}
