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

export async function getUser(email){
    const response = await fetch(`http://localhost:3000/users?email=${email}`);
    if (!response.ok) {
        throw new Error('Failed to fetch user')
    }
    return await response.json();
}