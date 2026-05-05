'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getStatus } from '@/lib/api'

const stageMeta = [
  { key: 'applied', label: 'Application Received' },
  { key: 'screened', label: 'Screening' },
  { key: 'interviewed', label: 'Interview' },
  { key: 'result', label: 'Final Result' },
]

function getStageDesc(stageKey: string, appStatus: string) {
  const map: Record<string, Record<string, string>> = {
    applied: { default: 'Your application has been submitted successfully.' },
    screened: { default: 'AI is evaluating your profile against job requirements.' },
    interviewed: {
      default: 'Complete the AI-moderated interview session.',
      interviewed: 'Interview completed. Results will be published soon.',
      selected: 'Interview completed. You have been selected!',
      waitlisted: 'Interview completed. You are on the waitlist.',
      rejected: 'Interview completed. Unfortunately, you were not selected.',
    },
    result: { default: 'Merit list published. Check your outcome.', interviewed: 'Results will be published soon.' },
  }
  return map[stageKey]?.[appStatus] || map[stageKey]?.default || ''
}

function mapStatusToStage(appStatus: string, hasInterviewScore: boolean) {
  if (appStatus === 'shortlisted') return 'screened'
  if (appStatus === 'interviewed') return 'result' // interview done, waiting for merit list
  if (appStatus === 'waitlisted') return 'result'
  if (appStatus === 'selected') return 'result'
  if (appStatus === 'rejected') return hasInterviewScore ? 'result' : 'screened'
  return appStatus
}

function getStageState(appStatus: string, stageKey: string, hasInterviewScore: boolean) {
  const order = ['applied', 'screened', 'interviewed', 'result']
  const mappedStatus = mapStatusToStage(appStatus, hasInterviewScore)
  const appIdx = order.indexOf(mappedStatus)
  const stageIdx = order.indexOf(stageKey)
  if (appIdx > stageIdx) return 'done'
  if (appIdx === stageIdx) return 'active'
  return 'pending'
}

export default function StatusPage({ params }: { params: { token: string } }) {
  const [application, setApplication] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchStatus() {
      try {
        const data = await getStatus(params.token)
        setApplication(data)
        setError('')
      } catch (err: any) {
        setError('Failed to load status. Invalid or expired token.')
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, 30000)
    return () => clearInterval(interval)
  }, [params.token])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center">
        <div className="text-[#718096]">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center text-[#dc2626]">
        {error}
      </div>
    )
  }

  const appStatus = application?.status || 'applied'
  const hasInterviewScore = !!application?.interview_score
  const currentStage = mapStatusToStage(appStatus, hasInterviewScore)

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      {/* Header */}
      <header className="bg-white border-t-[3px] border-t-[#0F2744] border-b border-[#e2e8f0]">
        <div className="max-w-[900px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 no-underline">
            <div className="w-10 h-10 bg-[#0F2744] rounded-md flex items-center justify-center">
              <svg viewBox="0 0 22 22" fill="none" className="w-[22px] h-[22px]">
                <rect x="3" y="3" width="7" height="7" rx="1.5" fill="white" opacity="0.9"/>
                <rect x="12" y="3" width="7" height="7" rx="1.5" fill="white" opacity="0.5"/>
                <rect x="3" y="12" width="7" height="7" rx="1.5" fill="white" opacity="0.5"/>
                <rect x="12" y="12" width="7" height="7" rx="1.5" fill="#1D9E75"/>
              </svg>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold text-[#0F2744] tracking-[0.01em]">SelectAI</span>
              <span className="text-[10px] text-[#718096] uppercase tracking-[0.03em]">Govt. of India</span>
            </div>
          </Link>
          <span className="text-[13px] text-[#718096]">Application Status</span>
        </div>
      </header>

      {/* Candidate Banner */}
      <div className="bg-[#0F2744] px-6 py-7">
        <div className="max-w-[900px] mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-white/50 uppercase tracking-[0.04em]">Candidate</span>
            <span className="text-[22px] font-bold text-white tracking-[-0.01em]">{application?.candidate_name || 'Applicant'}</span>
            <div className="inline-flex items-center gap-[7px] mt-1">
              <span className="inline-flex items-center gap-1 bg-white/10 border border-white/15 text-white/85 text-[11px] font-semibold px-2.5 py-[3px] rounded-full">
                {application?.job_profiles?.title || 'Internship Application'}
              </span>
            </div>
          </div>
          <div className="bg-white/[0.08] border border-white/10 rounded-lg px-4 py-3 text-right">
            <div className="text-[10px] font-semibold uppercase tracking-[0.07em] text-white/40 mb-[3px]">Application ID</div>
            <div className="text-[15px] font-bold text-white tabular-nums tracking-[0.04em]">{application?.id?.slice(0, 8).toUpperCase()}</div>
            <div className="text-[11px] text-white/40 mt-0.5">{application?.created_at ? new Date(application.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</div>
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="max-w-[900px] mx-auto px-6 py-9 flex flex-col gap-7">
        {/* Stepper */}
        <div className="bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden">
          {stageMeta.map((stage, i) => {
            const state = getStageState(currentStage, stage.key, hasInterviewScore)
            const isLast = i === stageMeta.length - 1
            return (
              <div key={stage.key} className={`grid grid-cols-[56px_1fr] relative ${state}`}>
                {!isLast && (
                  <div className={`absolute left-[27px] top-[56px] bottom-0 w-[2px] ${state === 'done' ? 'bg-[#a7f3d0]' : 'bg-[#e2e8f0]'}`}></div>
                )}
                <div className="flex flex-col items-center pt-[22px]">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 relative z-[1] ${
                    state === 'done' ? 'bg-[#1D9E75]' :
                    state === 'active' ? 'bg-[#2563eb] before:content-[""] before:absolute before:inset-[-5px] before:rounded-full before:border-2 before:border-[#2563eb] before:opacity-35 before:animate-[pulse-ring_1.8s_ease-out_infinite]' :
                    'bg-white border-2 border-[#e2e8f0]'
                  }`}>
                    {state === 'done' ? (
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5 6.5-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    ) : state === 'active' ? (
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3" fill="white"/></svg>
                    ) : (
                      <span className="text-[10px] font-bold text-[#718096]">{i + 1}</span>
                    )}
                  </div>
                </div>
                <div className={`py-5 pr-6 pl-1 ${!isLast ? 'border-b border-[#e2e8f0]' : ''}`}>
                  <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                    <h3 className={`text-[15px] font-semibold ${state === 'done' ? 'text-[#1D9E75]' : state === 'active' ? 'text-[#0F2744]' : 'text-[#94a3b8]'}`}>
                      {stage.label}
                    </h3>
                    {state === 'active' && (
                      <span className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#2563eb] bg-[#eff6ff] border border-[#bfdbfe] px-2 py-0.5 rounded-full">Current</span>
                    )}
                    {state === 'done' && (
                      <span className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#1D9E75] bg-[#e6f7f2] border border-[#a7f3d0] px-2 py-0.5 rounded-full">Completed</span>
                    )}
                  </div>
                  <p className={`text-[13px] leading-relaxed ${state === 'pending' ? 'text-[#94a3b8]' : 'text-[#4a5568]'}`}>
                    {getStageDesc(stage.key, appStatus)}
                  </p>

                  {/* Stage-specific content */}
                  {stage.key === 'screened' && application?.screening_score && (
                    <div className="mt-4 flex items-center gap-3 flex-wrap">
                      <div className="bg-[#f7f9fc] border border-[#e2e8f0] rounded-lg px-4 py-2.5">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#718096]">Screening Score</div>
                        <div className={`text-xl font-bold ${application.status === 'rejected' ? 'text-[#dc2626]' : 'text-[#1D9E75]'}`}>
                          {application.screening_score}<span className="text-sm font-normal text-[#718096]">/100</span>
                        </div>
                      </div>
                      {application.status === 'rejected' && (
                        <span className="text-[13px] text-[#dc2626]">Not shortlisted</span>
                      )}
                      {application.status === 'shortlisted' && (
                        <Link
                          href={`/interview/${application.session_token}`}
                          className="inline-flex items-center gap-2 bg-[#0F2744] text-white text-[13px] font-semibold px-4 py-2.5 rounded-lg hover:bg-[#1a3a5c] transition-colors"
                        >
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          Start Interview
                        </Link>
                      )}
                    </div>
                  )}

                  {stage.key === 'interviewed' && application?.interview_score && (
                    <div className="mt-4 bg-[#f7f9fc] border border-[#e2e8f0] rounded-lg px-4 py-2.5 inline-block">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#718096]">Interview Score</div>
                      <div className="text-xl font-bold text-[#1D9E75]">
                        {application.interview_score}<span className="text-sm font-normal text-[#718096]">/100</span>
                      </div>
                    </div>
                  )}

                  {stage.key === 'result' && ['selected', 'waitlisted', 'rejected'].includes(appStatus) && (
                    <div className="mt-4">
                      {appStatus === 'selected' && (
                        <div className="inline-flex items-center gap-2 bg-[#e6f7f2] border border-[#a7f3d0] rounded-lg px-4 py-3">
                          <div className="w-8 h-8 bg-[#1D9E75] rounded-full flex items-center justify-center">
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5 6.5-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </div>
                          <div>
                            <div className="text-[15px] font-bold text-[#0F2744]">Selected!</div>
                            <div className="text-[13px] text-[#4a5568]">Rank: {application?.rank}</div>
                          </div>
                        </div>
                      )}
                      {appStatus === 'waitlisted' && (
                        <div className="inline-flex items-center gap-2 bg-[#fffbeb] border border-[#fde68a] rounded-lg px-4 py-3">
                          <div className="text-[15px] font-bold text-[#d97706]">Waitlisted</div>
                          <div className="text-[13px] text-[#4a5568]">Rank: {application?.rank}</div>
                        </div>
                      )}
                      {appStatus === 'rejected' && (
                        <div className="inline-flex items-center gap-2 bg-[#fef2f2] border border-[#fca5a5] rounded-lg px-4 py-3">
                          <div className="text-[15px] font-bold text-[#dc2626]">Not Selected</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Refresh note */}
        <div className="text-center text-xs text-[#718096]">
          Last updated: {new Date().toLocaleTimeString()} · Auto-refreshes every 30s
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#e2e8f0] py-5 px-6">
        <div className="max-w-[900px] mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-xs text-[#718096]">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1D9E75] bg-[#e6f7f2] px-2 py-0.5 rounded-full">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4" stroke="#1D9E75" strokeWidth="1.2"/><circle cx="5" cy="5" r="1.5" fill="#1D9E75"/></svg>
              Powered by AI
            </span>
          </div>
          <div className="text-xs text-[#718096]">Government of India · © 2026 SelectAI</div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.35; }
          70% { transform: scale(1.4); opacity: 0; }
          100% { transform: scale(1.4); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
