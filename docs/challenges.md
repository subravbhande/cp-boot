# Challenges & Solutions

Key challenges encountered during the development of **CP-Boot** and the solutions implemented to overcome them.

---

# Development Challenges

## 1. Finding a Free WhatsApp Automation API

### Challenge
Finding a reliable way to send automated WhatsApp messages without using the official WhatsApp Business API, which requires approval and usage costs.

### Solution
The project uses the **Baileys library**, an open-source WhatsApp Web API implementation.

Benefits:

- no official API cost
- supports session persistence
- works directly with WhatsApp Web protocol
- allows sending messages to groups and individuals

Baileys enabled building a fully automated notification bot without relying on paid services.

---

## 2. Maintaining a Stable WhatsApp Connection

### Challenge
WhatsApp Web sessions occasionally disconnect due to:

- network interruptions
- session expiration
- WhatsApp connection resets

This could stop the bot from sending messages.

### Solution
A **persistent connection management system** was implemented.

Key features:

- automatic reconnection logic
- session storage using `auth_info_baileys/`
- health checks every 5 minutes
- connection monitoring through scheduler

This ensures the bot reconnects automatically without manual intervention.

---

## 3. Scheduling Automated Tasks

### Challenge
Early implementations relied on system schedulers, which were not reliable across different environments.

### Solution
The project uses **node-schedule** to manage all automated tasks inside the application.

Scheduled tasks include:

| Task | Frequency |
|-----|-----|
Daily contest notifications | 5:00 AM IST |
Reminder checks | Every 5 minutes |
Connection health checks | Every 5 minutes |

This approach keeps scheduling fully integrated within the Node.js application.

---

## 4. Running the Bot Continuously

### Challenge
The bot must run continuously to ensure reminders and notifications are sent on time.

### Solution
The system uses **PM2 process manager** to run the bot as a persistent background service.

PM2 provides:

- automatic restart if the process crashes
- process monitoring
- log management
- stable long-running execution

Example command:

```
pm2 start startService.js --name cp-bot
```

---

## 5. Managing Contest Reminder State

### Challenge
Reminders must be sent only once and must survive application restarts.

Without proper storage, reminders could be lost or duplicated.

### Solution
A file-based storage system was implemented.

Reminders are stored in:

```
reminderFile.txt
```

Example structure:

```json
[
  {
    "time": "2026-03-08T14:05:00.000Z",
    "message": "Contest reminder message"
  }
]
```

When a reminder is sent:

1. The reminder entry is removed
2. The file is updated

This guarantees that reminders are not sent multiple times.

---

## 6. Handling WhatsApp Encryption Errors

### Challenge
Baileys sometimes logs encryption related errors such as:

```
Bad MAC
Failed to decrypt message
Closing open session
```

These logs can appear when receiving messages from groups or when session keys rotate.

### Solution
These logs were identified as **non-critical internal Baileys events**.

The system suppresses excessive logs using the `pino` logger configuration:

```javascript
const logger = pino({ level: "silent" });
```

This keeps logs clean while the bot continues functioning normally.

---

# Current Challenges

## Google Calendar Data Consistency

The bot relies on a shared Google Calendar for contest events.

Potential issues include:

- missing events
- incorrect event timings
- calendar updates not reflecting immediately

Future improvements may include additional validation or multiple calendar sources.

---

## Timezone Handling

Contests may be stored in **UTC format**, while users expect notifications in **IST**.

Careful timezone conversions are required when generating reminders and notifications.

---

## Library Updates

The Baileys library evolves rapidly and may introduce breaking changes.

Maintaining compatibility requires occasional updates and testing.

---

# Future Improvements

Possible improvements to address current limitations:

- database storage for reminders
- improved timezone normalization
- automated calendar validation
- multi-calendar integration
- better logging and monitoring

---

Contributions and improvements are always welcome.
