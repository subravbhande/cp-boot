import fs from 'fs/promises';
import { exec } from 'child_process';
import config from './config.js';
import path from 'path';

const USE_WINDOWS_SCHEDULER = false;

export async function setReminder(messageString, startTime) {
    try {

        const contestTime = new Date(startTime);

        // reminder = contest time - reminderOffset
        const reminderTime = new Date(contestTime.getTime() - config.time.reminderOffset);

        const reminderObject = {
            time: reminderTime,
            message: messageString
        };

        const reminderEntry = JSON.stringify(reminderObject, null, 2) + ',\n';

        await fs.appendFile(config.paths.reminderFile, reminderEntry);

        if (USE_WINDOWS_SCHEDULER) {

            const schedule = "once";
            const taskCommand = path.join(config.paths.root, "runReminder.bat");
            const taskName = `Reminder_${reminderTime.getTime()}`;

            const cronTime = reminderTime.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });

            const schtasksCommand =
                `schtasks /create /tn "${taskName}" /tr "${taskCommand}" /sc ${schedule} /st ${cronTime} /f`;

            exec(schtasksCommand, (error, stdout, stderr) => {

                if (error) {
                    console.error(`Error creating task: ${error}`);
                    return;
                }

                if (stderr) {
                    console.error(`stderr: ${stderr}`);
                    return;
                }

                console.log(`Task created successfully for ${reminderTime.toLocaleString()}`);

            });

        } else {

            console.log(`Reminder saved for ${reminderTime.toLocaleString()} (using node-schedule)`);

        }

    } catch (err) {

        console.error("Error saving reminder:", err.message);
        throw err;

    }
}
