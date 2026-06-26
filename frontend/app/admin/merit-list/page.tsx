'use client'
import * as tw from '@/lib/tailwindClasses'

import { useState, useEffect } from 'react'
import { getMeritList, publishResults, getJobs } from '@/lib/api'
import { AdminShell } from '../../components/AdminShell'
import {
  badgeBase,
  badgeDanger,
  badgeDot,
  badgeSuccess,
  badgeWarning,
  buttonPrimary,
  tableHeadCell,
  tableHeadRow,
  tableRow,
  tableShell,
} from '@/lib/tailwindClasses'

export default function AdminMeritListPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [selectedJobId, setSelectedJobId] = useState('')
  const [meritList, setMeritList] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [publishing, setPublishing] = useState(false)

  useEffect(() => {
    async function loadJobs() {
      try {
        const data = await getJobs()
        setJobs(data)
        if (data.length > 0) {
          setSelectedJobId(data[0].id)
        }
      } catch (err) {
        console.error('Failed to load jobs:', err)
      }
    }
    loadJobs()
  }, [])

  useEffect(() => {
    if (selectedJobId) {
      loadMeritList()
    }
  }, [selectedJobId])

  async function loadMeritList() {
    setLoading(true)
    try {
      const data = await getMeritList(selectedJobId)
      setMeritList(data)
    } catch (err) {
      console.error('Failed to load merit list:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handlePublish() {
    if (!confirm('Are you sure you want to publish results? This will send emails to all candidates.')) {
      return
    }

    setPublishing(true)
    try {
      await publishResults(selectedJobId)
      alert('Results published successfully!')
      await loadMeritList()
    } catch (err: any) {
      alert('Failed to publish results: ' + (err.message || 'Unknown error'))
    } finally {
      setPublishing(false)
    }
  }

  return (
    <AdminShell title="Merit List" subtitle="Ranked candidates by final score">
      {/* Job Selector */}
      <div className={tw.cardControls}>
        <span className={tw.textPrimary13}>Job:</span>
        <select
          value={selectedJobId}
          onChange={(e) => setSelectedJobId(e.target.value)}
          className={tw.selectMin280}
        >
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>{job.title}</option>
          ))}
        </select>
        <div className="flex-1"></div>
        <button
          onClick={handlePublish}
          disabled={publishing || meritList.length === 0}
          className="px-4 py-2 bg-[#1D9E75] text-white text-[13px] font-semibold rounded-lg hover:bg-[#1a8f69] transition-colors disabled:bg-[#e2e8f0] disabled:text-[#718096]"
        >
          {publishing ? 'Publishing...' : 'Publish Results'}
        </button>
      </div>

      {/* Merit List Table */}
      <div className={tableShell}>
        {loading ? (
          <div className="text-center py-12">
            <div className="text-[#718096]">Loading...</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className={tableHeadRow}>
                  {['Rank', 'Candidate', 'Screening', 'Interview', 'Final', 'Outcome'].map((h) => (
                    <th key={h} className={tableHeadCell}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {meritList.map((entry: any) => (
                  <tr key={entry.id} className={tableRow}>
                    <td className={tw.tableCellStrong}>#{entry.rank}</td>
                    <td className={tw.tableCell}>
                      <div className={tw.textPrimary13}>{entry.candidate_name}</div>
                      <div className={tw.textSecondary11}>{entry.email}</div>
                    </td>
                    <td className={tw.tableCellTextNums}>{entry.screening_score ?? '-'}</td>
                    <td className={tw.tableCellTextNums}>{entry.interview_score ?? '-'}</td>
                    <td className={tw.tableCellStrong}>{entry.final_score}</td>
                    <td className={tw.tableCell}>
                      <span className={`${badgeBase} ${
                        entry.outcome === 'selected' ? badgeSuccess :
                        entry.outcome === 'waitlisted' ? badgeWarning :
                        badgeDanger
                      }`}>
                        <span className={`${badgeDot} ${
                          entry.outcome === 'selected' ? 'bg-[#1D9E75]' :
                          entry.outcome === 'waitlisted' ? 'bg-[#d97706]' :
                          'bg-[#dc2626]'
                        }`}></span>
                        {entry.outcome}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && meritList.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[15px] text-[#718096]">No interviewed candidates found for this job.</p>
          </div>
        )}
      </div>
    </AdminShell>
  )
}
