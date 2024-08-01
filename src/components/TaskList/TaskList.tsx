import React from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Task } from "../../services/task-api"; 

interface TaskListProps {
  tasks: Task[];
  handleClickUpdateTask: (id: string) => void;
  handleClickDeleteTask: (id: string) => void;
  handleToggleTask: (id: string) => void;
  handleToggleAllTasks: (isChecked: boolean) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  handleClickUpdateTask,
  handleClickDeleteTask,
  handleToggleTask,
  handleToggleAllTasks,
}) => {
  if (tasks.length === 0) {
    return (
      <div className="m-3">
        <p>No tasks found</p>
      </div>
    );
  }

  return (
    <div id="task-list" className="m-3">
      <div className="task mb-2 flex items-center rounded border-b border-l border-r bg-slate-200 p-2 font-serif shadow-md">
        <div className="flex items-center justify-center pl-4">
          <input
            type="checkbox"
            onChange={(e) => handleToggleAllTasks(e.target.checked)}
            className="h-5 w-5 cursor-pointer"
          />
        </div>
        <div className="ml-[16px]">
          <p className="font-black">Task Name</p>
        </div>
        <div className="ml-auto mr-6">
          <p className="font-black">Action</p>
        </div>
      </div>

      {tasks.map((task) => (
        <div
          key={task.id} // Đảm bảo mỗi phần tử có key duy nhất
          className="flex items-center justify-between rounded border pb-2 pl-6 pr-6 pt-2 shadow-md"
        >
          <div className="flex items-center justify-center gap-5">
            <div className="flex items-center justify-center">
              <input
                type="checkbox"
                checked={task.isChecked}
                onChange={() => handleToggleTask(task.id!)}
                className="h-4 w-4 cursor-pointer"
              />
            </div>
            <div>
              <input
                type="text"
                value={task.title}
                className={`${task.isChecked ? "task line-through" : "task"}`}
                readOnly
              />
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <div>
              <FaEdit
                data-id={task.id}
                onClick={() => handleClickUpdateTask(task.id!)}
                className="text-2xl text-cyan-500 hover:cursor-pointer hover:text-cyan-600"
              />
            </div>
            <div>
              <MdDelete
                id="delete-task"
                data-id={task.id}
                onClick={() => handleClickDeleteTask(task.id!)}
                className="text-2xl text-red-500 hover:cursor-pointer hover:text-red-600"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
