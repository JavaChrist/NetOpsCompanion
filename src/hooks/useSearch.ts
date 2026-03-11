import { useMemo } from 'react';
import { commands } from '../data/commands';
import { diagnostics } from '../data/diagnostics';
import { checklists } from '../data/checklists';
import type { CommandEntry, DiagnosticGuide, ChecklistTemplate } from '../types';

function normalize(str: string): string {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function matchesQuery(fields: string[], query: string): boolean {
  const q = normalize(query);
  return fields.some((f) => normalize(f).includes(q));
}

interface SearchFilters {
  category?: string;
  level?: string;
  tool?: string;
}

export function useCommandSearch(query: string, filters: SearchFilters = {}) {
  return useMemo(() => {
    let results: CommandEntry[] = commands;

    if (query.trim()) {
      results = results.filter((c) =>
        matchesQuery(
          [c.title, c.command, c.description, c.fieldUsage, ...c.tags, ...c.useCases],
          query
        )
      );
    }

    if (filters.category) {
      results = results.filter((c) => c.category === filters.category);
    }
    if (filters.level) {
      results = results.filter((c) => c.level === filters.level);
    }
    if (filters.tool) {
      results = results.filter((c) => c.tool === filters.tool);
    }

    return results;
  }, [query, filters.category, filters.level, filters.tool]);
}

export function useDiagnosticSearch(query: string, filters: SearchFilters = {}) {
  return useMemo(() => {
    let results: DiagnosticGuide[] = diagnostics;

    if (query.trim()) {
      results = results.filter((d) =>
        matchesQuery(
          [d.title, d.description, d.problemSummary, ...d.tags, ...d.probableCauses],
          query
        )
      );
    }

    if (filters.category) {
      results = results.filter((d) => d.category === filters.category);
    }
    if (filters.level) {
      results = results.filter((d) => d.level === filters.level);
    }

    return results;
  }, [query, filters.category, filters.level]);
}

export function useChecklistSearch(query: string, filters: SearchFilters = {}) {
  return useMemo(() => {
    let results: ChecklistTemplate[] = checklists;

    if (query.trim()) {
      results = results.filter((cl) =>
        matchesQuery([cl.title, cl.description, ...cl.tags], query)
      );
    }

    if (filters.category) {
      results = results.filter((cl) => cl.category === filters.category);
    }

    return results;
  }, [query, filters.category]);
}

export function useGlobalSearch(query: string) {
  const matchedCommands = useCommandSearch(query);
  const matchedDiagnostics = useDiagnosticSearch(query);
  const matchedChecklists = useChecklistSearch(query);

  return useMemo(() => {
    if (!query.trim()) return { commands: [], diagnostics: [], checklists: [], total: 0 };
    return {
      commands: matchedCommands.slice(0, 6),
      diagnostics: matchedDiagnostics.slice(0, 4),
      checklists: matchedChecklists.slice(0, 3),
      total: matchedCommands.length + matchedDiagnostics.length + matchedChecklists.length,
    };
  }, [query, matchedCommands, matchedDiagnostics, matchedChecklists]);
}
