# System Architecture

## High-Level Design

CP-Boot follows a lightweight event-driven architecture designed for reliability and continuous execution.  
The system consists of four primary layers:

1. **External Data Source** – Google Calendar providing contest information  
2. **Bot Server (Node.js)** – Scheduler, processing logic, and WhatsApp client  
3. **Storage Layer** – File-based reminder storage and session state  
4. **Delivery Layer** – WhatsApp groups and users receiving notifications

```mermaid
graph TB
    subgraph External["External Data Source"]
        GC["Google Calendar<br/><br/>Contest Schedule<br/><br/>• Codeforces<br/>• CodeChef<br/>• LeetCode<br/>• AtCoder"]
    end
    
    subgraph Server["Bot Server - Node.js"]
        SS["Service Layer<br/><br/>startService.js<br/><br/>• Boot Service<br/>• Initialize Scheduler<br/>• Heartbeat Monitor"]
        
        SCH["Scheduler Module<br/><br/>scheduler.js<br/><br/>• Daily Notification (5 AM)<br/>• Reminder Check (5 min)<br/>• Connection Health Check"]
        
        PROC["Data Processor<br/><br/>getContestDetails.js<br/><br/>• Parse Calendar Data<br/>• Format Contest Messages<br/>• Generate Reminders"]
        
        WA["WhatsApp Client<br/><br/>app.js<br/><br/>• Baileys Library<br/>• Persistent Session<br/>• Message Sender"]
    end
    
    subgraph Storage["Storage Layer"]
        RF["reminderFile.txt<br/><br/>Stores Pending Reminders"]
        AUTH["auth_info_baileys/<br/><br/>WhatsApp Session Files"]
    end
    
    subgraph Delivery["Message Delivery"]
        WAP["WhatsApp Platform<br/><br/>Target Recipients:<br/>• Groups<br/>• Individual Users"]
    end

    GC --> PROC
    SS --> SCH
    SCH --> PROC
    PROC --> RF
    SCH --> WA
    WA --> WAP
    AUTH --> WA
```

---

# Data Flow

## 1. Daily Contest Notification Flow

Every day at **5:00 AM IST**, the system sends contest updates.

```mermaid
flowchart TD
    A["Scheduler Trigger<br/><br/>Daily 5:00 AM IST"] --> B["Fetch Contest Data<br/><br/>Google Calendar"]
    
    B --> C["Process Contest Data<br/><br/>• Parse calendar events<br/>• Filter today's contests<br/>• Filter tomorrow's contests"]
    
    C --> D["Format Message<br/><br/>• Contest name<br/>• Start time<br/>• Duration<br/>• Contest link"]
    
    D --> E["Create Reminder Entry<br/><br/>ContestTime - 30 min"]
    
    E --> F["Store Reminder<br/><br/>reminderFile.txt"]
    
    D --> G["Send WhatsApp Message<br/><br/>via Baileys"]
```

---

# 2. Contest Reminder Flow

The reminder system checks every **5 minutes**.

```mermaid
flowchart TD
    A["Scheduler Trigger<br/><br/>Every 5 minutes"] --> B["Load reminderFile.txt"]
    
    B --> C{"Reminder Time Reached?"}
    
    C -->|YES| D["Send Reminder Message"]
    
    D --> E["Send via WhatsApp"]
    
    E --> F["Remove Reminder from File"]
    
    C -->|NO| G["Wait for next check"]
```

---

# Core Components

## 1. Service Layer

**File:** `startService.js`

Responsible for:

- bootstrapping the system
- initializing the scheduler
- maintaining heartbeat logs
- keeping the Node.js process alive

Heartbeat logs every **5 minutes** to confirm service health.

---

## 2. Scheduler Module

**File:** `scheduler.js`

Manages automated jobs:

| Task | Frequency |
|-----|-----|
Daily contest notifications | 5:00 AM IST |
Reminder checks | Every 5 minutes |
Connection health check | Every 5 minutes |

The scheduler coordinates all automation tasks.

---

## 3. Data Processor

**Files:**

- `getContestDetails.js`
- `sendReminder.js`

Responsibilities:

- fetch contest events from Google Calendar
- process contest metadata
- format WhatsApp messages
- create reminder entries
- manage reminder file updates

---

## 4. WhatsApp Client

**File:** `app.js`

Handles all WhatsApp communication.

Features:

- Baileys WhatsApp Web API
- persistent session authentication
- automatic reconnection
- group metadata caching
- message delivery

---

# WhatsApp Connection Architecture

```mermaid
stateDiagram-v2
    [*] --> Disconnected
    
    Disconnected --> QRAuthentication
    QRAuthentication --> Connected
    
    Connected --> Disconnected: Connection Lost
    Disconnected --> Connected: Auto Reconnect
    
    Connected --> RestartRequired
    RestartRequired --> Connected
```

Disconnect handling:

| Event | Action |
|------|------|
connectionClosed | Auto reconnect |
connectionLost | Auto reconnect |
timedOut | Auto reconnect |
restartRequired | Restart connection |
loggedOut | Re-authenticate |

---

# Storage Layer

## File-Based Storage

### WhatsApp Session

```
auth_info_baileys/
```

Contains:

- encryption keys
- session credentials
- device identity
- WhatsApp state sync data

---

### Reminder Storage

```
reminderFile.txt
```

Example:

```json
[
  {
    "time": "2026-03-08T14:05:00.000Z",
    "message": "🏆 Codeforces Round\n⏰ Time: 08:05 pm\n⏳ Duration: 3h\n🔗 https://codeforces.com/contest/..."
  }
]
```

Each reminder entry contains:

| Field | Description |
|-----|-----|
time | contest start time |
message | formatted reminder message |

---

## In-Memory Storage

### Group Metadata Cache

Using **NodeCache**:

```javascript
groupCache = new NodeCache({
    stdTTL: 300,
    useClones: false
});
```

Purpose:

- cache WhatsApp group metadata
- reduce repeated API calls
- improve performance

---

# Deployment Architecture

The bot is designed for **cloud deployment**.

Typical production setup:

```
Ubuntu Server
      │
      ▼
Node.js Runtime
      │
      ▼
PM2 Process Manager
      │
      ▼
CP-Boot Bot Service
      │
      ▼
WhatsApp Web (Baileys)
```

PM2 provides:

- process monitoring
- automatic restarts
- centralized logs
- stable long-running execution

---

# Reliability Features

CP-Boot includes several reliability mechanisms:

- automatic WhatsApp reconnection
- heartbeat service monitoring
- reminder persistence via file storage
- PM2 crash recovery
- health check scheduler

These features ensure the bot runs continuously without manual intervention.

---

# Future Architecture Improvements

Potential upgrades:

- database storage (MongoDB / PostgreSQL)
- admin dashboard
- multi-calendar support
- distributed bot instances
- webhook-based contest updates
