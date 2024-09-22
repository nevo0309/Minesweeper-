'use strict'

// function createBoard(size) {
//   var board = []
//   for (var i = 0; i < size; i++) {
//     board.push([])
//     for (var j = 0; j < size; j++) {
//       board[i][j] = ''
//     }
//   }
//   return board
// }

// function renderBoard(board) {
//   // From Pacman
//   var strHTML = ''
//   // console.table(board);
//   for (var i = 0; i < board.length; i++) {
//     strHTML += '<tr>'
//     for (var j = 0; j < board[0].length; j++) {
//       var cell = board[i][j]
//       var className = cell ? 'occupied' : ''
//       strHTML += `
//             <td data-i="${i}" data-j="${j}" onclick="cellClicked(this, ${i}, ${j})" class="${className}" >
//                 ${cell}
//             </td>
//             `
//     }
//     strHTML += '</tr>'
//   }
//   var elBoard = document.querySelector('.board')
//   elBoard.innerHTML = strHTML
// }

// function renderCell(location, value) {
//   // Select the elCell and set the value
//   var elCell = document.querySelector(`.cell${location.i}-${location.j}`)
//   elCell.innerHTML = value
// }

// function createMat(ROWS, COLS) {
//   var mat = []
//   for (var i = 0; i < ROWS; i++) {
//     var row = []
//     for (var j = 0; j < COLS; j++) {
//       row.push('')
//     }
//     mat.push(row)
//   }
//   return mat
// }

// function copyMat(mat) {
//   var newMat = []
//   for (vari = 0; i < mat.length; i++) {
//     newMat[i] = []
//     for (var j = 0; j < mat.length; j++) {
//       newMat[i][j] = mat[i][j]
//     }
//   }
//   return newMat
// }

function setMinesNegsCount(elCell, cellI, cellJ, mat) {
  var negsCount = 0

  // Count neighboring mines
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= mat.length) continue
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= mat[i].length) continue

      if (i === cellI && j === cellJ) continue

      if (mat[i][j].isMine) negsCount++
    }
  }
  return negsCount
  console.log('elCell', elCell)
}
function renderCell(location, value) {
  var elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
  elCell.innerHTML = value
}
function getClassName(location) {
  const cellClass = `cell-${location.i}-${location.j}`
  return cellClass
}
// function updateScore(diff) {
//   gGame.score += diff
//   document.querySelector('h2 span').innerText = gGame.score
// }

// function getEmptyCell() {
//   var emptyCells = []

//   for (var i = 0; i < gBoard.length; i++) {
//     for (var j = 0; j < gBoard[0].length; j++) {
//       var currCell = gBoard[i][j]
//       if (!currCell.gameElement && currCell.type === FLOOR) {
//         var emptyCellPos = { i, j }
//         emptyCells.push(emptyCellPos)
//       }
//     }
//   }
//   var randomIdx = getRandomInt(0, emptyCells.length)
//   var emptyCell = emptyCells[randomIdx]
//   return emptyCell
// }

// function addElement(element, elementImg) {
//   var emptyCell = getEmptyCell()
//   // Model:
//   gBoard[emptyCell.i][emptyCell.j].gameElement = element
//   // DOM :
//   renderCell(emptyCell, elementImg)
//   return emptyCell
// }

// function isEmptyCell(coord) {
//   return gBoard[coord.i][coord.j] === ''
// }

function getRandomIntInc(min, max) {
  // Maximum is inclusive
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min) //The maximum is inclusive and the minimum is inclusive
}

function getRandomInt(min, max) {
  // Maximum is NOT inclusive
  return Math.floor(Math.random() * (max - min)) + min
}

// function getRandomColor() {
//   var letters = '0123456789ABCDEF'
//   var color = '#'
//   for (var i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)]
//   }
//   return color
// }

// function playSound(file) {
//   var audio = new Audio(file)
//   audio.play()
// }

// function drawNum() {
//   var idx = getRandomInt(0, gNums.length)
//   var num = gNums[idx]
//   gNums.splice(idx, 1)
//   return num
// }

function shuffle(arr) {
  var randIdx, keep
  for (var i = 0; i < arr.length - 1; i++) {
    randIdx = getRandomInt(0, arr.length)
    keep = arr[i]
    arr[i] = arr[randIdx]
    arr[randIdx] = keep
  }
  return arr
}
