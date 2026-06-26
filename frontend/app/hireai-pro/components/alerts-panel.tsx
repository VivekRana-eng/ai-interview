'use client';
import * as tw from '@/lib/tailwindClasses'

import React, { useState } from 'react';
import { useDashboardStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ShieldCheck, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export const AlertsPanel: React.FC = () => {
  const { alerts, resolveAlert } = useDashboardStore();
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'warning' | 'info'>('all');

  const activeAlerts = alerts.filter((a) => !a.resolved);
  
  const filteredAlerts = activeAlerts.filter((a) => {
    return filterSeverity === 'all' || a.severity === filterSeverity;
  });

  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case 'critical':
        return {
          bg: 'bg-rose-500/10 dark:bg-rose-500/10 light:bg-rose-50 border-rose-500/20 text-rose-400 dark:text-rose-400 light:text-rose-700',
          badge: 'bg-rose-500/20 text-rose-400 dark:text-rose-400 light:text-rose-700',
          icon: ShieldAlert
        };
      case 'warning':
        return {
          bg: 'bg-amber-500/10 dark:bg-amber-500/10 light:bg-amber-50 border-amber-500/20 text-amber-400 dark:text-amber-400 light:text-amber-700',
          badge: 'bg-amber-500/20 text-amber-400 dark:text-amber-400 light:text-amber-700',
          icon: AlertTriangle
        };
      default:
        return {
          bg: 'bg-blue-500/10 dark:bg-blue-500/10 light:bg-blue-50 border-blue-500/20 text-blue-400 dark:text-blue-400 light:text-blue-700',
          badge: 'bg-blue-500/20 text-blue-400 dark:text-blue-400 light:text-blue-700',
          icon: Info
        };
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h3 className="text-sm font-bold text-white dark:text-white light:text-slate-900">AI Integrity Alerts</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Real-time candidate telemetry analysis alerts</p>
        </div>

        {/* Severity Filter */}
        <div className="flex bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-100 p-0.5 rounded-xl border border-slate-900 dark:border-slate-900 light:border-slate-200">
          {(['all', 'critical', 'warning', 'info'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`
                px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all
                ${filterSeverity === sev 
                  ? 'bg-slate-800 dark:bg-slate-800 light:bg-white text-white dark:text-white light:text-slate-800 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-300 dark:hover:text-slate-300 light:hover:text-slate-700'
                }
              `}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="flex-1 overflow-y-auto max-h-[380px] space-y-2.5 pr-1.5 scrollbar-thin">
        <AnimatePresence initial={false}>
          {filteredAlerts.map((alert) => {
            const styles = getSeverityStyle(alert.severity);
            const Icon = styles.icon;

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`
                  p-4 rounded-2xl border backdrop-blur-md flex gap-3.5 items-start justify-between
                  shadow-md dark:shadow-md light:shadow-sm
                  ${styles.bg}
                `}
              >
                <div className="flex gap-3">
                  <div className="mt-0.5 p-1.5 rounded-lg bg-slate-950/60 border border-slate-900/80">
                    <Icon className={tw.iconMd} />
                  </div>
                  <div>
                    <div className={tw.flexItemsGap2}>
                      <span className="font-bold text-xs text-white dark:text-white light:text-slate-800">{alert.candidateName}</span>
                      <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded uppercase border border-slate-900/40 tracking-wider ${styles.badge}`}>
                        {alert.severity}
                      </span>
                    </div>
                    <span className="block font-semibold text-[11px] text-slate-200 dark:text-slate-200 light:text-slate-800 mt-1">{alert.type}</span>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{alert.message}</p>
                    <span className="block text-[9px] text-slate-500 mt-1.5 font-medium">{alert.timestamp}</span>
                  </div>
                </div>

                <button
                  onClick={() => resolveAlert(alert.id)}
                  className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-slate-950/60 border border-slate-900 hover:border-slate-800 hover:text-white transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Resolve</span>
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredAlerts.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-600 border border-dashed border-slate-900/40 dark:border-slate-900/40 light:border-slate-200 rounded-2xl">
            <ShieldCheck className="w-8 h-8 text-emerald-500/40 mb-2" />
            <span className="text-xs font-semibold text-slate-500">Security Feed Clear</span>
            <span className="text-[10px] text-slate-500 mt-0.5">No active alerts of severity "{filterSeverity}"</span>
          </div>
        )}
      </div>
    </div>
  );
};
