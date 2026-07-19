'use client';

import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  MapPin, 
  Phone, 
  Globe, 
  Briefcase, 
  GraduationCap, 
  Plus, 
  Trash2, 
  Check, 
  Edit3, 
  FileText 
} from 'lucide-react';

export const ProfileTab: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Sarah Jenkins',
    email: 'candidate@hireai.com',
    phone: '+1 (555) 019-2834',
    location: 'San Francisco, CA',
    title: 'Senior Frontend Engineer',
    bio: 'Passionate UI Architect with 6+ years of building ultra-performant React architectures, custom design systems, and responsive SaaS products.',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Redux', 'Zustand', 'GraphQL', 'Node.js', 'Jest', 'Playwright'],
    experience: [
      { id: 1, role: 'Senior React Developer', company: 'TechSolutions Inc', period: '2023 - Present', desc: 'Led a team of 4 frontend developers to migrate a legacy analytics dashboard to Next.js App Router, boosting page load speeds by 40%.' },
      { id: 2, role: 'Frontend Engineer', company: 'SaaSify Platforms', period: '2020 - 2023', desc: 'Crafted the core layout engine and component library using Tailwind CSS and Radix UI primitives. Maintained 95%+ test coverage.' }
    ],
    education: [
      { id: 1, degree: 'B.S. in Computer Science', school: 'Stanford University', period: '2016 - 2020' }
    ],
    certifications: ['AWS Certified Cloud Practitioner', 'Google Advanced React Developer Certification'],
    links: {
      github: 'https://github.com/sarahj-dev',
      linkedin: 'https://linkedin.com/in/sarahj-dev',
      portfolio: 'https://sarahj.dev'
    }
  });

  const [newSkill, setNewSkill] = useState('');

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(s => s !== skillToRemove)
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-left">
      
      {/* Profile Header Widget */}
      <div className="bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-3xl p-6 relative overflow-hidden shadow-sm">
        <div className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-blue-500/5 blur-2xl" />
        
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-3xl shadow-lg shadow-blue-500/10">
              {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-850 dark:text-white">{profile.name}</h2>
              <p className="text-xs text-blue-400 font-bold mt-1">{profile.title}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2.5 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {profile.location}</span>
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {profile.email}</span>
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {profile.phone}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all active:scale-95 flex items-center gap-2 ${
              isEditing 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/10'
                : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
            }`}
          >
            {isEditing ? (
              <>
                <Check className="w-4 h-4" />
                <span>Save Profile</span>
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column - Bio, Skills, Links */}
        <div className="space-y-6">
          
          {/* About / Bio */}
          <div className="bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-3xl p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-850 dark:text-white uppercase tracking-wider mb-3">About Me</h3>
            {isEditing ? (
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={4}
                className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800/60 rounded-xl focus:border-blue-500 focus:outline-none font-semibold text-slate-700 dark:text-slate-200"
              />
            ) : (
              <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-semibold">{profile.bio}</p>
            )}
          </div>

          {/* Social / Portfolio Links */}
          <div className="bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-3xl p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-850 dark:text-white uppercase tracking-wider mb-3">Professional Links</h3>
            <div className="space-y-3">
              <a 
                href={profile.links.linkedin} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-100 dark:bg-slate-900/40 hover:bg-slate-100 dark:bg-slate-900/80 border border-slate-150 dark:border-slate-800/60 rounded-2xl transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[#0077b5]" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">LinkedIn Profile</span>
                </div>
                <span className="text-[10px] text-slate-500 group-hover:text-white transition-colors font-bold">Visit</span>
              </a>

              <a 
                href={profile.links.github} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-100 dark:bg-slate-900/40 hover:bg-slate-100 dark:bg-slate-900/80 border border-slate-150 dark:border-slate-800/60 rounded-2xl transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-slate-700 dark:text-slate-200 dark:text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">GitHub Repos</span>
                </div>
                <span className="text-[10px] text-slate-500 group-hover:text-white transition-colors font-bold">Visit</span>
              </a>

              <a 
                href={profile.links.portfolio} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-100 dark:bg-slate-900/40 hover:bg-slate-100 dark:bg-slate-900/80 border border-slate-150 dark:border-slate-800/60 rounded-2xl transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Portfolio Website</span>
                </div>
                <span className="text-[10px] text-slate-500 group-hover:text-white transition-colors font-bold">Visit</span>
              </a>
            </div>
          </div>

          {/* Technical Skills */}
          <div className="bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-3xl p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-850 dark:text-white uppercase tracking-wider mb-3">Core Skills</h3>
            
            {isEditing && (
              <form onSubmit={handleAddSkill} className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add skill (e.g. Docker)"
                  className="flex-1 text-xs px-3 py-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800/60 rounded-xl focus:border-blue-500 focus:outline-none font-semibold"
                />
                <button
                  type="submit"
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shrink-0"
                >
                  <Plus className="w-4.5 h-4.5" />
                </button>
              </form>
            )}

            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <div 
                  key={skill} 
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-100 dark:bg-slate-900/50 border border-slate-150 dark:border-slate-800/60 text-xs text-slate-600 dark:text-slate-300 font-bold"
                >
                  <span>{skill}</span>
                  {isEditing && (
                    <button 
                      type="button" 
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-rose-400 hover:text-rose-350 ml-1 transition-colors"
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column - Experience & Education */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Work Experience */}
          <div className="bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-5 border-b border-slate-150 dark:border-slate-800/40 pb-3">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4.5 h-4.5 text-blue-400" />
                <h3 className="text-sm font-bold text-slate-850 dark:text-white">Work Experience</h3>
              </div>
              {isEditing && (
                <button className="text-xs text-blue-400 hover:text-blue-300 font-bold inline-flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add Job
                </button>
              )}
            </div>

            <div className="space-y-6">
              {profile.experience.map((exp, i) => (
                <div key={exp.id} className="relative pl-5 border-l border-slate-200 dark:border-slate-800 last:border-0 pb-1">
                  <div className="absolute left-0 top-1.5 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-slate-900" />
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-slate-850 dark:text-white">{exp.role}</h4>
                      <span className="text-[11px] font-bold text-blue-400 mt-0.5 block">{exp.company}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold">{exp.period}</span>
                  </div>
                  
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-semibold leading-relaxed">{exp.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-5 border-b border-slate-150 dark:border-slate-800/40 pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4.5 h-4.5 text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-850 dark:text-white">Education</h3>
              </div>
              {isEditing && (
                <button className="text-xs text-indigo-400 hover:text-indigo-300 font-bold inline-flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add Education
                </button>
              )}
            </div>

            <div className="space-y-4">
              {profile.education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-850 dark:text-white">{edu.degree}</h4>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold block mt-0.5">{edu.school}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold">{edu.period}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white border border-slate-200 dark:border-slate-200 dark:border-slate-800/85 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-850 dark:text-white mb-4 border-b border-slate-150 dark:border-slate-800/40 pb-3">Certifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profile.certifications.map((cert) => (
                <div 
                  key={cert}
                  className="p-3 bg-slate-50 dark:bg-slate-100 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-800/60 rounded-2xl flex items-center gap-3"
                >
                  <FileText className="w-4.5 h-4.5 text-blue-400 shrink-0" />
                  <span className="text-xs text-slate-600 dark:text-slate-300 font-bold leading-tight">{cert}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
