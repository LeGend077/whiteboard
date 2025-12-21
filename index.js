let brushbtn = document.getElementById('brush')
let eraserbtn = document.getElementById('eraser')
let size = document.getElementById('sizeSlider')

brushbtn.addEventListener("click", (e) => {
    currentTool = "brush"
    brushbtn.classList.add('isactive')
    eraserbtn.classList.remove('isactive')
})

eraserbtn.addEventListener("click", (e) => {
    currentTool = "eraser"
    brushbtn.classList.remove('isactive')
    eraserbtn.classList.add('isactive')
})

size.addEventListener("change", (e) => {
    toolSize = e.target.value
})