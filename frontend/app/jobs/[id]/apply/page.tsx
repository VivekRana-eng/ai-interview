'use client'
import * as tw from '@/lib/tailwindClasses'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { getJob, submitApplication } from '@/lib/api'
import { Header } from '../../../components/Header'
import { Footer } from '../../../components/Footer'

function domainBadge(domain: string) {
  const map: Record<string, { label: string; color: string }> = {
    artificial_intelligence: { label: 'Artificial Intelligence', color: 'text-[#1D9E75]' },
    software_development: { label: 'Software Development', color: 'text-[#2563eb]' },
    cybersecurity: { label: 'Cybersecurity', color: 'text-[#dc2626]' },
    data_science: { label: 'Data Science', color: 'text-[#7c3aed]' },
    cloud_computing: { label: 'Cloud Computing', color: 'text-[#0e7490]' },
  }
  return map[domain] || { label: domain, color: 'text-[#4a5568]' }
}

export default function ApplyPage({ params }: { params: { id: string } }) {
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [statusToken, setStatusToken] = useState('')
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function loadJob() {
      try {
        const jobData = await getJob(params.id)
        setJob(jobData)
      } catch (err) {
        setError('Failed to load job details')
      } finally {
        setLoading(false)
      }
    }
    loadJob()
  }, [params.id])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const formData = new FormData(e.currentTarget)

    // Convert comma-separated certifications to JSON array
    const certsRaw = formData.get('certifications') as string
    const certsArray = certsRaw
      ? certsRaw.split(',').map(c => c.trim()).filter(c => c.length > 0)
      : []
    formData.set('certifications', JSON.stringify(certsArray))

    try {
      const result = await submitApplication(params.id, formData)
      if (result.success) {
        setSubmitted(true)
        setStatusToken(result.token)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit application')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className={tw.pageShellCentered}>
        <div className="text-[#718096]">Loading...</div>
      </div>
    )
  }

  if (error && !job) {
    return (
      <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center text-[#dc2626]">
        {error}
      </div>
    )
  }

  if (submitted) {
    return (
      <div className={tw.pageShellCentered}>
        <div className={tw.cardP8Centered}>
          <div className="w-14 h-14 bg-[#e6f7f2] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
              <path d="M3 8l3.5 3.5 6.5-7" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#0F2744] mb-2">Application Submitted!</h2>
          <p className="text-[14px] text-[#4a5568] mb-6">Your application has been received. You can track your status using the link below.</p>
          <Link
            href={`/status/${statusToken}`}
            className="inline-block w-full text-center py-3 bg-[#0F2744] text-white font-semibold text-sm rounded-lg hover:bg-[#1a3a5c] transition-colors"
          >
            Track Application Status
          </Link>
        </div>
      </div>
    )
  }

  const badge = domainBadge(job?.domain || '')

  return (
    <div className={tw.pageShell}>
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#e2e8f0]">
        <div className="max-w-[1200px] mx-auto px-6 h-11 flex items-center gap-2 text-[13px]">
          <Link href="/jobs" className="text-[#718096] hover:text-[#0F2744] transition-colors">Jobs</Link>
          <span className="text-[#e2e8f0]">›</span>
          <Link href={`/jobs/${params.id}`} className="text-[#718096] hover:text-[#0F2744] transition-colors">{job?.title}</Link>
          <span className="text-[#e2e8f0]">›</span>
          <span className="text-[#0F2744] font-medium">Apply</span>
        </div>
      </div>

      <main className="flex-1 max-w-[1200px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Section 1: Resume */}
            <div className={tw.cardOverflow}>
              <div className="px-6 py-[18px] border-b border-[#e2e8f0] flex items-center gap-2.5">
                <div className="w-[26px] h-[26px] bg-[#0F2744] rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0">1</div>
                <div className="text-[15px] font-bold text-[#0F2744]">Resume Upload</div>
              </div>
              <div className="p-6 flex flex-col gap-5">
                <label className={`relative block ${!fileName ? 'border-2 border-dashed border-[#e2e8f0] rounded-[10px] p-10 text-center cursor-pointer hover:border-[#1D9E75] hover:bg-[#e6f7f2] transition-colors' : ''}`}>
                  {/* Input always stays in DOM so FormData can find it */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    name="resume"
                    accept=".pdf"
                    required
                    className={fileName ? 'hidden' : 'absolute inset-0 opacity-0 cursor-pointer w-full h-full'}
                    onChange={(e) => { const f = e.target.files?.[0] || null; setFileName(f?.name || ''); setResumeFile(f) }}
                  />
                  {!fileName ? (
                    <>
                      <div className="w-12 h-12 bg-[#E8F4FD] rounded-[10px] flex items-center justify-center mx-auto mb-3.5">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M12 3v12M7 8l5-5 5 5" stroke="#0F2744" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="#0F2744" strokeWidth="1.8" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <div className="text-sm font-semibold text-[#0F2744] mb-1">Drop your resume here or <span className="text-[#1D9E75]">click to browse</span></div>
                      <div className={tw.textSecondary12}>PDF only · Max 5MB</div>
                    </>
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3.5 bg-[#e6f7f2] border border-[#6ee7c4] rounded-lg">
                      <div className="w-8 h-8 bg-[#1D9E75] rounded-full flex items-center justify-center flex-shrink-0">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M3 8l3.5 3.5 6.5-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-[#0F2744] flex-1">{fileName}</span>
                      <button type="button" onClick={(e) => { e.preventDefault(); setFileName(''); setResumeFile(null); if (fileInputRef.current) fileInputRef.current.value = '' }} className="text-xs text-[#dc2626] font-medium hover:underline">Remove</button>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Section 2: Your Details */}
            <div className={tw.cardOverflow}>
              <div className="px-6 py-[18px] border-b border-[#e2e8f0] flex items-center gap-2.5">
                <div className="w-[26px] h-[26px] bg-[#0F2744] rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0">2</div>
                <div className="text-[15px] font-bold text-[#0F2744]">Your Details</div>
              </div>
              <div className="p-6 flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={tw.flexColGap1_5}>
                    <label className={tw.textPrimary13}>Full Name <span className="text-[#dc2626] ml-0.5">*</span></label>
                    <input type="text" name="name" required placeholder="As on official documents" className={tw.inputBase} />
                  </div>
                  <div className={tw.flexColGap1_5}>
                    <label className={tw.textPrimary13}>Email Address <span className="text-[#dc2626] ml-0.5">*</span></label>
                    <input type="email" name="email" required placeholder="you@example.com" className={tw.inputBase} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={tw.flexColGap1_5}>
                    <label className={tw.textPrimary13}>Phone Number <span className="text-[#dc2626] ml-0.5">*</span></label>
                    <input type="tel" name="phone" required placeholder="+91 ..." className={tw.inputBase} />
                  </div>
                  <div className={tw.flexColGap1_5}>
                    <label className={tw.textPrimary13}>Institution <span className="text-[#dc2626] ml-0.5">*</span></label>
                    <input type="text" name="institution" required placeholder="University / College name" className={tw.inputBase} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={tw.flexColGap1_5}>
                    <label className={tw.textPrimary13}>Degree <span className="text-[#dc2626] ml-0.5">*</span></label>
                    <input type="text" name="degree" required placeholder="B.Tech, M.Tech, etc." className={tw.inputBase} />
                  </div>
                  <div className={tw.flexColGap1_5}>
                    <label className={tw.textPrimary13}>CGPA <span className="text-[#dc2626] ml-0.5">*</span></label>
                    <input type="number" name="cgpa" step="0.01" min="0" max="10" required placeholder="0.00 - 10.00" className={tw.inputBase} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={tw.flexColGap1_5}>
                    <label className={tw.textPrimary13}>Experience (months) <span className="text-[#dc2626] ml-0.5">*</span></label>
                    <input type="number" name="experience_months" min="0" required placeholder="0" className={tw.inputBase} />
                  </div>
                  <div className={tw.flexColGap1_5}>
                    <label className={tw.textPrimary13}>Certifications</label>
                    <input type="text" name="certifications" placeholder="e.g., AWS Certified, Google Cloud" className={tw.inputBase} />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: SOP */}
            <div className={tw.cardOverflow}>
              <div className="px-6 py-[18px] border-b border-[#e2e8f0] flex items-center gap-2.5">
                <div className="w-[26px] h-[26px] bg-[#0F2744] rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0">3</div>
                <div className="text-[15px] font-bold text-[#0F2744]">Statement of Purpose</div>
              </div>
              <div className="p-6 flex flex-col gap-5">
                <div className={tw.flexColGap1_5}>
                  <label className={tw.textPrimary13}>Why do you want this internship? <span className="text-[#dc2626] ml-0.5">*</span></label>
                  <textarea name="sop_text" required rows={6} placeholder="Tell us why you're interested in this position and what makes you a good fit..." className="px-3.5 py-2.5 border-[1.5px] border-[#e2e8f0] rounded-lg text-sm text-[#0F2744] bg-white outline-none focus:border-[#0F2744] focus:shadow-[0_0_0_3px_rgba(15,39,68,0.07)] transition-all resize-y min-h-[130px] leading-relaxed" />
                  <div className="flex items-center justify-between text-[11px] text-[#718096]">
                    <span>Min 50 words recommended</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className={tw.cardP6}>
              {error && <p className="text-[#dc2626] text-sm mb-4">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#0F2744] text-white font-semibold text-[15px] rounded-lg hover:bg-[#1a3a5c] active:scale-[0.99] transition-all tracking-[0.01em] flex items-center justify-center gap-2 disabled:bg-[#718096]"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
              <div className="mt-3 text-center text-xs text-[#718096] flex items-center justify-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 10.5a.75.75 0 110 1.5.75.75 0 010-1.5zM8 4.5a.75.75 0 00-.75.75v3a.75.75 0 001.5 0v-3A.75.75 0 008 4.5z" fill="currentColor"/></svg>
                Your data is processed securely for government recruitment
              </div>
            </div>
          </form>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <div className={tw.cardOverflowSticky}>
              <div className="bg-[#0F2744] p-5">
                <span className={`inline-flex items-center gap-[5px] text-[11px] font-semibold uppercase tracking-[0.04em] px-[9px] py-1 rounded-full bg-white ${badge.color} mb-2`}>
                  <span className="w-[5px] h-[5px] rounded-full bg-current"></span>
                  {badge.label}
                </span>
                <div className="text-lg font-bold text-white leading-tight">{job?.title}</div>
                <div className="text-[13px] text-white/60 mt-1">Ministry of Electronics & IT</div>
              </div>
              <div className="p-5 flex flex-col gap-3.5">
                <div className={tw.flexColGap1}>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#718096]">Deadline</div>
                  <div className="text-[13px] font-semibold text-[#dc2626]">{job?.deadline ? new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Rolling'}</div>
                </div>
                <div className={tw.divider}></div>
                <div className={tw.flexColGap1}>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#718096]">Seats</div>
                  <div className={tw.textPrimary13}>{job?.seats}</div>
                </div>
                <div className={tw.divider}></div>
                <div className={tw.flexColGap1}>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#718096]">Min CGPA</div>
                  <div className={tw.textPrimary13}>{job?.min_cgpa || 'Any'}</div>
                </div>
              </div>
            </div>

            <div className={tw.cardP5}>
              <div className="text-xs font-semibold text-[#718096] uppercase tracking-[0.05em] mb-3">Application Steps</div>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'Submit application', status: 'active' },
                  { label: 'AI screening', status: 'pending' },
                  { label: 'Interview', status: 'pending' },
                  { label: 'Final result', status: 'pending' },
                ].map((step, i) => (
                  <div key={step.label} className={`flex items-center gap-2.5 text-[13px] ${step.status === 'active' ? 'text-[#0F2744] font-semibold' : 'text-[#718096]'}`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${step.status === 'active' ? 'bg-[#0F2744] text-white' : 'border-2 border-[#e2e8f0]'}`}>
                      {i + 1}
                    </div>
                    {step.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
