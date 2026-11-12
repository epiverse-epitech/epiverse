/** Petit message temporaire en bas de l'écran (banc d'essai uniquement). */
export function showToast(message: string): void {
  const toast = document.createElement('div');
  toast.setAttribute('role', 'status'); // annoncé par les lecteurs d'écran
  toast.textContent = message;
  Object.assign(toast.style, {
    position: 'fixed',
    left: '50%',
    bottom: '24px',
    transform: 'translateX(-50%)',
    maxWidth: '90vw',
    padding: '12px 16px',
    borderRadius: '8px',
    background: '#1f2a3a',
    color: '#ffffff',
    font: '15px system-ui, sans-serif',
    zIndex: '10',
  });
  document.body.append(toast);
  setTimeout(() => toast.remove(), 3000);
}
