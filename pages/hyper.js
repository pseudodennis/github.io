const hyperForm = document.querySelector('#hyperForm')
hyperForm.addEventListener('submit', eval)

async function eval(event) {    
    event.preventDefault()
    clearPreviousResults()
        
    let form = event.target
    const dimension = form[0].value
    const graph = generateVertices(dimension)
    appendLevel(dimension, graph)


    console.log(generateVertices(dimension))




    // const vertexA = form[1].value
    // const vertexB = form[2].value
    // const distance = calculateHamming(vertexA, vertexB)

    // showResult(dimension, vertexA, vertexB, distance)

    // var vertices = generateBitstrings(dimension)
    // var graphEdges = []
    // vertices.forEach(v => graphEdges = graphEdges.concat(findNeighbors(v)))

    // console.log(vertices)
    // console.log(graphEdges)

    //let graphOptions = buildGraphOptions()

    let graphElements = buildGraphElements(graph)
    let graphOptions = buildGraphOptions(graphElements)
    var cy = cytoscape(graphOptions)

}

function buildGraphOptions(graphElements) {

  return {

    container: document.getElementById('cy'), // container to render in
  
    elements: graphElements,
  
    style: [ // the stylesheet for the graph
      {
        selector: 'node',
        style: {
          'background-color': '#666',
          'label': 'data(id)',
          'width':1,
          'height':1,
          'font-size': 2

        }
      },
  
      {
        selector: 'edge',
        style: {
          'width': 0.25,
          'line-color': '#ccc',
          'target-arrow-color': '#ccc',
          'target-arrow-shape': 'none',
          'curve-style': 'bezier'
        }
      }


    ],
  
    layout: {
      name: 'cose',
      rows: 1
    }
  
  }



}


function buildGraphElements(graph) {

  let elements = []

  for (let v of graph.v) {
    elements.push({data: {id: `${v}`}})
  }

  for (let e of graph.e) {
    elements.push({
      data: { id: `${e[0]}-${e[1]}`, source: `${e[0]}`, target: `${e[1]}` } 
    })
  }
  return elements
}








function generateVertices(q) {

  if (q==1) {
     let v1 = ['0']
     let v2 = ['1']
     
     let e = v1.map(function(e, i) {
      return [e, v2[i]];
     });
     
     let graph = {v:v1.concat(v2), e:e}

     return graph
     
  } else {

      let prev = generateVertices(q-1)
    
      let v1 = prev.v.map(v => v+=0)
      let v2 = prev.v.map(v => v+=1)
      let v = v1.concat(v2)
      
      let e1 = prev.e.map(i => i.map(e => e+=0))
      let e2 = prev.e.map(i => i.map(e => e+=1))

      let e = v1.map(function(e, i) {
        return [e, v2[i]];
       }).concat(e1.concat(e2));

       graph = {v:v, e:e}

       return graph
  }

}


function appendLevel(m, graph) {
  //level-container
  let level = document.createElement('div')
  level.classList.add('my-5')
  level.classList.add('col')



  //header
  let header = document.createElement('div')
  header.innerHTML=`<h5>Q(${m}) Graph</h5>`
  header.classList.add('row')


  //vertex row
  let vertexRow = document.createElement('div')
  vertexRow.classList.add('row')

  let vertexRowLabel = document.createElement('div')
  vertexRowLabel.classList.add('col-2')
  vertexRowLabel.classList.add('pl-0')
  vertexRowLabel.innerHTML = '<h6>Vertices</h6>'
  vertexRow.appendChild(vertexRowLabel)

  let vertexRowList = document.createElement('div')
  vertexRowList.classList.add('col')

  let vertices = document.createElement('div')
  vertices.classList.add('row')

  for (let v of graph.v) {
    let coord = document.createElement('div')
    coord.classList.add('col-auto')
    coord.classList.add('text-monospace')
    coord.innerText=v
    vertices.appendChild(coord)
  }

  vertexRowList.appendChild(vertices)
  vertexRow.appendChild(vertexRowList)


  //edge row
  let edgeRow = document.createElement('div')
  edgeRow.classList.add('row')
  edgeRow.classList.add('my-4')


  let edgeRowLabel = document.createElement('div')
  edgeRowLabel.classList.add('col-2')
  edgeRowLabel.classList.add('pl-0')
  edgeRowLabel.innerHTML = '<h6>Edges</h6>'
  edgeRow.appendChild(edgeRowLabel)

  let edgeRowList = document.createElement('div')
  edgeRowList.classList.add('col')

  let edges = document.createElement('div')
  edges.classList.add('row')

  for (let e of graph.e) {
    let edge = document.createElement('div')
    edge.classList.add('col-auto')
    edge.classList.add('text-monospace')
    edge.innerText=e
    edges.appendChild(edge)
  }

  edgeRowList.appendChild(edges)
  edgeRow.appendChild(edgeRowList)





  level.appendChild(header)
  level.appendChild(vertexRow)
  level.appendChild(edgeRow)


  //attach everything
  document.querySelector('#results').appendChild(level)




}








function clearPreviousResults() {
    let resultsDiv = document.querySelectorAll('#results div')
    if (resultsDiv.length !== 0) {
        resultsDiv.forEach(x => x.remove())
    }
}

function generateBitstrings(n) {

    if (n == 1) {
        return ['0','1']
    } else {
        let L1 = []
        let L2 = []
        
        L1 = generateBitstrings(n-1)
        L2 = Array.from(L1).reverse()
        L1 = L1.map(e => '0'+ e)
        L2 = L2.map(e => '1' + e)
        return L1.concat(L2)
    }
}


function findHamiltonianCycle(vertexArray) {

    let edges = []
    for (let i=0; i<vertexArray.length-1; i++) {
        edges.push([vertexArray[i], vertexArray[i+1]])
    }
    edges.push([vertexArray[vertexArray.length-1], vertexArray[0]])
    return edges
}

function findNeighbors(vertex) {
    let neighbors = []
    let edges = []
    arr = [...vertex]
    for (let i=0; i<arr.length; i++) {
        if (arr[i] == '0') {
            arr[i] = '1';
            neighbors.push([...arr].join(''))
            arr[i] = '0'
        }
    }
    if (neighbors.length > 0) {
        neighbors.forEach(e => edges.push([vertex, e]))
    }
    return edges
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




// var cy = cytoscape(
  
  
//   {

//     container: document.getElementById('cy'), // container to render in
  
//     elements: [ // list of graph elements to start with
//       { // node a
//         data: { id: 'a' }
//       },
//       { // node b
//         data: { id: 'b' }
//       },
//       { // edge ab
//         data: { id: 'ab', source: 'a', target: 'b' }
//       }
//     ],
  
//     style: [ // the stylesheet for the graph
//       {
//         selector: 'node',
//         style: {
//           'background-color': '#666',
//           'label': 'data(id)'
//         }
//       },
  
//       {
//         selector: 'edge',
//         style: {
//           'width': 3,
//           'line-color': '#ccc',
//           'target-arrow-color': '#ccc',
//           'target-arrow-shape': 'triangle',
//           'curve-style': 'bezier'
//         }
//       }
//     ],
  
//     layout: {
//       name: 'grid',
//       rows: 1
//     }
  
//   }
  
  
//   );