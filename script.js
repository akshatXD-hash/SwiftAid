// ============= GRAPH DATA STRUCTURE =============
class Graph {
    constructor() {
        this.nodes = new Map();
        this.edges = new Map();
    }

    addNode(id, lat, lng, name) {
        this.nodes.set(id, { id, lat, lng, name });
    }

    addEdge(from, to, baseWeight) {
        const key = `${from}-${to}`;
        this.edges.set(key, { from, to, baseWeight, currentWeight: baseWeight });
        const reverseKey = `${to}-${from}`;
        this.edges.set(reverseKey, { from: to, to: from, baseWeight, currentWeight: baseWeight });
    }

    getNeighbors(nodeId) {
        const neighbors = [];
        this.edges.forEach((edge, key) => {
            if (edge.from === nodeId) {
                neighbors.push({ node: edge.to, weight: edge.currentWeight });
            }
        });
        return neighbors;
    }

    updateTrafficWeights() {
        this.edges.forEach((edge, key) => {
            const trafficMultiplier = 0.8 + Math.random() * 0.4;
            edge.currentWeight = edge.baseWeight * trafficMultiplier;
        });
    }
}

// ============= PRIORITY QUEUE =============
class PriorityQueue {
    constructor() {
        this.items = [];
    }

    enqueue(element, priority) {
        this.items.push({ element, priority });
        this.items.sort((a, b) => a.priority - b.priority);
    }

    dequeue() {
        return this.items.shift();
    }

    isEmpty() {
        return this.items.length === 0;
    }
}

// ============= DIJKSTRA ALGORITHM =============
function dijkstraSearch(graph, start, goal, priorityLevel) {
    const startTime = performance.now();
    const distances = new Map();
    const previous = new Map();
    const unvisited = new PriorityQueue();
    let nodesExplored = 0;

    const priorityMultipliers = {
        'critical': 0.85,
        'moderate': 1.0,
        'minor': 1.15
    };
    const multiplier = priorityMultipliers[priorityLevel] || 1.0;

    graph.nodes.forEach((node, id) => {
        distances.set(id, id === start ? 0 : Infinity);
        unvisited.enqueue(id, distances.get(id));
    });

    while (!unvisited.isEmpty()) {
        const current = unvisited.dequeue().element;
        nodesExplored++;

        if (current === goal) {
            const path = reconstructPath(previous, current);
            const endTime = performance.now();
            return {
                path,
                cost: distances.get(goal),
                time: (endTime - startTime).toFixed(2),
                nodesExplored
            };
        }

        if (distances.get(current) === Infinity) break;

        const neighbors = graph.getNeighbors(current);
        for (const { node, weight } of neighbors) {
            const adjustedWeight = weight * multiplier;
            const alt = distances.get(current) + adjustedWeight;
            if (alt < distances.get(node)) {
                distances.set(node, alt);
                previous.set(node, current);
                unvisited.enqueue(node, alt);
            }
        }
    }

    return null;
}

// ============= DYNAMIC PROGRAMMING =============
let dpPrecomputed = null;

function floydWarshall(graph) {
    const startTime = performance.now();
    const nodes = Array.from(graph.nodes.keys());
    const dist = new Map();
    const next = new Map();

    nodes.forEach(i => {
        nodes.forEach(j => {
            const key = `${i}-${j}`;
            if (i === j) {
                dist.set(key, 0);
            } else {
                const edge = graph.edges.get(`${i}-${j}`);
                dist.set(key, edge ? edge.currentWeight : Infinity);
                if (edge) next.set(key, j);
            }
        });
    });

    nodes.forEach(k => {
        nodes.forEach(i => {
            nodes.forEach(j => {
                const ikKey = `${i}-${k}`;
                const kjKey = `${k}-${j}`;
                const ijKey = `${i}-${j}`;
                const distIK = dist.get(ikKey);
                const distKJ = dist.get(kjKey);
                const distIJ = dist.get(ijKey);

                if (distIK + distKJ < distIJ) {
                    dist.set(ijKey, distIK + distKJ);
                    next.set(ijKey, next.get(ikKey));
                }
            });
        });
    });

    const endTime = performance.now();
    return { dist, next, computeTime: (endTime - startTime).toFixed(2) };
}

function getDPPath(start, goal, dpResult) {
    if (!dpResult.next.has(`${start}-${goal}`)) return null;
    
    const path = [start];
    let current = start;
    
    while (current !== goal) {
        current = dpResult.next.get(`${current}-${goal}`);
        if (!current) return null;
        path.push(current);
    }
    
    return {
        path,
        cost: dpResult.dist.get(`${start}-${goal}`),
        time: '< 0.01',
        nodesExplored: 0
    };
}

// ============= HELPER FUNCTIONS =============
function reconstructPath(cameFrom, current) {
    const path = [current];
    while (cameFrom.has(current)) {
        current = cameFrom.get(current);
        path.unshift(current);
    }
    return path;
}

// ============= FETCH ACTUAL ROAD ROUTE =============
// ============= FETCH ACTUAL ROAD ROUTE (SIMPLIFIED) =============
async function fetchRoadRoute(startNodeId, endNodeId) {
    const startNode = cityGraph.nodes.get(startNodeId);
    const endNode = cityGraph.nodes.get(endNodeId);
    
    const coordinates = `${startNode.lng},${startNode.lat};${endNode.lng},${endNode.lat}`;

    try {
        const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`
        );
        const data = await response.json();

        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
            return {
                coordinates: data.routes[0].geometry.coordinates,
                distance: data.routes[0].distance / 1000 // Convert to km
            };
        }
    } catch (error) {
        console.log('OSRM routing unavailable, using straight line');
    }

    // Fallback: straight line
    return {
        coordinates: [[startNode.lng, startNode.lat], [endNode.lng, endNode.lat]],
        distance: null
    };
}

// ============= MAP AND GRAPH INITIALIZATION =============
const hubliCoords = [15.3647, 75.1240];
let map;
let routeLayers = [];
let markerLayers = [];

const cityGraph = new Graph();

// Check and update these if needed:
cityGraph.addNode('H0', 15.3780, 75.1350, 'KIMS Hospital');
cityGraph.addNode('H1', 15.3550, 75.1180, 'SDM Hospital');
cityGraph.addNode('H2', 15.3450, 75.1100, 'District Hospital');
cityGraph.addNode('H3', 15.3820, 75.1280, 'Narayana Hrudayalaya');
cityGraph.addNode('H4', 15.3650, 75.1400, 'Apollo BGS Hospital');
cityGraph.addNode('H5', 15.3520, 75.1430, 'KLE Hospital');
cityGraph.addNode('H6', 15.3490, 75.1250, 'Civil Hospital');
cityGraph.addNode('H7', 15.3730, 75.1330, 'KIMS Govt Medical College');
cityGraph.addNode('H8', 15.3600, 75.1300, 'Sushruta Hospital'); // ← Fix this one
cityGraph.addNode('H9', 15.3700, 75.1100, 'Akshay Hospital');
cityGraph.addNode('H10', 15.3580, 75.1380, 'Sai Hospital');
cityGraph.addNode('H11', 15.3620, 75.1220, 'Niramay Hospital');

cityGraph.addNode('E0', 15.3850, 75.1280, 'Unkal Lake Area');
cityGraph.addNode('E1', 15.3720, 75.1420, 'Vidyanagar Circle');
cityGraph.addNode('E2', 15.3580, 75.1250, 'Old Hubli Market');
cityGraph.addNode('E3', 15.3500, 75.1350, 'Gokul Road');
cityGraph.addNode('E4', 15.3650, 75.1050, 'Hosur Cross');
cityGraph.addNode('E5', 15.3440, 75.1340, 'Hubli Railway Station');
cityGraph.addNode('E6', 15.3620, 75.1380, 'BRTS Bus Stand');
cityGraph.addNode('E7', 15.3900, 75.1150, 'Keshwapur');
cityGraph.addNode('E8', 15.3750, 75.1050, 'Navanagar');
cityGraph.addNode('E9', 15.3480, 75.1450, 'KLE College Area');
cityGraph.addNode('E10', 15.3820, 75.1500, 'BVB College Area');
cityGraph.addNode('E11', 15.3680, 75.1280, 'Deshpande Nagar');
cityGraph.addNode('E12', 15.3520, 75.1090, 'Lingarajapuram');
cityGraph.addNode('E13', 15.3590, 75.1470, 'Tolankere');
cityGraph.addNode('E14', 15.3770, 75.1190, 'Vidyagiri');
cityGraph.addNode('E15', 15.3920, 75.1200, 'Adarsh Nagar');
cityGraph.addNode('E16', 15.3950, 75.1280, 'Gabbur');
cityGraph.addNode('E17', 15.3400, 75.1480, 'Amargol');
cityGraph.addNode('E18', 15.3640, 75.1530, 'Shirur Park');
cityGraph.addNode('E19', 15.3780, 75.0980, 'Tarihal');
cityGraph.addNode('E20', 15.3710, 75.1310, 'Club House Circle');
cityGraph.addNode('E21', 15.3670, 75.1350, 'Gandhi Nagar');
cityGraph.addNode('E22', 15.3880, 75.1320, 'Kakati Nagar');
cityGraph.addNode('E23', 15.3420, 75.1200, 'Rayapur');
cityGraph.addNode('E24', 15.3650, 75.1580, 'Gadag Road');
cityGraph.addNode('E25', 15.3690, 75.1020, 'Akshay Park');
cityGraph.addNode('E26', 15.3470, 75.1310, 'KSRTC Bus Stand');
cityGraph.addNode('E27', 15.3620, 75.0850, 'Hubli Airport');
cityGraph.addNode('E28', 15.3550, 75.1050, 'Industrial Estate');
cityGraph.addNode('E29', 15.3510, 75.0950, 'Kusugal');
cityGraph.addNode('E30', 15.3380, 75.1150, 'Ranebennur Road');

cityGraph.addNode('I0', 15.3700, 75.1200, 'Junction 1');
cityGraph.addNode('I1', 15.3600, 75.1150, 'Junction 2');
cityGraph.addNode('I2', 15.3650, 75.1300, 'Junction 3');
cityGraph.addNode('I3', 15.3550, 75.1250, 'Junction 4');
cityGraph.addNode('I4', 15.3500, 75.1200, 'Junction 5');
cityGraph.addNode('I5', 15.3600, 75.1350, 'Junction 6');
cityGraph.addNode('I6', 15.3750, 75.1350, 'Junction 7');
cityGraph.addNode('I7', 15.3800, 75.1200, 'Junction 8');
cityGraph.addNode('I8', 15.3550, 75.1350, 'Junction 9');
cityGraph.addNode('I9', 15.3650, 75.1450, 'Junction 10');

// Add all edges (same as before - keeping your existing edges)
cityGraph.addEdge('E0', 'H0', 1.2);
cityGraph.addEdge('E0', 'I0', 1.8);
cityGraph.addEdge('E0', 'I7', 1.0);
cityGraph.addEdge('E1', 'I5', 1.0);
cityGraph.addEdge('E1', 'H0', 2.0);
cityGraph.addEdge('E1', 'I6', 0.8);
cityGraph.addEdge('E2', 'I2', 0.8);
cityGraph.addEdge('E2', 'I3', 1.5);
cityGraph.addEdge('E2', 'H8', 0.5);
cityGraph.addEdge('E3', 'I3', 1.2);
cityGraph.addEdge('E3', 'H1', 1.8);
cityGraph.addEdge('E3', 'I8', 0.9);
cityGraph.addEdge('E4', 'I1', 1.5);
cityGraph.addEdge('E4', 'H2', 2.2);
cityGraph.addEdge('E4', 'H9', 1.0);
cityGraph.addEdge('E5', 'H1', 0.9);
cityGraph.addEdge('E5', 'I3', 0.6);
cityGraph.addEdge('E5', 'H6', 0.7);
cityGraph.addEdge('E6', 'I5', 0.7);
cityGraph.addEdge('E6', 'I2', 0.9);
cityGraph.addEdge('E6', 'H10', 0.4);
cityGraph.addEdge('E7', 'I0', 1.1);
cityGraph.addEdge('E7', 'H0', 1.4);
cityGraph.addEdge('E7', 'I7', 1.0);
cityGraph.addEdge('E8', 'I1', 1.0);
cityGraph.addEdge('E8', 'I0', 1.3);
cityGraph.addEdge('E8', 'H9', 0.6);
cityGraph.addEdge('E9', 'H1', 1.2);
cityGraph.addEdge('E9', 'I3', 1.0);
cityGraph.addEdge('E9', 'H5', 0.5);
cityGraph.addEdge('E10', 'I5', 0.8);
cityGraph.addEdge('E10', 'H0', 1.1);
cityGraph.addEdge('E10', 'I9', 0.6);
cityGraph.addEdge('E11', 'I2', 0.5);
cityGraph.addEdge('E11', 'I0', 0.7);
cityGraph.addEdge('E11', 'H11', 0.6);
cityGraph.addEdge('E12', 'I4', 0.8);
cityGraph.addEdge('E12', 'H2', 1.0);
cityGraph.addEdge('E12', 'H6', 0.5);
cityGraph.addEdge('E13', 'I5', 0.9);
cityGraph.addEdge('E13', 'H0', 1.6);
cityGraph.addEdge('E13', 'I9', 0.7);
cityGraph.addEdge('E14', 'I0', 0.6);
cityGraph.addEdge('E14', 'H0', 1.0);
cityGraph.addEdge('E14', 'I7', 0.5);
cityGraph.addEdge('E15', 'I7', 0.8);
cityGraph.addEdge('E15', 'H0', 1.2);
cityGraph.addEdge('E15', 'H3', 1.0);
cityGraph.addEdge('E16', 'I7', 1.0);
cityGraph.addEdge('E16', 'H3', 0.9);
cityGraph.addEdge('E16', 'E0', 1.1);
cityGraph.addEdge('E17', 'H5', 0.7);
cityGraph.addEdge('E17', 'I8', 1.2);
cityGraph.addEdge('E17', 'H1', 1.5);
cityGraph.addEdge('E18', 'I9', 0.6);
cityGraph.addEdge('E18', 'H4', 0.8);
cityGraph.addEdge('E18', 'E13', 0.9);
cityGraph.addEdge('E19', 'H9', 0.8);
cityGraph.addEdge('E19', 'I1', 1.4);
cityGraph.addEdge('E19', 'E27', 1.3);
cityGraph.addEdge('E20', 'I6', 0.5);
cityGraph.addEdge('E20', 'H7', 0.6);
cityGraph.addEdge('E20', 'I2', 0.7);
cityGraph.addEdge('E21', 'I5', 0.6);
cityGraph.addEdge('E21', 'H4', 0.8);
cityGraph.addEdge('E21', 'I6', 0.5);
cityGraph.addEdge('E22', 'H3', 0.7);
cityGraph.addEdge('E22', 'I7', 0.9);
cityGraph.addEdge('E22', 'H7', 0.8);
cityGraph.addEdge('E23', 'H2', 0.8);
cityGraph.addEdge('E23', 'I4', 0.9);
cityGraph.addEdge('E23', 'H6', 0.7);
cityGraph.addEdge('E24', 'I9', 0.8);
cityGraph.addEdge('E24', 'H4', 1.0);
cityGraph.addEdge('E24', 'E13', 1.1);
cityGraph.addEdge('E25', 'H9', 0.5);
cityGraph.addEdge('E25', 'I1', 1.2);
cityGraph.addEdge('E25', 'E8', 0.7);
cityGraph.addEdge('E26', 'H6', 0.5);
cityGraph.addEdge('E26', 'I3', 0.7);
cityGraph.addEdge('E26', 'E5', 0.4);
cityGraph.addEdge('E27', 'H9', 1.8);
cityGraph.addEdge('E27', 'I1', 2.0);
cityGraph.addEdge('E27', 'E29', 1.0);
cityGraph.addEdge('E28', 'H2', 1.3);
cityGraph.addEdge('E28', 'I1', 0.9);
cityGraph.addEdge('E28', 'E29', 0.6);
cityGraph.addEdge('E29', 'H2', 1.1);
cityGraph.addEdge('E29', 'I4', 1.0);
cityGraph.addEdge('E29', 'E30', 0.8);
cityGraph.addEdge('E30', 'H2', 0.9);
cityGraph.addEdge('E30', 'I4', 0.7);
cityGraph.addEdge('E30', 'H6', 0.8);
cityGraph.addEdge('H0', 'I0', 1.5);
cityGraph.addEdge('H0', 'I2', 1.3);
cityGraph.addEdge('H0', 'I6', 0.8);
cityGraph.addEdge('H0', 'I7', 0.9);
cityGraph.addEdge('H1', 'I3', 1.0);
cityGraph.addEdge('H1', 'I1', 0.9);
cityGraph.addEdge('H1', 'I8', 1.1);
cityGraph.addEdge('H2', 'I4', 0.7);
cityGraph.addEdge('H2', 'I1', 1.1);
cityGraph.addEdge('H3', 'I7', 0.6);
cityGraph.addEdge('H3', 'I6', 0.9);
cityGraph.addEdge('H4', 'I5', 0.8);
cityGraph.addEdge('H4', 'I9', 0.7);
cityGraph.addEdge('H4', 'I6', 0.6);
cityGraph.addEdge('H5', 'I8', 0.8);
cityGraph.addEdge('H5', 'I9', 1.0);
cityGraph.addEdge('H6', 'I3', 0.6);
cityGraph.addEdge('H6', 'I4', 0.5);
cityGraph.addEdge('H7', 'I6', 0.5);
cityGraph.addEdge('H7', 'I2', 0.8);
cityGraph.addEdge('H8', 'I2', 0.7);
cityGraph.addEdge('H8', 'I3', 0.6);
cityGraph.addEdge('H9', 'I1', 0.8);
cityGraph.addEdge('H9', 'I0', 1.0);
cityGraph.addEdge('H10', 'I5', 0.5);
cityGraph.addEdge('H10', 'I9', 0.9);
cityGraph.addEdge('H11', 'I2', 0.6);
cityGraph.addEdge('H11', 'I0', 0.7);
cityGraph.addEdge('I0', 'I1', 1.2);
cityGraph.addEdge('I0', 'I2', 0.9);
cityGraph.addEdge('I0', 'I7', 0.8);
cityGraph.addEdge('I1', 'I4', 0.8);
cityGraph.addEdge('I2', 'I3', 1.0);
cityGraph.addEdge('I2', 'I5', 1.1);
cityGraph.addEdge('I2', 'I6', 0.7);
cityGraph.addEdge('I3', 'I4', 0.7);
cityGraph.addEdge('I3', 'I8', 0.6);
cityGraph.addEdge('I4', 'H1', 1.0);
cityGraph.addEdge('I5', 'H0', 1.4);
cityGraph.addEdge('I5', 'I6', 0.8);
cityGraph.addEdge('I5', 'I9', 0.9);
cityGraph.addEdge('I6', 'I7', 0.7);
cityGraph.addEdge('I7', 'I0', 0.8);
cityGraph.addEdge('I8', 'I5', 1.0);
cityGraph.addEdge('I9', 'I6', 0.8);

// ============= MAP INITIALIZATION =============
window.onload = function() {
    map = L.map('map', {
        center: hubliCoords,
        zoom: 13,
        minZoom: 12,
        maxZoom: 17
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    addLocationMarkers();

    console.log('Precomputing Floyd-Warshall paths...');
    dpPrecomputed = floydWarshall(cityGraph);
    console.log(`DP precomputation completed in ${dpPrecomputed.computeTime}ms`);

    setInterval(() => {
        cityGraph.updateTrafficWeights();
        document.getElementById('trafficStatus').textContent = 'Updated';
        setTimeout(() => {
            document.getElementById('trafficStatus').textContent = 'Active';
        }, 1000);
    }, 30000);

    setTimeout(() => {
        map.invalidateSize();
    }, 300);
};

// ============= ADD MARKERS =============
function addLocationMarkers() {
    const hospitals = ['H0', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10', 'H11'];
    hospitals.forEach(id => {
        const node = cityGraph.nodes.get(id);
        const marker = L.circleMarker([node.lat, node.lng], {
            radius: 10,
            fillColor: '#4d9fff',
            color: '#fff',
            weight: 2,
            fillOpacity: 0.9
        }).addTo(map);
        marker.bindPopup(`<b>🏥 ${node.name}</b><br>Hospital Node`);
        markerLayers.push(marker);
    });

    const emergencies = ['E0', 'E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 
                         'E10', 'E11', 'E12', 'E13', 'E14', 'E15', 'E16', 'E17', 'E18', 'E19',
                         'E20', 'E21', 'E22', 'E23', 'E24', 'E25', 'E26', 'E27', 'E28', 'E29', 'E30'];
    emergencies.forEach(id => {
        const node = cityGraph.nodes.get(id);
        const marker = L.circleMarker([node.lat, node.lng], {
            radius: 6,
            fillColor: '#ff4d4d',
            color: '#fff',
            weight: 1.5,
            fillOpacity: 0.7
        }).addTo(map);
        marker.bindPopup(`<b>🚨 ${node.name}</b><br>Emergency Zone`);
        markerLayers.push(marker);
    });
}

// ============= DISPATCH AMBULANCE (UPDATED) =============
async function dispatchAmbulance() {
    const emergencyIdx = document.getElementById('emergencyLocation').value;
    const hospitalIdx = document.getElementById('hospitalSelect').value;
    const priority = document.getElementById('priority').value;

    const emergencyId = `E${emergencyIdx}`;
    const hospitalId = `H${hospitalIdx}`;

    document.getElementById('statusText').textContent = 'Computing optimal route...';
    document.getElementById('dispatchBtn').disabled = true;

    clearRoutes();

    setTimeout(async () => {
        // Run Dijkstra to calculate optimal cost/distance through our graph
        const dijkstraResult = dijkstraSearch(cityGraph, emergencyId, hospitalId, priority);
        const dpResult = getDPPath(emergencyId, hospitalId, dpPrecomputed);

        if (dijkstraResult) {
            // Fetch actual road route DIRECTLY from start to end (not through intermediate nodes)
            document.getElementById('statusText').textContent = 'Fetching road route...';
            const roadRoute = await fetchRoadRoute(emergencyId, hospitalId);
            
            // Draw route following actual roads
            await drawRoute(roadRoute.coordinates, [emergencyId, hospitalId], '#4dff4d', 'Optimal Route (Dijkstra)');
            
            // Use Dijkstra's calculated distance (from our graph) or OSRM's real distance
            const displayDistance = roadRoute.distance || dijkstraResult.cost;
            const eta = Math.round(displayDistance * 2);
            
            document.getElementById('etaText').textContent = `${eta} minutes`;
            document.getElementById('distanceText').textContent = `${displayDistance.toFixed(2)} km`;
            document.getElementById('statusText').textContent = '✓ Route Active';
        }

        displayComparison(dijkstraResult, dpResult);
        document.getElementById('dispatchBtn').disabled = false;
    }, 100);
}

// ============= DRAW ROUTE WITH REAL ROADS =============
async function drawRoute(roadCoordinates, nodePath, color, label) {
    // Convert OSRM format [lng, lat] to Leaflet format [lat, lng]
    const leafletCoords = roadCoordinates.map(coord => [coord[1], coord[0]]);

    const polyline = L.polyline(leafletCoords, {
        color: color,
        weight: 5,
        opacity: 0.7,
        lineJoin: 'round'
    }).addTo(map);

    polyline.bindPopup(`<b>${label}</b>`);
    routeLayers.push(polyline);

    // Add ambulance marker at start
    const startNode = cityGraph.nodes.get(nodePath[0]);
    const ambulanceMarker = L.marker([startNode.lat, startNode.lng], {
        icon: L.divIcon({
            html: '🚑',
            className: 'ambulance-icon',
            iconSize: [30, 30]
        })
    }).addTo(map);
    markerLayers.push(ambulanceMarker);

    map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
}

// ============= DISPLAY ALGORITHM COMPARISON =============
function displayComparison(dijkstra, dp) {
    const comparisonDiv = document.getElementById('comparison');
    const resultsDiv = document.getElementById('comparisonResults');
    
    const results = [
        { name: 'Dijkstra (Live Routing)', data: dijkstra, desc: 'Real-time pathfinding with traffic' },
        { name: 'DP - Floyd-Warshall (Cached)', data: dp, desc: 'Pre-computed shortest paths' }
    ];
    
    const bestCost = Math.min(dijkstra?.cost || Infinity, dp?.cost || Infinity);
    
    resultsDiv.innerHTML = '';
    
    results.forEach(result => {
        if (result.data) {
            const isBest = result.data.cost === bestCost;
            const div = document.createElement('div');
            div.className = 'algo-result' + (isBest ? ' best' : '');
            
            div.innerHTML = `
                <h4>${result.name} ${isBest ? '✓ Optimal' : ''}</h4>
                <p style="color: #888; font-size: 0.8rem; margin-bottom: 5px;">${result.desc}</p>
                <p><strong>Distance:</strong> ${result.data.cost.toFixed(2)} km</p>
                <p><strong>Computation Time:</strong> ${result.data.time} ms</p>
                <p><strong>Nodes Explored:</strong> ${result.data.nodesExplored}</p>
            `;
            
            resultsDiv.appendChild(div);
        }
    });
    
    const explanation = document.createElement('div');
    explanation.style.cssText = 'margin-top: 15px; padding: 10px; background: #1a1a1a; border-radius: 4px; font-size: 0.85rem; color: #ccc;';
    explanation.innerHTML = `
        <strong style="color: #4dff4d;">Why two algorithms?</strong><br>
        <strong>Dijkstra:</strong> Adapts to live traffic updates<br>
        <strong>DP:</strong> Instant lookup but uses static data
    `;
    resultsDiv.appendChild(explanation);
    
    comparisonDiv.style.display = 'block';
}

// ============= CLEAR ROUTES =============
function clearRoutes() {
    routeLayers.forEach(layer => map.removeLayer(layer));
    routeLayers = [];
    
    markerLayers.forEach(marker => {
        if (marker.options.icon) {
            map.removeLayer(marker);
        }
    });
    
    document.getElementById('comparison').style.display = 'none';
    document.getElementById('etaText').textContent = '--';
    document.getElementById('distanceText').textContent = '--';
    document.getElementById('statusText').textContent = 'Ready';
}
