const BASE_URL = "http://localhost:3000/tasks";

export async function getTasks(userId) {
    const response = await fetch(`${BASE_URL}?userId=${userId}`);
    if (!response.ok) throw new Error("Error al obtener tareas");
    return await response.json();
}

export async function createTask(task) {
    const response = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task)
    });
    if (!response.ok) throw new Error("Error al crear tarea");
    return await response.json();
}

export async function updateTask(id, data) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error("Error al actualizar tarea");
    return await response.json();
}

export async function deleteTask(id) {
    const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Error al eliminar tarea");
    return await response.json();
}