const API_URL = 'http://localhost:3000';
const APP_NAME = 'Energise';

function applyAppName() {
    const appNameElements = document.querySelectorAll('.app-name');

    for (const element of appNameElements) {
        element.textContent = APP_NAME;
    }
}

document.addEventListener('DOMContentLoaded', applyAppName);