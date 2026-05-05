'use client'

import { useState, useEffect } from 'react'
import { getApplications } from '@/lib/api'
import Link from 'next/link'
import { AdminShell } from '../../components/AdminShell'

function statusBadge(status: string) {
  const map: Record<string, { bg: string; color: string; dot: string }> = {
    selected: { bg: 'bg-[#e6f7f2]', color: 'text-[#1D9E75]', dot: 'bg-[#1D9E75]' },
    rejected: { bg: 'bg-[#fef2f2]', color: 'text-[#dc2626]', dot: 'bg-[#dc2626]' },
    shortlisted: { bg: 'bg-[#eff6ff]', color: 'text-[#2563eb]', dot: 'bg-[#2563eb]' },
    interviewed: { bg: 'bg-[#fffbeb]', color: 'text-[#d97706]', dot: 'bg-[#d97706]' },
    applied: { bg: 'bg-[#f7f9fc]', color: 'text-[#718096]', dot: 'bg-[#718096]' },
  }
  return map[status] || { bg: 'bg-[#f7f9fc]', color: 'text-[#718096]', dot: 'bg-[#718096]' }
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ status: '', minScore: '', maxScore: '' })

  useEffect(() => {
    async function loadApplications() {
      try {
        const data = await getApplications()
        setApplications(data)
      } catch (err) {
        console.error('Failed to load applications:', err)
      } finally {
        setLoading(false)
      }
    }
    loadApplications()
  }, [])

  const filteredApplications = applications.filter((app) => {
    if (filters.status && app.status !== filters.status) return false
    if (filters.minScore && app.final_score && app.final_score < parseFloat(filters.minScore)) return false
    if (filters.maxScore && app.final_score && app.final_score > parseFloat(filters.maxScore)) return false
    return true
  })

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    return (b.final_score || 0) - (a.final_score || 0)
  })

  if (loading) {
    return (
      <AdminShell title="Applications" subtitle="Review and manage candidates">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-[#718096]">Loading...</div>
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell title="Applications" subtitle="Review and manage candidates">
      {/* Controls */}
      <div className="bg-white border border-[#e2e8f0] rounded-[10px] p-3.5 flex items-center gap-2.5 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#718096]" width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4"/><path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
          <input type="text" placeholder="Search candidates..." className="w-full pl-8 pr-3 py-2 border-[1.5px] border-[#e2e8f0] rounded-lg text-[13px] text-[#0F2744] bg-[#f7f9fc] outline-none focus:border-[#0F2744] focus:bg-white transition-colors" />
        </div>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="px-2.5 py-2 border-[1.5px] border-[#e2e8f0] rounded-lg text-[13px] text-[#4a5568] bg-[#f7f9fc] outline-none focus:border-[#0F2744] focus:bg-white cursor-pointer appearance-none pr-7"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%23718096' d='M5 7L1 3h8z'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
        >
          <option value="">All Status</option>
          <option value="applied">Applied</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="interviewed">Interviewed</option>
          <option value="selected">Selected</option>
          <option value="rejected">Rejected</option>
        </select>
        <div className="flex items-center gap-2 text-[12px] text-[#718096] whitespace-nowrap">
          <span>Min:</span>
          <input type="number" value={filters.minScore} onChange={(e) => setFilters({ ...filters, minScore: e.target.value })} placeholder="0" className="w-14 px-2 py-1.5 border border-[#e2e8f0] rounded text-[13px] outline-none focus:border-[#0F2744]" />
          <span>Max:</span>
          <input type="number" value={filters.maxScore} onChange={(e) => setFilters({ ...filters, maxScore: e.target.value })} placeholder="100" className="w-14 px-2 py-1.5 border border-[#e2e8f0] rounded text-[13px] outline-none focus:border-[#0F2744]" />
        </div>
        <div className="flex-1"></div>
        <button className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0F2744] text-white text-[13px] font-semibold rounded-lg hover:bg-[#1a3a5c] transition-colors">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M8 3v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          Export
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e2e8f0] rounded-[10px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-[#0F2744]">
                {['Candidate', 'Job', 'Screening', 'Interview', 'Final', 'Status', ''].map((h) => (
                  <th key={h} className="px-3.5 py-2.5 text-left text-[11px] font-semibold text-white/70 uppercase tracking-[0.06em] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedApplications.map((app) => {
                const badge = statusBadge(app.status)
                return (
                  <tr
                    key={app.id}
                    className="border-b border-[#e2e8f0] last:border-0 hover:bg-[#fafbfc] transition-colors cursor-pointer"
                    onClick={() => window.location.href = `/admin/applications/${app.id}`}
                  >
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      <Link href={`/admin/applications/${app.id}`} className="text-[13px] font-semibold text-[#0F2744] hover:text-[#2563eb] transition-colors" onClick={(e) => e.stopPropagation()}>
                        {app.candidate_name}
                      </Link>
                      <div className="text-[11px] text-[#718096]">{app.email}</div>
                    </td>
                    <td className="px-3.5 py-3 text-[13px] text-[#4a5568] whitespace-nowrap">{app.job_profiles?.title || '-'}</td>
                    <td className="px-3.5 py-3 text-[13px] text-[#4a5568] whitespace-nowrap tabular-nums">{app.screening_score ?? '-'}</td>
                    <td className="px-3.5 py-3 text-[13px] text-[#4a5568] whitespace-nowrap tabular-nums">{app.interview_score ?? '-'}</td>
                    <td className="px-3.5 py-3 text-[13px] font-bold text-[#0F2744] whitespace-nowrap tabular-nums">{app.final_score ?? '-'}</td>
                    <td className="px-3.5 py-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${badge.bg} ${badge.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-3.5 py-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <Link href={`/admin/applications/${app.id}`} className="text-[13px] font-semibold text-[#2563eb] hover:text-[#1d4ed8]">View</Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {sortedApplications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[15px] text-[#718096]">No applications match your filters.</p>
          </div>
        )}
      </div>
    </AdminShell>
  )
}
