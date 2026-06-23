'use client';

import React from 'react';
import { useRecruiterStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Info, CheckCircle2 } from 'lucide-react';

export const AlertsPanel: React.FC = () => {
  const { alerts, resolveAlert } = useRecruiterStore();
  const activeAlerts = alerts.filter(a => !a.resolved);

  const getAlertStyles = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          cardBg: 'bg-rose-50/70 border-rose-200/80 text-rose-800',
          badgeText: 'text-rose-500',
          title: 'Multiple Face Detected',
          icon: ShieldAlert,
          iconBg: 'bg-rose-100/80 text-rose-600 border-rose-200'
        };
      case 'warning':
        return {
          cardBg: 'bg-amber-50/70 border-amber-200/80 text-amber-800',
          badgeText: 'text-amber-500',
          title: 'Tab Switch Attempt',
          icon: ShieldAlert,
          iconBg: 'bg-amber-100/80 text-amber-600 border-amber-200'
        };
      default:
        return {
          cardBg: 'bg-blue-50/70 border-blue-200/80 text-blue-800',
          badgeText: 'text-blue-500',
          title: 'High Potential Match',
          icon: Info,
          iconBg: 'bg-blue-100/80 text-blue-600 border-blue-200'
        };
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-100/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col gap-5 h-full">
      {/* Header */}
      <div className="flex justify-between items-center pb-2 border-b border-slate-55">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <span>AI Integrity Alerts</span>
        </h3>
        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-500 border border-rose-100">
          {activeAlerts.length || 8} active anomalies
        </span>
      </div>

      {/* Alerts list */}
      <div className="space-y-3 overflow-y-auto max-h-[300px] pr-1.5 scrollbar-thin">
        <AnimatePresence initial={false}>
          {activeAlerts.map((alert) => {
            const style = getAlertStyles(alert.severity);
            const Icon = style.icon;

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-4 rounded-xl border flex gap-3 justify-between items-start ${style.cardBg}`}
              >
                <div className="flex gap-3">
                  <div className={`p-1.5 rounded-lg border flex items-center justify-center ${style.iconBg} h-8 w-8 mt-0.5`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">{style.title}</span>
                      <span className="text-[8px] font-semibold text-slate-400">• {alert.timestamp}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-semibold mt-1.5 leading-relaxed pr-2">
                      {alert.message}
                    </p>
                  </div>
                </div>

                {/* Acknowledge Action button */}
                <button
                  onClick={() => resolveAlert(alert.id)}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-extrabold uppercase tracking-wider bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 transition-colors shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Acknowledge & Resolve</span>
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {activeAlerts.length === 0 && (
          <div className="py-12 text-center text-slate-400 font-semibold text-xs border-2 border-dashed border-slate-100 rounded-xl">
            All security flags resolved.
          </div>
        )}
      </div>
    </div>
  );
};
