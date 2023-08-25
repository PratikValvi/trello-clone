"use client";

import { FormEvent, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useModalStore } from '@/store/ModalStore';
import { useBoardStore } from '@/store/BoardStore';
import TaskTypeRadioGroup from './TaskTypeRadioGroup';

const Modal = () => {
  const [isOpen, closeModal] = useModalStore((state) => [state.isOpen, state.closeModal]);

  const [newTaskInput, newTaskType, setNewTaskInput, addTask] = useBoardStore((state) => [state.newTaskInput, state.newTaskType, state.setNewTaskInput, state.addTask]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //Add Task
    addTask(newTaskInput, newTaskType);
    closeModal();
  }

  return (
    // Use the `Transition` component at the root level
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="form" onClose={closeModal} onSubmit={(e) => handleSubmit(e)}>
        <div className="fixed inset-0 flex items-center justify-center p-4 text-center z-99">
          {/*
          Use one Transition.Child to apply one transition to the backdrop...
        */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          {/*
          ...and another Transition.Child to apply a separate transition
          to the contents.
        */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-md tranform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900 pb-2"
              >
                Add a task
              </Dialog.Title>
              <div className='mt-2'>
                <input
                  className='w-full border border-gray-300 rounded-md outline-none p-5'
                  type='text'
                  value={newTaskInput}
                  placeholder='Enter a task here...'
                  onChange={(e) => setNewTaskInput(e.target.value)}
                />
              </div>
              <TaskTypeRadioGroup />
              <div>
                <button
                  type="submit"
                  disabled={!newTaskInput}
                  className='inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 test-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offet-2 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed'
                >
                  Add Task
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export default Modal;