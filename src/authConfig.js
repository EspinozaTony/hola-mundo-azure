// src/authConfig.js
export const msalConfig = {
    auth: {
        clientId: "018df15c-311a-474d-a22a-51bfef3187dd",
        authority: "https://login.microsoftonline.com/common",
        // 👇 PON TU URL PÚBLICA AQUÍ:
        redirectUri: "https://tonystorage12345.z19.web.core.windows.net/", 
    },
    cache: {
        cacheLocation: "sessionStorage", // Guarda la sesión temporalmente
        storeAuthStateInCookie: false,
    }
};

// Los permisos que le pedimos al usuario (solo leer su perfil básico)
export const loginRequest = {
    scopes: ["User.Read"]
};