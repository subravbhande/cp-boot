import { scheduleJob } from 'node-schedule';
import { connectionLogic, moveFurther } from './app.js';
import fs from 'fs/promises';

let whatsAppSocket = null;

const STATE_FILE = './botState.json';

async function hasAlreadySentToday() {

    try {

        const data = await fs.readFile(STATE_FILE, 'utf8');
        const state = JSON.parse(data);

        const today = new Date().toDateString();

        return state.lastNotificationDate === today;

    } catch {

        return false;

    }

}

async function markAsSentToday() {

    const state = {
        lastNotificationDate: new Date().toDateString()
    };

    await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2));

}

export async function initializeWhatsAppConnection() {

    console.log("Initializing persistent WhatsApp connection...");

    const onConnectionEstablished = async (sock) => {

        whatsAppSocket = sock;

        console.log("WhatsApp connection established and ready");

        return sock;

    };

    await connectionLogic(onConnectionEstablished);

}

export function getWhatsAppSocket() {

    if (!whatsAppSocket) {
        console.log("Warning: WhatsApp socket is null");
    }

    return whatsAppSocket;

}

export function startConnectionHealthCheck() {

    setInterval(async () => {

        console.log("Running WhatsApp connection health check...");

        if (!whatsAppSocket) {

            console.log("Socket missing. Reconnecting...");
            await initializeWhatsAppConnection();

        } else {

            console.log("WhatsApp connection active");

        }

    }, 5 * 60 * 1000);

}

export function scheduleContestNotifications() {

    const dailyJob = scheduleJob(
        'contest-notifications',
        '0 0 5 * * *',
        async () => {

            console.log(`Running contest notifications at ${new Date().toLocaleString()}`);

            if (await hasAlreadySentToday()) {

                console.log("Contest message already sent today. Skipping.");

                return;

            }

            try {

                if (whatsAppSocket) {

                    await moveFurther(whatsAppSocket);

                } else {

                    console.log("Socket missing. Reinitializing...");
                    await initializeWhatsAppConnection();

                    if (whatsAppSocket) {
                        await moveFurther(whatsAppSocket);
                    }

                }

                await markAsSentToday();

            } catch (error) {

                console.error("Contest notification error:", error);

            }

        }
    );

    console.log("Contest notifications scheduled for 5:00 AM daily");

    return dailyJob;

}

export function scheduleContestReminders() {

    const reminderJob = scheduleJob(
        'contest-reminders',
        '*/5 * * * *',
        async () => {

            console.log(`Checking reminders at ${new Date().toLocaleString()}`);

            try {

                const { getReminders } = await import('./sendReminder.js');

                if (whatsAppSocket) {

                    await getReminders(whatsAppSocket);

                } else {

                    console.log("Socket missing. Reconnecting...");
                    await initializeWhatsAppConnection();

                    if (whatsAppSocket) {
                        await getReminders(whatsAppSocket);
                    }

                }

            } catch (error) {

                console.error("Reminder scheduler error:", error);

            }

        }
    );

    console.log("Contest reminders scheduled every 5 minutes");

    return reminderJob;

}

export function initializeScheduler() {

    initializeWhatsAppConnection()
        .then(() => {

            scheduleContestNotifications();
            scheduleContestReminders();
            startConnectionHealthCheck();

            console.log("Scheduler initialized successfully");

        })
        .catch(error => {

            console.error("Scheduler initialization failed:", error);

        });

}


