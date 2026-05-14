import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Note, NoteTag } from "../types";

interface NotebookStore {
  notes: Note[];
  addNote: (title: string, content: string, tag: NoteTag) => void;
  deleteNote: (id: string) => void;
  clearAll: () => void;
}

export const useNotebookStore = create<NotebookStore>()(
  persist(
    (set) => ({
      notes: [
        {
          id: "sample-1",
          title: "チューリップ（北エリア）",
          content: "真っ赤なアパルドーンという品種が特にきれいだった。朝9時半頃で比較的空いていた。",
          tag: "flower",
          createdAt: "2027-03-28T09:32:00+09:00",
        },
        {
          id: "sample-2",
          title: "カフェのチューリップパフェ",
          content: "季節限定！見た目も味も最高。650円。売り切れ注意。",
          tag: "food",
          createdAt: "2027-03-28T11:15:00+09:00",
        },
      ],
      addNote: (title, content, tag) =>
        set((state) => ({
          notes: [
            {
              id: Date.now().toString(),
              title,
              content,
              tag,
              createdAt: new Date().toISOString(),
            },
            ...state.notes,
          ],
        })),
      deleteNote: (id) =>
        set((state) => ({ notes: state.notes.filter((n) => n.id !== id) })),
      clearAll: () => set({ notes: [] }),
    }),
    { name: "expo2027-notebook" }
  )
);
