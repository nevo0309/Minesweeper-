'use strict'
var gBoard
var gMinesToMark
var gLifes
var gHints
var gSafeClicks
var gManualMines
var isDark = false
var gMegaHintCount
var gFirstCorner
var gSeconedCorner
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
    isManualMine: false,
    isMegaHint: false,
  }

  gMegaHintCount = 1
  gBoard = createBoard(gLevel.Size)
  renderBoard(gBoard)
  gLifes = 3
  renderLife()
  gSafeClicks = 3
  gHints = 3
  renderHints()
  gMinesToMark = gLevel.Mines
  elMarkedMine.innerHTML = gMinesToMark
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
  document.querySelector('.board').innerHTML = ''
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

if (gManualMines.length === gLevel.Mines) {
  gGame.isManualMine = false
  console.log('Manual mine placement complete')
  elMineCounter.innerText = '0'
  elButton.innerText = '😁'
  hideAllMines()
}
function onCellClicked(elCell, i, j) {
  const elMineCounter = document.querySelector('.manual-mine-counter')

  if (gGame.isFirstClicked && !gGame.isManualMine) {
    gGame.isFirstClicked = false
    randomMines(gLevel.Mines, { i, j })
    renderBoard(gBoard)
    setMinesNegsCountForBoard()
    elCell = document.querySelector(`.cell-${i}-${j}`)
    gGame.isOn = true
    startTimer()
  } else if (gGame.isManualMine) {
    // Manually place a mine
    if (!gBoard[i][j].isMine && gManualMines.length < gLevel.Mines) {
      gBoard[i][j].isMine = true
      gManualMines.push({ i, j })
      elCell.innerHTML = MINES
      console.log('Mine placed manually:', { i, j })

      const minesLeft = gLevel.Mines - gManualMines.length
      elMineCounter.innerText = minesLeft

      if (gManualMines.length === gLevel.Mines) {
        gGame.isManualMine = false
        console.log('Manual mine placement complete')
        elMineCounter.innerText = '0'
        elButton.innerText = '😁'
        hideAllMines()
      }
    }
  }
  if (gGame.isMegaHint) {
    if (!gFirstCorner) {
      gFirstCorner = { i, j }
    } else if (!gSeconedCorner) {
      gSeconedCorner = { i, j }
      revealMegaHintArea()
    }
    return
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
  gBoard[i][j].minesAroundCount = setMinesNegsCount(elCell, i, j, gBoard)
  elCell.innerHTML = gBoard[i][j].minesAroundCount
  elCell.classList.add('show')
  expandShown(gBoard, elCell, i, j)
  checkGameOver()
}

function onCellMarked(elCell, i, j) {
  if (gGame.isFirstClicked) return
  if (gBoard.isShown) return

  if (gBoard[i][j].isMarked) {
    onSeconedMarked(elCell, i, j)
  } else {
    if (gMinesToMark === 0) return
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
    for (var j = cellJ - 1; j <= board[i].length; j++) {
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

        elNeighbor.innerHTML = neighborCell.minesAroundCount
        elNeighbor.classList.add('show')

        if (neighborCell.minesAroundCount === 0) {
          expandShown(board, elNeighbor, i, j)
        }
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
    showAllMines()

    updateButton('🤯')
    stopTimer()
    return
  }
}
function toggleManualMine() {
  if (gGame.isOn) return
  gGame.isManualMine = !gGame.isManualMine
  gManualMines = []

  const elMineCounterContainer = document.querySelector(
    '.manual-mine-counter-container'
  )
  const elMineCounter = document.querySelector('.manual-mine-counter')

  if (gGame.isManualMine) {
    updateButton('🛠️')
    elMineCounterContainer.style.display = 'block'
    elMineCounter.innerText = gLevel.Mines
  } else {
    updateButton('😁')
    elMineCounterContainer.style.display = 'none'
  }
  console.log('Manual Mine Placement Mode:', gGame.isManualMine)
}
function updateButton(emoji) {
  elButton.innerHTML = `${emoji}`
}
function showAllMines() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j].isMine) {
        var elCell = document.querySelector(`.cell-${i}-${j}`)
        var elSpan = elCell.querySelector('span')
        elSpan.classList.remove('hidden')
      }
    }
  }
}

function hideAllMines() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j].isMine) {
        var elCell = document.querySelector(`.cell-${i}-${j}`)
        var elSpan = elCell.querySelector('span')
        elSpan.classList.add('hidden')
      }
    }
  }
}

function activeMegaHint() {
  if (gGame.isFirstClicked) return
  if (gMegaHintCount <= 0 || gGame.isMegaHint) return // Prevent multiple activations or no mega hints left
  gGame.isMegaHint = true
  gFirstCorner = null
  gSeconedCorner = null
}
function revealMegaHintArea() {
  if (!gFirstCorner || !gSeconedCorner) return
  for (var i = gFirstCorner.i; i <= gSeconedCorner.i; i++) {
    for (var j = gFirstCorner.j; j <= gSeconedCorner.j; j++) {
      var elCell = document.querySelector(`.cell-${i}-${j}`)
      var elSpan = elCell.querySelector('span')
      elSpan.classList.remove('hidden')
      elCell.classList.add('mega-hint')
    }
  }

  setTimeout(() => {
    // Hide the area again after 2 seconds
    for (var i = gFirstCorner.i; i <= gSeconedCorner.i; i++) {
      for (var j = gFirstCorner.j; j <= gSeconedCorner.j; j++) {
        var elCell = document.querySelector(`.cell-${i}-${j}`)
        var elSpan = elCell.querySelector('span')
        elSpan.classList.add('hidden')
        elCell.classList.remove('mega-hint')
      }
    }
    gGame.isMegaHint = false
    gMegaHintCount--
    console.log('Mega Hint used. Area hidden again.')
  }, 2000)
}
function mineExterminator() {
  var countToEliminate = 1
  if (gMinesToMark === 0) return

  gMinesToMark -= countToEliminate
  elMarkedMine.innerHTML = gMinesToMark
  let minesToEliminate = []

  // Gather all mine positions
  for (let i = 0; i < gBoard.length; i++) {
    for (let j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j].isMine) {
        minesToEliminate.push({ i, j })
      }
    }
  }

  minesToEliminate = shuffle(minesToEliminate)

  minesToEliminate = minesToEliminate.slice(0, countToEliminate)

  for (let idx = 0; idx < minesToEliminate.length; idx++) {
    let minePos = minesToEliminate[idx]
    gBoard[minePos.i][minePos.j].isMine = false
    renderCell({ i: minePos.i, j: minePos.j }, '')
  }

  setMinesNegsCountForBoard()
  updateShownCells()
  gLevel.Mines -= countToEliminate
  console.log(`${countToEliminate} mines eliminated`)
}
//CHECK ALL CELLS NEGS
function setMinesNegsCountForBoard() {
  for (let i = 0; i < gBoard.length; i++) {
    for (let j = 0; j < gBoard[0].length; j++) {
      gBoard[i][j].minesAroundCount = setMinesNegsCount(null, i, j, gBoard)
    }
  }
}

function updateShownCells() {
  for (let i = 0; i < gBoard.length; i++) {
    for (let j = 0; j < gBoard[0].length; j++) {
      const cell = gBoard[i][j]

      if (cell.isShown) {
        const elCell = document.querySelector(`.cell-${i}-${j}`)
        cell.minesAroundCount = setMinesNegsCount(elCell, i, j, gBoard)
        elCell.innerHTML = cell.minesAroundCount
      }
    }
  }
}

function darkMode() {
  var elBody = document.querySelector('body')
  var elTopBar = document.querySelector('.top-bar')
  var elBottomBar = document.querySelector('.bottom-bar')
  var elDarkButton = document.querySelector('.dark button')
  if (!isDark) {
    elBody.classList.add('dark-mode')
    elTopBar.classList.add('dark-mode')
    elBottomBar.classList.add('dark-mode')
    elDarkButton.innerHTML = 'White Mode'
    isDark = true
  } else {
    elBody.classList.remove('dark-mode')
    elTopBar.classList.remove('dark-mode')
    elBottomBar.classList.remove('dark-mode')
    elDarkButton.innerHTML = 'Dark Mode'
    isDark = false
  }
}
function setLevel(size, mines) {
  if (gGame.isOn) {
    stopTimer()
    gGame.isOn = false
  }
  gLevel.Size = size
  gLevel.Mines = mines
  gGame.isFirstClicked = true
  resetTimer()
  onInit()
}

function restartGame(emoji) {
  elButton.innerHTML = '😁'
  gGame.isManualMine = false
  gManualMines = []
  const elMineCounterContainer = document.querySelector(
    '.manual-mine-counter-container'
  )
  elMineCounterContainer.style.display = 'none'
  gLevel = { Size: 4, Mines: 2 }
  resetTimer()
  onInit()

  return
}
