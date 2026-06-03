export async function createUser(user) {
    const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
    if (!response.ok) {
        throw new Error('Failed to create user')
    }
    return await response.json();
}

export async function getUser(email) {
    const response = await fetch(`http://localhost:3000/users?email=${email}`);
    if (!response.ok) {
        throw new Error('Failed to fetch user')
    }
    return await response.json();
}

export async function updateUser(id, data) {
    const response = await fetch(`http://localhost:3000/users/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        throw new Error('Failed to update user');
    }
    return await response.json();
}

export async function deleteUser(id) {
    const response = await fetch(`http://localhost:3000/users/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('Failed to delete user');
    }
    return await response.json();
}
export async function getUsers() {
    const response = await fetch(`http://localhost:3000/users`);
    if (!response.ok) {
        throw new Error('Failed to fetch user')
    }
    return await response.json();
}