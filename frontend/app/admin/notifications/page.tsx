'use client'
import * as tw from '@/lib/tailwindClasses'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { AdminShell } from '../../components/AdminShell'

export default function AdminNotificationsPage() {
  const [auditLogs, setAuditLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAuditLogs() {
      try {
        const { data } = await supabase
          .from('audit_log')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(100)
        setAuditLogs(data || [])
      } catch (err) {
        console.error('Failed to load audit logs:', err)
      } finally {
        setLoading(false)
      }
    }
    loadAuditLogs()
  }, [])

  if (loading) {
    return (
      <AdminShell title="Notifications" subtitle="Audit log and activity history">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-[#718096]">Loading...</div>
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell title="Notifications" subtitle="Audit log and activity history">
      <div className={tw.cardCompactOverflow}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-[#0F2744]">
                {['Timestamp', 'Type', 'Entity ID', 'Status Change', 'Actor'].map((h) => (
                  <th key={h} className="px-3.5 py-2.5 text-left text-[11px] font-semibold text-white/70 uppercase tracking-[0.06em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log: any) => (
                <tr key={log.id} className="border-b border-[#e2e8f0] last:border-0 hover:bg-[#fafbfc] transition-colors">
                  <td className="px-3.5 py-3 text-[13px] text-[#718096] whitespace-nowrap tabular-nums">
                    {new Date(log.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-3.5 py-3 text-[13px] font-semibold text-[#0F2744] whitespace-nowrap">{log.entity_type}</td>
                  <td className="px-3.5 py-3 text-[11px] text-[#718096] whitespace-nowrap font-mono">{log.entity_id?.slice(0, 8)}...</td>
                  <td className={tw.tableCellText}>
                    {log.from_status ? (
                      <span><span className="text-[#718096]">{log.from_status}</span> <span className="text-[#e2e8f0]">→</span> <span className="font-semibold text-[#0F2744]">{log.to_status}</span></span>
                    ) : (
                      <span className="font-semibold text-[#0F2744]">{log.to_status}</span>
                    )}
                  </td>
                  <td className={tw.tableCellText}>{log.actor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {auditLogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[15px] text-[#718096]">No audit logs found.</p>
          </div>
        )}
      </div>
    </AdminShell>
  )
}
