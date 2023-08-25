import { create } from "zustand";
import { getTodosGroupedByColumn } from "@/lib/getTodosGroupedByColumn";
import { databases, ID } from "@/appwrite";

interface BoardState {
  board: Board;
  searchString: string;
  newTaskInput: string;
  newTaskType: string;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTodoOnDB: (todo: Todo, columnId: TypeColumn) => void;
  setSearchString: (searchString: string) => void;
  deleteTodo: (todoIndex: number, todo: Todo, columnId: string) => void;
  setNewTaskInput: (input: string) => void;
  setNewTaskType: (columnId: string) => void;
  addTask: (todo: string, columnId: string) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypeColumn, Column>()
  },
  searchString: "",
  newTaskInput: "",
  newTaskType: "todo",
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
  },
  setNewTaskInput: (value) => set({ newTaskInput: value }),
  setNewTaskType: (value) => set({ newTaskType: value }),
  addTask: async (todo, columnId) => {
    const { $id } = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID,
      ID.unique(),
      {
        title: todo,
        status: columnId
      }
    );

    set({ newTaskInput: "" });

    set((state) => {
      const newColoumns = new Map(state.board.columns);

      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
      };

      const column = newColoumns.get(columnId);

      if (!column) {
        newColoumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        });
      } else {
        newColoumns.get(columnId)?.todos.push(newTodo);
      }

      return {
        board: {
          columns: newColoumns,
        }
      }
    })
  },
}))