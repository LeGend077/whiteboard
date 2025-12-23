// Canvas setup
const canvas = document.getElementById("maincanvas");
const ctx = canvas.getContext("2d");
const dpr = window.devicePixelRatio || 1;

function resizeCanvas() {
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();


// Input
const Input = {
    x: 0,
    y: 0,
    prevX: 0,
    prevY: 0,
    isDown: false,
    shapeX: 0,
    shapeY: 0,
    prevShapeX: 0,
    prevShapeY: 0,
};

function updatePointerPos(e) {
    const rect = canvas.getBoundingClientRect();
    Input.prevX = Input.x;
    Input.prevY = Input.y;
    Input.x = e.clientX - rect.left;
    Input.y = e.clientY - rect.top;
}

canvas.addEventListener("pointerdown", e => {
    Input.isDown = true;

    // for shapes
    Input.prevShapeX = e.offsetX;
    Input.prevShapeY = e.offsetY;

    // for brush
    updatePointerPos(e);
    startStroke();
});

canvas.addEventListener("pointermove", e => {
    updatePointerPos(e);
});

canvas.addEventListener("pointerup", (e) => {
    Input.isDown = false;

    // for shapes
    Input.shapeX = e.offsetX;
    Input.shapeY = e.offsetY;

    updateShapes();

    // for brush
    endStroke();
    // console.log(Input);
});

canvas.addEventListener("pointerleave", () => {
    Input.isDown = false;
    endStroke();
});

// Stroke data
let currentTool = "brush";
let toolSize = 20;
let color = "black"

const strokes = [];
const undoStack = [];
const redoStack = [];
let currentStroke = null;

const shapes = [];
const shapeTools = ['circle', 'square', 'hollowCircle', 'hollowSquare']

function updateShapes() {
    if (!shapeTools.includes(currentTool)) return;
    shapes.push({
        type: currentTool,
        color: color,
        points: [Input.prevShapeX, Input.prevShapeY, Input.shapeX, Input.shapeY]
    })
}

function startStroke() {
    currentStroke = {
        color: color,
        size: toolSize,
        points: [{ x: Input.x, y: Input.y }]
    };
    strokes.push(currentStroke);
}

function endStroke() {
    if (currentStroke) {
        undoStack.push(currentStroke);
        redoStack.length = 0; // clear redo stack
        currentStroke = null;
    }
}

function eraseAt(x, y) {
    for (let i = strokes.length - 1; i >= 0; i--) {
        const stroke = strokes[i];

        for (const p of stroke.points) {
            const dx = p.x - x;
            const dy = p.y - y;
            const dist = Math.hypot(dx, dy);

            if (dist < toolSize) {
                strokes.splice(i, 1); // remove entire stroke
                undoStack.splice(i, 1); // Incomplete (workaround)
                return;
            }
        }
    }
}

function undo() {
    if (undoStack.length === 0) return;
    const stroke = undoStack.pop();
    redoStack.push(stroke);

    // rebuild strokes array from undoStack
    strokes.length = 0;
    strokes.push(...undoStack);
}

function redo() {
    if (redoStack.length === 0) return;
    const stroke = redoStack.pop();
    undoStack.push(stroke);

    // rebuild strokes array
    strokes.length = 0;
    strokes.push(...undoStack);
}


// Update loop
function update() {
    if (!Input.isDown) return;

    if (currentTool === "brush" && currentStroke) {
        currentStroke.points.push({ x: Input.x, y: Input.y });
    }

    if (currentTool === "eraser") {
        eraseAt(Input.x, Input.y);
    }
}

// Render
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const stroke of strokes) {
        const pts = stroke.points;
        if (pts.length < 2) continue;

        ctx.beginPath();
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.size;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        if (pts.length === 2) {
            // fallback for very short strokes
            ctx.moveTo(pts[0].x, pts[0].y);
            ctx.lineTo(pts[1].x, pts[1].y);
        } else {
            // move to first midpt
            let midX = (pts[0].x + pts[1].x) / 2;
            let midY = (pts[0].y + pts[1].y) / 2;
            ctx.moveTo(midX, midY);

            for (let i = 1; i < pts.length - 1; i++) {
                const p = pts[i];
                const next = pts[i + 1];

                const midNextX = (p.x + next.x) / 2;
                const midNextY = (p.y + next.y) / 2;

                ctx.quadraticCurveTo(
                    p.x, p.y,        // control point
                    midNextX, midNextY
                );
            }
        }

        ctx.stroke();
    }

    for (const shape of shapes) {
        if (shape.type === "circle") {
            ctx.beginPath();

            let radius = Math.min(Math.abs(shape.points[0] - shape.points[2]), Math.abs(shape.points[1] - shape.points[3])) / 2;

            ctx.arc((shape.points[0] + shape.points[2]) / 2, (shape.points[1] + shape.points[3]) / 2, radius, 0, 2 * Math.PI);
            ctx.fillStyle = shape.color;
            ctx.fill();
            ctx.strokeStyle = shape.color;
            ctx.stroke();
        }
    }

    if (currentTool === "eraser") {
        ctx.beginPath();
        ctx.arc(Input.x, Input.y, toolSize, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0,0,0,0.3)";
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

// Main loop
let lastTime = 0;

function loop(time) {
    const dt = (time - lastTime) / 1000;
    lastTime = time;

    update(dt);
    render();

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);