// Making the tabs draggable

var tabs = document.querySelectorAll('.etabs-tab')

tabs.forEach((tab) => {
  tab.setAttribute('draggable', true)
  tab.addEventListener('dragstart', handleDragStart, true)
  tab.addEventListener('dragenter', handleDragEnter, true)
  tab.addEventListener('dragover', handleDragOver, true)
  tab.addEventListener('dragleave', handleDragLeave, true)
})

function handleDragStart (e) {
  this.style.opacity = '0.4'
  console.log('drag')
}

function handleDragOver (e) {
  if (e.preventDefault) {
    e.preventDefault() // Necessary. Allows us to drop.
  }

  e.dataTransfer.dropEffect = 'move'  // See the section on the DataTransfer object.

  return false
}

function handleDragEnter (e) {
  // this / e.target is the current hover target.
  this.classList.add('over')
}

function handleDragLeave (e) {
  this.classList.remove('over') // this / e.target is previous target element.
}
