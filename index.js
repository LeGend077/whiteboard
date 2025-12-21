let brushbtn = document.getElementById('brush')
let eraserbtn = document.getElementById('eraser')

document.getElementById('brush').addEventListener("click", (e) => {
    currentTool = "brush"
    brushbtn.classList.add('isactive')
    eraserbtn.classList.remove('isactive')
})

document.getElementById('eraser').addEventListener("click", (e) => {
    currentTool = "eraser"
    brushbtn.classList.remove('isactive')
    eraserbtn.classList.add('isactive')
})