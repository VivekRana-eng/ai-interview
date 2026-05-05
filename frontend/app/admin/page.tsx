'use client'

import { useState, useEffect } from 'react'
import { getApplications } from '@/lib/api'
import { supabase } from '@/lib/supabase'
import { AdminShell } from '../components/AdminShell'
import Link from 'next/link'

export default function AdminDashboard() {
  const [applications, setApplications] = useState<any[]>([])
  const [auditLogs, setAuditLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const apps = await getApplications()
        setApplications(apps)

        const { data: logs } = await supabase
          .from('audit_log')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(10)
        setAuditLogs(logs || [])
      } catch (err) {
        console.error('Dashboard load failed:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const totalApplications = applications.length
  const shortlisted = applications.filter((a: any) => a.status === 'shortlisted').length
  const interviewed = applications.filter((a: any) => a.status === 'interviewed').length
  const selected = applications.filter((a: any) => a.status === 'selected').length

  const kpiCards = [
    { label: 'Total Applications', value: totalApplications, color: 'text-[#0F2744]', bg: 'bg-white' },
    { label: 'Shortlisted', value: shortlisted, color: 'text-[#2563eb]', bg: 'bg-[#eff6ff] border-[#bfdbfe]' },
    { label: 'Interviewed', value: interviewed, color: 'text-[#d97706]', bg: 'bg-[#fffbeb] border-[#fde68a]' },
    { label: 'Selected', value: selected, color: 'text-[#1D9E75]', bg: 'bg-[#e6f7f2] border-[#a7f3d0]' },
  ]

  const funnel = [
    { label: 'Applied', count: totalApplications, barBg: 'bg-[#e2e8f0]', textColor: 'text-[#718096]' },
    { label: 'Shortlisted', count: shortlisted, barBg: 'bg-[#bfdbfe]', textColor: 'text-[#2563eb]' },
    { label: 'Interviewed', count: interviewed, barBg: 'bg-[#fde68a]', textColor: 'text-[#d97706]' },
    { label: 'Selected', count: selected, barBg: 'bg-[#a7f3d0]', textColor: 'text-[#1D9E75]' },
  ]

  if (loading) {
    return (
      <AdminShell title="Dashboard" subtitle="Overview of the selection pipeline">
        <div className="flex-1 flex items-center justify-center text-[#718096]">Loading dashboard...</div>
      </AdminShell>
    )
  }

  return (
    <AdminShell title="Dashboard" subtitle="Overview of the selection pipeline">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => (
          <div key={kpi.label} className={`bg-white border border-[#e2e8f0] rounded-xl p-5 ${kpi.bg !== 'bg-white' ? kpi.bg + ' border' : ''}`}>
            <div className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#718096] mb-2">{kpi.label}</div>
            <div className={`text-3xl font-bold ${kpi.color}`}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Pipeline Funnel */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
        <h2 className="text-lg font-bold text-[#0F2744] mb-1">Pipeline Funnel</h2>
        <p className="text-xs text-[#718096] mb-5">Application flow through selection stages</p>
        <div className="flex flex-col gap-3">
          {funnel.map((stage) => (
            <div key={stage.label} className="flex items-center gap-4">
              <span className="w-24 text-[13px] text-[#4a5568] font-medium">{stage.label}</span>
              <div className="flex-1 bg-[#f7f9fc] rounded-full h-7 overflow-hidden">
                <div
                  className={`${stage.barBg} h-7 rounded-full flex items-center justify-end pr-3 transition-all`}
                  style={{ width: totalApplications > 0 ? `${Math.max((stage.count / totalApplications) * 100, 4)}%` : '4%' }}
                >
                  <span className="text-xs font-bold text-[#0F2744]">{stage.count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-[#0F2744]">Recent Activity</h2>
            <p className="text-xs text-[#718096]">Latest status changes and actions</p>
          </div>
          <Link href="/admin/notifications" className="text-xs font-semibold text-[#2563eb] hover:text-[#1d4ed8]">View all</Link>
        </div>
        {auditLogs && auditLogs.length > 0 ? (
          <div className="flex flex-col gap-1">
            {auditLogs.map((log: any) => (
              <div key={log.id} className="flex items-start justify-between py-3 border-b border-[#e2e8f0] last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    log.to_status === 'selected' ? 'bg-[#1D9E75]' :
                    log.to_status === 'rejected' ? 'bg-[#dc2626]' :
                    log.to_status === 'shortlisted' ? 'bg-[#2563eb]' :
                    'bg-[#718096]'
                  }`} />
                  <div>
                    <p className="text-[13px] text-[#4a5568]">
                      <span className="font-semibold text-[#0F2744]">{log.entity_type}</span> {log.from_status ? `changed from ${log.from_status} to ` : 'set to '}<span className="font-semibold text-[#0F2744]">{log.to_status}</span>
                    </p>
                    <p className="text-[11px] text-[#718096]">by {log.actor}</p>
                  </div>
                </div>
                <p className="text-[11px] text-[#718096] whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#718096]">No recent activity</p>
        )}
      </div>
    </AdminShell>
  )
}
