'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  FileText, 
  UploadCloud, 
  Trash2, 
  Download, 
  CheckCircle, 
  AlertCircle,
  Eye,
  X,
  Printer
} from 'lucide-react';

export const ResumeTab: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [resume, setResume] = useState<{ name: string; size: string; date: string; status: string } | null>({
    name: 'Sarah_Jenkins_Resume_Senior_Frontend.pdf',
    size: '1.2 MB',
    date: '2026-07-12 10:32 AM',
    status: 'Verified'
  });

  const [dragActive, setDragActive] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const candidateInfo = {
    name: 'Sarah Jenkins',
    title: 'Senior Frontend Engineer',
    email: 'candidate@hireai.com',
    phone: '+1 (555) 019-2834',
    location: 'San Francisco, CA',
    summary: 'High-performing UI Developer & Architect with 6+ years of experience specializing in Next.js, React, TypeScript, and state management. Proven track record of scaling high-throughput Web applications with pixel-perfect UI/UX standards.',
    skills: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Redux / Zustand', 'GraphQL', 'Node.js', 'Jest', 'Playwright'],
    experience: [
      {
        role: 'Senior React Developer',
        company: 'BluePeak Systems',
        period: '2023 - Present',
        bullets: [
          'Led a team of 4 frontend engineers to architect high-performance dashboard UI in Next.js.',
          'Improved Core Web Vitals score by 45%.',
          'Drove adoption of TypeScript across the frontend codebase, reducing runtime errors by 60%.'
        ]
      },
      {
        role: 'Frontend Engineer',
        company: 'CloudShield Tech',
        period: '2020 - 2023',
        bullets: [
          'Maintained enterprise component library used across 12 product lines.',
          'Achieved 98% test coverage using React Testing Library.',
          'Built accessible UI components compliant with WCAG 2.1 AA standards.'
        ]
      }
    ],
    education: [
      { degree: 'B.Tech in Computer Science', school: 'IIT Delhi', period: '2016 - 2020' }
    ],
    certifications: ['AWS Certified Developer - Associate', 'Meta Frontend Developer Professional Certificate']
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setResume({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        date: new Date().toLocaleString(),
        status: 'Processing'
      });
      setTimeout(() => {
        setResume(prev => prev ? { ...prev, status: 'Verified' } : null);
      }, 3000);
    }
  };

  const generatePdfBlob = (): Blob => {
    const lines = [
      `HIREAI PRO - CANDIDATE RESUME PROFILE`,
      `================================================================================`,
      `Name: ${candidateInfo.name}`,
      `Title: ${candidateInfo.title}`,
      `Email: ${candidateInfo.email} | Phone: ${candidateInfo.phone}`,
      `Location: ${candidateInfo.location}`,
      ``,
      `PROFESSIONAL SUMMARY`,
      `--------------------------------------------------------------------------------`,
      candidateInfo.summary,
      ``,
      `TECHNICAL SKILLS`,
      `--------------------------------------------------------------------------------`,
      candidateInfo.skills.join(', '),
      ``,
      `WORK EXPERIENCE`,
      `--------------------------------------------------------------------------------`
    ];

    candidateInfo.experience.forEach(exp => {
      lines.push(`${exp.role} - ${exp.company} (${exp.period})`);
      // lines.push(`  * ${exp.description}`);
    });

    lines.push(``);
    lines.push(`EDUCATION & CERTIFICATIONS`);
    lines.push(`--------------------------------------------------------------------------------`);
    candidateInfo.education.forEach(edu => {
      lines.push(`${edu.degree} - ${edu.school} (${edu.period})`);
    });
    lines.push(`Certifications: ${candidateInfo.certifications.join(', ')}`);

    const pdfText = lines.map((line, idx) => {
      const escaped = line.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
      return `1 0 0 1 40 ${750 - (idx * 14)} Tm (${escaped}) Tj`;
    }).join('\n');

    const contentStream = `BT /F1 9 Tf\n${pdfText}\nET`;
    const streamLength = new TextEncoder().encode(contentStream).length;

    const pdfString = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length ${streamLength} >>
stream
${contentStream}
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000318 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
${400 + streamLength}
%%EOF`;

    return new Blob([pdfString], { type: 'application/pdf' });
  };

  const handleDownload = () => {
    if (!resume) return;
    const blob = generatePdfBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = resume.name.endsWith('.pdf') ? resume.name : `${resume.name}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDelete = () => {
    setResume(null);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto text-left">
      
      <div className="bg-white border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <h2 className="text-md font-bold text-slate-850 dark:text-white mb-2">My Professional Resume</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-6">
          Upload your resume in PDF format. Our AI parser parses skills, experience, and certifications to automatically match you with jobs.
        </p>

        {resume ? (
          // Active Resume View
          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5 min-w-0 w-full sm:w-auto">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-500/15 flex items-center justify-center text-blue-500 shrink-0 mt-0.5 sm:mt-0">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-850 dark:text-white truncate max-w-xs sm:max-w-md">{resume.name}</h4>
                  {/* Status Indicator */}
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ring-1 shrink-0 ${
                    resume.status === 'Verified' 
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20' 
                      : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20 animate-pulse'
                  }`}>
                    {resume.status === 'Verified' ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {resume.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-[10px] text-slate-500 font-bold">
                  <span>{resume.size}</span>
                  <span>&bull;</span>
                  <span>Uploaded {resume.date}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto pt-2 sm:pt-0 border-t border-slate-200/60 dark:border-slate-800/60 sm:border-0 w-full sm:w-auto justify-end">
              {/* View Action */}
              <button 
                title="View Document"
                onClick={() => setIsPreviewOpen(true)}
                className="p-2 text-slate-500 dark:text-slate-300 hover:text-blue-600 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition-all active:scale-95 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
              </button>

              {/* Download Action */}
              <button 
                title="Download PDF Document"
                onClick={handleDownload}
                className="p-2 text-slate-500 dark:text-slate-300 hover:text-blue-600 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition-all active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4" />
              </button>

              {/* Delete Action */}
              <button 
                title="Remove Document"
                onClick={handleDelete}
                className="p-2 text-rose-500 hover:text-rose-700 bg-rose-50 dark:bg-rose-500/10 border border-rose-500/20 rounded-xl transition-all active:scale-95 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          // Upload Drag & Drop Area
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all ${
              dragActive 
                ? 'border-blue-500 bg-blue-500/5' 
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/10 hover:border-slate-400'
            }`}
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-850 dark:text-white">Drag and drop your file here, or click to browse</p>
                <p className="text-[10px] text-slate-500 font-bold">Supports PDF format (Max size 10MB)</p>
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    setResume({
                      name: file.name,
                      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                      date: new Date().toLocaleString(),
                      status: 'Processing'
                    });
                    setTimeout(() => {
                      setResume(prev => prev ? { ...prev, status: 'Verified' } : null);
                    }, 3000);
                  }
                }}
              />
              <label 
                htmlFor="file-upload"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-2xl transition-all shadow-md shadow-blue-600/10 cursor-pointer hover:shadow-blue-600/20 active:scale-95 inline-block"
              >
                Choose PDF File
              </label>
            </div>
          </div>
        )}
      </div>

      {/* ─── RESUME PREVIEW MODAL (FULL-SCREEN PORTAL) ─── */}
      {isPreviewOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Print-specific overrides */}
          <style>{`
            @media print {
              body * { visibility: hidden; }
              #candidate-resume-sheet, #candidate-resume-sheet * { visibility: visible; }
              #candidate-resume-sheet {
                position: absolute; left: 0; top: 0;
                width: 100% !important; max-width: 100% !important;
                border: none !important; box-shadow: none !important;
                padding: 0 !important; margin: 0 !important;
                background: white !important; color: black !important;
              }
            }
          `}</style>

          {/* Full Screen Backdrop Blur */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200 no-print"
            onClick={() => setIsPreviewOpen(false)}
          />

          {/* Modal Box */}
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 no-print">

            {/* Modal Header */}
            <div className="px-3.5 py-3 sm:px-6 sm:py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/90 gap-2">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">Resume Document Preview</h3>
                  <p className="text-[10px] text-slate-500 font-semibold truncate">{resume?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button
                  onClick={handleDownload}
                  className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shrink-0"
                  title="Download PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download PDF</span>
                  <span className="inline sm:hidden">PDF</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer shrink-0"
                  title="Print Resume"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer shrink-0"
                  title="Close Preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Resume Content Sheet */}
            <div id="candidate-resume-sheet" className="p-8 overflow-y-auto space-y-6 text-slate-800 text-xs bg-white">

              {/* Header */}
              <div className="border-b border-slate-200 pb-5 flex justify-between items-start">
                <div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">{candidateInfo.name}</h1>
                  <p className="text-xs font-bold text-blue-600 mt-0.5">{candidateInfo.title}</p>
                </div>
                <div className="text-right text-[11px] text-slate-500 font-medium space-y-0.5">
                  <p>{candidateInfo.email}</p>
                  <p>{candidateInfo.phone}</p>
                  <p>{candidateInfo.location}</p>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-1.5">
                <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Professional Summary</h4>
                <p className="text-slate-700 leading-relaxed font-normal">{candidateInfo.summary}</p>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Technical Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {candidateInfo.skills.map((skill, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-lg text-[10px]">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Work Experience</h4>
                {candidateInfo.experience.map((exp, i) => (
                  <div key={i} className="space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900 text-[11px]">{exp.role} &mdash; <span className="text-blue-600 font-semibold">{exp.company}</span></span>
                      <span className="text-[10px] text-slate-500 font-semibold">{exp.period}</span>
                    </div>
                    <ul className="list-disc list-outside pl-4 space-y-0.5">
                      {exp.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="text-[11px] text-slate-600">{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Education & Certs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Education</h4>
                  {candidateInfo.education.map((edu, i) => (
                    <div key={i} className="text-[11px]">
                      <p className="font-bold text-slate-900">{edu.degree}</p>
                      <p className="text-slate-500">{edu.school} ({edu.period})</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Certifications</h4>
                  {candidateInfo.certifications.map((cert, i) => (
                    <p key={i} className="text-[11px] text-slate-700 font-medium">&bull; {cert}</p>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};
