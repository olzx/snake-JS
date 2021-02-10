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
snake[0] = randomCords()

let food = []
spawnFood(8)

const draw = function draw() {
    drawPlane()

    // Отрисовываем все элементы из snake[]
    renderOnPlane(snake, "#f2a154", "#ef7b0e")

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
        snake.push({x: 0, y: 0})

        // спавним на random координаты в массив food[]
        spawnFood(1)
    }

    // Вставлям "первый элемент" на 0 место (первое) в массив snake[]
    snake.unshift(newHead)
}
setInterval(draw, 100)

function spawnFood(num) {
    for (let i = 0; i < num; i++) {
        let cords = randomCords()

        // пока cords такое же как и у food или cords == snake
        while (collision(cords, food) || collision(cords, snake)) {
            cords = randomCords()
        }

        food.push(cords)
    }
}

function randomCords() {
    return cords = {
        x: Math.floor(Math.random() * canvas.width/box + 1),
        y: Math.floor(Math.random() * canvas.height/box  + 1)
    }
}

function collision(cords, arr) {
    const element = arr.find(elem => {
        if (cords.x == elem.x && cords.y == elem.y) {
            return elem
        }
    })

    if (typeof element === 'undefined') {
        return false
    }

    return element
}

function renderOnPlane(arr, color, colorHead=false) {
    arr.forEach((elem, index) => {
        const x = (elem.x-1)*box
        const y = (elem.y-1)*box

        if (colorHead != false && index == 0) {
            ctx.fillStyle = colorHead
            ctx.fillRect(x, y, box, box)
        } else {
            ctx.fillStyle = color
            ctx.fillRect(x, y, box, box)
        }
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
            dirResponse = true
            break;
        case "down":
            cord.y++
            dirResponse = true
            break;
        case "left":
            cord.x--
            dirResponse = true
            break;
        case "right":
            cord.x++
            dirResponse = true
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
let dirResponse = false
document.addEventListener('keydown', event => {
    if (dirResponse === true) {
        switch (event.key) {
            case 'w':
                direction = direction === "down" ? "down" : "up", dirResponse = false
                break;
            case 's':
                direction = direction === "up" ? "up" : "down", dirResponse = false
                break;
            case 'a':
                direction = direction === "right" ? "right" : "left", dirResponse = false
                break;
            case 'd':
                direction = direction === "left" ? "left" : "right", dirResponse = false
                break;
        }
    }
})

