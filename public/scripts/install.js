window.addEventListener('beforeinstallprompt', saveBeforeInstallPromptEvent);

window.addEventListener('appinstalled', () => {
    const installBtn = document.getElementById('butInstall');
    installBtn.setAttribute('hidden', true);
});

function saveBeforeInstallPromptEvent(e) {
    let deferredInstallPrompt = e;
    const installBtn = document.getElementById('butInstall');
    installBtn.removeAttribute('hidden');

    installBtn.addEventListener('click', (e) => {
        deferredInstallPrompt.prompt();
        installBtn.setAttribute('hidden', true);
    });

    deferredInstallPrompt.userChoice
    .then((choice) => {
        if (choice.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt', choice);
        } else {
            console.log('User dismissed the A2HS prompt', choice);
        }
        deferredInstallPrompt = null;
    });
}