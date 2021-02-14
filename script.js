class Game {
    constructor(options) {
        this.$el = document.querySelector(options.selector)
        this.ctx = this.$el.getContext('2d')

        this.sizeBox = options.sizeBox

        this.$el.width = this.getClosestInteger(options.width, this.sizeBox)
        this.$el.height = this.getClosestInteger(options.height, this.sizeBox)
    }

    show() {
        this.$el.style.display = 'block'
    }

    hide() {
        this.$el.style.display = 'none'
    }

    getClosestInteger(a, b, x = Math.trunc(a / b)) { //х - сколько раз b содержится в а
        if(a > b){//защита от дурака
            if(!(a % b)) //если а делится на b без остатка
                return a//значит а это и есть ответ
            return (b * (x + 1) - a) < (a - b * x) ? b * (x + 1) : b * x //иначе выбираем между b * x и b * (x + 1)
        }
        return 'Некорректный ввод данных'
    }
}

class Snake extends Game {
    constructor(options) {
        super(options)

        this.flatColor = options.flatColor
        this.setFlatColor(this.flatColor)

        this.timeUpdate = options.timeUpdate

        this._start = false

        this.eats = [
            {food: {
                amount: options.eats.foodApple.amount, 
                color: options.eats.foodApple.color, 
                coords: []
            }},
            {boost: {
                amount: options.eats.boost.amount, 
                color: options.eats.boost.color,
                coords: []
            }}
        ]

        this.snake = {
            colorHead: options.snake.colorHead,
            colorTail: options.snake.colorTail,
            coords: [this._getRandomCoords()],
            direction: 'down'
        }
    }

    setFlatColor(color) {
        this.ctx.fillStyle = this.flatColor
        this.ctx.fillRect(0, 0, this.$el.width, this.$el.height)
    }

    setTimeUpdate(time) {
        this.timeUpdate = time
    }

    startGame() {
        if (this._start == false) {
            this._start = true
            setTimeout(this._drawUpdate, this.timeUpdate)
        } else {
            console.error('[Ошибка]: Игра уже началась')
        }
    }

    stopGame() {
        if (this._start == true) {
            this._start = false
        } else {
            console.error('[Ошибка]: Игра еще не началась')
        }
    }

    _drawUpdate = () => {
        if (!this._start) return // если игры не была начата

        this.setFlatColor(this.flatColor)
        this._spawnEats(this.eats)
        this._snakeControl()
        
        if (this._start == true) {
            setTimeout(this._drawUpdate, this.timeUpdate)
        }
    }

    _snakeControl() {
        this.snake.coords.forEach((block, index) => {
            let color = ''

            if (index == 0) { // если index == 0 значит это голова
                color = this.snake.colorHead
            } else {
                color = this.snake.colorTail
            }

            this._drawPixelOnPlane(block.x, block.y, color, this.sizeBox)

            if (index == 0) {
                switch (this.snake.direction) {
                    case 'up':
                        block.y--
                        break;
                    case 'down':
                        block.y++
                        break;
                    case 'left':
                        block.x--
                        break;
                    case 'right':
                        block.x++
                        break;
                }
                console.log(block)
            }
        })
    }

    _spawnEats(arrEats) {
        arrEats.forEach(food => {
            for (const iterator in food) {
                const amount = food[iterator].amount
                const color = food[iterator].color
                let coords = food[iterator].coords

                for (let i = 0; i < amount; i++) {
                    if (coords.length < amount) {
                        const cord = this._getRandomCoords()
                        coords.push(cord)
                    }

                    this._drawPixelOnPlane(coords[i].x, coords[i].y, color, this.sizeBox)
                }
            }
        })
    }

    _drawPixelOnPlane(cordX, cordY, color, size) {
        const x = (cordX)*this.sizeBox
        const y = (cordY)*this.sizeBox

        this.ctx.fillStyle = color
        this.ctx.fillRect(x, y, size, size)
    }

    _getRandomCoords() {
        return {
            x: Math.floor(Math.random() * this.$el.width/this.sizeBox),
            y: Math.floor(Math.random() * this.$el.height/this.sizeBox)
        }
    }
}


const snake = new Snake({
    selector: '#snake', // id canvas из Html
    height: document.body.clientHeight, // высота canvas
    width: document.body.clientWidth,   // ширина canvas
    timeUpdate: 100,    // время обновления (ms)
    sizeBox: 16, // ширина = высота клеточек (px)
    flatColor: '#000', // цвет фона canvas
    // Настройка всего что ест snake
    eats: {
        foodApple: {
            amount: 5,
            color: 'green'
        },
        boost: {
            amount: 1,
            color: 'blue'
        }
    },
    // Настройка snake
    snake: {
        colorHead: '#f2a154',
        colorTail: '#ef7b0e'
    },
})

snake.startGame()