# Visually Stunning MST Visualizer

A gorgeous, interactive standalone web application for visualizing Minimum Spanning Tree (MST) algorithms natively in your browser! Featuring **Kruskal's** and **Prim's** algorithms, this visualizer allows you to build custom mathematical graphs and see them elegantly solved in real-time.

Built entirely using pure zero-dependency **HTML**, **CSS**, and **JavaScript**, bypassing the need for heavy frameworks or backend servers.

![mst](/mst_kruskal_demo.webp)

## 📋 Features

### Custom Interactive Graphs
- Click on the empty space to spawn nodes with a dynamic pop animation.
- Select two nodes sequentially to snap an edge between them and set a **custom distance/cost.**
- Full freedom to design connected components, cyclic clusters, or completely disjoint maps.
- Safely remove specific nodes or specific edges directly from the UI.

### Algorithms Implemented
- **Kruskal's Algorithm**
  - Sorts explicit custom edge weights incrementally.
  - Custom JavaScript `Disjoint-Set (Union-Find)` class structurally prevents cycle formations.
- **Prim's Algorithm**
  - Fanning logic visually explores the frontier from an origin.
  - Dynamically builds out the tree node by node.

### Vibrant Real-Time Rendering
- High-fidelity dark mode with neon highlights (Cyan for active exploration, Pink for final paths).
- Glassmorphism UI panel dynamically tracks stats (number of nodes, active MST cost).
- Sleek interactive modals built for seamless keyboard inputs.
- Safe detection for sparse and completely disjoint sub-graphs without crashing.

## 📁 Project Structure

```text
├── index.html         # Main standalone HTML layout
├── styles.css         # Animations, Glassmorphism, and styling
├── script.js          # Core application and Canvas rendering logic
└── README.md          # Project documentation
```

## 🚀 Running It Locally

There is **no installation, no Python, and no Node.** 

1. Clone or download this repository.
2. Double-click `index.html` to open it in Chrome, Safari, Edge, or Firefox.
3. Start creating your graph!

## 📖 How to Use

1. **Adding Nodes**: Click anywhere empty on the page.
2. **Selecting**: Click an existing node. It will glow cyan indicating it is selected.
3. **Connecting**: Click a second node to connect them. A prompt will appear allowing you to enter an explicit cost value.
4. **Running an Algorithm**: Once you've created a few connected nodes, click either **Run Kruskal's** or **Run Prim's** in the top left panel. 
5. **Deleting**: You can select a node and hit the `Delete` or `Backspace` key (or use the on-screen menu) to sever the node and all of its connections. Selecting two already-connected nodes will bring up the cost menu where you can click "Delete" to severe the edge itself.

## 📝 License

Free to use for educational purposes and portfolio building!
