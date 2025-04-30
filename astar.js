// Euclidean distance heuristic based on coordinates
function heuristic(a, b, nodes) {
    const dx = nodes[a].lon - nodes[b].lon;
    const dy = nodes[a].lat - nodes[b].lat;
    return Math.sqrt(dx * dx + dy * dy);
}

// A* Pathfinding Algorithm
function astar(start, goal, graph, nodes) {
    const openSet = new Set([start]);
    const cameFrom = {};

    const gScore = {};
    const fScore = {};

    for (const node in nodes) {
        gScore[node] = Infinity;
        fScore[node] = Infinity;
    }

    gScore[start] = 0;
    fScore[start] = heuristic(start, goal, nodes);

    while (openSet.size > 0) {
        // Get node with lowest fScore
        let current = [...openSet].reduce((a, b) => fScore[a] < fScore[b] ? a : b);

        if (current === goal) {
            const path = [];
            while (current in cameFrom) {
                path.unshift(current);
                current = cameFrom[current];
            }
            path.unshift(start);
            return path;
        }

        openSet.delete(current);

        for (const neighbor of graph[current] || []) {
            const tentativeG = gScore[current] + neighbor.weight;
            if (tentativeG < gScore[neighbor.to]) {
                cameFrom[neighbor.to] = current;
                gScore[neighbor.to] = tentativeG;
                fScore[neighbor.to] = tentativeG + heuristic(neighbor.to, goal, nodes);
                openSet.add(neighbor.to);
            }
        }
    }

    return null; // No path found
}
