# 🚑 SwiftAid - Smart Emergency Vehicle Routing System

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://swift-aid-tau.vercel.app)
[![GitHub](https://img.shields.io/badge/github-SwiftAid-blue)](https://github.com/akshatXD-hash/SwiftAid)
[![Status](https://img.shields.io/badge/status-active-brightgreen)]()

> **Help arrives faster with SwiftAid.** An intelligent emergency dispatch system that uses advanced graph algorithms to optimize ambulance routing across Hubli-Dharwad, reducing response times and saving lives.

![SwiftAid Demo](https://img.shields.io/badge/Response_Time-Sub_2ms-brightgreen) ![Coverage](https://img.shields.io/badge/Coverage-31_Locations-blue) ![Hospitals](https://img.shields.io/badge/Hospitals-12-orange)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Live Demo](#-live-demo)
- [Technology Stack](#️-technology-stack)
- [Algorithms Implemented](#-algorithms-implemented)
- [How It Works](#-how-it-works)
- [Installation](#-installation--setup)
- [Usage Guide](#-usage-guide)
- [Project Structure](#-project-structure)
- [Performance Metrics](#-performance-metrics)
- [Mobile Responsive](#-mobile-responsive)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🌟 Overview

### **The Problem**
In emergency medical services, every second counts. Studies show that a **1-minute delay** in emergency response can **reduce cardiac arrest survival rates by 10%**. Traditional GPS systems don't optimize for emergency-specific scenarios like priority-based routing, real-time traffic adaptation, and multi-hospital coordination.

### **The Solution**
SwiftAid is a real-time emergency vehicle routing system designed specifically for Hubli-Dharwad that:
- ✅ Computes optimal routes in **under 2 milliseconds**
- ✅ Adapts to **real-time traffic conditions** (30-second updates)
- ✅ Prioritizes **critical emergencies** (Code Red/Yellow/Green)
- ✅ Covers **31 emergency locations** and **12 hospitals**
- ✅ Provides **algorithm performance comparison**
- ✅ Works seamlessly on **mobile and desktop**

By combining computer science algorithms with emergency response protocols, SwiftAid ensures ambulances always take the fastest route available.

---

## ✨ Features

### 🎯 **Core Functionality**
- **Intelligent Pathfinding**: Dijkstra's algorithm guarantees shortest path
- **Real-Time Traffic Simulation**: Updates every 30 seconds
- **Priority-Based Routing**: 
  - 🔴 **Code Red** (Critical - Cardiac arrest, severe trauma)
  - 🟡 **Code Yellow** (Moderate - Fractures, bleeding)
  - 🟢 **Code Green** (Minor - Sprains, minor cuts)
- **Comprehensive Coverage**: 31 emergency zones across Hubli-Dharwad
- **Multi-Hospital Network**: 12 hospitals including KIMS, SDM, Apollo BGS, KLE, and more

### 📊 **Algorithm Comparison**
- **Dijkstra's Algorithm**: Real-time optimal routing with traffic adaptation
- **Dynamic Programming (Floyd-Warshall)**: Pre-computed paths for instant lookup
- **Performance Metrics Display**: 
  - Computation time
  - Nodes explored
  - Distance analysis
  - Algorithm efficiency comparison

### 🗺️ **Interactive Map**
- Live route visualization with Leaflet.js
- Color-coded markers:
  - 🔵 **Blue** = Hospitals
  - 🔴 **Red** = Emergency Locations
  - 🟢 **Green** = Optimal Route
- Click markers for location details
- Auto-zoom to route bounds
- Smooth animations and transitions

### 📱 **Mobile Responsive**
- Optimized for phones, tablets, and desktops
- Touch-friendly interface
- Adaptive layout for all screen sizes

---

## 🚀 Live Demo

**🌐 [Try SwiftAid Live](https://swift-aid-tau.vercel.app)**

### **Quick Start:**
1. Select an emergency location (e.g., "Vidyanagar Circle")
2. Choose destination hospital (e.g., "KIMS Hospital")
3. Set priority level (Code Red/Yellow/Green)
4. Click "🚨 Dispatch Vehicle"
5. View optimal route, ETA, and performance metrics

---

## 🛠️ Technology Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **HTML5** | Structure and semantic markup | - |
| **CSS3** | Styling, animations, responsive design | - |
| **JavaScript (ES6+)** | Core logic, algorithms, interactivity | ES2015+ |
| **Leaflet.js** | Interactive map visualization | 1.9.4 |
| **OpenStreetMap** | Map tiles and geographic data | - |
| **Vercel** | Cloud hosting and deployment | - |
| **GitHub** | Version control and collaboration | - |

### **No Frameworks, No Build Tools**
- Pure vanilla JavaScript for maximum performance
- No dependencies or package managers
- Instant loading, zero build time

---

## 🧠 Algorithms Implemented

### **1. Dijkstra's Shortest Path Algorithm**

**Purpose**: Real-time optimal route computation

**How it works**:
```javascript
