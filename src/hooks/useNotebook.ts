import { useNotebookStore } from "../stores/notebookStore";

/** notebookStore の薄いラッパーフック（将来の拡張に備えた層） */
export function useNotebook() {
  const { notes, addNote, deleteNote, clearAll } = useNotebookStore();
  return { notes, addNote, deleteNote, clearAll };
}
