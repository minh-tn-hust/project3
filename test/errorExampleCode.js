let syntaxError = `
const name = 'John'
const age = 30
console.log(name) console.log(age)

let num = 1
const if = 2

const obj = {
  name: 'John'
  age: 30,
}
`

let referenceError = `
console.log(myVar)

const obj = { name: 'John' }
console.log(obj.age)

function greet(name) {
  console.log("Hello, " + name);
}
greet()
`

let dividedBy0 = `
const x = 10 / 0
console.log(x)

const y = 10 / 'hello'
console.log(y)
`

let nullPointer = `
let obj = null
console.log(obj.name)

let arr = [1, 2, 3]
console.log(arr.foo())
`

let dijktraExample = `
const problem = {
  start: {A: 5, B: 2},
  A: {C: 4, D: 2},
  B: {A: 8, D: 7},
  C: {D: 6, finish: 3},
  D: {finish: 1},
  finish: {}
};

const lowestCostNode = (costs, processed) => {
  return Object.keys(costs).reduce((lowest, node) => {
    if (lowest === null || costs[node] < costs[lowest]) {
      if (!processed.includes(node)) {
        lowest = node;
      }
    }
    return lowest;
  }, null);
};

// function that returns the minimum cost and path to reach Finish
const dijkstra = (graph) => {

  // track lowest cost to reach each node
  const costs = Object.assign({finish: Infinity}, graph.start);

  // track paths
  const parents = {finish: null};
  for (let child in graph.start) {
    parents[child] = 'start';
  }

  // track nodes that have already been processed
  const processed = [];

  let node = lowestCostNode(costs, processed);

  while (node) {
    let cost = costs[node];
    let children = graph[node];
    for (let n in children) {
      let newCost = cost + children[n];
      if (!costs[n]) {
        costs[n] = newCost;
        parents[n] = node;
      }
      if (costs[n] > newCost) {
        costs[n] = newCost;
        parents[n] = node;
      }
    }
    processed.push(node);
    node = lowestCostNode(costs, processed);
  }

  let optimalPath = ['finish'];
  let parent = parents.finish;
  while (parent) {
    optimalPath.push(parent);
    parent = parents[parent];
  }
  optimalPath.reverse();

  const results = {
    distance: costs.finish,
    path: optimalPath
  };

  return results;
};

console.log(dijkstra(problem)); `

let tleExample = `
let count = 0;
while(1) {
  count++;
}
`

module.exports = {
  syntaxError,
  dijktraExample,
  nullPointer,
  dividedBy0,
  tleExample
}
