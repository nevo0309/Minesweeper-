'use strict'
var gBoard
var gMinesToMark
var gLifes
var gHints
var gSafeClicks
const elButton = document.querySelector('.reset')
const elMarkedMine = document.querySelector('.Mines-Marked')
const MINES = '💣'
var gGame
var gLevel = { Size: 4, Mines: 2 }

function onInit() {
  console.log('Game initialized')
  gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    isFirstClicked: true,
  }
  startTimer()
  gBoard = createBoard(gLevel.Size)
  renderBoard(gBoard)
  gLifes = 3
  renderLife()
  gSafeClicks = 3
  gHints = 3
  renderHints()
  gMinesToMark = gLevel.Mines
  elMarkedMine.innerHTML = gMinesToMark
  gGame.isFirstClicked = true
  gGame.isOn = false
  resetTimer()
}

function createBoard(size) {
  var board = []
  for (var i = 0; i < size; i++) {
    board.push([])
    for (var j = 0; j < size; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      }
    }
  }

  //   board[1][1].isMine = true
  //   board[1][3].isMine = true
  return board
}

function renderBoard(board) {
  var strHTML = ''
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < board[0].length; j++) {
      var currCell = board[i][j]
      var cellClass = getClassName({ i: i, j: j })
      var cellContent = currCell.isMine ? MINES : ''
      strHTML += `<td class="cell ${cellClass}" onclick="onCellClicked(this,${i},${j})" oncontextmenu="onCellMarked(this,${i},${j})"><span class="hidden">${cellContent}</span></td>`
    }
    strHTML += '</tr>'
  }

  const elBoard = document.querySelector('.board')
  elBoard.innerHTML = strHTML
}

function randomMines(numOfMines, firstCell) {
  var minePosIdx = []
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (!gBoard[i][j].isMine && !(i === firstCell.i && j === firstCell.j)) {
        minePosIdx.push({ i: i, j: j })
      }
    }
    minePosIdx = shuffle(minePosIdx)
  }
  for (var z = 0; z < numOfMines; z++) {
    var cord = minePosIdx[z]
    gBoard[cord.i][cord.j].isMine = true
  }
}

function onCellClicked(elCell, i, j) {
  if (gGame.isFirstClicked) {
    gGame.isFirstClicked = false
    randomMines(gLevel.Mines, { i, j })
    renderBoard(gBoard)
    elCell = document.querySelector(`.cell-${i}-${j}`)
    gGame.isOn = true
    startTimer()
  }
  if (!gGame.isOn || gBoard[i][j].isShown) return
  if (gBoard[i][j].isMine) {
    gameLives(elCell)
    checkGameOver()

    return
  }

  if (gBoard[i][j].isMarked) return
  gGame.shownCount++
  console.log('gGame.shownCount', gGame.shownCount)
  gBoard[i][j].isShown = true
  var negsCount = setMinesNegsCount(elCell, i, j, gBoard)
  gBoard[i][j].minesAroundCount = negsCount
  gBoard[i][j].isShown = true
  elCell.innerHTML = negsCount
  elCell.classList.add('show')
  expandShown(gBoard, elCell, i, j)
  checkGameOver()
}
function onCellMarked(elCell, i, j) {
  //   if (gBoard.isShown) return
  //   if (gBoard.isMarked) {
  //     gBoard.isMarked = false
  //     elCell.innerHTML = ''
  //   } else {
  if (gGame.isFirstClicked) return
  if (gMinesToMark === 0) {
    checkGameOver()
    return
  }
  if (gBoard[i][j].isMarked) {
    onSeconedMarked(elCell, i, j)
  } else {
    gGame.markedCount++
    gMinesToMark--
    elMarkedMine.innerHTML = gMinesToMark
    gBoard[i][j].isMarked = true
    elCell.innerHTML = '🚩'
  }
  checkGameOver()
}
// }
function onSeconedMarked(elCell, i, j) {
  elCell.innerHTML = ''
  gBoard[i][j].isMarked = false
  gMinesToMark++
  gGame.markedCount--
  elMarkedMine.innerHTML = gMinesToMark
  return
}

function gameLives(elCell) {
  gLifes--
  var elSpan = elCell.querySelector('span')
  elSpan.classList.remove('hidden')
  renderLife()
  console.log('gLifes', gLifes)
  if (gLifes === 0) {
    checkGameOver()
  }
}
function getSafe() {
  if (gSafeClicks > 0 && !gGame.isFirstClicked) {
    gSafeClicks--
    var hintCell = getEmptyCell()
    if (!hintCell) return
    var elHintCell = document.querySelector(`.cell-${hintCell.i}-${hintCell.j}`)
    elHintCell.classList.add('get-safe')
    setTimeout(() => {
      elHintCell.classList.remove('get-safe')
    }, 1500)
  }
}

function expandShown(board, elCell, cellI, cellJ) {
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= board.length) continue
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= board[i].length) continue

      if (i === cellI && j === cellJ) continue

      var neighborCell = board[i][j]
      var elNeighbor = document.querySelector(`.cell-${i}-${j}`)

      if (!neighborCell.isShown && !neighborCell.isMine) {
        neighborCell.isShown = true
        neighborCell.minesAroundCount = setMinesNegsCount(
          elNeighbor,
          i,
          j,
          board
        )
        gGame.shownCount++
        console.log('gGame.shownCount', gGame.shownCount)
        elNeighbor.innerHTML = neighborCell.minesAroundCount
        elNeighbor.classList.add('show')
        if (neighborCell.minesAroundCount === 0)
          expandShown(board, elNeighbor, i, j)
      }
    }
  }
}
function renderLife() {
  const elLife = document.querySelector('.life-count')
  let life = ''

  for (let i = 0; i < gLifes; i++) {
    life += '🩷'
  }
  elLife.innerText = life
}
function renderHints() {
  const elHints = document.querySelector('.hint-count')
  let hint = ''

  for (let i = 0; i < gSafeClicks; i++) {
    hint += '💡'
  }
  elHints.innerText = hint
}
function checkGameOver() {
  console.log('hi')
  if (
    gGame.markedCount === gLevel.Mines &&
    gGame.shownCount === gLevel.Size * gLevel.Size - gLevel.Mines
  ) {
    gGame.isOn = false
    console.log('you win!')

    updateButton('😎')
    stopTimer()
    return
  }
  if (gLifes === 0) {
    gGame.isOn = false
    console.log('you lose!')

    updateButton('🤯')
    stopTimer()
    return
  }
}
function updateButton(emoji) {
  elButton.innerHTML = `${emoji}`
}
function restartGame(emoji) {
  elButton.innerHTML = '😁'
  onInit()
  return
}

function setLevel(size, mines) {
  gLevel.Size = size
  gLevel.Mines = mines
  gGame.isFirstClicked = true
  resetTimer()
  onInit()
}
