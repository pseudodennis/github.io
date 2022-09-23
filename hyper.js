const hyperForm = document.querySelector('#hyperForm')
hyperForm.addEventListener('submit', eval)

async function eval(event) {    
    event.preventDefault()
    clearPreviousResults()
        
    let form = event.target
    const dimension = form[0].value
    const vertexA = form[1].value
    const vertexB = form[2].value
    const distance = calculateHamming(vertexA, vertexB)

    showResult(dimension, vertexA, vertexB, distance)

}

function clearPreviousResults() {
    let resultsDiv = document.querySelectorAll('#results div')
    if (resultsDiv.length !== 0) {
        resultsDiv.forEach(x => x.remove())
    }
}

function calculateHamming(a, b) {    
    return[...a]
    .map( (e,i) => [e, [...b][i]])
    .reduce( (p,c) => p + (c[0] == c[1] ? 0 : 1), 0)
}


function showResult(dimension, vertexA, vertexB, distance) {
    let result = document.createElement('div')
    result.classList.add('my-5')
    result.innerText = `In a ${dimension}-dimensional hypercube, the distance between ${vertexA} and ${vertexB} is ${distance}`            
    document.querySelector('#results').appendChild(result)
}