import Link from 'next/link'
import { getJob } from '@/lib/api'
import { notFound } from 'next/navigation'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { badgeChip, pageShell, pageContainer } from '@/lib/tailwindClasses'
import * as tw from '@/lib/tailwindClasses'

function domainBadge(domain: string) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    artificial_intelligence: { label: 'Artificial Intelligence', color: 'text-[#1D9E75]', bg: 'bg-[#e6f7f2]' },
    software_development: { label: 'Software Development', color: 'text-[#2563eb]', bg: 'bg-[#eff6ff]' },
    cybersecurity: { label: 'Cybersecurity', color: 'text-[#dc2626]', bg: 'bg-[#fef2f2]' },
    data_science: { label: 'Data Science', color: 'text-[#7c3aed]', bg: 'bg-[#f5f3ff]' },
    cloud_computing: { label: 'Cloud Computing', color: 'text-[#0e7490]', bg: 'bg-[#ecfeff]' },
  }
  return map[domain] || { label: domain, color: 'text-[#4a5568]', bg: 'bg-[#f7f9fc]' }
}

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const job = await getJob(params.id)

  if (!job) {
    notFound()
  }

  const badge = domainBadge(job.domain)

  return (
    <div className={pageShell}>
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#e2e8f0]">
        <div className={pageContainer + ' h-11 flex items-center gap-2 text-[13px]'}>
          <Link href="/jobs" className="text-[#718096] hover:text-[#0F2744] transition-colors">Jobs</Link>
          <span className="text-[#e2e8f0]">›</span>
          <span className="text-[#0F2744] font-medium">{job.title}</span>
        </div>
      </div>

      <main className="flex-1 max-w-[1200px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
          {/* Main content */}
          <div className="flex flex-col gap-6">
            {/* Header card */}
            <div className={tw.cardOverflow}>
              <div className="bg-[#0F2744] p-6">
                <span className={`${badgeChip} bg-white ${badge.color} mb-3`}>
                  <span className="w-[5px] h-[5px] rounded-full bg-current"></span>
                  {badge.label}
                </span>
                <h1 className="text-[22px] font-bold text-white leading-tight">{job.title}</h1>
                <p className="text-[13px] text-white/60 mt-1">Ministry of Electronics & IT</p>
              </div>
              <div className="p-6">
                <h2 className="text-[15px] font-bold text-[#0F2744] mb-3">About the Role</h2>
                <p className="text-[14px] text-[#4a5568] leading-relaxed">{job.description}</p>

                <div className="mt-6 pt-6 border-t border-[#e2e8f0]">
                  <h3 className="text-[13px] font-bold text-[#0F2744] mb-3 uppercase tracking-[0.05em]">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.required_skills.map((skill: string) => (
                      <span key={skill} className="text-[11px] font-medium bg-[#E8F4FD] text-[#0F2744] px-[9px] py-[3px] rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[#e2e8f0]">
                  <h3 className="text-[13px] font-bold text-[#0F2744] mb-3 uppercase tracking-[0.05em]">Requirements</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#718096] mb-1">Min CGPA</div>
                      <div className={tw.textPrimary13}>{job.min_cgpa || 'Any'}</div>
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#718096] mb-1">Experience</div>
                      <div className={tw.textPrimary13}>{job.min_exp_months || 0} months min</div>
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#718096] mb-1">Seats</div>
                      <div className={tw.textPrimary13}>{job.seats} available</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <div className={tw.cardOverflowSticky}>
              <div className="bg-[#0F2744] p-5">
                <span className={`${badgeChip} bg-white ${badge.color} mb-2`}>
                  <span className="w-[5px] h-[5px] rounded-full bg-current"></span>
                  {badge.label}
                </span>
                <div className="text-lg font-bold text-white leading-tight">{job.title}</div>
                <div className="text-[13px] text-white/60 mt-1">Ministry of Electronics & IT</div>
              </div>
              <div className="p-5 flex flex-col gap-3.5">
                <div className={tw.flexColGap1}>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#718096]">Deadline</div>
                  <div className="text-[13px] font-semibold text-[#dc2626]">{job.deadline ? new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Rolling'}</div>
                </div>
                <div className={tw.divider}></div>
                <div className={tw.flexColGap1}>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#718096]">Duration</div>
                  <div className={tw.textPrimary13}>8-12 weeks</div>
                </div>
                <div className={tw.divider}></div>
                <div className={tw.flexColGap1}>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#718096]">Seats</div>
                  <div className={tw.textPrimary13}>{job.seats}</div>
                </div>
                <div className={tw.divider}></div>
                <div className="flex flex-wrap gap-1.5">
                  {job.required_skills.slice(0, 4).map((skill: string) => (
                    <span key={skill} className="text-[11px] font-medium bg-[#E8F4FD] text-[#0F2744] px-2 py-[3px] rounded">{skill}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className={tw.cardP5}>
              <div className="text-xs font-semibold text-[#718096] uppercase tracking-[0.05em] mb-3">Application Steps</div>
              <div className="flex flex-col gap-2">
                {['Submit application', 'AI screening', 'Interview', 'Final result'].map((step, i) => (
                  <div key={step} className="flex items-center gap-2.5 text-[13px] text-[#718096]">
                    <div className="w-5 h-5 rounded-full border-2 border-[#e2e8f0] flex items-center justify-center text-[10px] font-bold flex-shrink-0">{i + 1}</div>
                    {step}
                  </div>
                ))}
              </div>
            </div>

            <Link
              href={`/jobs/${job.id}/apply`}
              className="w-full py-3.5 bg-[#0F2744] text-white font-semibold text-sm rounded-lg hover:bg-[#1a3a5c] transition-colors text-center"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
