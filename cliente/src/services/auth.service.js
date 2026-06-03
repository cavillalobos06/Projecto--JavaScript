import { getUser } from "./users.service";
import Swal from 'sweetalert2'

const userSession = "Sesion-Actual";

export function saveSession(user) {
    localStorage.setItem(userSession, JSON.stringify(user))
}

export function getSession() {
    const sesionJSON = localStorage.getItem(userSession)
    return JSON.parse(sesionJSON);
}

export function removeSession() {
    localStorage.removeItem(userSession)
}

export async function loginSession(email, password) {
    const lowerEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (!lowerEmail || !normalizedPassword) {
        throw new Error("Debes ingresar correo y contraseña");
    }

    const userExist = await getUser(lowerEmail);

    if (userExist.length == 0) {
        Swal.fire({
            icon: "error",
            text: "El usuario no existe",
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true
        });
        throw new Error("El usuario no existe");

    }

    const user = userExist[0];

    if (user.password !== normalizedPassword) {
        Swal.fire({
            icon: "error",
            text: "Contraseña incorrecta",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true
        });
        throw new Error("Contraseña incorrecta");
    }

    saveSession(user);
    return user;

}


export function logout() {
    removeSession();
    window.location.href = "/login";
}