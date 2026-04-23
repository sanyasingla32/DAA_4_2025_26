const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let nodes = [];
let edges = []; // {u, v, weight, state}
let nextNodeId = 0; // Better ID tracking for deletions

let selectedNodeId = null;
let isAnimating = false;
let totalCost = 0;

// Elements
const modal = document.getElementById('weight-modal');
const weightInput = document.getElementById('weight-input');
const btnConfirmWeight = document.getElementById('btn-confirm-weight');
const btnCancelWeight = document.getElementById('btn-cancel-weight');
const btnDeleteEdge = document.getElementById('btn-delete-edge');
const btnDeleteNode = document.getElementById('btn-delete-node');
let pendingEdge = null; // {u, v}

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    draw();
}

window.addEventListener('resize', resize);
resize();

function isClickOnPanel(x, y) {
    return x >= 20 && x <= 380 && y >= 20 && y <= 500;
}

function getClickedNode(x, y) {
    for (const node of nodes) {
        const dx = node.x - x;
        const dy = node.y - y;
        if (Math.sqrt(dx * dx + dy * dy) <= (node.targetRadius || 15) + 10) {
            return node;
        }
    }
    return null;
}

canvas.addEventListener('click', (e) => {
    if (isAnimating) return;
    if (!modal.classList.contains('hidden')) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (isClickOnPanel(x, y)) return;

    const clickedNode = getClickedNode(x, y);

    if (clickedNode) {
        if (selectedNodeId === null) {
            selectedNodeId = clickedNode.id;
            btnDeleteNode.classList.remove('hidden');
        } else if (selectedNodeId === clickedNode.id) {
            selectedNodeId = null;
            btnDeleteNode.classList.add('hidden');
        } else {
            pendingEdge = { u: selectedNodeId, v: clickedNode.id };
            showModal();
        }
    } else {
        if (selectedNodeId !== null) {
            selectedNodeId = null;
            btnDeleteNode.classList.add('hidden');
        } else {
            nodes.push({id: nextNodeId++, x, y, radius: 0, targetRadius: 8});
            animateNodePop(nodes[nodes.length - 1]);
            document.getElementById('stat-nodes').innerText = nodes.length;
        }
    }
    
    draw();
});

function draw() {
    ctx.clearRect(0, 0, width, height);
    
    edges.forEach(edge => {
        const uNode = nodes.find(n => n.id === edge.u);
        const vNode = nodes.find(n => n.id === edge.v);
        
        ctx.beginPath();
        ctx.moveTo(uNode.x, uNode.y);
        ctx.lineTo(vNode.x, vNode.y);
        
        if (edge.state === 'mst') {
            ctx.strokeStyle = '#ff007f'; 
            ctx.lineWidth = 3;
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ff007f';
        } else if (edge.state === 'exploring') {
            ctx.strokeStyle = '#66fcf1'; 
            ctx.lineWidth = 2;
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#66fcf1';
        } else if (edge.state === 'rejected') {
            ctx.strokeStyle = 'rgba(197, 198, 199, 0.1)';
            ctx.lineWidth = 1;
            ctx.shadowBlur = 0;
        } else { 
            ctx.strokeStyle = 'rgba(197, 198, 199, 0.4)';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 0;
        }
        
        ctx.stroke();
    });
    
    ctx.shadowBlur = 0;

    ctx.font = '14px Outfit';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    edges.forEach(edge => {
        const uNode = nodes.find(n => n.id === edge.u);
        const vNode = nodes.find(n => n.id === edge.v);
        
        const midX = (uNode.x + vNode.x) / 2;
        const midY = (uNode.y + vNode.y) / 2;
        
        const textDist = ctx.measureText(edge.weight).width;
        ctx.fillStyle = '#0b0c10';
        ctx.fillRect(midX - textDist/2 - 4, midY - 10, textDist + 8, 20);
        
        if (edge.state === 'mst') ctx.fillStyle = '#ff007f';
        else if (edge.state === 'exploring') ctx.fillStyle = '#66fcf1';
        else if (edge.state === 'rejected') ctx.fillStyle = '#444';
        else ctx.fillStyle = '#ffffff';
        
        ctx.fillText(edge.weight, midX, midY);
    });

    nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius || 8, 0, Math.PI * 2);
        
        const isConnected = edges.some(e => e.state === 'mst' && (e.u === node.id || e.v === node.id));
        const isSelected = selectedNodeId === node.id;
        
        if (isSelected) {
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#ffffff';
            ctx.strokeStyle = '#66fcf1';
            ctx.lineWidth = 3;
            ctx.stroke();
        } else if (isConnected) {
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#ff007f';
        } else {
            ctx.fillStyle = '#66fcf1';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#66fcf1';
        }
        
        ctx.fill();
        ctx.closePath();
    });
    ctx.shadowBlur = 0;
}

function animateNodePop(node) {
    if (isAnimating) return;
    function step() {
        if (node.radius < node.targetRadius) {
            node.radius += 1;
            draw();
            requestAnimationFrame(step);
        } else {
            node.radius = node.targetRadius;
            draw();
        }
    }
    step();
}

// Modal handling
function showModal() {
    modal.classList.remove('hidden');
    weightInput.focus();

    const existingEdge = edges.find(e => 
        (e.u === pendingEdge.u && e.v === pendingEdge.v) || 
        (e.u === pendingEdge.v && e.v === pendingEdge.u)
    );

    if (existingEdge) {
        weightInput.value = existingEdge.weight;
        btnDeleteEdge.classList.remove('hidden');
    } else {
        weightInput.value = '';
        btnDeleteEdge.classList.add('hidden');
    }
}

function hideModal() {
    modal.classList.add('hidden');
    selectedNodeId = null;
    pendingEdge = null;
    btnDeleteNode.classList.add('hidden');
    draw();
}

function confirmEdgeWeight() {
    const weight = parseInt(weightInput.value, 10);
    if (isNaN(weight)) {
        hideModal();
        return;
    }
    
    const existingEdgeIndex = edges.findIndex(e => 
        (e.u === pendingEdge.u && e.v === pendingEdge.v) || 
        (e.u === pendingEdge.v && e.v === pendingEdge.u)
    );
    
    if (existingEdgeIndex !== -1) {
        edges[existingEdgeIndex].weight = weight;
        edges[existingEdgeIndex].state = 'unexplored';
    } else {
        edges.push({
            u: pendingEdge.u,
            v: pendingEdge.v,
            weight: weight,
            state: 'unexplored'
        });
    }
    hideModal();
}

function deleteCurrentEdge() {
    edges = edges.filter(e => 
        !((e.u === pendingEdge.u && e.v === pendingEdge.v) || 
          (e.u === pendingEdge.v && e.v === pendingEdge.u))
    );
    hideModal();
}

function deleteSelectedNode() {
    if (selectedNodeId === null || isAnimating) return;
    
    // Remove the node
    nodes = nodes.filter(n => n.id !== selectedNodeId);
    
    // Remove all edges connected to it
    edges = edges.filter(e => e.u !== selectedNodeId && e.v !== selectedNodeId);
    
    selectedNodeId = null;
    btnDeleteNode.classList.add('hidden');
    document.getElementById('stat-nodes').innerText = nodes.length;
    draw();
}

// Event Listeners for actions
btnConfirmWeight.addEventListener('click', confirmEdgeWeight);
btnCancelWeight.addEventListener('click', hideModal);
btnDeleteEdge.addEventListener('click', deleteCurrentEdge);
btnDeleteNode.addEventListener('click', deleteSelectedNode);

weightInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') confirmEdgeWeight();
    if (e.key === 'Escape') hideModal();
});

// Global keyboard listeners for Deleting Selected Node
window.addEventListener('keydown', (e) => {
    if (isAnimating) return;
    if (!modal.classList.contains('hidden')) return; // Ignore if modal is open

    if (e.key === 'Backspace' || e.key === 'Delete') {
        if (selectedNodeId !== null) {
            deleteSelectedNode();
        }
    }
});


function setButtonsDisabled(disabled) {
    document.getElementById('btn-kruskal').disabled = disabled;
    document.getElementById('btn-prim').disabled = disabled;
    document.getElementById('btn-clear').disabled = disabled;
    if (disabled) btnDeleteNode.classList.add('hidden');
}

document.getElementById('btn-clear').addEventListener('click', () => {
    isAnimating = false;
    nodes = [];
    edges = [];
    selectedNodeId = null;
    nextNodeId = 0;
    totalCost = 0;
    document.getElementById('stat-nodes').innerText = '0';
    document.getElementById('stat-cost').innerText = '0';
    btnDeleteNode.classList.add('hidden');
    draw();
});

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// ALGORITHMS
document.getElementById('btn-kruskal').addEventListener('click', async () => {
    if (nodes.length < 2 || edges.length === 0 || isAnimating) return;
    
    isAnimating = true;
    setButtonsDisabled(true);
    totalCost = 0;
    document.getElementById('stat-cost').innerText = '0';
    selectedNodeId = null;
    
    edges.forEach(e => e.state = 'unexplored');
    draw();
    
    let sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
    
    class DisjointSet {
        constructor() {
            this.parent = {};
            this.rank = {};
            nodes.forEach(n => {
                this.parent[n.id] = n.id;
                this.rank[n.id] = 0;
            });
        }
        find(i) {
            if (this.parent[i] === i) return i;
            return this.parent[i] = this.find(this.parent[i]);
        }
        union(i, j) {
            let rootI = this.find(i);
            let rootJ = this.find(j);
            if (rootI !== rootJ) {
                if (this.rank[rootI] < this.rank[rootJ]) {
                    this.parent[rootI] = rootJ;
                } else if (this.rank[rootI] > this.rank[rootJ]) {
                    this.parent[rootJ] = rootI;
                } else {
                    this.parent[rootJ] = rootI;
                    this.rank[rootI]++;
                }
                return true;
            }
            return false;
        }
    }
    
    let ds = new DisjointSet();
    let mstEdges = 0;
    
    for (let testEdge of sortedEdges) {
        if (!isAnimating) break; 
        
        let edge = edges.find(e => 
            (e.u === testEdge.u && e.v === testEdge.v) || 
            (e.u === testEdge.v && e.v === testEdge.u)
        );
        
        edge.state = 'exploring';
        draw();
        await sleep(400);
        
        if (ds.union(edge.u, edge.v)) {
            edge.state = 'mst';
            totalCost += edge.weight;
            document.getElementById('stat-cost').innerText = totalCost;
            mstEdges++;
        } else {
            edge.state = 'rejected';
        }
        
        draw();
        await sleep(200);
        
        if (mstEdges === nodes.length - 1) break;
    }
    
    edges.forEach(e => {
        if (e.state === 'unexplored') e.state = 'rejected';
    });
    
    draw();
    isAnimating = false;
    setButtonsDisabled(false);
});

document.getElementById('btn-prim').addEventListener('click', async () => {
    if (nodes.length < 2 || edges.length === 0 || isAnimating) return;
    
    isAnimating = true;
    setButtonsDisabled(true);
    totalCost = 0;
    document.getElementById('stat-cost').innerText = '0';
    selectedNodeId = null;
    
    edges.forEach(e => e.state = 'unexplored');
    draw();
    
    let startNodeId = edges[0].u;
    let inMST = new Set([startNodeId]);
    
    while (inMST.size < nodes.length && isAnimating) {
        let bestEdge = null;
        let minWeight = Infinity;
        
        let candidates = edges.filter(e => 
            (inMST.has(e.u) && !inMST.has(e.v)) || (!inMST.has(e.u) && inMST.has(e.v))
        );
        
        if (candidates.length === 0) break;
        
        for (let e of candidates) {
            e.state = 'exploring';
        }
        draw();
        await sleep(500);
        
        for (let e of candidates) {
            if (e.weight < minWeight) {
                minWeight = e.weight;
                bestEdge = e;
            }
            e.state = 'unexplored';
        }
        
        if (bestEdge) {
            bestEdge.state = 'mst';
            inMST.add(bestEdge.u);
            inMST.add(bestEdge.v);
            totalCost += bestEdge.weight;
            document.getElementById('stat-cost').innerText = totalCost;
        }
        
        edges.forEach(e => {
            if (inMST.has(e.u) && inMST.has(e.v) && e.state === 'unexplored') {
                e.state = 'rejected';
            }
        });
        
        draw();
        await sleep(300);
    }
    
    edges.forEach(e => {
        if (e.state === 'unexplored') e.state = 'rejected';
    });
    
    draw();
    isAnimating = false;
    setButtonsDisabled(false);
});
