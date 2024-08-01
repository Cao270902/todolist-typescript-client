import React, { useEffect, useState } from "react";
import TaskForm from "../components/TaskForm/TaskForm";
import SearchGroup from "../components/SearchGroup/SearchGroup";
import TaskList from "../components/TaskList/TaskList";
import Loading from "../components/Loading/Loading";
import {
  getTasks,
  createTasks,
  updateTasks,
  deleteTasks,
  deleteTask,
  Task,
  TasksResponse,
} from "../services/task-api";

import { getQueryString } from "../utils";

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [filterValue, setFilterValue] = useState<string>("");
  const [taskUpdateId, setTaskUpdateId] = useState<string | null>(null);
  const [task, setTask] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async (query: string = "") => {
    setIsLoading(true);
    try {
      const data: TasksResponse = await getTasks(query);
      if (data.tasks === "Not found") {
        setTasks([]);
      } else {
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModifyTask = async () => {
    if (!task.trim()) {
      return;
    }

    const newTask: Task = { title: task, isChecked: false };
    setIsLoading(true);
    try {
      if (taskUpdateId) {
        await updateTasks({ ...newTask, id: taskUpdateId });
        setTaskUpdateId(null);
      } else {
        await createTasks(newTask);
      }
      setTask("");
      await fetchTasks();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async () => {
    setIsLoading(true);
    try {
      const tasksToDelete = tasks.filter((task) => task.isChecked);

      for (const task of tasksToDelete) {
        await deleteTasks(task.id as string);
      }
      await fetchTasks();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickDeleteTask = async (id: string) => {
    const taskToDelete = tasks.find((task) => task.id === id);

    try {
      if (taskToDelete) {
        await deleteTask(taskToDelete.id as string);
        await fetchTasks();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleTask = async (id: string) => {
    const taskToToggle = tasks.find((task) => task.id === id);
    if (taskToToggle) {
      const updatedTask: Task = {
        ...taskToToggle,
        isChecked: !taskToToggle.isChecked,
      };
      setIsLoading(true);
      try {
        await updateTasks(updatedTask);
        await fetchTasks();
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleToggleAllTasks = async (isChecked: boolean) => {
    setIsLoading(true);
    try {
      const updatedTasks = tasks.map((task) => ({ ...task, isChecked }));
      for (const task of updatedTasks) {
        await updateTasks(task);
      }
      await fetchTasks();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickUpdateTask = (id: string) => {
    const taskToUpdate = tasks.find((task) => task.id === id);
    if (taskToUpdate) {
      setTaskUpdateId(id);
      setTask(taskToUpdate.title);
    }
  };

  const handleFilter = async () => {
    const query = getQueryString({
      title: searchValue,
      isChecked:
        filterValue === "1" ? true : filterValue === "-1" ? false : null,
    });

    await fetchTasks(query);
  };

  useEffect(() => {
    handleFilter();
  }, [searchValue, filterValue]);

  return (
    <div className="wrapper">
      <TaskForm
        task={task}
        setTask={setTask}
        handleModifyTask={handleModifyTask}
        handleDeleteTask={handleDeleteTask}
        taskUpdateId={taskUpdateId}
      />
      <SearchGroup
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
      />
      <Loading isLoading={isLoading} />
      <TaskList
        tasks={tasks}
        handleClickUpdateTask={handleClickUpdateTask}
        handleClickDeleteTask={handleClickDeleteTask}
        handleToggleTask={handleToggleTask}
        handleToggleAllTasks={handleToggleAllTasks}
      />
      <div id="pagination"></div>
    </div>
  );
};

export default Home;
