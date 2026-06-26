import Link from 'next/link'
import { getJobs } from '@/lib/api'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import {
  badgeBase,
  badgeChip,
  badgeDot,
  badgeInfo,
  pageShell,
  pageContainer,
  tableShell,
} from '@/lib/tailwindClasses'

function domainBadge(domain: string) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    artificial_intelligence: { label: 'Artificial Intelligence', color: 'text-[#1D9E75]', bg: 'bg-[#e6f7f2]' },
    software_development: { label: 'Software Development', color: 'text-[#2563eb]', bg: 'bg-[#eff6ff]' },
    cybersecurity: { label: 'Cybersecurity', color: 'text-[#dc2626]', bg: 'bg-[#fef2f2]' },
    data_science: { label: 'Data Science', color: 'text-[#7c3aed]', bg: 'bg-[#f5f3ff]' },
    cloud_computing: { label: 'Cloud Computing', color: 'text-[#0e7490]', bg: 'bg-[#ecfeff]' },
  }
  const d = map[domain] || { label: domain, color: 'text-[#4a5568]', bg: 'bg-[#f7f9fc]' }
  return d
}

export default async function JobsPage() {
  const jobs = await getJobs()

  return (
    <div className={pageShell}>
      <Header />

      {/* Hero */}
      <section className="bg-[#0F2744] px-6 pt-14 pb-12">
        <div className="max-w-[720px] mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#1D9E75] mb-4">
            <span className="w-1.5 h-1.5 bg-[#1D9E75] rounded-full inline-block"></span>
            AI-Evaluated Internships
          </div>
          <h1 className="text-[clamp(28px,5vw,44px)] font-bold text-white tracking-[-0.02em] mb-3 leading-[1.15]">
            Find Your Internship
          </h1>
          <p className="text-[15px] text-white/65 mb-8 leading-relaxed">
            AI-evaluated selection across Software Development, Artificial Intelligence,<br className="hidden sm:block"/>
            Cybersecurity and more across government organisations.
          </p>
        </div>
      </section>

      <main className="flex-1">
        {/* Results bar */}
        <div className={pageContainer + ' mt-8 mb-5 flex items-center justify-between'}>
          <div className="text-[13px] text-[#718096]">
            <strong className="text-[#0F2744] font-semibold">{jobs.length}</strong> internships available
          </div>
        </div>

        {/* Grid */}
        <div className={pageContainer + ' pb-16'}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job) => {
              const badge = domainBadge(job.domain)
              return (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="bg-white border border-[#e2e8f0] rounded-[10px] p-[22px] flex flex-col gap-3.5 transition-transform transition-shadow hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(15,39,68,0.09)] hover:border-[#c8d6e5]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={`inline-flex items-center gap-[5px] text-[11px] font-semibold uppercase tracking-[0.04em] px-[9px] py-1 rounded-full ${badge.color} ${badge.bg}`}>
                      <span className="w-[5px] h-[5px] rounded-full bg-current"></span>
                      {badge.label}
                    </span>
                    <span className="text-xs text-[#718096] bg-[#f7f9fc] border border-[#e2e8f0] rounded px-2 py-[3px] whitespace-nowrap">
                      {job.seats} seats
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-[#0F2744] leading-[1.3] tracking-[-0.01em]">{job.title}</h2>
                  <div className="flex items-center gap-1.5 text-[13px] text-[#4a5568] font-medium">
                    <span className="inline-block w-3.5 h-3.5 bg-[#f7f9fc] border border-[#e2e8f0] rounded-[3px] flex-shrink-0"></span>
                    Ministry of Electronics & IT
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-[5px] text-xs text-[#718096]">
                      <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M5 1v4M11 1v4M2 7h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                      Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Rolling'}
                    </div>
                  </div>
                  <div className="text-xs text-[#718096] leading-relaxed border-t border-[#e2e8f0] pt-3">
                    <strong className="text-[#4a5568] font-medium">Screening:</strong> AI profile evaluation + timed interview
                  </div>
                  <span className="mt-auto w-full text-center py-2.5 border-[1.5px] border-[#0F2744] rounded-[7px] text-[13px] font-semibold text-[#0F2744] hover:bg-[#0F2744] hover:text-white transition-colors tracking-[0.01em]">
                    View & Apply
                  </span>
                </Link>
              )
            })}
          </div>

          {jobs.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[15px] text-[#718096]">No internships match your search.</p>
              <p className="text-[13px] text-[#a0aec0] mt-1">Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
