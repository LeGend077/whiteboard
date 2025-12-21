let brushbtn = document.getElementById('brush');
let eraserbtn = document.getElementById('eraser');
let size = document.getElementById('sizeSlider');
let colorPicker = document.getElementById('colorPicker');

brushbtn.addEventListener("click", (e) => {
    currentTool = "brush";
    brushbtn.classList.add('isactive');
    eraserbtn.classList.remove('isactive');
});

eraserbtn.addEventListener("click", (e) => {
    currentTool = "eraser";
    brushbtn.classList.remove('isactive');
    eraserbtn.classList.add('isactive');
});

size.addEventListener("change", (e) => {
    toolSize = e.target.value;
});

colorPicker.addEventListener("change", (e) => {
    color = e.target.value
});

window.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "z") undo();
    if (e.ctrlKey && e.key === "y") redo();
    if (e.key === "e") {
        currentTool = "eraser";
        brushbtn.classList.remove('isactive');
        eraserbtn.classList.add('isactive');
    }
    if (e.key === "b") {
        currentTool = "brush";
        brushbtn.classList.add('isactive');
        eraserbtn.classList.remove('isactive');
    }
});