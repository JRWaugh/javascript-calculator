const container = document.querySelector('.container')
const display = document.querySelector(".display")
const input = document.querySelector(".input")
const buttons =
    ["C", "CE", "DEL", "/",
        "7", "8", "9", "*",
        "4", "5", "6", "-",
        "1", "2", "3", "+",
        " ", "0", ".", "="]
const operators = {
    '+': (a, b) => parseFloat(a) + parseFloat(b),
    '-': (a, b) => parseFloat(a) - parseFloat(b),
    '*': (a, b) => parseFloat(a) * parseFloat(b),
    '/': (a, b) => parseFloat(a) / parseFloat(b)
}
const keys = Object.keys(operators)
let operation = []

//Loop to create all the necessary divs
for (i = 0; i < buttons.length; i++) {
    let key = document.createElement('div')
    key.className = "key"
    key.id = buttons[i]
    key.textContent = buttons[i]
    key.addEventListener('click', updateDisplay)
    container.appendChild(key)
}

function updateDisplay() {
    if (this.id == "DEL") {
        //Delete the final character in the input.textContent variable
        input.textContent = input.textContent.substring(0, input.textContent.length - 1)
    } else if (this.id == "C") {
        //Reset everything
        reset()
    } else if (this.id == "CE") {
        //Remove the last thing in the operation array if it's an operator
        operation.splice(-1, 1)
        //Set the display to the current version of the array
        display.textContent = operation.join('')
        input.textContent = ""
    } else {
        //If the button pressed was a number or operator, it is added to the display here.
        //If the button pressed is in the operator Keys array:
        if (keys.includes(this.id) || this.id == '=') {
            /*Add the current number to the operation array and reset the input.textContent variable
            if the input is not an empty string from the CE operation*/
            if (input.textContent != "") {
                operation.push(input.textContent)
            }
            input.textContent = ""
            if (this.id == "=") {
                evaluate()
            } else if (keys.includes(operation[operation.length - 1])) {
                //If the last thing in the operation is an operator, change the operator instead of adding another
                operation[operation.length - 1] = this.id
                display.textContent = operation.join('')
            } else {
                operation.push(this.id)
                display.textContent = operation.join('')
            }
        } else if (this.id != "." || input.textContent.includes(".") == false) {
            input.textContent += this.id
            if(operation.length == 1){
                operation = []
                display.textContent = operation.join('')
            }
        }
    }
}

function evaluate() {
    if(keys.includes(operation[operation.length - 1])){
        operation.pop()
    }

    //While loops to go through the order of operations. Each loop compresses two numbers and an operator to one result
    let multiIndices = operation.filter(e => ['*', '/'].indexOf(e) !== -1)
    let addIndices = operation.filter(e => ['+', '-'].indexOf(e) !== -1)

    while (multiIndices.length > 0) {
        index = operation.indexOf(multiIndices[0])
        if (multiIndices[0] == '/' && operation[index + 1] == '0') {
            reset()
        } else {
            operation[index - 1] = operators[multiIndices[0]](operation[index - 1], operation[index + 1])
        }
        operation.splice(index, 2)
        multiIndices.splice(0, 1)
    }
    while (addIndices.length > 0) {
        index = operation.indexOf(addIndices[0])
        operation[index - 1] = operators[addIndices[0]](operation[index - 1], operation[index + 1])
        operation.splice(index, 2)
        addIndices.splice(0, 1)
    }
    //Turn the result back into a string so nothing breaks
    operation[0] = "" + operation[0]
    display.textContent = operation[0]
}

function reset() {
    display.textContent = ""
    input.textContent = ""
    operation = []
}