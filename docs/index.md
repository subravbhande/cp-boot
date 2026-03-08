# CP-Boot — Contest Reminder WhatsApp Bot

## Overview

**CP-Boot** is an automated WhatsApp notification system that helps competitive programmers stay updated about upcoming coding contests.

The bot sends:

- Daily contest schedules
- Contest reminders before contests start

Notifications are delivered directly to WhatsApp groups so community members never miss important contests.

Repository:  
https://github.com/subravbhande/cp-boot

---

# Why This Project?

## The Problem

Competitive programmers often struggle to track contests across multiple platforms. Important contests can be missed due to:

- timezone confusion
- forgetting contest timings
- manually checking multiple websites
- lack of reminders

Managing contest updates for a community also becomes difficult.

---

## The Solution

CP-Boot automates the entire workflow.

The bot:

- fetches contest data automatically
- sends daily contest updates
- sends reminders before contests
- delivers notifications directly through WhatsApp groups

Since WhatsApp is always active on users’ devices, notifications reach users instantly.

---

# Key Features

## Daily Contest Notifications

Every day at **5:00 AM IST**, the bot sends:

- Today's contests
- Tomorrow's contests
- Contest name
- Start time
- Duration
- Contest link

---

## Contest Reminder System

The bot sends reminders **30 minutes before a contest starts**.

Reminder behavior:

- Checks every **5 minutes**
- Sends reminder **only once**
- Automatically removes sent reminders

---

## Contest Data Source

Contest data is fetched from a **Google Calendar** that aggregates contests from multiple competitive programming platforms.

This approach allows easy management of contests without relying on external APIs.

Platforms included in the calendar typically cover:

- Codeforces
- CodeChef
- LeetCode
- AtCoder

---

# Persistent WhatsApp Connection

The bot uses **Baileys WhatsApp Web API** to maintain a persistent connection.

Features include:

- automatic reconnection
- session persistence
- QR authentication
- group metadata caching

---

# Health Monitoring

The system includes built-in monitoring:

- heartbeat logs every 5 minutes
- connection health checks
- automatic reconnection if WhatsApp disconnects

---

# Always Running Service

The bot runs using **PM2**, allowing it to operate continuously.

Benefits:

- automatic restart if the bot crashes
- process monitoring
- easy log access
- reliable production deployment

---

# Project Architecture

```
startService.js
     │
     ▼
scheduler.js
     │
     ├── Daily contest notifications (5 AM IST)
     ├── Reminder checker (every 5 minutes)
     ├── WhatsApp connection health check
     │
     ▼
app.js
     │
     ▼
Baileys WhatsApp connection
     │
     ▼
Send contest notifications
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
git clone https://github.com/subravbhande/cp-boot.git

cd cp-boot
```

---

## Install Dependencies

```
npm install
```

---

# Environment Variables

Create a `.env` file in the root directory.

```
HELP_NUMBER=91xxxxxxxxxx@s.whatsapp.net
```

`HELP_NUMBER` is used to send error alerts or system messages to the bot administrator.

---

# Running the Bot

Start the bot using PM2:

```
pm2 start startService.js --name cp-bot
```

---

# Checking Bot Status

Check running processes:

```
pm2 list
```

View logs:

```
pm2 logs cp-bot
```

Restart bot:

```
pm2 restart cp-bot
```

---

# Example Messages

## Daily Contest Notification

```
Hello Chefs!

Today (Sunday, 09/03/2026)

🏆 Codeforces Round
⏰ Time: 20:05
⏳ Duration: 3h
🔗 https://codeforces.com/contest/...

───────────────

Tomorrow

💻 AtCoder Beginner Contest
⏰ Time: 17:30
⏳ Duration: 1h 40m
🔗 https://atcoder.jp/contests/...

Happy Coding!
```

---

## Contest Reminder

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

The bot can be deployed on any Linux server.

Typical setup:

```
Ubuntu Server
Node.js
PM2
Persistent WhatsApp session storage
```

Recommended platforms:

- AWS EC2
- DigitalOcean

---

# Future Improvements

Possible improvements:

- Web dashboard
- Admin commands via WhatsApp
- Platform filtering
- Custom reminder times
- Contest results tracking
- Multi-group configuration

---

# Support

For issues, suggestions, or contributions:

https://github.com/subravbhande/cp-boot

---

Built for the competitive programming community.
