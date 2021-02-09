const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')

canvas.height = 656
canvas.width  = 656

const box = 16

function drawPlane() {
    ctx.fillStyle = "#108165"
    ctx.fillRect(0, 0, canvas.height, canvas.width)
}

let snake = []
snake[0] = {
    x: 5,
    y: 5
}
snake[1] = {
    x: 5,
    y: 5
}
snake[2] = {
    x: 5,
    y: 5
}

const draw = function draw() {
    drawPlane()

    ctx.fillStyle = "#f2a154"

    snake.forEach(elem => {
        const x = (elem.x-1)*box
        const y = (elem.y-1)*box

        ctx.fillRect(x, y, box, box)
    })

    let snakeX = snake[0].x
    let snakeY = snake[0].y

    snake.pop()

    switch (direction) {
        case "up":
            snakeY--
            break;
        case "down":
            snakeY++
            break;
        case "left":
            snakeX--
            break;
        case "right":
            snakeX++
            break;
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    }

    newHead = checkExit(newHead)

    snake.unshift(newHead)
}
setInterval(draw, 100)

function checkExit(cords) {
    const head = {
        x: cords.x,
        y: cords.y
    }

    if (cords.x <= 0) {
        head.x = canvas.width / box
        return head
    }

    if ((cords.x * box) > canvas.width) {
        head.x = 1
        return head
    } 

    if (cords.y <= 0) {
        head.y = canvas.height / box
        return head
    }

    if ((cords.y * box) > canvas.height) {
        head.y = 1
        return head
    } 

    return head
}

let direction = 'down'
document.addEventListener('keydown', event => {
    switch (event.key) {
        case 'w':
            direction = direction === "down" ? "down" : "up"
            break;
        case 's':
            direction = direction === "up" ? "up" : "down"
            break;
        case 'a':
            direction = direction === "right" ? "right" : "left"
            break;
        case 'd':
            direction = direction === "left" ? "left" : "right"
            break;
    }
})

