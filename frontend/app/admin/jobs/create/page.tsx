'use client'
import * as tw from '@/lib/tailwindClasses'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AdminShell } from '../../../components/AdminShell'

export default function CreateJobPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)

    try {
      const { error } = await supabase.from('job_profiles').insert({
        title: formData.get('title'),
        domain: formData.get('domain'),
        description: formData.get('description'),
        required_skills: JSON.parse(formData.get('required_skills') as string || '[]'),
        min_cgpa: parseFloat(formData.get('min_cgpa') as string),
        min_exp_months: parseInt(formData.get('min_exp_months') as string),
        required_certs: JSON.parse(formData.get('required_certs') as string || '[]'),
        seats: parseInt(formData.get('seats') as string),
        deadline: formData.get('deadline') || null,
        status: 'published',
      })

      if (error) throw error

      router.push('/admin/jobs')
    } catch (err: any) {
      setError(err.message || 'Failed to create job')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminShell title="Create Job Profile" subtitle="Add a new internship opening">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[13px] text-[#718096] mb-1">
        <Link href="/admin/jobs" className="hover:text-[#0F2744] transition-colors">Job Profiles</Link>
        <span className="text-[#e2e8f0]">›</span>
        <span className="text-[#0F2744] font-medium">Create</span>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-[#e2e8f0] rounded-xl p-6 max-w-[720px] flex flex-col gap-5">
        <div className={tw.flexColGap1_5}>
          <label className={tw.textPrimary13}>Title <span className="text-[#dc2626]">*</span></label>
          <input type="text" name="title" required placeholder="e.g., Full-Stack Developer Intern" className={tw.inputBase} />
        </div>

        <div className={tw.flexColGap1_5}>
          <label className={tw.textPrimary13}>Domain <span className="text-[#dc2626]">*</span></label>
          <select name="domain" required className="px-3.5 py-2.5 border-[1.5px] border-[#e2e8f0] rounded-lg text-sm text-[#0F2744] bg-white outline-none focus:border-[#0F2744] focus:shadow-[0_0_0_3px_rgba(15,39,68,0.07)] transition-all cursor-pointer appearance-none pr-8 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2210%22 height=%2210%22 viewBox=%220 0 10 10%22%3E%3Cpath fill=%22%23718096%22 d=%22M5 7L1 3h8z%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_10px_center]">
            <option value="artificial_intelligence">Artificial Intelligence</option>
            <option value="software_development">Software Development</option>
            <option value="cybersecurity">Cybersecurity</option>
            <option value="data_science">Data Science</option>
            <option value="cloud_computing">Cloud Computing</option>
          </select>
        </div>

        <div className={tw.flexColGap1_5}>
          <label className={tw.textPrimary13}>Description</label>
          <textarea name="description" rows={4} placeholder="Describe the role, responsibilities, and expectations..." className="px-3.5 py-2.5 border-[1.5px] border-[#e2e8f0] rounded-lg text-sm text-[#0F2744] bg-white outline-none focus:border-[#0F2744] focus:shadow-[0_0_0_3px_rgba(15,39,68,0.07)] transition-all resize-y min-h-[100px] leading-relaxed" />
        </div>

        <div className={tw.flexColGap1_5}>
          <label className={tw.textPrimary13}>Required Skills (JSON array)</label>
          <input type="text" name="required_skills" placeholder='["Python", "Machine Learning", "React"]' className={tw.inputBaseMono} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={tw.flexColGap1_5}>
            <label className={tw.textPrimary13}>Min CGPA</label>
            <input type="number" name="min_cgpa" step="0.1" min="0" max="10" defaultValue="0" className={tw.inputBase} />
          </div>
          <div className={tw.flexColGap1_5}>
            <label className={tw.textPrimary13}>Min Experience (months)</label>
            <input type="number" name="min_exp_months" min="0" defaultValue="0" className={tw.inputBase} />
          </div>
          <div className={tw.flexColGap1_5}>
            <label className={tw.textPrimary13}>Seats <span className="text-[#dc2626]">*</span></label>
            <input type="number" name="seats" min="1" required defaultValue="5" className={tw.inputBase} />
          </div>
        </div>

        <div className={tw.flexColGap1_5}>
          <label className={tw.textPrimary13}>Required Certifications (JSON array)</label>
          <input type="text" name="required_certs" placeholder='["AWS Certified", "Google Cloud"]' className={tw.inputBaseMono} />
        </div>

        <div className={tw.flexColGap1_5}>
          <label className={tw.textPrimary13}>Deadline</label>
          <input type="date" name="deadline" className={tw.inputBase} />
        </div>

        {error && <p className="text-[#dc2626] text-sm">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Link href="/admin/jobs" className="px-5 py-2.5 border border-[#e2e8f0] text-[#4a5568] text-[13px] font-semibold rounded-lg hover:bg-[#f7f9fc] transition-colors text-center">Cancel</Link>
          <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-[#0F2744] text-white text-[13px] font-semibold rounded-lg hover:bg-[#1a3a5c] transition-colors disabled:bg-[#718096]">
            {loading ? 'Creating...' : 'Create Job'}
          </button>
        </div>
      </form>
    </AdminShell>
  )
}
