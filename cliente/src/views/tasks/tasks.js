import { renderRouter } from "../../router/router";
import { getSession, logout } from "../../services/auth.service";
import { getTasks, deleteTask, getAllTasks } from "../../services/task.service";
import Swal from 'sweetalert2';
import { getUsers } from "../../services/users.service";

export function renderTasks() {
  return `
<header class="border-b border-blue-100 bg-white/90 backdrop-blur">
  <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
    <a class="text-xl font-black text-blue-900" href="/">TaskFlowSPA</a>
    <nav class="hidden gap-3 md:flex">
      <a class="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700" href="/dashboard">Dashboard</a>
      <a class="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white" href="/tasks">Tareas</a>
      <a class="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700" href="/profile">Perfil</a>
      <a id= "admin" class="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700" href="/admin">Admin</a>
      <a id= "logout" class="rounded-full px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
        href="/login">Logout</a>
    </nav>
  </div>
</header>

<main class="mx-auto max-w-6xl px-6 py-10">
  <section class="flex flex-col gap-4 rounded-[2rem] bg-blue-600 px-8 py-10 text-white md:flex-row md:items-end md:justify-between">
    <div>
      <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">CRUD de tareas</p>
      <h1 class="mt-3 text-4xl font-black tracking-tight">Mis tareas</h1>
    </div>
    <a id="createBtn" class="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50"
      href="/task-form">Crear tarea</a>
  </section>

  <section id="tasks-list" class="mt-8 grid gap-4">
    <p class="text-slate-400">Cargando tareas...</p>
  </section>
</main>`
}

export async function setupTasks() {
  const tasksList = document.getElementById("tasks-list");
  const createTask = document.getElementById("createBtn")

  createTask.addEventListener("click", () => {
    sessionStorage.removeItem("editTaskId")
  })

  const logOut = document.getElementById("logout");
  logOut.addEventListener("click", () => {
    logout();
  })

  const session = getSession();
  const userRol = session.roles[0]

  if (userRol === "USER") {
    const admin = document.getElementById("admin")

    admin.classList.add("hidden")
    

    const tasks = await getTasks(session.id);

    if (tasks.length === 0) {
      tasksList.innerHTML = `<p class="text-slate-400">No tienes tareas aún.</p>`;
      return;
    }
    tasksList.innerHTML = "";
    tasks.forEach(task => {
      console.log(task)
      tasksList.innerHTML += `<article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
      <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">${task.status}</p>
          <h2 class="mt-2 text-2xl font-bold text-slate-900">${task.title}</h2>
          <p class="mt-3 max-w-2xl text-slate-600">${task.description ? task.description : "Sin descripción"}</p>
        </div>
        <div class="flex gap-3">
          <a data-id="${task.id}" class="edit-btn rounded-full border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 cursor-pointer">Editar</a>
          <button data-id="${task.id}" class="delete-btn rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 cursor-pointer">Eliminar</button>
        </div>
      </div>
    </article>`
    });

    tasksList.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const confirm = await Swal.fire({
          icon: "warning",
          title: "¿Eliminar tarea?",
          showCancelButton: true,
          confirmButtonText: "Sí, eliminar",
          cancelButtonText: "Cancelar"
        });
        if (confirm.isConfirmed) {
          await deleteTask(btn.dataset.id);
          renderRouter();
        }
      });
    });

    tasksList.querySelectorAll(".edit-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        sessionStorage.setItem("editTaskId", btn.dataset.id);
        window.history.pushState({}, "", "/task-form");
        renderRouter();
      });
    });
  } else {
    const tasks = await getAllTasks();
    const allUsers = await getUsers();
    

    if (tasks.length === 0) {
      tasksList.innerHTML = `<p class="text-slate-400">No hay tareas existentes.</p>`;
      return;
    }
    tasksList.innerHTML = "";
    tasks.forEach(task => {

      const user = allUsers.find(user => user.id === task.userId)
      tasksList.innerHTML += `<article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
      <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p class="mt-3 max-w-2xl text-slate-600">${user ? user.name : "Usuario Desconocido"} ${user ? user.lastname : ""}</p>
          <p class="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">${task.status}</p>
          <h2 class="mt-2 text-2xl font-bold text-slate-900">${task.title}</h2>
          <p class="mt-3 max-w-2xl text-slate-600">${task.description ? task.description : "Sin descripción"}</p>
        </div>
        <div class="flex gap-3">
          <a data-id="${task.id}" class="edit-btn rounded-full border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 cursor-pointer">Editar</a>
          <button data-id="${task.id}" class="delete-btn rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 cursor-pointer">Eliminar</button>
        </div>
      </div>
    </article>`
    });

    tasksList.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const confirm = await Swal.fire({
          icon: "warning",
          title: "¿Eliminar tarea?",
          showCancelButton: true,
          confirmButtonText: "Sí, eliminar",
          cancelButtonText: "Cancelar"
        });
        if (confirm.isConfirmed) {
          await deleteTask(btn.dataset.id);
          renderRouter();
        }
      });
    });

    tasksList.querySelectorAll(".edit-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        sessionStorage.setItem("editTaskId", btn.dataset.id);
        window.history.pushState({}, "", "/task-form");
        renderRouter();
      });
    });
  }



}