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
            return (b * x - a) < (a - b * x) ? b * x : b * x //иначе выбираем между b * x и b * (x + 1)
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

        this.buttonSwitch = false
        this._Buttons()

        this.eats = [
            {food: {
                amount: options.eats.foodApple.amount, 
                color: options.eats.foodApple.color, 
                coords: [],
                autoAdd: true
            }},
            {boost: {
                amount: options.eats.boost.amount, 
                color: options.eats.boost.color,
                coords: [],
                autoAdd: true
            }}
        ]

        this.snake = {
            colorHead: options.snake.colorHead,
            colorTail: options.snake.colorTail,
            coords: [{x: 3, y: 4}],
            direction: 'down'
        }
    }

    setFlatColor(color) {
        this.ctx.fillStyle = this.flatColor
        this.ctx.fillRect(0, 0, this.$el.width, this.$el.height)
        document.body.style.backgroundColor = this.flatColor
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
            this._drawPixelOnPlane(block.x, block.y, this.snake.colorTail, this.sizeBox)

            if (index == 0) {
                let newCord = {x: block.x, y: block.y}

                switch (this.snake.direction) {
                    case 'up':
                        newCord.y--
                        break;
                    case 'down':
                        newCord.y++
                        break;
                    case 'left':
                        newCord.x--
                        break;
                    case 'right':
                        newCord.x++
                        break;
                }
                this.buttonSwitch = true

                // проверка на столкновение со своим хвостом
                this.snake.coords.forEach((blockTail, number) => {
                    if (number != 0) {
                        if ((newCord.x == blockTail.x) && (newCord.y == blockTail.y)) {
                            this.snake.coords.splice(number+1, this.snake.coords.length)
                        }
                    }
                })

                // Проверка на выход за края поля
                const maxWidth = this.$el.width/this.sizeBox
                const maxHeight = this.$el.height/this.sizeBox
                if (newCord.x >= maxWidth) {
                    newCord.x = 0
                }
                if (newCord.x < 0) {
                    newCord.x = maxWidth-1
                }
                if (newCord.y < 0) {
                    newCord.y = maxHeight-1
                }
                if (newCord.y >= maxHeight) {
                    newCord.y = 0
                }

                // Удаление последнего элемента хвоста и вставка нового в начало
                if (this.snake.coords.length > 1) {
                    this.snake.coords.pop()
                }
                this.snake.coords.unshift(newCord)

                this._drawPixelOnPlane(newCord.x, newCord.y, this.snake.colorHead, this.sizeBox)

                // проверка на столкновение с eats[]
                this.eats.forEach(eat => {
                    for (const iterator in eat) {
                        let coords = eat[iterator].coords

                        coords.forEach((coord, index) => {
                            // если true - столкнулись
                            if ((coord.x == newCord.x) && (coord.y == newCord.y)) {
                                switch (iterator) {
                                    case 'food':
                                        this.snake.coords.push({x: newCord.x, y: newCord.y})
                                        // console.log(this.snake.coords.length)
                                        coords.splice(index, 1) // удаляем элемент с которым столкнулись
                                        break;

                                    case 'boost':
                                        coords.splice(index, 1)

                                        this.timeUpdate = 50
                                        
                                        const _BoostAutoAdd = autoAdd => {
                                            this.eats.forEach(eat => {
                                                for (let iterator in eat) {
                                                    if (iterator == 'boost') {
                                                        eat[iterator].autoAdd = autoAdd
                                                    }
                                                }
                                            })
                                        }

                                        _BoostAutoAdd(false)

                                        setTimeout(() => {
                                            this.timeUpdate = 100
                                            _BoostAutoAdd(true)
                                        }, 3000)
                                        break;
                                }
                            }
                        })
                    }
                })
            }
        })
    }

    _Buttons() {
        document.addEventListener('keydown', e => {
            switch (e.key) {
                case 'w':
                    if (!this.buttonSwitch) break;

                    if (this.snake.direction !== 'down') {
                        this.snake.direction = 'up'
                        this.buttonSwitch = false
                    }
                    break;
                case 's':
                    if (!this.buttonSwitch) break;

                    if (this.snake.direction !== 'up') {
                        this.snake.direction = 'down'
                        this.buttonSwitch = false
                    }
                    break;
                case 'a':
                    if (!this.buttonSwitch) break;

                    if (this.snake.direction !== 'right') {
                        this.snake.direction = 'left'
                        this.buttonSwitch = false
                    }
                    break;
                case 'd':
                    if (!this.buttonSwitch) break;

                    if (this.snake.direction !== 'left') {
                        this.snake.direction = 'right'
                        this.buttonSwitch = false
                    }
                    break;
                default:
                    break;
            }
        })
    }

    _spawnEats(arrEats) {
        arrEats.forEach(food => {
            for (const iterator in food) {
                const amount = food[iterator].amount
                const color = food[iterator].color
                let coords = food[iterator].coords
                const autoAdd = food[iterator].autoAdd

                for (let i = 0; i < amount; i++) {
                    if ((coords.length < amount) && autoAdd) {
                        const cord = this._getRandomCoords()
                        coords.push(cord)
                    }

                    if (coords.length > 0) {
                        this._drawPixelOnPlane(coords[i].x, coords[i].y, color, this.sizeBox)
                    }
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
            amount: 10,
            color: 'green'
        },
        boost: {
            amount: 1,
            color: 'blue'
        }
    },
    // Настройка snake
    snake: {
        colorHead: 'red', //#f2a154
        colorTail: '#ef7b0e'
    },
})

snake.startGame()