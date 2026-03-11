import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FavoritesState, HistoryEntry, ChecklistProgress, AppSettings } from '../types';

// ─── Favorites Store ──────────────────────────────────────────────────────

interface FavoritesStore extends FavoritesState {
  toggleFavorite: (type: keyof FavoritesState, id: string) => void;
  isFavorite: (type: keyof FavoritesState, id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      commands: [],
      diagnostics: [],
      checklists: [],
      toggleFavorite: (type, id) => {
        set((state) => {
          const list = state[type] as string[];
          const exists = list.includes(id);
          return {
            [type]: exists ? list.filter((i) => i !== id) : [...list, id],
          };
        });
      },
      isFavorite: (type, id) => (get()[type] as string[]).includes(id),
    }),
    { name: 'netops-favorites' }
  )
);

// ─── History Store ────────────────────────────────────────────────────────

interface HistoryStore {
  entries: HistoryEntry[];
  addEntry: (entry: Omit<HistoryEntry, 'visitedAt'>) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (entry) => {
        set((state) => {
          const newEntry: HistoryEntry = {
            ...entry,
            visitedAt: new Date().toISOString(),
          };
          const filtered = state.entries.filter(
            (e) => !(e.type === entry.type && e.id === entry.id)
          );
          return { entries: [newEntry, ...filtered].slice(0, 50) };
        });
      },
      clearHistory: () => set({ entries: [] }),
    }),
    { name: 'netops-history' }
  )
);

// ─── Checklist Progress Store ────────────────────────────────────────────

interface ChecklistStore {
  progress: Record<string, ChecklistProgress>;
  toggleItem: (checklistId: string, itemId: string) => void;
  isChecked: (checklistId: string, itemId: string) => boolean;
  resetChecklist: (checklistId: string) => void;
  getProgress: (checklistId: string) => number;
}

export const useChecklistStore = create<ChecklistStore>()(
  persist(
    (set, get) => ({
      progress: {},
      toggleItem: (checklistId, itemId) => {
        set((state) => {
          const existing = state.progress[checklistId] || {
            checklistId,
            checkedItems: {},
            startedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          return {
            progress: {
              ...state.progress,
              [checklistId]: {
                ...existing,
                checkedItems: {
                  ...existing.checkedItems,
                  [itemId]: !existing.checkedItems[itemId],
                },
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },
      isChecked: (checklistId, itemId) =>
        get().progress[checklistId]?.checkedItems[itemId] ?? false,
      resetChecklist: (checklistId) => {
        set((state) => {
          const { [checklistId]: _, ...rest } = state.progress;
          return { progress: rest };
        });
      },
      getProgress: (checklistId) => {
        const p = get().progress[checklistId];
        if (!p) return 0;
        const checked = Object.values(p.checkedItems).filter(Boolean).length;
        const total = Object.keys(p.checkedItems).length;
        return total > 0 ? Math.round((checked / total) * 100) : 0;
      },
    }),
    { name: 'netops-checklists' }
  )
);

// ─── Settings Store ──────────────────────────────────────────────────────

interface SettingsStore extends AppSettings {
  update: (settings: Partial<AppSettings>) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      compactMode: false,
      showWelcome: true,
      update: (settings) => set((state) => ({ ...state, ...settings })),
    }),
    { name: 'netops-settings' }
  )
);

// ─── Search Store (non-persisted) ────────────────────────────────────────

interface SearchStore {
  query: string;
  setQuery: (q: string) => void;
  activeFilters: {
    category?: string;
    level?: string;
    tool?: string;
  };
  setFilter: (key: string, value: string | undefined) => void;
  clearFilters: () => void;
}

export const useSearchStore = create<SearchStore>()((set) => ({
  query: '',
  setQuery: (q) => set({ query: q }),
  activeFilters: {},
  setFilter: (key, value) =>
    set((state) => ({
      activeFilters: { ...state.activeFilters, [key]: value },
    })),
  clearFilters: () => set({ activeFilters: {} }),
}));
