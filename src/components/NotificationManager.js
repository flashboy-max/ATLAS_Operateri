/**
 * NotificationManager - Centralizovani sistem za notifikacije i status indikatore
 * Ekstraktovano iz ATLASApp klase
 */

export class NotificationManager {
    constructor() {
        this.notifications = [];
        this.syncStatusVisible = false;
    }

    /**
     * Prikazuje notifikaciju korisniku
     * @param {string} message - Poruka za prikaz
     * @param {string} type - Tip notifikacije ('info', 'success', 'error')
     * @param {number} duration - Trajanje u milisekundama (default: 3000)
     */
    showNotification(message, type = 'info', duration = 3000) {
        // Simple notification system
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Dodaj u listu aktivnih notifikacija
        this.notifications.push(notification);

        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                // Ukloni iz liste
                const index = this.notifications.indexOf(notification);
                if (index > -1) {
                    this.notifications.splice(index, 1);
                }
            }, 300);
        }, duration);
    }

    /**
     * Prikazuje sync status bar
     */
    showSyncStatus() {
        const statusBar = document.getElementById('sync-status-bar');
        if (statusBar) {
            statusBar.style.display = 'block';
            this.syncStatusVisible = true;

            // Sakrij posle 10 sekundi ako nema interakcije
            setTimeout(() => {
                if (this.syncStatusVisible) {
                    this.hideSyncStatus();
                }
            }, 10000);
        }
    }

    /**
     * Sakriva sync status bar
     */
    hideSyncStatus() {
        const statusBar = document.getElementById('sync-status-bar');
        if (statusBar) {
            statusBar.style.display = 'none';
            this.syncStatusVisible = false;
        }
    }

    /**
     * Briše sve aktivne notifikacije
     */
    clearAllNotifications() {
        this.notifications.forEach(notification => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        });
        this.notifications = [];
    }

    /**
     * Prikazuje info notifikaciju
     * @param {string} message - Poruka
     * @param {number} duration - Trajanje
     */
    showInfo(message, duration = 3000) {
        this.showNotification(message, 'info', duration);
    }

    /**
     * Prikazuje success notifikaciju
     * @param {string} message - Poruka
     * @param {number} duration - Trajanje
     */
    showSuccess(message, duration = 3000) {
        this.showNotification(message, 'success', duration);
    }

    /**
     * Prikazuje error notifikaciju
     * @param {string} message - Poruka
     * @param {number} duration - Trajanje
     */
    showError(message, duration = 3000) {
        this.showNotification(message, 'error', duration);
    }

    /**
     * Prikazuje warning notifikaciju
     * @param {string} message - Poruka
     * @param {number} duration - Trajanje
     */
    showWarning(message, duration = 3000) {
        this.showNotification(message, 'warning', duration);
    }
}
