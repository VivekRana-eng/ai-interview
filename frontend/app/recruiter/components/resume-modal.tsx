'use client';

import React from 'react';
import { Candidate } from '../types';
import { X, Download, Printer } from 'lucide-react';
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

  const experiences = candidate.workExperienceDetails && candidate.workExperienceDetails.length > 0 
    ? candidate.workExperienceDetails 
    : getDefaultExperiences(candidate);

  const isML = candidate.position.toLowerCase().includes('machine') || candidate.position.toLowerCase().includes('ai');
  const isSec = candidate.position.toLowerCase().includes('security') || candidate.position.toLowerCase().includes('devsecops');

  const summaryText = isML
    ? 'Results-oriented Machine Learning and Artificial Intelligence Engineer seeking a challenging position to apply expertise in designing and implementing innovative AI solutions for complex systems challenges. Proven track record of success in machine learning pipelines, data engineering, problem-solving, and cross-functional collaboration. Adept at utilizing cutting-edge neural architectures to optimize model convergence and inference efficiency.'
    : isSec
    ? 'Results-oriented DevSecOps and Cybersecurity Specialist seeking a challenging position to apply expertise in securing large-scale cloud-native infrastructure, implementing secure SDLC automation, threat modeling, and vulnerability remediation. Proven track record of auditing access control systems and optimizing secure pipelines.'
    : 'Results-oriented Software Engineer seeking a challenging position to apply expertise in designing and implementing innovative web solutions for complex engineering challenges. Proven track record of success in project management, database optimization, problem-solving, and cross-functional collaboration.';

  const educationDetails = [
    { degree: 'Bachelor of Computer Science & Engineering with Honours', school: 'University of Technology Excellence', year: 'Aug 2016 - Oct 2019', grade: 'Intelligent Systems / Application Development' },
    { degree: 'Diploma in Software Engineering', school: 'Engineering College of Science', year: 'May 2014 - May 2016', grade: 'Structural Design & System Architectures' }
  ];

  const skillsJoined = (candidate.skills && candidate.skills.length > 0)
    ? candidate.skills.join(', ')
    : 'Go, Python, FastAPI, PostgreSQL, gRPC, Docker, Kubernetes, AWS, Git';

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Print specific style overrides */}
          <style>{`
            @media print {
              body * {
                visibility: hidden;
              }
              #resume-sheet, #resume-sheet * {
                visibility: visible;
              }
              #resume-sheet {
                position: absolute;
                left: 0;
                top: 0;
                width: 100% !important;
                max-width: 100% !important;
                border: none !important;
                box-shadow: none !important;
                padding: 0 !important;
                margin: 0 !important;
                background: white !important;
                color: black !important;
              }
            }
          `}</style>
          
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 no-print" onClick={onClose} />
          
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-3xl h-[85vh] bg-white border border-slate-150 rounded-2xl shadow-xl overflow-hidden z-10 flex flex-col no-print">
            <div className="flex justify-between items-center px-6 py-3 border-b border-slate-100 bg-[#fafbfd]">
              <div>
                <span className="text-[8px] font-bold text-blue-600 uppercase tracking-widest block font-mono">CV Document Preview</span>
                <h3 className="text-xs font-bold text-slate-800">{candidate.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handlePrint} className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 flex items-center gap-1.5 text-xs font-bold px-2.5">
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <button onClick={onClose} className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700"><X className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50">
              {/* Styled Resume Sheet matching Screenshot 1 layout */}
              <div id="resume-sheet" className="bg-white border border-slate-200 p-8 shadow-sm font-sans text-slate-800 select-text max-w-2xl mx-auto rounded-none text-left space-y-6">
                
                {/* Header Row: Photo & Details */}
                <div className="flex justify-between items-start gap-6 pb-2 border-b border-slate-100">
                  <div className="flex gap-4 items-center">
                    {candidate.avatarUrl ? (
                      <img src={candidate.avatarUrl} alt={candidate.name} className="w-20 h-20 rounded-lg object-cover border border-slate-200 bg-slate-50 flex-shrink-0" />
                    ) : (
                      <div className="w-20 h-20 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-xl border border-slate-200 flex-shrink-0">
                        {candidate.name[0]}
                      </div>
                    )}
                    <div className="space-y-1.5">
                      <h1 className="text-xl font-extrabold text-[#1a365d] tracking-wide uppercase leading-none font-sans">
                        {candidate.name}
                      </h1>
                      <div className="text-[9.5px] space-y-1 text-slate-700 font-semibold leading-normal">
                        <p><span className="font-extrabold text-slate-800">Address:</span> {candidate.location || 'London, UK'}</p>
                        <p><span className="font-extrabold text-slate-800">Phone:</span> {candidate.phone || '+91 98765 43210'}</p>
                        <p><span className="font-extrabold text-slate-800">Email:</span> {candidate.email}</p>
                        <p><span className="font-extrabold text-slate-800">Website:</span> www.linkedin.com/in/{candidate.name.toLowerCase().replace(' ', '-')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Sections */}
                <div className="space-y-5">
                  
                  {/* SUMMARY */}
                  <div className="space-y-1">
                    <h2 className="text-[10px] font-extrabold text-[#1a365d] border-b border-[#1a365d] pb-0.5 tracking-wider uppercase">
                      Summary
                    </h2>
                    <p className="text-[9px] text-slate-650 font-semibold leading-relaxed">
                      {summaryText}
                    </p>
                  </div>

                  {/* WORK EXPERIENCE */}
                  <div className="space-y-2">
                    <h2 className="text-[10px] font-extrabold text-[#1a365d] border-b border-[#1a365d] pb-0.5 tracking-wider uppercase">
                      Work Experience
                    </h2>
                    <div className="space-y-3">
                      {experiences.map((exp, idx) => (
                        <div key={idx} className="space-y-0.5">
                          <div className="flex justify-between items-start text-[9.5px] font-extrabold text-slate-800">
                            <span>{exp.role}, {exp.company}</span>
                            <span className="text-slate-650">{exp.duration}</span>
                          </div>
                          <ul className="list-disc list-outside pl-4 text-[9px] text-slate-600 space-y-0.5 font-semibold leading-relaxed">
                            {exp.description.map((bullet, bIdx) => (
                              <li key={bIdx}>{bullet}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* EDUCATION */}
                  <div className="space-y-2">
                    <h2 className="text-[10px] font-extrabold text-[#1a365d] border-b border-[#1a365d] pb-0.5 tracking-wider uppercase">
                      Education
                    </h2>
                    <div className="space-y-3">
                      {educationDetails.map((edu, idx) => (
                        <div key={idx} className="space-y-0.5">
                          <div className="flex justify-between items-start text-[9.5px] font-extrabold text-slate-800">
                            <span>{edu.degree}</span>
                            <span className="text-slate-650">{edu.year}</span>
                          </div>
                          <p className="text-[9px] text-slate-600 font-bold">{edu.school}</p>
                          {edu.grade && (
                            <p className="text-[8.5px] text-slate-500 font-semibold italic">Major/Focus: {edu.grade}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ADDITIONAL INFORMATION */}
                  <div className="space-y-1">
                    <h2 className="text-[10px] font-extrabold text-[#1a365d] border-b border-[#1a365d] pb-0.5 tracking-wider uppercase">
                      Additional Information
                    </h2>
                    <ul className="list-disc list-outside pl-4 text-[9px] text-slate-600 space-y-0.5 font-semibold leading-relaxed">
                      <li>
                        <span className="font-bold text-slate-850">Technical Skills:</span> {skillsJoined}
                      </li>
                      <li>
                        <span className="font-bold text-slate-850">Languages:</span> English, Hindi (Native), Spanish (Basic)
                      </li>
                      <li>
                        <span className="font-bold text-slate-850">Certifications:</span> AWS Certified Solutions Architect, Certified Kubernetes Administrator (CKA)
                      </li>
                      <li>
                        <span className="font-bold text-slate-850">Awards/Activities:</span> Actively participated in national hackathons and developer community outreach programs.
                      </li>
                    </ul>
                  </div>

                </div>

              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
