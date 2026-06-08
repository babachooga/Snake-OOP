import readline from 'node:readline'
import { randomNum } from './index.js'
import chalk from 'chalk'

readline.emitKeypressEvents(process.stdin)
if (process.stdin.isTTY) {
  process.stdin.setRawMode(true)
}

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
            new Point(1, 3),
            new Point(1, 4),
            new Point(1, 5)
        ];
        this.pattern = "#";
        this.direction = new Point(0, 1)
    }
    getBody() {
        return this.body
    }
    setDirection(newDirection) {
        this.direction = newDirection
    }
    getDirection() {
        return this.direction
    }
    getHead() {
        return this.body.at(-1);
    }
    makeStep() {
        const head = this.getHead()
        const direction = this.getDirection()

        const y = head.getY() + direction.getY()
        const x = head.getX() + direction.getX()

        snake.body.push(new Point(y, x))
        snake.body.shift()
    }
    checkCollision() {
        const head = this.getHead()
        const body = this.getBody()
        for (let i = 0; i < body.length - 1; i++){
            const y = head.getY() === body[i].getY()
            const x = head.getX() === body[i].getX()
            if (x && y) {
                return true
            }
        }
        return false
    }
}
class Apple {
    constructor() {
        this.coordinates = new Point(1,1)
        this.pattern = '@'
    }
    getPattern() {
        return this.pattern
    }
    getCoordinates() {
        return this.coordinates
    }
    setCoordinates(newCoordinates) {
        this.coordinates = newCoordinates
    }
}
class Game{
    constructor(width,height,pattern) {
        this.width = width
        this.height = height
        this.pattern = chalk.grey(pattern)
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
            field[y][x] = chalk.green(snake.pattern)
        }
    }
    printApple(apple) {
        const field = this.getField()
        const appleCoords = apple.getCoordinates()
        const y = appleCoords.getY()
        const x = appleCoords.getX()
        field[y][x] = chalk.red(apple.getPattern())
    }
    checkApple(apple, snake) {
        const head = snake.getHead()
        const appleCoords = apple.getCoordinates()
        const y = head.getY() === appleCoords.getY()
        const x = head.getX() === appleCoords.getX()

        return y && x
    }
    printField() {
        console.log(
            this.field.map((row) => {
                return row.join(' ')
            }).join("\n")
        )
    }
}

const apple = new Apple()
const snake = new Snake()
const game = new Game(10, 10, '.')

const play = () => {
    console.clear()
    const boolean = snake.checkCollision()
    if (boolean) {
        console.log('DEAD')
        process.exit()
    }
    snake.makeStep()
    const check = game.checkApple(apple, snake)
    if (check) {
        apple.setCoordinates(new Point(randomNum(10), randomNum(10)))
    }
    game.printSnake(snake)
    game.printApple(apple)
    game.printField()
    game.makeField()
}

setInterval(play, 250)

process.stdin.on('keypress', (_, key) => {
if (key.ctrl && key.name === 'c') process.exit()
    
  switch (key.name) {
    case 'up':
      snake.setDirection(new Point(-1,0))
      break
    case 'down':
      snake.setDirection(new Point(1,0))
      break
    case 'left':
      snake.setDirection(new Point(0,-1))
      break
    case 'right':
      snake.setDirection(new Point(0,1))
      break
  }
})