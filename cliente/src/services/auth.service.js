import { getUser } from "./users.service";

const userSession = "Sesion-Actual";

function saveSession(user){
    localStorage.setItem(userSession, JSON.stringify(user))
}

function getSession(){
    const sesionJSON = localStorage.getItem(userSession)
    return JSON.parse(sesionJSON);
}

function removeSession(){
    localStorage.removeItem(userSession)
}

export async function loginSession(email, password) {
    return;
}