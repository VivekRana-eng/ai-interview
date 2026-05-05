'use client'

import { useState, useEffect } from 'react'
import { getMeritList, publishResults, getJobs } from '@/lib/api'
import { AdminShell } from '../../components/AdminShell'

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
      <div className="bg-white border border-[#e2e8f0] rounded-[10px] p-4 flex items-center gap-3">
        <span className="text-[13px] font-semibold text-[#0F2744]">Job:</span>
        <select
          value={selectedJobId}
          onChange={(e) => setSelectedJobId(e.target.value)}
          className="px-3 py-2 border-[1.5px] border-[#e2e8f0] rounded-lg text-[13px] text-[#0F2744] bg-[#f7f9fc] outline-none focus:border-[#0F2744] focus:bg-white cursor-pointer appearance-none pr-8 min-w-[280px]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%23718096' d='M5 7L1 3h8z'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
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
      <div className="bg-white border border-[#e2e8f0] rounded-[10px] overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-[#718096]">Loading...</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="bg-[#0F2744]">
                  {['Rank', 'Candidate', 'Screening', 'Interview', 'Final', 'Outcome'].map((h) => (
                    <th key={h} className="px-3.5 py-2.5 text-left text-[11px] font-semibold text-white/70 uppercase tracking-[0.06em]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {meritList.map((entry: any) => (
                  <tr key={entry.id} className="border-b border-[#e2e8f0] last:border-0 hover:bg-[#fafbfc] transition-colors">
                    <td className="px-3.5 py-3 text-[13px] font-bold text-[#0F2744] whitespace-nowrap tabular-nums">#{entry.rank}</td>
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      <div className="text-[13px] font-semibold text-[#0F2744]">{entry.candidate_name}</div>
                      <div className="text-[11px] text-[#718096]">{entry.email}</div>
                    </td>
                    <td className="px-3.5 py-3 text-[13px] text-[#4a5568] whitespace-nowrap tabular-nums">{entry.screening_score ?? '-'}</td>
                    <td className="px-3.5 py-3 text-[13px] text-[#4a5568] whitespace-nowrap tabular-nums">{entry.interview_score ?? '-'}</td>
                    <td className="px-3.5 py-3 text-[13px] font-bold text-[#0F2744] whitespace-nowrap tabular-nums">{entry.final_score}</td>
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        entry.outcome === 'selected' ? 'bg-[#e6f7f2] text-[#1D9E75]' :
                        entry.outcome === 'waitlisted' ? 'bg-[#fffbeb] text-[#d97706]' :
                        'bg-[#fef2f2] text-[#dc2626]'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
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
