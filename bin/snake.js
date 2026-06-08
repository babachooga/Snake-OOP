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
    makeStep(boolean) {
        const head = this.getHead()
        const direction = this.getDirection()

        const y = head.getY() + direction.getY()
        const x = head.getX() + direction.getX()

        if(boolean){
            snake.body.push(new Point(y,x))
        }
        else{
            snake.body.push(new Point(y,x))
            snake.body.shift()
        }
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
    checkPlacement(field){
        const head = this.getHead()
        const y = head.getY()
        const x = head.getX()
        return field[y][x] === undefined
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
    uniqCoords(snake){
        const body = snake.getBody()
        const uniqCoords = new Point(randomNum(10),randomNum(10))

        const coincide = body.some((point) => {
           const y = point.getY() === uniqCoords.getY()
           const x = point.getX() === uniqCoords.getX()
           return y && x
        })
        if(coincide){
            return this.uniqCoords(snake)
        }
        return uniqCoords
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

        if(y && x){
            const newCoords = apple.uniqCoords(snake)
            apple.setCoordinates(newCoords)
        }
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

const game = new Game(10, 10, '.')
const apple = new Apple()
const snake = new Snake()

const play = () => {
    console.clear()
    const field = game.getField()
    const placemnt = snake.checkPlacement(field)
    if(placemnt){
        console.log('You are out of playing area')
        process.exit()
    }
    const collision = snake.checkCollision()
    if (collision) {
        console.log('DEAD')
        process.exit()
    }
    
    const check = game.checkApple(apple, snake)
    snake.makeStep(check)


    game.printApple(apple)
    game.printSnake(snake)
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