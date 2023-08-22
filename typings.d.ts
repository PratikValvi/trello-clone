type TypeColumn = "todo" | "inprogress" | "done"

type todos = {
  $id: string,
  $createdAt: string,
  title: string,
  status: TypeColumn
}

interface Column {
  id: TypeColumn
  todos: todos[]
}


interface Board {
  columns: Map<TypeColumn, Column>
}