import { databases } from "@/appwrite"

export const getTodosGroupedByColumn = async () => {
  const data = await databases.listDocuments(
    process.env.NEXT_PUBLIC_DATABASE_ID!,
    process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!
  );

  const todos = data.documents;

  const groupedTodos = todos.reduce((acc, todo) => {
    if (!acc.has(todo.status)) {
      acc.set(todo.status, {
        id: todo.status,
        todos: []
      });
    }
    const todos = acc.get(todo.status)!.todos
    todos.push({
      $id: todo.$id,
      $createdAt: todo.$createdAt,
      title: todo.title,
      status: todo.status
    })
    return acc;
  }, new Map<TypeColumn, Column>());

  const columnTypes: TypeColumn[] = ["todo", "inprogress", "done"];

  for (const type of columnTypes) {
    if (!groupedTodos.has(type)) {
      groupedTodos.set(type, {
        id: type,
        todos: []
      })
    }
  }

  const sortedColumns = new Map(
    Array.from(groupedTodos.entries()).sort(
      (a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
    )
  )

  const board: Board = {
    columns: sortedColumns
  }

  return board;
}