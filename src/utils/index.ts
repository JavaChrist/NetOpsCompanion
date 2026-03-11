import { categories } from '../data/categories';
import { commands } from '../data/commands';
import { diagnostics } from '../data/diagnostics';
import { checklists } from '../data/checklists';

export function getCategoryById(id: string) {
  return categories.find((c) => c.id === id);
}

export function getCommandById(id: string) {
  return commands.find((c) => c.id === id);
}

export function getDiagnosticById(id: string) {
  return diagnostics.find((d) => d.id === id);
}

export function getChecklistById(id: string) {
  return checklists.find((cl) => cl.id === id);
}

export function getCategoryColor(color: string): string {
  const map: Record<string, string> = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    violet: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    red: 'bg-red-500/10 text-red-400 border-red-500/30',
    pink: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
    green: 'bg-green-500/10 text-green-400 border-green-500/30',
    teal: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    slate: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
  };
  return map[color] ?? map['slate'];
}

export function getLevelColor(level: string): string {
  const map: Record<string, string> = {
    beginner: 'bg-green-500/10 text-green-400 border-green-500/30',
    intermediate: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    advanced: 'bg-red-500/10 text-red-400 border-red-500/30',
  };
  return map[level] ?? '';
}

export function getLevelLabel(level: string): string {
  const map: Record<string, string> = {
    beginner: 'Débutant',
    intermediate: 'Intermédiaire',
    advanced: 'Avancé',
  };
  return map[level] ?? level;
}

export function getToolColor(tool: string): string {
  const map: Record<string, string> = {
    CMD: 'bg-slate-500/10 text-slate-300',
    PowerShell: 'bg-blue-500/10 text-blue-300',
    Nmap: 'bg-orange-500/10 text-orange-300',
    Wireshark: 'bg-teal-500/10 text-teal-300',
    Terrain: 'bg-violet-500/10 text-violet-300',
    ONVIF: 'bg-pink-500/10 text-pink-300',
    SSH: 'bg-cyan-500/10 text-cyan-300',
  };
  return map[tool] ?? 'bg-slate-500/10 text-slate-300';
}

export function formatRelativeDate(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Il y a ${days}j`;
}

export function countCommandsByCategory() {
  const counts: Record<string, number> = {};
  commands.forEach((c) => {
    counts[c.category] = (counts[c.category] || 0) + 1;
  });
  return counts;
}
