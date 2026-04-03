import { create } from 'zustand'

interface UiState {
  expandedProject: string | null
  showCompleted: boolean
  toggleProject: (id: string) => void
  toggleCompleted: () => void
}

export const useUiStore = create<UiState>((set) => ({
  expandedProject: null,
  showCompleted: false,
  toggleProject: (id) =>
    set((state) => ({
      expandedProject: state.expandedProject === id ? null : id,
    })),
  toggleCompleted: () =>
    set((state) => ({ showCompleted: !state.showCompleted })),
}))
