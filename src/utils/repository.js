const USER_KEY = 'user'

// Get the logged in user details from the local storage
export const getLoggedInUser = () => {
    const value = localStorage.getItem(USER_KEY)
    return value ? JSON.parse(value) : undefined
}

// Set the logged in user details in the local storage
export const setLoggedInUser = (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
}

// Remove the logged in user details from the local storage. Calls at the logout
export const removeLoggedInUser = (user) => {
    localStorage.removeItem(USER_KEY)
}