import { getSession, logout } from "../../services/auth.service";
import Swal from 'sweetalert2';
import { getTasks } from "../../services/task.service";

export function renderDashboard() {
  return `
<header class="border-b border-blue-100 bg-white/90 backdrop-blur">
  <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
    <a class="text-xl font-black text-blue-900" href="/">TaskFlowSPA</a>
    <nav class="hidden gap-3 md:flex">
      <a class="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
        href="/dashboard">Dashboard</a>
      <a class="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700"
        href="/tasks">Tareas</a>
      <a class="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700"
        href="/profile">Perfil</a>
      <a id="admin" class="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700"
        href="/admin">Admin</a>
      <a id= "logout" class="rounded-full px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
        href="/login">Logout</a>
    </nav>
  </div>
</header>

<main class="mx-auto max-w-6xl px-6 py-10">
  <section class="rounded-[2rem] bg-blue-600 px-8 py-10 text-white shadow-xl shadow-blue-100">
    <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">Dashboard principal</p>
    <h1 id="welcome" class="mt-3 text-4xl font-black tracking-tight">Bienvenida, Ana.</h1>
    <p class="mt-4 max-w-2xl text-blue-50">Resumen general del trabajo del usuario, accesos rapidos y estado actual de
      productividad.</p>
  </section>

  <section class="mt-8 grid gap-4 md:grid-cols-3">
    <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
      <p class="text-sm text-slate-500">Tareas activas</p>
      <p id="count-active" class="mt-3 text-4xl font-black text-blue-700">0</p>
    </article>
    <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
      <p class="text-sm text-slate-500">Completadas</p>
      <p id="count-completed" class="mt-3 text-4xl font-black text-blue-700">0</p>
    </article>
    <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
      <p class="text-sm text-slate-500">Pendientes hoy</p>
      <p id="count-pending" class="mt-3 text-4xl font-black text-blue-700">0</p>
    </article>
  </section>

  <section class="mt-8">
    <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-slate-900">Accesos rapidos</h2>
        <a class="text-sm font-semibold text-blue-700 hover:text-blue-600" href="/tasks">Ver tareas</a>
      </div>
      <div class="mt-6 grid gap-4 sm:grid-cols-2">
        <a class="rounded-3xl bg-blue-50 p-5 hover:bg-blue-100" href="/task-form">
          <p class="text-sm font-semibold text-blue-600">Crear</p>
          <h3 class="mt-2 text-lg font-bold text-slate-900">Nueva tarea</h3>
        </a>
        <a class="rounded-3xl bg-blue-50 p-5 hover:bg-blue-100" href="/profile">
          <p class="text-sm font-semibold text-blue-600">Cuenta</p>
          <h3 class="mt-2 text-lg font-bold text-slate-900">Editar perfil</h3>
        </a>
      </div>
    </article>
  </section>
</main>`
}


export async function setupDashboard() {

  const session = getSession();
  const welcome = document.getElementById("welcome");

  welcome.textContent = `Bienvenido, ${session.name}`;


  const logOut = document.getElementById("logout");

  const currentUser = getSession();
  const userRol = currentUser.roles[0]

  if (userRol === "USER") {
    const admin = document.getElementById("admin")

    admin.classList.add("hidden")
  }


  logOut.addEventListener("click", () => {
    logout();
  })


  const tasks = await getTasks(session.id);

  document.getElementById("count-active").textContent =
    tasks.filter(t => t.status === "En progreso").length;

  document.getElementById("count-completed").textContent =
    tasks.filter(t => t.status === "Completada").length;

  document.getElementById("count-pending").textContent =
    tasks.filter(t => t.status === "Pendiente").length;

  const recentTasks = document.getElementById("recent-tasks");

  if (tasks.length === 0) {
    recentTasks.innerHTML = `<p class="text-slate-400">No tienes tareas aún.</p>`;
  } else {
    recentTasks.innerHTML = tasks.slice(0, 3).map(task => `
        <div class="flex items-center justify-between rounded-2xl bg-blue-50 px-5 py-4">
            <div>
                <p class="text-sm font-bold text-slate-900">${task.title}</p>
                <p class="text-xs text-slate-500">${task.description}</p>
            </div>
            <span class="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                ${task.status}
            </span>
        </div>
    `).join("");
  }

  if (sessionStorage.getItem("profileUpdated")) {
    sessionStorage.removeItem("profileUpdated");
    Swal.fire({
      icon: "success",
      title: "Perfil actualizado",
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false
    });
  }
}