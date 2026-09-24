# ⚡ Synapse — Geo-Fenced Smart Attendance System

> A next-generation, client-side, geo-fenced dynamic QR attendance system built with modern neural aesthetics, precision GPS verification, and zero backend dependencies.

---

## 🌟 Overview

**Synapse** eliminates traditional attendance fraud (proxy attendance, QR screenshot sharing, remote scanning) by combining:
1. **Dynamic Dynamic QR Codes** with real-time countdowns and cryptographically tagged session tokens.
2. **Precision Geo-Fencing (Haversine Algorithm)** matching student GPS coordinates against the instructor's live location.
3. **100% Client-Side Execution** — Deployable instantly on Vercel, Netlify, or GitHub Pages without database or backend infrastructure.

---

## 🚀 Key Features

### 👨‍🏫 Teacher Portal (`teacher.html`)
- **Live Geolocation Fetching**: Obtains instructor's GPS latitude and longitude with high accuracy.
- **Dynamic Session Configuration**:
  - Configurable Geo-Fence Radius (e.g., 5m to 200m).
  - Configurable QR Expiration Timer (e.g., 10s to 120s).
- **Auto-Rotating QR Generation**: Encodes instructor coordinates, timestamps, course ID, instructor signature, and security nonces into self-expiring QR codes.
- **Session Control**: Start, pause, or terminate attendance windows at any time.

### 🎓 Student Portal (`student.html`)
- **Integrated Camera Scanner**: High-speed, responsive QR scanning powered by HTML5-QRCode.
- **Geo-Verification Engine**:
  - Retrieves student's real-time device GPS coordinates.
  - Computes spatial distance to teacher via the **Haversine formula**.
- **Instant Fraud Detection**:
  - Automatically rejects expired QR tokens.
  - Rejects scans outside the classroom's allowed geo-radius.
- **Audit Confirmation**: Generates a tamper-evident attendance receipt with student details, instructor info, GPS proximity, and timestamp.

### 🌌 Synapse Design System (`index.html` & `styles.css`)
- **Futuristic Dark UI**: Deep obsidian tones (`#0a0b10`), glassmorphic panels, and neon violet/cyan gradients.
- **Ambient Canvas Controller**: Interactive glowing ambient orbs with dynamic physics and mouse parallax.
- **Design Tokens**: Complete design token viewer and live interactive components.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Structure** | Semantic HTML5 |
| **Styling** | Vanilla CSS3 (Custom Design Tokens, Glassmorphism, CSS Grid, Micro-animations) |
| **Client Engine** | Modern Vanilla JavaScript (ES6+, Web Geolocation API, MediaDevices API) |
| **QR Generation** | `qrcode.js` / Canvas QR rendering |
| **QR Scanning** | `html5-qrcode` library |
| **Distance Algorithm** | Haversine Formula ($R = 6371\text{ km}$) |

---

## 📂 Project Structure

```text
project-mewto/
├── index.html       # Landing page & Synapse Neural Design System showcase
├── teacher.html     # Teacher Portal (Geo-tagged dynamic QR generator)
├── student.html     # Student Portal (Camera scanner & GPS distance verifier)
├── styles.css       # Unified design system stylesheet
├── app.js           # Core client-side engine (Landing, Teacher & Student logic)
└── README.md        # Project documentation
```

---

## 💻 Getting Started Locally

### 1. Prerequisites
Any modern web browser (Chrome, Edge, Safari, Firefox) with camera and location permissions enabled.

### 2. Run Local Server
Because camera and geolocation APIs require a secure context (`localhost` or `HTTPS`), run a local server:

**Using Python:**
```bash
python -m http.server 8000
```

**Using Node / npx:**
```bash
npx serve .
```

### 3. Open in Browser
- **Home / Landing:** [http://localhost:8000/](http://localhost:8000/)
- **Teacher Portal:** [http://localhost:8000/teacher.html](http://localhost:8000/teacher.html)
- **Student Portal:** [http://localhost:8000/student.html](http://localhost:8000/student.html)

---

## ☁️ Deployment (Vercel)

This project is completely static and ready for 1-click deployment on **Vercel**:

1. Push or import your repository to [Vercel](https://vercel.com).
2. Framework Preset: **Other** (Root directory: `./`).
3. Click **Deploy**.
4. Vercel automatically issues an **HTTPS** certificate (essential for browser Camera and Geolocation access).

---

## 🔒 Security & Geolocation Notes

- **HTTPS Mandatory**: In production, browsers will only expose `navigator.geolocation` and `navigator.mediaDevices.getUserMedia` over secure HTTPS connections.
- **Indoor Accuracy**: Device GPS accuracy is highest on mobile devices (smartphones/tablets with GPS chips). For laptop testing, enable Wi-Fi location services.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
