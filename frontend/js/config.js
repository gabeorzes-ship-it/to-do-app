const API_URL = 'https://to-do-app-1cod.onrender.com';
const APP_NAME = 'Energise';

function applyAppName() {
    const appNameElements = document.querySelectorAll('.app-name');

    for (const element of appNameElements) {
        element.textContent = APP_NAME;
    }
}

document.addEventListener('DOMContentLoaded', applyAppName);