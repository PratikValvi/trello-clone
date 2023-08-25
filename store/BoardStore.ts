import { create } from "zustand";
import { getTodosGroupedByColumn } from "@/lib/getTodosGroupedByColumn";
import { databases } from "@/appwrite";

interface BoardState {
  board: Board;
  searchString: string;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTodoOnDB: (todo: Todo, columnId: TypeColumn) => void;
  setSearchString: (searchString: string) => void;
  deleteTodo: (todoIndex: number, todo: Todo, columnId: string) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypeColumn, Column>()
  },
  searchString: "",
  getBoard: async () => {
    const board = await getTodosGroupedByColumn();
    set({ board })
  },
  setBoardState: (board) => set({ board }),
  updateTodoOnDB: async (todo, columnId) => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID,
      todo.$id,
      {
        title: todo.title,
        status: columnId,
      }
    )
  },
  setSearchString: (value) => set({ searchString: value }),
  deleteTodo: async (todoIndex, todo, columnId) => {
    const newColoumns = new Map(get().board.columns);
    newColoumns.get(columnId)?.todos.splice(todoIndex, 1);
    set({ board: { columns: newColoumns } });

    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID,
      todo.$id,
    )
  }
}))