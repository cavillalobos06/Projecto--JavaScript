import { renderRouter } from "../../router/router";
import { createUser, getUser } from "../../services/users.service";
import Swal from 'sweetalert2'

export function renderRegister() {
  return `
<main class="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
  <section class="hidden border-r border-blue-100 bg-blue-600 p-10 text-white lg:flex lg:flex-col lg:justify-between">
    <a class="text-xl font-black tracking-tight" href="/">TaskFlowSPA</a>
    <div>
      <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">Nuevo usuario</p>
      <h1 class="mt-4 text-5xl font-black tracking-tight">Crea tu cuenta y empieza a organizar tu flujo.</h1>
      <p class="mt-5 max-w-md text-lg leading-8 text-blue-50">
        Esta vista permite enseñar el registro como parte del alcance funcional antes de llevarlo al flujo SPA
        definitivo.
      </p>
    </div>
    <p class="text-sm text-blue-100">Interfaz base del modulo de autenticacion.</p>
  </section>

  <section class="flex items-center justify-center px-6 py-10">
    <div class="w-full max-w-xl rounded-[2rem] border border-blue-100 bg-white p-8 shadow-xl shadow-blue-100/70">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Registro</p>
          <h2 class="mt-2 text-3xl font-black text-slate-900">Crear cuenta</h2>
        </div>
        <a class="rounded-full border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
          href="/login">Ya tengo cuenta</a>
      </div>

      <form id="register-form" class="mt-8 grid gap-5">
        <div class="grid gap-5 md:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700" for="register-name">Nombre</label>
            <input id="register-name" type="text" required placeholder="Ana"
              class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"/>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700" for="register-lastname">Apellido</label>
            <input id="register-lastname" type="text" required placeholder="Torres"
              class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"/>
          </div>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700" for="register-email">Correo</label>
          <input id="register-email" type="email" required placeholder="usuario@taskflow.com"
            class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"/>
        </div>

        <div class="grid gap-5 md:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700" for="register-password">Contraseña</label>
            <input id="register-password" type="password" required placeholder="Crea una contraseña"
              class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"/>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700" for="register-role">Rol</label>
            <select id="register-role"
              class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 focus:border-blue-400 focus:outline-none">
              <option>USER</option>
              <option>ADMIN</option>
            </select>
          </div>
        </div>

        <a id= "create" class="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500"
          href="/login">
          Registrarme
        </a>
      </form>
    </div>
  </section>
</main>`
}

export function setupRegister() {
  const role = document.getElementById('register-role');
  const createBtn = document.getElementById("create");

  createBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const name = document.getElementById('register-name').value.trim();
    const lastname = document.getElementById('register-lastname').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value.trim();


    if (!name || !lastname || !email || !password) {
      Swal.fire({
        icon: "error",
        text: "Todos los campos son obligatorios",
        footer: "Por favor llene los campos"
      });
      return;
    }
    const userAlreadyExist = await getUser(email)

    if (userAlreadyExist.length > 0) {
      Swal.fire({
        icon: "error",
        text: "El usuario ya existe",
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true
      });
      return;
    }

    const newUser = {
      name: name,
      lastname: lastname,
      email: email,
      password: password,
      roles: [role.value]
    }
    const response = await createUser(newUser);

    if (response) {
      Swal.fire({
        position: "top-end",
        title: "Usuario creado exitosamente",
        icon: "success",
        draggable: true
      });
      window.history.pushState({}, "", "/login")
      renderRouter();
    }

  })
}