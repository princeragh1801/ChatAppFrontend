// Import necessary modules and utilities
import axios from "axios";
import { LocalStorage } from "../utils";

// Create an Axios instance for API requests
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI,
  withCredentials: true,
  timeout: 120000,
});

// Add an interceptor to set authorization header with user token before requests
apiClient.interceptors.request.use(
  function (config) {
    // Retrieve user token from local storage
    const token = LocalStorage.get("token");
    // Set authorization header with bearer token
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// API functions for different actions
const loginUser = (data: { username: string; password: string }) => {
  return apiClient.post("user/login", data);
};

const registerUser = (data: {
  name : string;
  email: string;
  password: string;
  username: string;
}) => {
  return apiClient.post("user", data);
};

const logoutUser = () => {
  return apiClient.post("/user/logout");
};

const getAvailableUsers = () => {
  return apiClient.get("/user");
};

const getUserChats = () => {
  return apiClient.get(`/chat/user`);
};

const createUserChat = (receiverId: string) => {
  return apiClient.post(`/Chat/AddUserChat/${receiverId}`);
};

const createGroupChat = (data: { name: string; participants: string[] }) => {
  return apiClient.post(`/chat`, data);
};

const getGroupInfo = (chatId: string) => {
  return apiClient.get(`/Chat/GroupInfo/${chatId}`);
};

const updateGroupName = (chatId: string, name: string) => {
  return apiClient.post(`/chat/group/${chatId}`, { name });
};

const deleteGroup = (chatId: string) => {
  return apiClient.delete(`/chat/group/${chatId}`);
};

const deleteOneOnOneChat = (chatId: string) => {
  return apiClient.delete(`/chat/${chatId}`);
};

const addParticipantToGroup = (chatId: string, participantId: string) => {
  return apiClient.post(`/chat/group/${chatId}/${participantId}`);
};

const removeParticipantFromGroup = (chatId: string, participantId: string) => {
  return apiClient.delete(`/chat/group/${chatId}/${participantId}`);
};

const getChatMessages = (chatId: string) => {
  return apiClient.get(`/messages/${chatId}`);
};

const sendMessage = (chatId: string, content: string, attachments: File[]) => {
  const formData = new FormData();
  if (content) {
    formData.append("content", content);
  }
  attachments?.map((file) => {
    formData.append("attachments", file);
  });
  return apiClient.post(`/messages/${chatId}`, formData);
};

const deleteMessage = (messageId: string) => {
  return apiClient.delete(`/messages/${messageId}`);
};

// Export all the API functions
export {
  addParticipantToGroup,
  createGroupChat,
  createUserChat,
  deleteGroup,
  deleteOneOnOneChat,
  getAvailableUsers,
  getChatMessages,
  getGroupInfo,
  getUserChats,
  loginUser,
  logoutUser,
  registerUser,
  removeParticipantFromGroup,
  sendMessage,
  updateGroupName,
  deleteMessage,
};
