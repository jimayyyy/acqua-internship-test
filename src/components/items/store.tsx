import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface State {
  TODO_ITEMS: string[];
  DONE_ITEMS: string[];
  moveItem: (todoItems: string[], doneItems: string[]) => void;
}

const useStore = create<State>()(
  persist(
    (set) => ({
      TODO_ITEMS: [
        'AI Fish or Phish',
        'Compile Coral DB',
        'AI Sub Navigation',
        'Server Water Cooling',
        'Whale Song AI',
        'Marine Chatbot',
      ],
      DONE_ITEMS: ['Dolphin Comm Sim'],

      moveItem: (todoItems, doneItems) =>
        set(() => {
          return {
            TODO_ITEMS: todoItems,
            DONE_ITEMS: doneItems,
          };
        }),
    }),
    {
      name: 'app-storage',
      getStorage: () => localStorage,
      partialize: (state) => ({
        TODO_ITEMS: state.TODO_ITEMS,
        DONE_ITEMS: state.DONE_ITEMS,
      }),
    },
  ),
);

export default useStore;
