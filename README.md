# Contest Reminder WhatsApp Bot

## Overview

**Contest Reminder WhatsApp Bot** is an automated WhatsApp notification system that keeps competitive programmers updated about upcoming coding contests from major platforms like CodeChef, Codeforces, LeetCode, and AtCoder.

The bot automatically sends daily contest updates and reminder messages directly to WhatsApp groups so that community members never miss important competitions.

---

# Why This Project?

## The Problem

Competitive programmers often struggle to keep track of contests across multiple platforms. Important contests can be missed due to:

- Timezone confusion
- Forgetting contest schedules
- Checking multiple websites daily
- Lack of reminders

This becomes even harder when managing a competitive programming community.

---

## The Solution

This bot automates the entire process by:

- Fetching contests from multiple platforms
- Sending daily contest schedules automatically
- Sending reminders before contests start
- Delivering notifications directly through WhatsApp

Since WhatsApp is constantly active on users' devices, notifications reach users instantly without requiring them to open a separate platform.

---

## Motivation

This project was created to help competitive programming communities stay active and informed.

Goals of the project:

- Reduce manual effort checking contest schedules
- Increase participation in contests
- Keep coding communities engaged
- Build a reliable automated notification system
- Learn real-world backend automation

---

# Key Features

## Daily Contest Notifications

Every day at **5:00 AM IST**, the bot sends a message containing:

- Today's contests
- Tomorrow's contests
- Contest name
- Start time
- Duration
- Contest link

---

## Smart Contest Reminders

The bot sends reminders **30 minutes before a contest starts**.

The reminder system:

- Checks every **5 minutes**
- Sends the reminder **only once**
- Automatically removes sent reminders

---

## Persistent WhatsApp Connection

The bot maintains a **persistent WhatsApp Web connection** using the **Baileys library**.

Features include:

- Automatic reconnection
- Session persistence
- QR authentication
- Group metadata caching

---

## Health Monitoring

The bot includes a built-in monitoring system:

- Heartbeat logs every 5 minutes
- Connection health checks
- Auto-reconnect if WhatsApp disconnects

---

## Always Running Service

The bot runs continuously using **PM2 process manager**.

Benefits:

- Automatic restart if the process crashes
- Process monitoring
- Easy log access
- Production-ready deployment

---

# Supported Platforms

The bot currently fetches contests from:

- CodeChef
- Codeforces
- LeetCode
- AtCoder

Additional platforms can easily be added.

---

# Project Architecture

```
startService.js
     │
     ▼
scheduler.js
     │
     ├── Daily contest notifications (5 AM)
     ├── Reminder checker (every 5 minutes)
     │
     ▼
app.js
     │
     ▼
WhatsApp connection (Baileys)
     │
     ▼
Message delivery
```

---

# Installation

## Prerequisites

Install the following:

```
Node.js v18+
npm
PM2
```

---

## Clone Repository

```
git clone https://github.com/subravbhande/cp-boot

cd cp-boot

```

---

## Install Dependencies

```
npm install
```

---

## Create Environment File

Create a `.env` file in the root directory.

```

HELP_NUMBER=9198765XXXXX@s.whatsapp.net
```

`HELP_NUMBER` is used for sending error alerts.

---

## Start the Bot

Start the service using PM2.

```
pm2 start startService.js --name cp-bot
```

---

## Authenticate WhatsApp

After starting the bot:

1. A QR code file will be generated.
2. Scan it using WhatsApp Web.
3. The bot will connect automatically.

---

# Running the Bot

## Check running processes

```
pm2 list
```

---

## View logs

```
pm2 logs cp-bot
```

---

## Restart bot

```
pm2 restart cp-bot
```

---

# Message Examples

## Daily Contest Notification

```
Hello Chefs!

Today 

🏆 Codeforces Round
⏰ Time: 20:05
⏳ Duration: 3h
🔗 https://codeforces.com/contest/...

────────────────

Tomorrow

💻 AtCoder Beginner Contest
⏰ Time: 17:30
⏳ Duration: 1h 40m
🔗 https://atcoder.jp/contests/...

Happy Coding!
```

---

## Reminder Message

```
🛑REMINDER🛑

🏆 Codeforces Round
⏰ Time: 20:05
⏳ Duration: 3h
🔗 https://codeforces.com/contest/...
```

---

# Technologies Used

| Technology | Purpose |
|-----------|--------|
| Node.js | Runtime environment |
| Baileys | WhatsApp Web API |
| node-schedule | Task scheduling |
| PM2 | Process manager |
| node-ical | Contest calendar parsing |
| Pino | Logging |

---

# Deployment

The bot is designed for **cloud deployment**.

Typical deployment setup:

```
Ubuntu VPS
Node.js
PM2
Persistent session storage
```

Recommended hosting platforms:

- AWS EC2
- DigitalOcean


---

# Future Improvements

Possible enhancements:

- Web dashboard
- Admin commands via WhatsApp
- Contest filters by platform
- Custom reminder timings
- Multiple group management
- Contest result summaries

---

# Support

For issues or feature requests, please visit:

https://github.com/subravbhande/cp-boot

---

**Built for the competitive programming community.**
