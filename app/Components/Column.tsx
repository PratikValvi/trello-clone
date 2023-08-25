import { PlusCircleIcon } from '@heroicons/react/20/solid';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import TodoCard from './TodoCard';
import { useBoardStore } from '@/store/BoardStore';
import { useModalStore } from '@/store/ModalStore';

type Props = {
  id: string,
  todos: Todo[],
  index: number
}

const idToColumnText = (id: string) => {
  switch (id) {
    case "todo":
      return "To Do";
    case "inprogress":
      return "In Progress";
    case "done":
      return "Done";
  }
};

const Column = ({ id, todos, index }: Props) => {

  const [searchString, setNewTaskType] = useBoardStore((state) => [state.searchString, state.setNewTaskType]);

  const [openModal] = useModalStore((state) => [state.openModal]);

  let todosToBeRendered = todos
  if (searchString) {
    todosToBeRendered = todos
      .filter((todo) => todo.title.toLowerCase().includes(searchString.toLowerCase()))
  }

  const handleOpenModal = () => {
    setNewTaskType(id);
    openModal();
  }

  return (
    <Draggable draggableId={id} index={index}>
      {
        (provided) => (
          <div
            {...provided.dragHandleProps}
            {...provided.draggableProps}
            ref={provided.innerRef}
          >
            <Droppable droppableId={index.toString()} type='card'>
              {
                (provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`p-2 rounded-2xl shadow-sm ${snapshot.isDraggingOver ? "bg-green-200" : "bg-white/50"}`}
                  >
                    <h2
                      className='flex justify-between font-bold text-xl p-2'
                    >
                      {idToColumnText(id)}
                      <span className='text-gray-500 bg-gray-200 rounded-full px-2 py-1 text-sm'>{todosToBeRendered.length}</span>
                    </h2>

                    <div
                      className='space-y-2'
                    >
                      {
                        todos.map((todo, index) => {
                          if (todo.title.toLowerCase().includes(searchString?.toLowerCase())) {
                            return (
                              <Draggable
                                key={todo.$id}
                                draggableId={todo.$id}
                                index={index}
                              >
                                {
                                  (provided) => (
                                    <TodoCard
                                      todo={todo}
                                      index={index}
                                      id={id}
                                      innerRef={provided.innerRef}
                                      draggableProps={provided.draggableProps}
                                      dragHandleProps={provided.dragHandleProps}
                                    />
                                  )
                                }
                              </Draggable>
                            )
                          }
                          return null
                        })
                      }
                      {provided.placeholder}
                      <div className='flex items-end justify-end p-2'>
                        <button className='text-green-500 hover:text-green-600'>
                          <PlusCircleIcon
                            className='h-10 w-10'
                            onClick={handleOpenModal}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              }
            </Droppable>
          </div>
        )
      }
    </Draggable>
  )
}

export default Column