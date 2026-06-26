'use client'
import * as tw from '@/lib/tailwindClasses'

import { useState, useEffect } from 'react'
import { getJobs } from '@/lib/api'
import Link from 'next/link'
import { AdminShell } from '../../components/AdminShell'
import {
  badgeDot,
  badgeInfo,
  badgeSuccess,
  badgeNeutral,
  badgeBase,
  buttonPrimary,
  tableCell,
  tableCellText,
  tableHeadCell,
  tableHeadRow,
  tableRow,
  tableShell,
} from '@/lib/tailwindClasses'

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
          className={`${buttonPrimary} px-4 py-2 text-[13px]`}
        >
          + Create Job
        </Link>
      </div>

      <div className={tableShell}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className={tableHeadRow}>
                {['Title', 'Domain', 'Seats', 'Deadline', 'Status'].map((h) => (
                  <th key={h} className={tableHeadCell}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className={tableRow}>
                  <td className="px-3.5 py-3 text-[13px] font-semibold text-[#0F2744] whitespace-nowrap">{job.title}</td>
                  <td className={tw.tableCell}>
                    <span className={`${badgeBase} ${badgeInfo} rounded`}>
                      {formatDomain(job.domain)}
                    </span>
                  </td>
                  <td className={tableCellText}>{job.seats}</td>
                  <td className={tableCellText}>
                    {job.deadline ? new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Rolling'}
                  </td>
                  <td className={tw.tableCell}>
                    <span className={`${badgeBase} ${job.status === 'published' ? badgeSuccess : badgeNeutral}`}>
                      <span className={`${badgeDot} ${job.status === 'published' ? 'bg-[#1D9E75]' : 'bg-[#718096]'}`}></span>
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
