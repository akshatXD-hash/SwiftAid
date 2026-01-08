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
- [Learning Reflections](#-learning-reflections)
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
1. Initialize distances (start = 0, others = ∞)
2. Create priority queue with all nodes
3. While queue not empty:
   a. Extract node with minimum distance
   b. For each neighbor:
      - Calculate new distance
      - If shorter, update distance and path
4. Reconstruct path from destination to start
```

**Complexity**:
- **Time**: O((V + E) log V) with priority queue
- **Space**: O(V)

**Priority Modification**:
- Code Red: Multiply edge weights by **0.85** (15% faster)
- Code Yellow: **1.0** (baseline)
- Code Green: **1.15** (15% slower, lower priority)

---

### **2. Dynamic Programming (Floyd-Warshall)**

**Purpose**: Pre-compute all-pairs shortest paths for instant lookup

**How it works**:
```javascript
For each intermediate node k:
  For each source i:
    For each destination j:
      If path through k is shorter:
        Update distance[i][j]
```

**Complexity**:
- **Time**: O(V³) once at startup, then O(1) lookup
- **Space**: O(V²)

**Result**: Instant route retrieval for common scenarios (< 0.01ms)

---

### **3. Priority Queue (Min-Heap)**

**Purpose**: Efficiently manage node exploration in Dijkstra

**Operations**:
- `enqueue(element, priority)`: O(log n)
- `dequeue()`: O(log n)
- `isEmpty()`: O(1)

Implemented as a sorted array for simplicity and small graph size.

---

## 📂 How It Works

### **1. Graph Representation**

The city is modeled as a **weighted, undirected graph**:
```javascript
GRAPH = {
  Nodes (Vertices): 53 locations
    - 12 Hospitals (H0-H11)
    - 31 Emergency Zones (E0-E30)
    - 10 Junction Points (I0-I9)
  
  Edges: 150+ bidirectional roads
  Weights: Real distances in kilometers
}
```

**Example**:
```
Unkal Lake (E0) ----1.2 km----> KIMS Hospital (H0)
Railway Station (E5) ----0.9 km----> SDM Hospital (H1)
```

---

### **2. Traffic Simulation**

Every **30 seconds**, edge weights are updated:
```javascript
For each road edge:
  trafficMultiplier = random(0.8, 1.2)
  currentWeight = baseDistance × trafficMultiplier

Example:
  2 km road:
    Clear traffic:  2 × 0.8 = 1.6 km (faster)
    Heavy traffic:  2 × 1.2 = 2.4 km (slower)
```

This simulates real-world traffic congestion and clearance patterns.

---

### **3. Route Computation Flow**
```
User Input (Emergency + Hospital + Priority)
         ↓
Graph Network Retrieved
         ↓
Dijkstra Algorithm Runs
  - Explores nodes by priority
  - Updates shortest distances
  - Stops at destination hospital
         ↓
DP Algorithm Looks Up Cache
  - Instant retrieval from memory
         ↓
Both Results Compared
         ↓
Best Route Drawn on Map (Green Line)
         ↓
Ambulance Marker Placed
         ↓
Stats Updated (ETA, Distance, Metrics)
         ↓
User Sees Complete Visualization
```

---

## 💻 Installation & Setup

### **Option 1: View Live Demo**
Simply visit: **https://swift-aid-tau.vercel.app**

---

### **Option 2: Run Locally**

1. **Clone the repository**:
```bash
git clone https://github.com/akshatXD-hash/SwiftAid.git
cd SwiftAid
```

2. **Open in browser**:
```bash
# Option A: Direct file open
open index.html

# Option B: Local server (recommended)
python -m http.server 8000
# Then visit: http://localhost:8000
```

**No build process required!** Pure vanilla JavaScript.

---

### **Option 3: Deploy Your Own**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/akshatXD-hash/SwiftAid)

1. Fork this repository
2. Connect to Vercel
3. Deploy in one click!

---

## 📖 Usage Guide

### **Basic Routing**:

**Step 1**: Select Emergency Location
```
Choose from 31 locations organized by area:
- Central Hubli (Unkal Lake, Vidyanagar, etc.)
- North Hubli (Keshwapur, Gabbur, etc.)
- Transport Hubs (Railway Station, Airport, etc.)
```

**Step 2**: Select Hospital
```
Choose from 12 hospitals:
- Multi-Specialty: KIMS, SDM, Apollo BGS
- Government: District Hospital, Civil Hospital
- Specialty: Sushruta, Akshay, Sai, Niramay
```

**Step 3**: Set Priority
```
🔴 Code Red   - Critical (Cardiac, Severe Trauma)
🟡 Code Yellow - Moderate (Fractures, Bleeding)
🟢 Code Green  - Minor (Sprains, Minor Cuts)
```

**Step 4**: Dispatch
```
Click "🚨 Dispatch Vehicle"
System computes optimal route instantly
```

---

### **Understanding Results**:

#### **Map Display**:
- **Green Line**: Optimal route
- **🚑 Ambulance Icon**: Starting position
- **Markers**: Click for location details

#### **Algorithm Comparison Panel**:
```
Dijkstra (Live Routing) ✓ Optimal
├─ Distance: 3.45 km
├─ Computation Time: 1.23 ms
└─ Nodes Explored: 14

DP (Cached)
├─ Distance: 3.45 km
├─ Computation Time: < 0.01 ms
└─ Nodes Explored: 0 (pre-computed)
```

**What This Means**:
- Both find the same optimal distance (guaranteed shortest)
- Dijkstra adapts to current traffic conditions
- DP is instant but uses pre-computed static data
- Dijkstra is marked "Optimal" because it uses live traffic

---

## 📁 Project Structure
```
SwiftAid/
│
├── index.html          # Main HTML structure (UI layout)
├── style.css           # Complete styling + responsive design
├── script.js           # Core algorithms and logic (900+ lines)
├── vercel.json         # Vercel deployment configuration
└── README.md           # Project documentation (this file)
```

### **Key Code Components**:

**`script.js`** breakdown:
- **Lines 1-50**: Graph class implementation
- **Lines 51-100**: Priority Queue data structure
- **Lines 101-200**: Dijkstra's algorithm
- **Lines 201-300**: Floyd-Warshall (Dynamic Programming)
- **Lines 301-500**: Graph network definition (nodes + edges)
- **Lines 501-700**: Map initialization and Leaflet integration
- **Lines 701-900**: UI event handlers and visualization

---

## 📊 Performance Metrics

### **Computation Speed**:

| Algorithm | Average Time | Worst Case | Best Case |
|-----------|-------------|------------|-----------|
| **Dijkstra** | 1-2 ms | 3 ms | 0.8 ms |
| **DP Lookup** | < 0.01 ms | 0.02 ms | < 0.01 ms |

### **Network Statistics**:
```
Total Nodes:     53
Total Edges:     150+
Avg Degree:      5.66
Graph Density:   11.3%
Diameter:        8 hops
Avg Path Length: 3.2 hops
```

### **Coverage Analysis**:
```
Emergency Locations: 31
  - Central:        8 locations
  - North:          4 locations
  - South:          4 locations
  - East:           5 locations
  - West:           4 locations
  - Transport:      3 hubs
  - Industrial:     3 zones

Hospitals: 12
  - Multi-Specialty: 5
  - Government:      3
  - Specialty:       4

Total Route Combinations: 372 (31 × 12)
Pre-computed Routes:      372 (100% coverage)
```

---

## 📱 Mobile Responsive

SwiftAid is fully responsive and works seamlessly on:

### **Desktop** (1024px+):
- ✅ Side-by-side layout (sidebar + map)
- ✅ Full algorithm comparison panel
- ✅ Large, detailed map view

### **Tablets** (768px - 1023px):
- ✅ Stacked layout (sidebar above map)
- ✅ Compact algorithm metrics
- ✅ Touch-friendly controls

### **Mobile** (< 768px):
- ✅ Full-width sidebar (60% screen)
- ✅ Compact map view (40% screen)
- ✅ Optimized font sizes
- ✅ Large touch targets

### **Small Phones** (< 480px):
- ✅ Extra-compact layout
- ✅ Minimal text sizes
- ✅ Priority to essential info

**Test it**: Open https://swift-aid-tau.vercel.app on your phone!

---

## 🎓 Learning Reflections

This section captures the educational journey and key learnings of our team members throughout the development of SwiftAid.

---

### **👨‍💻 Akshat - Algorthmic developer && Full-Stack Development**

Developing SwiftAid from concept to deployment was an incredible learning experience that pushed me beyond my comfort zone. As the project lead, I not only had to master the technical implementation but also coordinate team efforts and make critical design decisions.

**Technical Growth:**
Building the entire system with vanilla JavaScript taught me the importance of writing clean, maintainable code without relying on frameworks. Implementing Dijkstra's algorithm from scratch deepened my understanding of graph theory far beyond what textbooks could teach. I learned how theoretical algorithms behave in practice, dealing with edge cases and performance optimization that aren't covered in academic settings.

Integrating Leaflet.js for map visualization was challenging but rewarding. I learned how to work with third-party APIs, handle asynchronous operations, and create smooth user experiences. The real-time traffic simulation system taught me about state management, timing mechanisms, and how to balance realism with performance.

**System Architecture:**
Designing the graph network with 53 nodes and 150+ edges for Hubli-Dharwad required careful planning. I learned how to structure data efficiently, create scalable architectures, and optimize for both speed and memory. Achieving sub-2ms computation times required profiling code, identifying bottlenecks, and implementing targeted optimizations.

**Problem-Solving Skills:**
The most valuable lesson was learning to break down a complex real-world problem into manageable components. From emergency priority systems to responsive design, each feature required careful analysis and iterative development. Debugging algorithms in real-time scenarios taught me patience and systematic problem-solving approaches.

**Deployment & DevOps:**
Deploying to Vercel taught me about continuous deployment, version control best practices, and the importance of testing across different environments. I learned to write documentation that serves both technical and non-technical audiences.

**Leadership & Collaboration:**
Coordinating with team members taught me the importance of clear communication, task delegation, and maintaining project momentum. I learned that good documentation is as important as good code, and that user experience should drive technical decisions.

This project showed me that building something meaningful requires more than just coding skills. It requires vision, persistence, and the ability to learn continuously. Most importantly, it reinforced that technology can have real-world impact. Knowing that this system could potentially save lives in emergency situations makes every hour spent debugging worthwhile.

---

### **👨‍💻 Shashank - Problem Analysis & System Design**

Working on the Smart Emergency Vehicle Routing System helped me understand how real-world problems can be translated into algorithmic models. I learned how a city map can be represented as a graph with nodes and edges, and how real-life constraints like traffic density and road capacity can be converted into weights.

This project improved my system design skills, especially in breaking a large problem into preprocessing, real-time computation, and performance evaluation phases. I also learned the importance of designing systems that respond within strict time limits, especially for life-critical applications like emergency services.

Understanding how to model emergency priorities (Code Red, Yellow, Green) as algorithmic parameters taught me that good system design requires both technical knowledge and domain understanding. The experience of seeing abstract graph theory concepts applied to save lives in emergency scenarios was particularly meaningful.

---

### **👩‍💻 Tanvi - Algorithm Implementation & Core Development**

The DAA course has been very insightful and helped me build a strong foundation in algorithm design and analysis. I learned a variety of algorithms, including sorting, searching, greedy algorithms, dynamic programming, and graph algorithms. Understanding how to analyze the time and space complexity of algorithms has made me more confident in choosing the right approach for different problems.

Working on the Emergency Vehicle Routing System project was particularly exciting. Implementing Dijkstra's algorithm as the core part of the project helped me understand how shortest-path algorithms work in real-world applications. It was challenging to handle the graph representation, compute distances efficiently, and ensure the algorithm always gave the correct route.

This project not only strengthened my algorithmic thinking but also taught me practical problem-solving skills, teamwork, and debugging strategies. The experience of translating theoretical knowledge into working code that could have real-world impact was incredibly rewarding.

Overall, the course improved my ability to break down complex problems, plan solutions systematically, and optimize algorithms for efficiency—skills that will be useful in both academics and professional life.

---

### **👩‍💻 Vaidehi - Theory & Practical Integration**

The DAA course was an excellent blend of theory and practical application. I gained a deeper understanding of classic and advanced algorithms and how they are analyzed for efficiency and correctness. Topics like graph algorithms, dynamic programming, and greedy techniques challenged me to think critically and improve my logical reasoning.

The Emergency Vehicle Routing System project was the highlight of the course. Designing and implementing the system using Dijkstra's algorithm made me realize the importance of choosing the right algorithm for real-time applications. I learned to represent the road network as a graph, manage data efficiently, and handle edge cases to ensure correct routing.

Collaborating with teammates also taught me how to divide tasks, communicate ideas, and debug complex issues. Seeing how our theoretical knowledge translated into a functional system that could help save lives was incredibly fulfilling.

This course strengthened my problem-solving, analytical, and programming skills, and gave me a practical perspective on how algorithms are applied to solve real-world problems. It was a challenging yet rewarding experience that made me more confident in tackling algorithm-intensive tasks.

---

### **👩‍💻 Hadiya - Algorithm Understanding & Real-World Impact**

The DAA course has been a really interesting and eye-opening experience. Over the semester, we learned about so many algorithms, from basic sorting and searching to dynamic programming, greedy approaches, and graph algorithms. Each topic made me think differently about problems, especially about how to make solutions efficient and fast.

The most exciting part for me was our final project: the Emergency Vehicle Routing System. Applying what we learned to a real-world problem was really satisfying. Using Dijkstra's algorithm to find the fastest routes for emergency vehicles showed me how algorithms can have a real impact. It was amazing to see theory turn into something practical that could actually save time in critical situations.

Of course, the project wasn't without challenges. Figuring out how to represent the city map as a graph and handling multiple paths efficiently was tricky at first. Sometimes, the algorithm didn't give the expected route, and debugging it took patience. But these challenges taught me how important it is to plan carefully and think logically about each step. I also realized that understanding the theory deeply makes implementation much smoother and easier.

Overall, this course taught me not just how to solve problems but also why the efficiency of algorithms matters. It gave me a better understanding of problem-solving in a structured way, and working on the routing system made the learning feel meaningful and fun. Knowing that our work could potentially help save lives gave the project real purpose beyond just academic learning.

---

## 🌍 Coverage Map

### **Emergency Locations (31)**:

**Central Hubli (8)**:
Unkal Lake Area, Vidyanagar Circle, Old Hubli Market, Gokul Road, Deshpande Nagar, Vidyagiri, Club House Circle, Gandhi Nagar

**North Hubli (4)**:
Keshwapur, Adarsh Nagar, Gabbur, Kakati Nagar

**South Hubli (4)**:
KLE College Area, Lingarajapuram, Amargol, Rayapur

**East Hubli (5)**:
BRTS Bus Stand, BVB College Area, Tolankere, Shirur Park, Gadag Road

**West Hubli (4)**:
Hosur Cross, Navanagar, Tarihal, Akshay Park

**Transport Hubs (3)**:
Hubli Railway Station, KSRTC Bus Stand, Hubli Airport

**Industrial/Commercial (3)**:
Industrial Estate, Kusugal, Ranebennur Road

---

### **Hospitals (12)**:

**Multi-Specialty**:
- KIMS Hospital
- SDM Hospital
- Narayana Hrudayalaya (Heart Specialist)
- Apollo BGS Hospital
- KLE Hospital & Medical Centre

**Government**:
- District Hospital
- Civil Hospital
- KIMS Govt Medical College

**Specialty & Private**:
- Sushruta Hospital
- Akshay Hospital
- Sai Hospital
- Niramay Hospital

---

## 🚀 Future Enhancements

### **Planned Features**:

1. **🗺️ Road Type Classification**
   - Highway vs Residential roads
   - One-way street restrictions
   - Different priority multipliers per road type
   - Code Red uses highways (faster)
   - Code Green uses residential (slower but shorter)

2. **🏥 Hospital Specialization**
   - Route cardiac cases to cardiac centers
   - Route trauma to trauma centers
   - Check bed availability before routing
   - ICU vs General ward routing

3. **🚑 Multi-Vehicle Coordination**
   - Track multiple ambulances simultaneously
   - Prevent congestion at single hospital
   - Load balancing across hospitals
   - Real-time fleet management

4. **📊 Historical Data Analysis**
   - Learn traffic patterns by time of day
   - Predict congestion hotspots
   - Seasonal adjustment factors
   - Holiday/event traffic modeling

5. **🌦️ Weather Integration**
   - Account for rain/fog delays
   - Snow/ice route adjustments
   - Flood zone avoidance

6. **📍 Live GPS Tracking**
   - Real ambulance position tracking
   - Dynamic rerouting based on position
   - ETA updates during journey

7. **🔔 Real-Time Notifications**
   - SMS/Push alerts to hospitals
   - Arrival time notifications
   - Traffic delay warnings

8. **📈 Analytics Dashboard**
   - Response time statistics
   - Most common routes
   - Algorithm performance metrics
   - Lives saved estimates

---

## 🎓 Educational Value

This project demonstrates:

### **Computer Science Concepts**:
- ✅ Graph Theory (weighted, undirected graphs)
- ✅ Algorithm Design (Dijkstra, Floyd-Warshall)
- ✅ Data Structures (graphs, priority queues, hash maps)
- ✅ Time-Space Tradeoffs (Dijkstra vs DP)
- ✅ Algorithm Analysis (Big O notation)
- ✅ Real-Time Systems Design

### **Software Engineering**:
- ✅ Modular code architecture
- ✅ Clean code principles
- ✅ Version control (Git/GitHub)
- ✅ Cloud deployment (Vercel)
- ✅ Responsive web design
- ✅ API integration (Leaflet.js)
- ✅ Performance optimization

### **Mathematics**:
- ✅ Graph theory
- ✅ Shortest path problems
- ✅ Dynamic programming
- ✅ Combinatorial optimization
- ✅ Heuristic functions

---

## 🤝 Contributing

Contributions are welcome! Here's how:

### **Ways to Contribute**:
1. 🐛 Report bugs
2. 💡 Suggest features
3. 📝 Improve documentation
4. 🔧 Submit pull requests
5. ⭐ Star the repository

### **Development Setup**:
```bash
# Fork the repository
# Clone your fork
git clone https://github.com/YOUR_USERNAME/SwiftAid.git

# Create a feature branch
git checkout -b feature/YourFeature

# Make changes
# Test thoroughly

# Commit with descriptive message
git commit -m "Add: Your feature description"

# Push to your fork
git push origin feature/YourFeature

# Open a Pull Request
```

### **Code Style**:
- Use meaningful variable names
- Comment complex logic
- Follow existing code structure
- Test on multiple browsers/devices

---

## 📜 License

This project is licensed under the **MIT License**.
```
MIT License

Copyright (c) 2025 Akshat

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Contact

**Developer**: Akshat  
**GitHub**: [@akshatXD-hash](https://github.com/akshatXD-hash)  
**Project Link**: [https://github.com/akshatXD-hash/SwiftAid](https://github.com/akshatXD-hash/SwiftAid)  
**Live Demo**: [https://swift-aid-tau.vercel.app](https://swift-aid-tau.vercel.app)

---

## 🙏 Acknowledgments

- **Leaflet.js** - Open-source mapping library
- **OpenStreetMap** - Free geographic data
- **Vercel** - Hosting and deployment platform
- **Hubli-Dharwad** - City geography and infrastructure data
- **Computer Science Community** - Algorithm resources and documentation
- **Team Members** - Shashank, Tanvi, Vaidehi, and Hadiya for their valuable contributions

---

## 📊 Project Statistics

![GitHub repo size](https://img.shields.io/github/repo-size/akshatXD-hash/SwiftAid)
![Lines of code](https://img.shields.io/tokei/lines/github/akshatXD-hash/SwiftAid)
![GitHub last commit](https://img.shields.io/github/last-commit/akshatXD-hash/SwiftAid)

---

<div align="center">

### **⭐ If you find this project useful, please consider giving it a star! ⭐**

**Built with ❤️ for saving lives through technology**

[🌐 View Live Demo](https://swift-aid-tau.vercel.app) | [📝 Report Bug](https://github.com/akshatXD-hash/SwiftAid/issues) | [✨ Request Feature](https://github.com/akshatXD-hash/SwiftAid/issues)

---

**SwiftAid** - Where every second counts, and every route matters.

*Developed as a demonstration of practical algorithm application in life-critical systems.*

**Team:** Akshat , Shashank, Tanvi, Vaidehi, Hadiya

</div>
