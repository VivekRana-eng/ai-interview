'use client';

import React from 'react';
import { Candidate } from '../types';
import { X, Download, Printer, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDefaultExperiences } from './candidate-detail-data';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate | null;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({
  isOpen,
  onClose,
  candidate
}) => {
  if (!candidate) return null;

  const experiences =
    candidate.workExperienceDetails && candidate.workExperienceDetails.length > 0
      ? candidate.workExperienceDetails
      : getDefaultExperiences(candidate);

  const isML =
    candidate.position.toLowerCase().includes('machine') ||
    candidate.position.toLowerCase().includes('ai');
  const isSec =
    candidate.position.toLowerCase().includes('security') ||
    candidate.position.toLowerCase().includes('devsecops');

  const summaryText =
    candidate.summary ||
    (isML
      ? 'Results-oriented Machine Learning and Artificial Intelligence Engineer seeking a challenging position to apply expertise in designing and implementing innovative AI solutions for complex systems challenges. Proven track record of success in machine learning pipelines, data engineering, problem-solving, and cross-functional collaboration.'
      : isSec
      ? 'Results-oriented DevSecOps and Cybersecurity Specialist seeking a challenging position to apply expertise in securing large-scale cloud-native infrastructure, implementing secure SDLC automation, threat modeling, and vulnerability remediation.'
      : 'Results-oriented Software Engineer seeking a challenging position to apply expertise in designing and implementing innovative web solutions for complex engineering challenges. Proven track record of success in project management, database optimization, problem-solving, and cross-functional collaboration.');

  const educationList =
    candidate.educationDetails && candidate.educationDetails.length > 0
      ? candidate.educationDetails
      : [
          {
            degree: 'Bachelor of Computer Science & Engineering with Honours',
            school: 'University of Technology Excellence',
            year: 'Aug 2016 - Oct 2019',
            grade: 'Intelligent Systems / Application Development'
          }
        ];

  const skills =
    candidate.skills && candidate.skills.length > 0
      ? candidate.skills
      : ['Go', 'Python', 'FastAPI', 'PostgreSQL', 'gRPC', 'Docker', 'Kubernetes', 'AWS', 'Git'];

  const certifications: string[] =
    (candidate as any).certifications && (candidate as any).certifications.length > 0
      ? (candidate as any).certifications
      : ['AWS Certified Solutions Architect', 'Certified Kubernetes Administrator (CKA)'];

  const resumeFileName = `${candidate.name.replace(/\s+/g, '_')}_Resume_${candidate.position.replace(/\s+/g, '_')}.pdf`;

  const handlePrint = () => window.print();

  const handleDownload = () => {
    const lines = [
      `HIREAI PRO - CANDIDATE RESUME PROFILE`,
      `================================================================================`,
      `Name: ${candidate.name}`,
      `Title: ${candidate.position}`,
      `Email: ${candidate.email} | Phone: ${candidate.phone || ''}`,
      `Location: ${candidate.location}`,
      ``,
      `PROFESSIONAL SUMMARY`,
      `--------------------------------------------------------------------------------`,
      summaryText,
      ``,
      `TECHNICAL SKILLS`,
      `--------------------------------------------------------------------------------`,
      skills.join(', '),
      ``,
      `WORK EXPERIENCE`,
      `--------------------------------------------------------------------------------`
    ];

    experiences.forEach((exp) => {
      lines.push(`${exp.role} - ${exp.company} (${exp.duration})`);
      exp.description.forEach((b) => lines.push(`  * ${b}`));
    });

    lines.push(``, `EDUCATION & CERTIFICATIONS`, `--------------------------------------------------------------------------------`);
    educationList.forEach((edu) => {
      lines.push(`${edu.degree} - ${edu.school} (${edu.year})`);
    });
    lines.push(`Certifications: ${certifications.join(', ')}`);

    const pdfText = lines
      .map((line, idx) => {
        const escaped = line.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
        return `1 0 0 1 40 ${750 - idx * 14} Tm (${escaped}) Tj`;
      })
      .join('\n');

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

    const blob = new Blob([pdfString], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = resumeFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Print-specific overrides */}
          <style>{`
            @media print {
              body * { visibility: hidden; }
              #resume-sheet, #resume-sheet * { visibility: visible; }
              #resume-sheet {
                position: absolute; left: 0; top: 0;
                width: 100% !important; max-width: 100% !important;
                border: none !important; box-shadow: none !important;
                padding: 0 !important; margin: 0 !important;
                background: white !important; color: black !important;
              }
            }
          `}</style>

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md no-print"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-3xl max-h-[90vh] bg-[#0f1521] border border-slate-700/60 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col no-print"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-700/60 flex items-center justify-between bg-[#131c2e]/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Resume Document Preview</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">{resumeFileName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownload}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="p-1.5 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Resume Content */}
            <div id="resume-sheet" className="p-8 overflow-y-auto space-y-6 text-slate-200 text-xs">

              {/* Header */}
              <div className="border-b border-slate-700/60 pb-5 flex justify-between items-start">
                <div>
                  <h1 className="text-xl font-black text-white tracking-tight">{candidate.name}</h1>
                  <p className="text-xs font-bold text-blue-400 mt-0.5">{candidate.position}</p>
                </div>
                <div className="text-right text-[11px] text-slate-400 font-medium space-y-0.5">
                  <p>{candidate.email}</p>
                  <p>{candidate.phone || ''}</p>
                  <p>{candidate.location}</p>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-1.5">
                <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                  Professional Summary
                </h4>
                <p className="text-slate-300 leading-relaxed font-normal">{summaryText}</p>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                  Technical Skills
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-300 font-semibold rounded-lg text-[10px]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Work Experience */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                  Work Experience
                </h4>
                {experiences.map((exp, i) => (
                  <div
                    key={i}
                    className="space-y-1.5 bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/60"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white text-[11px]">
                        {exp.role} &mdash;{' '}
                        <span className="text-blue-400">{exp.company}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">{exp.duration}</span>
                    </div>
                    <ul className="list-disc list-outside pl-4 space-y-0.5">
                      {exp.description.map((bullet, bIdx) => (
                        <li key={bIdx} className="text-[11px] text-slate-400">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Education & Certifications */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                    Education
                  </h4>
                  {educationList.map((edu, i) => (
                    <div key={i} className="text-[11px]">
                      <p className="font-bold text-white">{edu.degree}</p>
                      <p className="text-slate-400">
                        {edu.school} ({edu.year})
                      </p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                    Certifications
                  </h4>
                  {certifications.map((cert, i) => (
                    <p key={i} className="text-[11px] text-slate-300 font-medium">
                      &bull; {cert}
                    </p>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
