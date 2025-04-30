let map = L.map("map").setView([37.2, 28.3], 9);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18
}).addTo(map);

let startDistrict = null;
let endDistrict = null;
let markers = [];

let graphData = null;
let districtData = null;

// Load graph and district data
Promise.all([
    fetch("graph-data.json").then(res => res.json()),
    fetch("mugla_districts.json").then(res => res.json())
]).then(([graph, districts]) => {
    graphData = graph;
    districtData = districts;

    Object.entries(districtData).forEach(([name, info]) => {
        let marker = L.marker([info.lat, info.lon]).addTo(map);
        marker.bindPopup(name);
        marker.on("click", () => {
            if (!startDistrict) {
                startDistrict = { name, ...info };
                marker.setIcon(greenIcon);
                marker.bindPopup("Start: " + name).openPopup();
            } else if (!endDistrict && name !== startDistrict.name) {
                endDistrict = { name, ...info };
                marker.setIcon(redIcon);
                marker.bindPopup("Destination: " + name).openPopup();
                drawAllRoutes();
            }
        });
        markers.push(marker);
    });
});

// Reset button
document.getElementById("cancelBtn").addEventListener("click", () => {
    startDistrict = null;
    endDistrict = null;
    markers.forEach(marker => marker.setIcon(new L.Icon.Default()));
    map.eachLayer(layer => {
        if (layer instanceof L.Polyline) {
            map.removeLayer(layer);
        }
    });

    const distanceInfoDiv = document.getElementById("distance-info");
    distanceInfoDiv.innerHTML = "";
});

// Draw shortest and alternative routes
function drawAllRoutes() {
    const startNode = String(startDistrict.node_id);
    const endNode = String(endDistrict.node_id);

    const routes = [];
    const distances = [];

    // Clone original graph edges
    const originalEdges = JSON.parse(JSON.stringify(graphData.edges));

    // Main A* path
    const mainPath = astar(startNode, endNode, graphData.edges, graphData.nodes);
    if (!mainPath) {
        alert("No path found!");
        return;
    }
    routes.push(mainPath);
    distances.push(computeDistance(mainPath));

    // Remove 1st and 2nd edge for alternative routes
    const edgePairs = mainPath.map((node, i) => [mainPath[i], mainPath[i + 1]]).slice(0, 2);

    for (let [u, v] of edgePairs) {
        graphData.edges[u] = graphData.edges[u].filter(edge => edge.to !== v);
        const altPath = astar(startNode, endNode, graphData.edges, graphData.nodes);
        if (altPath && !routes.find(r => JSON.stringify(r) === JSON.stringify(altPath))) {
            routes.push(altPath);
            distances.push(computeDistance(altPath));
        }
        // Restore edge
        graphData.edges[u] = originalEdges[u];
    }

    // Draw all routes
    const colors = ["red", "blue", "green"];
    const labels = ["Shortest", "Alternative 1", "Alternative 2"];
    const distanceInfoDiv = document.getElementById("distance-info");
    distanceInfoDiv.innerHTML = "";

    routes.forEach((path, i) => {
        const coords = path.map(id => [graphData.nodes[id].lat, graphData.nodes[id].lon]);
        L.polyline(coords, { color: colors[i], weight: 5 }).addTo(map);

        const km = (distances[i] / 1000).toFixed(2);
        const time = (distances[i] / 1000 / 50 * 60).toFixed(0); // in minutes (assuming 50 km/h)
        const steps = Math.round(distances[i] / 0.75); // human steps
        
        const infoText = document.createElement("span");
        infoText.style.color = colors[i];
        infoText.innerHTML = `
          ${labels[i]} route → 
          <strong>${km} km</strong> | 
          <strong>${time} min</strong> | 
          <strong>${steps.toLocaleString()} steps</strong>
        `;
        distanceInfoDiv.appendChild(infoText);
        distanceInfoDiv.appendChild(document.createElement("br"));        
    });
}

// Compute total weight of a path
function computeDistance(path) {
    let total = 0;
    for (let i = 0; i < path.length - 1; i++) {
        const from = path[i];
        const to = path[i + 1];
        const edge = graphData.edges[from].find(e => e.to === to);
        total += edge ? edge.weight : 0;
    }
    return total;
}

// Marker icons
const greenIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const redIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
