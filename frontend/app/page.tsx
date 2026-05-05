import Link from 'next/link'
import { Header } from './components/Header'
import { Footer } from './components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f7f9fc] flex flex-col">
      <Header />

      <main className="flex-1">
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
            <div className="flex gap-2.5 max-w-[640px] mx-auto flex-col sm:flex-row">
              <Link
                href="/jobs"
                className="flex-1 px-5 py-3.5 bg-[#1D9E75] text-white font-semibold text-sm rounded-lg hover:bg-[#1a8f69] transition-colors text-center"
              >
                Browse Open Positions
              </Link>
              <Link
                href="/admin/login"
                className="px-5 py-3.5 border border-white/15 bg-white/10 text-white font-semibold text-sm rounded-lg hover:bg-white/15 transition-colors text-center"
              >
                Admin Portal
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-[1200px] mx-auto px-6 py-16">
          <h3 className="text-xl font-semibold text-[#0F2744] mb-8 text-center">How It Works</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: '1', title: 'Apply', desc: 'Submit your resume and SOP' },
              { step: '2', title: 'Screening', desc: 'AI evaluates your profile' },
              { step: '3', title: 'Interview', desc: 'Answer timed questions' },
              { step: '4', title: 'Result', desc: 'Check your final status' },
            ].map((s) => (
              <div key={s.step} className="bg-white border border-[#e2e8f0] rounded-xl p-6 text-center">
                <div className="w-10 h-10 bg-[#e6f7f2] rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-[#1D9E75] font-bold text-sm">{s.step}</span>
                </div>
                <h4 className="font-semibold text-[#0F2744] text-[15px]">{s.title}</h4>
                <p className="text-[13px] text-[#718096] mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="bg-white border-y border-[#e2e8f0]">
          <div className="max-w-[1200px] mx-auto px-6 py-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {[
                { num: '12', label: 'Open Positions' },
                { num: '4', label: 'Government Departments' },
                { num: 'AI', label: 'Powered Screening' },
                { num: '100%', label: 'Transparent Process' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-bold text-[#0F2744]">{stat.num}</div>
                  <div className="text-sm text-[#718096] mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
