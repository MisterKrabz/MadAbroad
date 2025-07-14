/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
export const msalConfig = {
    auth: {
        // Application (client) ID
        clientId: "1e438fa6-40d8-4dd4-a0a5-0469dac96ed9", 
        // Directory (tenant) ID
        authority: "https://login.microsoftonline.com/2ca68321-0eda-4908-88b2-424a8cb4b0f9",
        // Where to redirect after login
        redirectUri: "http://localhost:5173" 
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false, 
    }
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 */
export const loginRequest = {
    scopes: ["User.Read"]
};