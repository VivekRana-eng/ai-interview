'use client'
import * as tw from '@/lib/tailwindClasses'

import { useState, useEffect } from 'react'
import { getApplications } from '@/lib/api'
import Link from 'next/link'
import { AdminShell } from '../../components/AdminShell'
import {
  badgeBase,
  badgeDanger,
  badgeDot,
  badgeInfo,
  badgeNeutral,
  badgeSuccess,
  badgeWarning,
  buttonPrimary,
  inputBaseSoft,
  inputSmall,
  selectSoft,
  tableHeadCell,
  tableHeadRow,
  tableRow,
  tableShell,
} from '@/lib/tailwindClasses'

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
  const [searchQuery, setSearchQuery] = useState('')

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
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const matchesName = app.candidate_name?.toLowerCase().includes(q)
      const matchesEmail = app.email?.toLowerCase().includes(q)
      if (!matchesName && !matchesEmail) return false
    }
    return true
  })

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    return (b.final_score || 0) - (a.final_score || 0)
  })

  function handleExportCSV() {
    if (sortedApplications.length === 0) {
      alert('No data to export')
      return
    }
    const headers = ['Candidate Name', 'Email', 'Job Title', 'Screening Score', 'Interview Score', 'Final Score', 'Status']
    const rows = sortedApplications.map(app => [
      app.candidate_name,
      app.email,
      app.job_profiles?.title || '',
      app.screening_score ?? '',
      app.interview_score ?? '',
      app.final_score ?? '',
      app.status
    ])
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `applications_export_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

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
      <div className={tw.cardControls}>
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#718096]" width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4"/><path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
          <input 
            type="text" 
            placeholder="Search candidates..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${inputBaseSoft} w-full pl-8 pr-3 py-2 text-[13px]`} 
          />
        </div>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className={selectSoft}
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
          <input type="number" value={filters.minScore} onChange={(e) => setFilters({ ...filters, minScore: e.target.value })} placeholder="0" className={`${inputSmall} w-14 text-[13px]`} />
          <span>Max:</span>
          <input type="number" value={filters.maxScore} onChange={(e) => setFilters({ ...filters, maxScore: e.target.value })} placeholder="100" className={`${inputSmall} w-14 text-[13px]`} />
        </div>
        <div className="flex-1"></div>
        <button 
          onClick={handleExportCSV}
          className={`${buttonPrimary} flex items-center gap-1.5 px-3.5 py-2 text-[13px]`}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M8 3v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          Export
        </button>
      </div>

      {/* Table */}
      <div className={tableShell}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className={tableHeadRow}>
                {['Candidate', 'Job', 'Screening', 'Interview', 'Final', 'Status', ''].map((h) => (
                  <th key={h} className={`${tableHeadCell} whitespace-nowrap`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedApplications.map((app) => {
                const badge = statusBadge(app.status)
                return (
                  <tr
                    key={app.id}
                    className={tableRow + ' cursor-pointer'}
                    onClick={() => window.location.href = `/admin/applications/${app.id}`}
                  >
                    <td className={tw.tableCell}>
                      <Link href={`/admin/applications/${app.id}`} className="text-[13px] font-semibold text-[#0F2744] hover:text-[#2563eb] transition-colors" onClick={(e) => e.stopPropagation()}>
                        {app.candidate_name}
                      </Link>
                      <div className={tw.textSecondary11}>{app.email}</div>
                    </td>
                    <td className={tw.tableCellText}>{app.job_profiles?.title || '-'}</td>
                    <td className={tw.tableCellTextNums}>{app.screening_score ?? '-'}</td>
                    <td className={tw.tableCellTextNums}>{app.interview_score ?? '-'}</td>
                    <td className={tw.tableCellStrong}>{app.final_score ?? '-'}</td>
                    <td className={tw.tableCell} onClick={(e) => e.stopPropagation()}>
                      <span className={`${badgeBase} ${badge.bg} ${badge.color}`}>
                        <span className={`${badgeDot} ${badge.dot}`}></span>
                        {app.status}
                      </span>
                    </td>
                    <td className={tw.tableCell} onClick={(e) => e.stopPropagation()}>
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
