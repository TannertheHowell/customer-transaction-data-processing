// Functions to implement in a generic way

/*
  filter: returns a subset of the input data that contains only the items for which the predicate returns true
  @data: an array of any arbitrary data
  @predicate: a function that takes a single datapoint as an argument. Returns either true or false.
  @return: a new array that contains all of the values in data
           for which the predicate function returns true
*/
function filter(data, predicate){

    let filterResult = [];

    for (let i = 0; i < data.length; i++){
        if (predicate (data[i])){
            filterResult.push(data[i]);
        } 
    }

    return filterResult;
}

/*
  findLast: finds the last value in an array that meets the condition specified in the predicate
  @data: an array of any arbitrary data
  @predicate: a function that takes a single datapoint as an argument. Returns either true or false.
  @return: a single data point from data
*/
function findLast(data, predicate) {
    for (let i = data.length - 1; i >= 0; i--){
        if (predicate(data[i])){
            return data[i];
        }
    }
}

/*
  map: creates a new array based on the input array where the value at each position in the array is the result of the callback function.
  @data: an array of any arbitrary data
  @callback: a function that takes a single datapoint as an argument. Returns a new value based on the input value
  @return: a mapped array
*/
function map(data, callback) {
    let mapResults = [];
    for (let i = 0; i < data.length; i++){
        mapResults.push(callback(data[i]));
    }
    return mapResults;
}

/*
  pairIf: creates a new array based on the input arrays where the value at each position is an 
          array that contains the 2 values that pair according to the predicate function.
  @data1: an array of any arbitrary data
  @data2: an array of any arbitrary data
  @callback: a function that takes a single datapoint from each input array as an argument. Returns true or false
  @return: an array
*/
function pairIf(data1, data2, callback) {
    let pairIfResults = [];
    for (let i = 0; i < data1.length; i++){
        for (let j = 0; j < data2.length; j++){
            if (callback(data1[i],data2[j])){
                pairIfResults.push([data1[i],data2[j]]);
            }
        }
    }
    return pairIfResults;
}

/*
  reduce: creates an accumulated result based on the reducer function. The value returned is returned
          is the return value of the reducer function for the final iteration.
  @data: an array of any arbitrary data
  @reducer: a function that takes a single datapoint from each input array as an
            argument and the result of the reducer function from the previous iteration.
            Returns the result to be passed to the next iteration
  @initialValue: the starting point for the reduction.
  @return: the value from the final call to the reducer function.
*/
function reduce(data, reducer, initialValue) {
    let accumulatedResult = initialValue;
    
    for (let i = 0; i < data.length; i++){
        accumulatedResult = reducer(data[i], accumulatedResult);
    }
    return accumulatedResult;
}

// Task 1: How many invalid customers are there? - using filter
let validTransactions = filter(transactions, t => {return(t.amount > 0 && t.amount != null)});
validTransactions = filter(validTransactions, t => {return(t.product === "FIG_JAM" ||t.product === "FIG_JELLY" ||t.product === "SPICY_FIG_JAM" ||t.product === "ORANGE_FIG_JELLY")});
let numValid = validTransactions.length; 
let numInvalid = transactions.length - numValid;
console.log("Number of invalid transactions: " + numInvalid);

// Task 2: How many duplicate customers? - using pairIf
let dupCustomers = pairIf(customers, customers, (customer1, customer2) => {return(customer1.emailAddress === customer2.emailAddress && customer1.id != customer2.id)});
console.log("Number of duplicate customers: " + dupCustomers.length);

// Task 3: How much was the last purchase for over $200?  - using findLast
let lastBig = findLast(transactions, t => {return(t.amount > 200)});
console.log("Most recent transaction over $200: $" + lastBig.amount);

// Task 4: How many small (<25), medium(25<75) and large(75+) transactions are there? - using reduce once

let transactionSizes = reduce(transactions, (value, accumulated) => {
  if (value.amount < 25) {
    accumulated.small.push(value);
  } else if (value.amount < 75) {
    accumulated.medium.push(value);
  } else {
    accumulated.large.push(value);
  }
  return accumulated;
}, {small: [], medium: [], large: []});

console.log("Number of small transactions: " + transactionSizes.small.length);
console.log("Number of medium transactions: " + transactionSizes.medium.length);
console.log("Number of large transactions: " + transactionSizes.large.length);

// Task 5: Which customers had a transaction over $200 -using filter, pairIf, reduce, map 
    // Output it as a list of customer objects, then as a list of first last name strings
let transactionsOver200 = filter(transactions, t => {return(t.amount > 200)});
let highRollers = pairIf(transactionsOver200, customers, (transaction, customer) => {return(transaction.customerId === customer.id)});
let uniqueCustomers = reduce(highRollers, (value, accumulatedResult) => {
    if (!accumulatedResult.includes(value[1])){
        accumulatedResult.push(value[1]);
    } return accumulatedResult;}, []);
console.log("Customers with transactions over $200: ");
console.log(uniqueCustomers);
let customerNames = map(uniqueCustomers, c => {return (c.firstName + " " + c.lastName)});
console.log("Names of customers with transactions over $200: ");
console.log(customerNames);