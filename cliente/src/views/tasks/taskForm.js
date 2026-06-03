import { getSession, logout } from "../../services/auth.service";
import { renderRouter } from "../../router/router";
import { createTask, updateTask, getTasks } from "../../services/task.service";
import Swal from 'sweetalert2';

export function renderTaskForm() {
  return `
<header class="border-b border-blue-100 bg-white/90 backdrop-blur">
  <div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
    <a class="text-xl font-black text-blue-900" href="/">TaskFlowSPA</a>
    <nav class="hidden gap-3 md:flex">
      <a class="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700"
        href="/dashboard">Dashboard</a>
      <a class="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700"
        href="/tasks">Tareas</a>
      <a class="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700"
        href="/profile">Perfil</a>
      <a class="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700"
        href="/admin">Admin</a>
      <a id= "logout" class="rounded-full px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
        href="/login">Logout</a>
    </nav>
  </div>
</header>

<main class="mx-auto max-w-5xl px-6 py-10">
  <section class="rounded-[2rem] border border-blue-100 bg-white p-8 shadow-xl shadow-blue-50">
    <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Formulario</p>
    <h1 class="mt-3 text-4xl font-black tracking-tight text-slate-900">Crear o editar tarea</h1>
    <p class="mt-4 max-w-2xl text-slate-600">Vista base para registrar una tarea nueva o actualizar una existente.</p>

    <form class="mt-8 grid gap-5">
      <div>
        <label class="mb-2 block text-sm font-medium text-slate-700" for="title">Titulo</label>
        <input id="title" type="text" placeholder="Ej. Preparar proyecto final"
          class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none" />
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium text-slate-700" for="description">Descripcion</label>
        <textarea id="description" rows="5" placeholder="Describe la tarea..."
          class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"></textarea>
      </div>

      <div class="grid gap-5 md:grid-cols-2">
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700" for="status">Estado</label>
          <select id="status"
            class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 focus:border-blue-400 focus:outline-none">
            <option>Pendiente</option>
            <option>En progreso</option>
            <option>Completada</option>
          </select>
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700" for="date">Fecha limite</label>
          <input id="date" type="date"
            class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 focus:border-blue-400 focus:outline-none" />
        </div>
      </div>

      <div class="flex flex-col gap-3 pt-2 sm:flex-row">
        <a id="save-task" class="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500"
          href="/tasks">Guardar tarea</a>
        <a id="cancel" class="inline-flex items-center justify-center rounded-2xl border border-blue-200 bg-white px-5 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50"
          href="/tasks">Cancelar</a>
      </div>
    </form>
  </section>
</main>`
}

export async function setupTaskForm() {

  const logOut = document.getElementById("logout");

  logOut.addEventListener("click", () => {
    logout();
  })

  const session = getSession();
  const editTaskId = sessionStorage.getItem("editTaskId");

  const titleInput = document.getElementById("title");
  const descriptionInput = document.getElementById("description");
  const statusInput = document.getElementById("status");
  const dateInput = document.getElementById("date");
  const saveBtn = document.getElementById("save-task");


  if (editTaskId) {
    const tasks = await getTasks(session.id);
    const task = tasks.find(t => t.id === editTaskId);

    if (task) {
      titleInput.value = task.title;
      descriptionInput.value = task.description;
      statusInput.value = task.status;
      dateInput.value = task.date || "";

    }else{
      sessionStorage.removeItem("editTaskId");
    }
  }

  saveBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const status = statusInput.value;
    const date = dateInput.value;

    if (!title) {
      Swal.fire({
        icon: "error",
        text: "El título es obligatorio"
      });
      return;
    }

    const taskData = {
      title,
      description,
      status,
      date,
      userId: session.id
    };

    try {
      if (editTaskId) {

        await updateTask(editTaskId, taskData);
        sessionStorage.removeItem("editTaskId");
        Swal.fire({
          icon: "success",
          title: "Tarea actualizada",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        }).then(() => {
          window.history.replaceState(null, "", "/tasks");
          renderRouter();
        });
      } else {

        await createTask(taskData);
        Swal.fire({
          icon: "success",
          title: "Tarea creada",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        }).then(() => {
          window.history.replaceState(null, "", "/tasks");
          renderRouter();
        });
      }
    } catch (error) {
      Swal.fire({ icon: "error", text: "Error al guardar la tarea" });
    }
  });

  const cancel = document.getElementById("cancel");
  cancel.addEventListener("click", async (e) => {
    e.preventDefault()
    e.stopPropagation()
    const action = Swal.fire({
      icon: "info",
      title: "¿Desea Cancelar?",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No"
    });
    if ((await action).isConfirmed) { 
      sessionStorage.removeItem("editTaskId");
      window.history.pushState({}, "", "/tasks");
      renderRouter();
    }
  })
}