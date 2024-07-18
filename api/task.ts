import axios from "axios";
import { API_URL, TASK_URL } from "./endpoint";

export const getTasks = async () => {
  try {
    const response = await axios.get(`${API_URL}${TASK_URL}`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

export const createTask = async (title: string, dueDate: Date) => {
  try {
    const response = await axios.post(`${API_URL}${TASK_URL}`, {
      title,
      isFinished: false,
      dueDate: dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

export const updateTask = async (id: string, title: string, dueDate: Date) => {
  try {
    const response = await axios.put(`${API_URL}${TASK_URL}/${id}`, {
      title,
      updatedAt: new Date().toISOString(),
      dueDate: dueDate,
    });

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

export const updateTaskStatus = async (id: string, isFinished: boolean) => {
  try {
    const response = await axios.put(`${API_URL}${TASK_URL}/${id}`, {
      isFinished,
    });

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

export const deleteTask = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}${TASK_URL}/${id}`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};
