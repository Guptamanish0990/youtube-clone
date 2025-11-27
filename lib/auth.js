// lib/auth.js - Authentication Helper Functions

export function isUserLoggedIn() {
  if (typeof window === 'undefined') return false;
  
  try {
    const user = localStorage.getItem("user");
    return !!user;
  } catch (error) {
    return false;
  }
}

export function getUserData() {
  if (typeof window === 'undefined') return null;
  
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    return null;
  }
}

export function logout() {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem("user");
    document.cookie = "auth=; path=/; max-age=0";
  } catch (error) {
    console.error("Logout error:", error);
  }
}

export function login(email, rememberMe = false) {
  if (typeof window === 'undefined') return false;
  
  try {
    const userData = {
      email,
      rememberMe,
      loginTime: new Date().toISOString()
    };
    localStorage.setItem("user", JSON.stringify(userData));
    document.cookie = `auth=${btoa(email)}; path=/; max-age=86400`;
    return true;
  } catch (error) {
    console.error("Login error:", error);
    return false;
  }
}