import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/",    // your Django API root
});

// — Attach JWT “Bearer <token>” on every request —
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// — AUTH —

// Login: returns { user, access, refresh }
export async function login({ email, password }) {
  const res = await api.post("auth/login/", { email, password });
  // store the access token & user
  localStorage.setItem("token", res.data.access);
  localStorage.setItem("user", JSON.stringify(res.data.user));
  return res.data;
}

// Signup: returns { user, access, refresh }
export async function signup({ username, email, password }) {
  const res = await api.post("auth/signup/", { username, email, password });
  localStorage.setItem("token", res.data.access);
  localStorage.setItem("user", JSON.stringify(res.data.user));
  return res.data;
}

// Logout: clear stored token & user
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

// — PROFILES —

// Get current user’s profile
export async function fetchMyProfile() {
  const user = JSON.parse(localStorage.getItem("user"));
  return api.get(`profiles/${user.id}/`).then((r) => r.data);
}

// — TASKS —

// List all tasks
export async function fetchTasks() {
  return api.get("tasks/").then((r) => r.data);
}

// Create a new task
export async function createTask(taskData) {
  return api.post("tasks/", taskData).then((r) => r.data);
}

// Claim a task
export async function claimTask(taskId) {
  return api.post(`tasks/${taskId}/claim/`).then((r) => r.data);
}

// Get detail for one task
export async function fetchTask(taskId) {
  return api.get(`tasks/${taskId}/`).then((r) => r.data);
}

// — COMMISSIONED TASKS —

// List all tasks created by the current user
export async function fetchCommissionedTasks() {
  return api.get("commissioned-tasks/").then((r) => r.data);
}

// Complete a task and transfer tokens
export async function completeTaskTransaction({ taskId, receiverId, hours }) {
  return api.post("complete_task_transaction/", {
    task_id: taskId,
    receiver_id: receiverId,
    hours,
  }).then((r) => r.data);
}

// — JOB HISTORY —

// Get completed jobs for a user
export async function fetchJobHistory(userId) {
  return api.get(`jobs/history/${userId}/`).then((r) => r.data);
}

// — SERVICES —

// List all services
export async function fetchServices() {
  return api.get("services/").then((r) => r.data);
}

export default api;
