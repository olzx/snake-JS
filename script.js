class Game {
    constructor(options) {
        this.$el = document.querySelector(options.selector)
        this.ctx = this.$el.getContext('2d')

        this.$el.width = options.width
        this.$el.height = options.height
    }

    show() {
        this.$el.style.display = 'block'
    }

    hide() {
        this.$el.style.display = 'none'
    }
}

class Snake extends Game {
    constructor(options) {
        super(options)

        this.setFlatColor(options.flatColor)
        
        this.sizeBox = options.sizeBox
        this.timeUpdate = options.timeUpdate

        this._start = false
    }

    setFlatColor(color) {
        this.flatColor = color
        this.ctx.fillStyle = this.flatColor
        this.ctx.fillRect(0, 0, this.$el.width, this.$el.height)
    }

    setTimeUpdate(time) {
        this.timeUpdate = time
    }

    _drawUpdate = () => {
        if (!this._start) return // если игры не была начата
        console.log('1')

        // game
        
        if (this._start == true) {
            setTimeout(this._drawUpdate, this.timeUpdate)
        }
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
}


const snake = new Snake({
    selector: '#snake', // id canvas из Html
    height: document.body.clientHeight, // высота canvas
    width: document.body.clientWidth,   // ширина canvas
    timeUpdate: 100,    // время обновления (ms)
    sizeBox: 16, // ширина = высота клеточек (px)
    flatColor: '#000', // цвет фона canvas
})