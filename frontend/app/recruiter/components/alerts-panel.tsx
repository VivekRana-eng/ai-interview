'use client';
import * as tw from '@/lib/tailwindClasses'

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
          title: 'Multiple Face Detected',
          icon: ShieldAlert,
          iconBg: 'bg-rose-100/80 text-rose-600 border-rose-200',
        };
      case 'warning':
        return {
          cardBg: 'bg-amber-50/70 border-amber-200/80 text-amber-800',
          title: 'Tab Switch Attempt',
          icon: ShieldAlert,
          iconBg: 'bg-amber-100/80 text-amber-600 border-amber-200',
        };
      default:
        return {
          cardBg: 'bg-blue-50/70 border-blue-200/80 text-blue-800',
          title: 'High Potential Match',
          icon: Info,
          iconBg: 'bg-blue-100/80 text-blue-600 border-blue-200',
        };
    }
  };

  return (
    <div className="p-4 sm:p-5 md:p-6 rounded-[15px] bg-white border border-[#EEF1F6] shadow-[0_4px_16px_rgba(15,23,42,0.04)] flex flex-col gap-4 sm:gap-5 h-full min-w-0">
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center pb-2 border-b border-[#EEF1F6] min-w-0">
        <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2 min-w-0">
          <span>AI Integrity Alerts</span>
        </h3>
        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-500 border border-rose-100 self-start sm:self-auto whitespace-nowrap">
          {activeAlerts.length || 8} active anomalies
        </span>
      </div>

      <div className="space-y-3 overflow-y-auto max-h-[300px] pr-1 sm:pr-1.5 scrollbar-thin min-w-0">
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
                className={`p-4 rounded-[14px] border flex flex-col gap-3 sm:flex-row sm:gap-4 sm:justify-between sm:items-start ${style.cardBg} min-w-0`}
              >
                <div className="flex gap-3 min-w-0">
                  <div className={`p-1.5 rounded-lg border flex items-center justify-center ${style.iconBg} h-8 w-8 mt-0.5`}>
                    <Icon className={tw.iconMd} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-xs font-bold text-[#111827] leading-tight">{style.title}</span>
                      <span className="text-[8px] font-semibold text-[#7B8AA3] whitespace-nowrap">{alert.timestamp}</span>
                    </div>
                    <p className="text-[10px] text-[#7B8AA3] font-semibold mt-1.5 leading-relaxed pr-0 sm:pr-2 break-words">
                      {alert.message}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => resolveAlert(alert.id)}
                  className="flex-shrink-0 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-extrabold uppercase tracking-wider bg-white hover:bg-slate-50 border border-[#EEF1F6] text-slate-600 transition-colors shadow-[0_4px_16px_rgba(15,23,42,0.04)] w-full sm:w-auto"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="whitespace-nowrap">Acknowledge & Resolve</span>
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {activeAlerts.length === 0 && (
          <div className="py-12 text-center text-[#7B8AA3] font-semibold text-xs border-2 border-dashed border-[#EEF1F6] rounded-xl">
            All security flags resolved.
          </div>
        )}
      </div>
    </div>
  );
};
