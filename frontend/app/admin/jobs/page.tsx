'use client'

import { useState, useEffect } from 'react'
import { getJobs } from '@/lib/api'
import Link from 'next/link'
import { AdminShell } from '../../components/AdminShell'

function formatDomain(domain: string) {
  const map: Record<string, string> = {
    artificial_intelligence: 'AI',
    software_development: 'Software',
    cybersecurity: 'Security',
    data_science: 'Data Science',
    cloud_computing: 'Cloud'
  }
  return map[domain] || domain
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadJobs() {
      try {
        const data = await getJobs()
        setJobs(data)
      } catch (err) {
        console.error('Failed to load jobs:', err)
      } finally {
        setLoading(false)
      }
    }
    loadJobs()
  }, [])

  if (loading) {
    return (
      <AdminShell title="Job Profiles" subtitle="Manage internship openings">
        <div className="flex-1 flex items-center justify-center text-[#718096]">Loading job profiles...</div>
      </AdminShell>
    )
  }

  return (
    <AdminShell title="Job Profiles" subtitle="Manage internship openings">
      <div className="flex items-center justify-between mb-1">
        <div></div>
        <Link
          href="/admin/jobs/create"
          className="px-4 py-2 bg-[#0F2744] text-white text-[13px] font-semibold rounded-lg hover:bg-[#1a3a5c] transition-colors"
        >
          + Create Job
        </Link>
      </div>

      <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-[#0F2744]">
                {['Title', 'Domain', 'Seats', 'Deadline', 'Status'].map((h) => (
                  <th key={h} className="px-3.5 py-2.5 text-left text-[11px] font-semibold text-white/70 uppercase tracking-[0.06em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-b border-[#e2e8f0] last:border-0 hover:bg-[#fafbfc] transition-colors">
                  <td className="px-3.5 py-3 text-[13px] font-semibold text-[#0F2744] whitespace-nowrap">{job.title}</td>
                  <td className="px-3.5 py-3 whitespace-nowrap">
                    <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded bg-[#eff6ff] text-[#2563eb]">
                      {formatDomain(job.domain)}
                    </span>
                  </td>
                  <td className="px-3.5 py-3 text-[13px] text-[#4a5568] whitespace-nowrap">{job.seats}</td>
                  <td className="px-3.5 py-3 text-[13px] text-[#4a5568] whitespace-nowrap">
                    {job.deadline ? new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Rolling'}
                  </td>
                  <td className="px-3.5 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      job.status === 'published' ? 'bg-[#e6f7f2] text-[#1D9E75]' : 'bg-[#f7f9fc] text-[#718096]'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${job.status === 'published' ? 'bg-[#1D9E75]' : 'bg-[#718096]'}`}></span>
                      {job.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  )
}
