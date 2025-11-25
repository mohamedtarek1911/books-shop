import { create } from "zustand";

interface BooksStore {
  count: number;
  shouldShake: boolean;
  setCount: (count: number) => void;
  incrementCount: () => void;
  decrementCount: () => void;
  triggerShake: () => void;
}

export const useBooksStore = create<BooksStore>((set) => ({
  count: 0,
  shouldShake: false,
  setCount: (count) => set({ count }),
  incrementCount: () => {
    set((state) => ({ count: state.count + 1 }));
    // Trigger shake animation
    set({ shouldShake: true });
    setTimeout(() => set({ shouldShake: false }), 500);
  },
  decrementCount: () =>
    set((state) => ({ count: Math.max(0, state.count - 1) })),
  triggerShake: () => {
    set({ shouldShake: true });
    setTimeout(() => set({ shouldShake: false }), 500);
  },
}));
