const canvas = document.querySelector('#canvas')
canvas.focus()
const ctx = canvas.getContext('2d')

canvas.height = 656
canvas.width  = 656

const box = 16

function drawPlane() {
    ctx.fillStyle = "#108165"
    ctx.fillRect(0, 0, canvas.height, canvas.width)
}

let snake = []
randomSpawn(snake)

let food = []
randomSpawn(food, 4)

const draw = function draw() {
    drawPlane()

    // Отрисовываем все элементы из snake[]
    renderOnPlane(snake, "#f2a154")

    // Отрисовываем все элементы из food[]
    renderOnPlane(food, "#54f299")

    // Сохраняем координаты первого элемента из snake[]
    let beforeDel = {
        x: snake[0].x,
        y: snake[0].y
    }

    // Удаляем последний элемент
    snake.pop()

    // Перемещаем первый элемент
    beforeDel = switchDir(direction, beforeDel)

    // Проверяем первый элемент на выход за границы
    newHead = checkExit(beforeDel)

    // Проверяем первый элемент на столкновение со своим хвостом (if true - удаляем все элементы после того элемента с которым столкнулись)
    const checkTail = collision(newHead, snake)
    if (checkTail) {
        snake.splice(snake.indexOf(checkTail), snake.length)
    }

    // Проверяем первый элемент на столкновение с едой (if true - прибаляем +1)
    const checkEat = collision(newHead, food)
    if (checkEat) {
        food.splice(food.indexOf(checkEat), 1)
        snake.push({x: beforeDel.x, y: beforeDel.y})

        // спавним на random координаты в массив food[]
        randomSpawn(food)
    }

    // Вставлям "первый элемент" на 0 место (первое) в массив snake[]
    snake.unshift(newHead)
}
setInterval(draw, 100)

function randomSpawn(arr, num = 1) {
    for (let i=0; i < num; i++) {
        const cords = {
            x: Math.floor(Math.random() * canvas.width/box + 1),
            y: Math.floor(Math.random() * canvas.height/box  + 1)
        }
        arr.push(cords)
    }
}

function collision(cords, arr) {
    const element = arr.find((elem, index) => {
        if (cords.x == elem.x && cords.y == elem.y) {
            return elem
        }
        return false
    })
    return element
}

function renderOnPlane(arr, color) {
    ctx.fillStyle = color

    arr.forEach(elem => {
        const x = (elem.x-1)*box
        const y = (elem.y-1)*box

        ctx.fillRect(x, y, box, box)
    })
}

function switchDir(direction, cords) {
    let cord = {
        x: cords.x,
        y: cords.y
    }

    switch (direction) {
        case "up":
            cord.y--
            break;
        case "down":
            cord.y++
            break;
        case "left":
            cord.x--
            break;
        case "right":
            cord.x++
            break;
    }

    return cord
}

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

