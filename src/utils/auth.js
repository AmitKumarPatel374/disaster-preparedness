import { readJSON, writeJSON, StorageKeys } from './storage'

export function signup(user) {
  const users = readJSON(StorageKeys.Users, []) || []
  if (users.some(u => u.email === user.email)) throw new Error('User already exists')
  users.push(user)
  writeJSON(StorageKeys.Users, users)
  writeJSON(StorageKeys.Session, { email: user.email, role: user.role, state: user.state, district: user.district })
  return user
}

export function login(email, password) {
  const users = readJSON(StorageKeys.Users, []) || []
  const user = users.find(u => u.email === email && u.password === password)
  if (!user) throw new Error('Invalid credentials')
  writeJSON(StorageKeys.Session, { email: user.email, role: user.role, state: user.state, district: user.district })
  return user
}

export function getSession() { return readJSON(StorageKeys.Session, null) }
export function logout() { writeJSON(StorageKeys.Session, null) }


