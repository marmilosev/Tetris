document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  // Array.from --> create array where every div has its own index
  const scoreDisplay = document.querySelector('#score')
  const endGame = document.querySelector('#endGame')
  const startBtn = document.querySelector('#start-button')
  const hScore = document.querySelector('#highScore')
  const width = 10
  let nextRandom = 0
  let timerId
  let score = 0
  if (window.localStorage.getItem('superHighScore') === null) {
    window.localStorage.setItem('superHighScore', '0')
  }
  const colors = [
    'yellow',
    'red',
    'blue',
    'green',
    'purple'
  ]

  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
  ]

  const zTetromino = [
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1]
  ]

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
  ]

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ]

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
  ]

  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

  let currentPosition = 4
  let currentRotation = 0
  let random = Math.floor(Math.random() * theTetrominoes.length)
  let current = theTetrominoes[random][currentRotation]

  // create shape of tetromino
  function draw () {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino')
      squares[currentPosition + index].style.backgroundColor = colors[random]
    })
  }

  // delete tetromino
  function undraw () {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino')
      squares[currentPosition + index].style.backgroundColor = ''
    })
  }

  // timerId = setInterval(moveDown, 1000)

  function control (e) {
    if (e.keyCode === 37) {
      moveLeft()
    } else if (e.keyCode === 38) {
      rotate()
    } else if (e.keyCode === 39) {
      moveRight()
    } else if (e.keyCode === 40) {
      moveDown()
    }
  }
  document.addEventListener('keyup', control)

  // freeze tetromino at the end of grid
  function freeze () {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      random = nextRandom
      // new tetromino
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      current = theTetrominoes[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
      addScore()
      gameOver()
    }
  }

  function moveDown () {
    undraw()
    currentPosition += width
    draw()
    freeze()
  }

  function moveLeft () {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    if (!isAtLeftEdge) currentPosition -= 1
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition += 1
    }
    draw()
  }

  function moveRight () {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
    if (!isAtRightEdge) currentPosition += 1
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -= 1
    }
    draw()
  }

  function rotate () {
    undraw()
    currentRotation++ // rotate - from array
    if (currentRotation === current.length) {
      currentRotation = 0
    }
    current = theTetrominoes[random][currentRotation]
    draw()
  }

  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  const displayIndex = 0

  // rotations
  const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], // lTetromino
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // zTetromino
    [1, displayWidth, displayWidth + 1, displayWidth + 2], // tTetromino
    [0, 1, displayWidth, displayWidth + 1], // oTetromino
    [1, displayWidth + 1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] // iTetromino
  ]
  function displayShape () {
    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
      square.style.backgroundColor = ''
    })
    upNextTetrominoes[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.add('tetromino')
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
  }

  startBtn.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      draw()
      timerId = setInterval(moveDown, 1000)
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      displayShape()
    }
  })

  function addScore () {
    for (let i = 0; i < 199; i += width) {
      const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

      if (row.every(index => squares[index].classList.contains('taken'))) {
        score += 10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
          squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(i, width)
        // console.log(squaresRemoved)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }

  function gameOver () {
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      endGame.innerHTML = 'You lost!'
      clearInterval(timerId)
      highScore()
    }
  }
  // console.log(displayShape())
  // console.log(freeze())
  // console.log(moveDown())

  function highScore () {
    // console.log(score)
    // console.log(window.localStorage.getItem('superHighScore'))
    if (score > window.localStorage.getItem('superHighScore')) {
      window.localStorage.setItem('superHighScore', score)
    }
  }
  hScore.innerHTML = window.localStorage.getItem('superHighScore')
})
