'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { AdminShell } from '../../../components/AdminShell'

const componentMeta = [
  { key: 's_skill', label: 'Skills Match', max: 35, color: '#0F2744' },
  { key: 's_edu', label: 'Education', max: 25, color: '#2563eb' },
  { key: 's_exp', label: 'Experience', max: 20, color: '#1D9E75' },
  { key: 's_cert', label: 'Certifications', max: 10, color: '#7c3aed' },
  { key: 's_sop', label: 'SOP Quality', max: 10, color: '#d97706' },
]

function statusPill(status: string) {
  const map: Record<string, { bg: string; text: string }> = {
    selected: { bg: 'bg-[#f0fdf4]', text: 'text-[#16a34a]' },
    rejected: { bg: 'bg-[#fef2f2]', text: 'text-[#dc2626]' },
    shortlisted: { bg: 'bg-[#e6f7f2]', text: 'text-[#1D9E75]' },
    interviewed: { bg: 'bg-[#eff6ff]', text: 'text-[#2563eb]' },
    waitlisted: { bg: 'bg-[#fffbeb]', text: 'text-[#d97706]' },
  }
  return map[status] || { bg: 'bg-[#f7f9fc]', text: 'text-[#718096]' }
}

function scoreBadgeClass(score: number) {
  if (score >= 8) return 'text-[#1D9E75] bg-[#e6f7f2]'
  if (score >= 6) return 'text-[#2563eb] bg-[#eff6ff]'
  return 'text-[#dc2626] bg-[#fef2f2]'
}

function rationaleForScore(score: number) {
  if (score >= 9) return 'Excellent — precise, thorough, and demonstrated advanced understanding.'
  if (score >= 8) return 'Strong answer demonstrating practical experience and clear reasoning.'
  if (score >= 7) return 'Good conceptual knowledge with relevant examples provided.'
  if (score >= 6) return 'Adequate understanding but lacks depth in implementation details.'
  return 'Basic understanding; answer lacks depth and specific examples.'
}

export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const [application, setApplication] = useState<any>(null)
  const [interviewAnswers, setInterviewAnswers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusMenuOpen, setStatusMenuOpen] = useState(false)
  const [resumeUrl, setResumeUrl] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const { data: appData } = await supabase.from('applications').select('*, job_profiles(*)').eq('id', params.id).single()
        setApplication(appData)
        const { data: answersData } = await supabase.from('interview_answers').select('*').eq('application_id', params.id).order('question_number')
        setInterviewAnswers(answersData || [])
        if (appData?.resume_url) {
          const { data: signed } = await supabase.storage.from('resumes').createSignedUrl(appData.resume_url, 3600)
          if (signed?.signedUrl) setResumeUrl(signed.signedUrl)
        }
      } catch (err) {
        console.error('Failed to load application:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [params.id])

  async function updateStatus(newStatus: string) {
    const { error } = await supabase.from('applications').update({ status: newStatus }).eq('id', params.id)
    if (!error) {
      setApplication({ ...application, status: newStatus })
      await supabase.from('audit_log').insert({
        entity_type: 'application', entity_id: params.id,
        from_status: application.status, to_status: newStatus,
        actor: 'admin', timestamp: new Date().toISOString()
      })
    }
    setStatusMenuOpen(false)
  }

  if (loading) {
    return (
      <AdminShell title="Candidate Review">
        <div className="flex-1 flex items-center justify-center text-[#718096]">Loading candidate profile...</div>
      </AdminShell>
    )
  }
  if (!application) {
    return (
      <AdminShell title="Candidate Review">
        <div className="flex-1 flex items-center justify-center text-[#718096]">Application not found</div>
      </AdminShell>
    )
  }

  const components = application.screening_components || {}
  const pill = statusPill(application.status)
  const initials = application.candidate_name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
  const avgInterview = interviewAnswers.length
    ? (interviewAnswers.reduce((s, a) => s + a.mock_score, 0) / interviewAnswers.length).toFixed(1)
    : null

  return (
    <AdminShell title={application.candidate_name} subtitle={`${application.email} · ${application.job_profiles?.title || 'Unknown Job'}`}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[13px] text-[#718096] mb-1">
        <Link href="/admin/applications" className="hover:text-[#0F2744] transition-colors">Applications</Link>
        <span className="text-[#e2e8f0]">›</span>
        <span className="text-[#0F2744] font-semibold">{application.candidate_name}</span>
      </div>

      {/* Candidate Header */}
      <div className="bg-white border border-[#e2e8f0] rounded-[10px] p-[18px_22px] flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3.5">
          <div className="w-[46px] h-[46px] rounded-full bg-[#0F2744] text-white flex items-center justify-center text-[15px] font-bold flex-shrink-0">{initials}</div>
          <div>
            <div className="text-[17px] font-bold text-[#0F2744] tracking-[-0.01em]">{application.candidate_name}</div>
            <div className="flex items-center gap-2.5 mt-[3px] flex-wrap">
              <span className="text-xs text-[#718096]">{application.email}</span>
              <span className="w-[3px] h-[3px] rounded-full bg-[#e2e8f0]"></span>
              <span className="text-xs text-[#4a5568] font-medium">{application.job_profiles?.title}</span>
              <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-[3px] rounded-full ${pill.bg} ${pill.text}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                {application.status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          {application.rank && (
            <div className="text-xs font-semibold text-[#718096] bg-[#f0f4f8] border border-[#e2e8f0] rounded-md px-3 py-1.5 whitespace-nowrap">
              Rank <strong className="text-[#0F2744]">#{application.rank}</strong>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button onClick={() => updateStatus('rejected')} className="px-4 py-2 bg-white text-[#dc2626] border border-[#fca5a5] rounded-md text-xs font-semibold hover:bg-[#fef2f2] transition-colors whitespace-nowrap">Reject</button>
            <button onClick={() => updateStatus('selected')} className="px-4 py-2 bg-[#1D9E75] text-white rounded-md text-xs font-semibold hover:bg-[#18896a] transition-colors whitespace-nowrap">✓ Select</button>
            <div className="relative">
              <button onClick={() => setStatusMenuOpen(!statusMenuOpen)} className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0F2744] text-white rounded-md text-[13px] font-semibold hover:bg-[#1a3a5c] transition-colors">
                Change Status
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M3 5l3 3 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
              {statusMenuOpen && (
                <div className="absolute right-0 top-[calc(100%+6px)] bg-white border border-[#e2e8f0] rounded-lg shadow-lg min-w-[160px] z-50 overflow-hidden">
                  {['shortlisted','interviewed','selected','waitlisted','rejected'].map((s) => (
                    <button key={s} onClick={() => updateStatus(s)} className="w-full text-left px-4 py-2.5 text-[13px] text-[#4a5568] hover:bg-[#f0f4f8] hover:text-[#0F2744] transition-colors capitalize">{s}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[30%_1fr_30%] gap-4 items-start">

        {/* LEFT: Score Breakdown */}
        <div className="bg-white border border-[#e2e8f0] rounded-[10px] overflow-hidden">
          <div className="px-[18px] py-[13px] border-b border-[#e2e8f0]">
            <div className="text-[13px] font-bold text-[#0F2744]">Score Breakdown</div>
            <div className="text-[11px] text-[#718096] mt-[1px]">AI-generated evaluation</div>
          </div>
          <div>
            {/* Total Score */}
            <div className="text-center py-4 pb-[18px] border-b border-[#e2e8f0] mb-[18px]">
              <div className="text-[40px] font-bold text-[#0F2744] leading-none tracking-[-0.03em]">{application.screening_score || 0}<span className="text-base font-medium text-[#718096]"> / 100</span></div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#718096] mt-1.5">Screening Score</div>
            </div>
            {/* Components */}
            <div className="px-[18px] pb-4 flex flex-col gap-3">
              {componentMeta.map((c) => {
                const val = components[c.key] || 0
                const pct = Math.min(100, Math.round((val / c.max) * 100))
                return (
                  <div key={c.key} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[#4a5568]">{c.label}</span>
                      <span className="text-xs font-bold text-[#0F2744] tabular-nums">{val} / {c.max}</span>
                    </div>
                    <div className="h-[6px] bg-[#f0f4f8] rounded-[3px] overflow-hidden">
                      <div className="h-full rounded-[3px] transition-[width] duration-700 ease-out" style={{ width: `${pct}%`, background: c.color }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
            {/* Secondary scores */}
            {(application.interview_score || application.final_score) && (
              <div className="mx-[18px] pt-4 border-t border-[#e2e8f0] flex flex-col gap-2 mb-4">
                {application.interview_score && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#718096] flex items-center gap-[5px]">
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><rect x="1" y="3" width="9" height="7" rx="1" stroke="currentColor" strokeWidth="1.3"/><path d="M10 6l3-2v6l-3-2V6z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>
                      Interview Score
                    </span>
                    <span className="text-sm font-bold text-[#1D9E75]">{application.interview_score} / 100</span>
                  </div>
                )}
                {application.final_score && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#718096] flex items-center gap-[5px]">
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M2 11V4l5-2 5 2v7l-5 2-5-2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>
                      Final Score
                    </span>
                    <span className="text-sm font-bold text-[#0F2744]">{application.final_score} / 100</span>
                  </div>
                )}
                <div className="text-[10px] text-[#718096] text-right mt-[2px]">Screening × 40% + Interview × 60%</div>
              </div>
            )}
            {application.rank && (
              <div className="mx-[18px] mb-[18px] flex items-center justify-center gap-[5px] bg-[#0F2744] text-white text-xs font-bold py-[5px] px-3 rounded-md">
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M7 1l1.5 4.5H13l-4 2.8 1.5 4.7L7 10.5 3.5 13l1.5-4.7L1 5.5h4.5L7 1z" fill="rgba(255,255,255,0.8)"/></svg>
                Rank #{application.rank}
              </div>
            )}
          </div>
        </div>

        {/* MIDDLE: Interview Transcript */}
        <div className="bg-white border border-[#e2e8f0] rounded-[10px] overflow-hidden flex flex-col">
          <div className="px-[18px] py-[13px] border-b border-[#e2e8f0] flex items-center justify-between">
            <div>
              <div className="text-[13px] font-bold text-[#0F2744]">Interview Transcript</div>
              <div className="text-[11px] text-[#718096] mt-[1px]">{application.job_profiles?.title} · {interviewAnswers.length} questions</div>
            </div>
            {avgInterview && (
              <span className="text-[11px] font-semibold text-[#1D9E75] bg-[#e6f7f2] px-[9px] py-[3px] rounded-full">Avg {avgInterview} / 10</span>
            )}
          </div>
          <div className="overflow-y-auto max-h-[520px]">
            {interviewAnswers.length === 0 ? (
              <div className="p-6 text-[13px] text-[#718096] text-center">No interview answers yet.</div>
            ) : (
              <div className="flex flex-col">
                {interviewAnswers.map((ans: any) => {
                  const isFast = ans.answer_time_seconds < 10
                  const isFlagged = ans.mock_score <= 5 || isFast
                  const scoreClass = scoreBadgeClass(ans.mock_score)
                  return (
                    <div key={ans.id} className={`px-[18px] py-[14px] border-b border-[#e2e8f0] last:border-0 ${isFlagged ? 'bg-[#fffbeb]' : ''}`}>
                      <div className="flex items-start justify-between gap-2.5 mb-2">
                        <div className="text-[13px] font-semibold text-[#0F2744] leading-relaxed flex-1">Q{ans.question_number}. {ans.question_text}</div>
                      </div>
                      <div className="text-xs text-[#4a5568] leading-relaxed mb-2.5 p-2.5 bg-[#f0f4f8] rounded-md border-l-[3px] border-[#e2e8f0]">{ans.answer_text}</div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-[3px] rounded-[5px] ${scoreClass}`}>{ans.mock_score} / 10</span>
                        <span className="text-[11px] text-[#718096] italic flex-1">{rationaleForScore(ans.mock_score)}</span>
                        <span className={`text-[11px] text-[#718096] flex items-center gap-1 whitespace-nowrap ${isFast ? 'text-[#d97706] font-semibold' : ''}`}>
                          <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M6 3.5v2.8l1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                          {ans.answer_time_seconds}s
                        </span>
                        {isFlagged && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#d97706] bg-[#fffbeb] border border-[#fde68a] px-[7px] py-[2px] rounded">
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 1l1.2 3.7H11L8 6.9l1.2 3.6L6 8.6l-3.2 1.9L4 6.9 1 4.7h3.8L6 1z" fill="#d97706"/></svg>
                            {ans.mock_score <= 5 ? 'Low score' : 'Fast response'}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Resume / Candidate Info */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-[#e2e8f0] rounded-[10px] overflow-hidden">
            <div className="px-[18px] py-[13px] border-b border-[#e2e8f0]">
              <div className="text-[13px] font-bold text-[#0F2744]">Candidate Profile</div>
            </div>
            <div className="p-4 flex flex-col gap-3.5">
              {/* Education */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#718096] mb-1.5">Education</div>
                <div className="text-xs font-semibold text-[#0F2744]">{application.degree || '—'}</div>
                <div className="text-[11px] text-[#718096]">{application.institution || '—'} · CGPA {application.cgpa || '—'}</div>
              </div>
              <div className="h-px bg-[#e2e8f0]"></div>
              {/* Experience */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#718096] mb-1.5">Experience</div>
                <div className="text-xs font-semibold text-[#0F2744]">{application.experience_months || 0} months</div>
                <div className="text-[11px] text-[#718096]">Relevant work / projects</div>
              </div>
              <div className="h-px bg-[#e2e8f0]"></div>
              {/* Skills */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#718096] mb-1.5">Certifications</div>
                <div className="flex flex-wrap gap-1">
                  {(application.certifications || []).map((cert: string) => (
                    <span key={cert} className="text-[11px] font-medium bg-[#eff6ff] text-[#0F2744] px-[9px] py-[3px] rounded">{cert}</span>
                  ))}
                  {(application.certifications || []).length === 0 && <span className="text-[11px] text-[#718096]">None listed</span>}
                </div>
              </div>
              <div className="h-px bg-[#e2e8f0]"></div>
              {/* SOP */}
              {application.sop_text && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#718096] mb-1.5">Statement of Purpose</div>
                  <p className="text-xs text-[#4a5568] leading-relaxed">{application.sop_text}</p>
                </div>
              )}
              <div className="h-px bg-[#e2e8f0]"></div>
              {/* Contact */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#718096] mb-1.5">Contact</div>
                <div className="text-xs text-[#4a5568]">{application.email}</div>
                <div className="text-xs text-[#4a5568]">{application.phone || '—'}</div>
              </div>
              {resumeUrl && (
                <>
                  <div className="h-px bg-[#e2e8f0]"></div>
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#2563eb] hover:text-[#1d4ed8] transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1v10M4 7l4 4 4-4M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    View Resume (PDF)
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Admin Notes */}
          <div className="bg-white border border-[#e2e8f0] rounded-[10px] overflow-hidden">
            <div className="px-[18px] py-[13px] border-b border-[#e2e8f0]">
              <div className="text-[13px] font-bold text-[#0F2744]">Admin Notes</div>
            </div>
            <div className="p-4 flex flex-col gap-2.5">
              <textarea
                className="w-full p-2.5 border border-[#e2e8f0] rounded-md text-[13px] text-[#0F2744] bg-[#f0f4f8] resize-y min-h-[90px] outline-none focus:border-[#0F2744] focus:bg-white transition-colors leading-relaxed"
                placeholder="Add notes about this candidate..."
                defaultValue={application.admin_notes || ''}
              />
              <button className="self-end px-4 py-2 bg-[#0F2744] text-white rounded-md text-xs font-semibold hover:bg-[#1a3a5c] transition-colors">Save Notes</button>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}

