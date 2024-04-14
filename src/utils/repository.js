const USER_KEY = 'user'
export const getLoggedInUser = () => {
    const value = localStorage.getItem(USER_KEY)
    return value ? JSON.parse(value) : undefined
}

export const setLoggedInUser = (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const removeLoggedInUser = (user) => {
    localStorage.removeItem(USER_KEY)
}