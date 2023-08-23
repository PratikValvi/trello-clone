type TypeColumn = "todo" | "inprogress" | "done"

type Todo = {
  $id: string,
  $createdAt: string,
  title: string,
  status: TypeColumn
}

interface Column {
  id: TypeColumn
  todos: Todo[]
}


interface Board {
  columns: Map<TypeColumn, Column>
}