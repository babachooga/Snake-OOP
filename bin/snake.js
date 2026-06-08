import readline from 'node:readline'


class Point {
    constructor(y, x) {
        this.y = y;
        this.x = x;
    }
    getY() {
        return this.y;
    }
    getX() {
        return this.x;
    }
}

class Snake {
    constructor() {
        this.body = [
            new Point(1, 1),
            new Point(1, 2),
            new Point(1, 3)
        ];
        this.pattern = "#";
    }
    getHead() {
        return this.body.at(-1);
    }
}

class Game{
    constructor(width,height,pattern) {
        this.width = width
        this.height = height
        this.pattern = pattern
        this.field = this.makeField()
    }
    getField() {
        return this.field
    }
    makeField() {
        const field = []
        for (let i = 0 ; i < this.height ; i++){
            field.push(Array(this.width).fill(this.pattern))
        }
        this.field = field
        return field
    }
    printSnake(snake) {
        const body = snake.body
        const field = this.getField()
        for (const point of body) {
            const y = point.getY()
            const x = point.getX()
            field[y][x] = snake.pattern
        }
    }
    printField() {
        console.log(
            this.field.map((row) => {
                return row.join(' ')
            }).join("\n")
        )
    }
}

const snake = new Snake()
const game = new Game(10, 10, '.')

game.printSnake(snake)
game.printField()