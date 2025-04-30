# 🚗 AI Midterm - A* Implementation on Map – Muğla Districts

A fully frontend-based web application that calculates and visualizes the shortest and alternative routes between the districts of **Muğla, Turkey**, using **A\*** pathfinding algorithm and **LeafletJS**.

---

## 📌 Features

- Interactive map of Muğla (LeafletJS)
- Click to select **start** and **destination** districts
- Shows **shortest route** using **A\*** algorithm
- Displays **up to 2 alternative routes**
- For each route, shows:
  - 🛣 Total distance (km)
  - ⏱ Estimated travel time (min) based on average speed
  - 👣 Estimated human step count (based on 0.75m step length)
- Reset button clears all selections and paths
- Fully **backend-free** – runs entirely in the browser

---

## 🛠️ Tech Stack

| Layer        | Technology             |
|--------------|------------------------|
| Frontend     | HTML, CSS, JavaScript  |
| Mapping      | LeafletJS              |
| Algorithm    | A* (in JavaScript)     |
| Data Format  | JSON                   |
| Map Source   | OpenStreetMap (OSM)    |

---

## 🌍 How It Works

1. **Data Preparation** (done beforehand in Python):
   - `mugla_roads.graphml` (OSM road graph) → converted to `graph-data.json`
   - District coordinates and node IDs saved to `mugla_districts.json`

2. **Route Calculation** (done in browser):
   - A* algorithm is implemented in `astar.js`
   - After selecting 2 districts, shortest path is calculated
   - Then 2 edges are temporarily removed to compute alternative paths
   - All routes are drawn with different colors

3. **Visualization**:
   - Red = shortest path
   - Blue = alternative 1
   - Green = alternative 2

4. **Distance, Time, Steps**:
   - Distance calculated from edge weights (meters)
   - Time estimated with 50 km/h average speed
   - Steps = total meters / 0.75 (average human step)

---

## 🚀 Setup & Run Instructions

> No backend needed! Just open in a browser.

### 1. Clone or Download the Folder

```bash
git clone https://github.com/Lorstann/aimidterm.git
cd aimidterm
```

### 2. Start Local Server (recommended)

If you have Python installed:

```bash
python -m http.server
```

Then open in browser:
```
http://localhost:8000
```

Or use **VS Code Live Server Extension** to run `index.html`.

---

## 🖼️ Screenshots

Coming soon...

---

## 📁 Project Structure

```
aimidterm/
├── index.html               # Web interface with map and buttons
├── style.css                # Styling for map and layout
├── script.js                # Main logic for selection, routing, drawing
├── astar.js                 # JavaScript implementation of A* algorithm
├── data/
│   ├── graph-data.json      # Graph with nodes and weighted edges
│   └── mugla_districts.json # Districts with coordinates and node IDs
├── README.md                # Project info and instructions
```

---

## 📌 Notes

- The graph is limited to **Muğla province** for performance and simplicity
- Routes are calculated live in the browser without server interaction
- You can convert other `.graphml` files using Python to expand the project

---

## 📜 License

MIT License – free to use with credit.

---

## ✨ Credits

- Developed by **Lorstann**
- GitHub: [github.com/Lorstann/aimidterm](https://github.com/Lorstann/aimidterm)
- Road data from [OpenStreetMap](https://www.openstreetmap.org/)
- Maps rendered via [LeafletJS](https://leafletjs.com/)
