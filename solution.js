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

// How many invalid customers are there and what percentage of customers are valid?
let validTransactions = filter(transactions, t => {return(t.amount > 0 && t.amount != null)});

// This line can be updated with whatever the current valid products are 
validTransactions = filter(validTransactions, t => {return(t.product === "FIG_JAM" ||t.product === "FIG_JELLY" ||t.product === "SPICY_FIG_JAM" ||t.product === "ORANGE_FIG_JELLY")});
let numValidTransactions = validTransactions.length; 
let numInvalidTransactions = transactions.length - numValidTransactions;

// Update the content of the bullet point in the HTML
document.getElementById('invalid-transactions-count').innerText = "Number of invalid transactions: " + numInvalidTransactions;

// Total transaction count and percentage of valid transactions
let totalTransactions = transactions.length;
let validTransactionPercent = ((numValidTransactions / totalTransactions) * 100).toFixed(2);  // Keep 2 decimal points for percentage
document.getElementById('total-transactions-count').innerText = "Total transactions: " + totalTransactions + ", Valid transaction percentage: " + validTransactionPercent + "%";

// How many duplicate customers? 
// let dupCustomers = pairIf(customers, customers, (customer1, customer2) => {return(customer1.emailAddress === customer2.emailAddress && customer1.id != customer2.id)});
// console.log("Number of duplicate customers: " + dupCustomers.length);

// A helper function to check if a customer is in an array of customers
function containsCustomer(customers, customer) {
  for (let i = 0; i < customers.length; i++) {
    if (customers[i].emailAddress === customer.emailAddress) {
      return true;
    }
  }

  return false;
}

// How many duplicate customers? 
let dupCustomers = [];
for (let i = 0; i < customers.length; i++) {
  if (!containsCustomer(dupCustomers, customers[i]) && 
      customers.some((customer, index) => 
        index !== i && customer.emailAddress === customers[i].emailAddress)) {
    dupCustomers.push(customers[i]);
  }
}

// Compute the total number of customers
let totalCustomerCount = customers.length;

// Compute the percentage of non-duplicate customers
let nonDupCustomerCount = totalCustomerCount - dupCustomers.length;
let nonDupCustomerPercentage = (nonDupCustomerCount / totalCustomerCount) * 100;

// Insert total customer count and non-duplicate customer percentage to the HTML
document.getElementById('total-customer-count').innerText = `Total customers: ${totalCustomerCount}, Non-duplicate customers: ${nonDupCustomerPercentage.toFixed(2)}%`;

// Insert duplicate customer count to the HTML
document.getElementById('duplicate-customer-count').innerText = `Duplicate customers: ${dupCustomers.length}`;

// How much was the last transaction for over $200?
let lastBig = findLast(transactions, t => {return(t.amount > 200)});

// Find the customer who made the last big transaction
let customerOfLastBigTransaction = findLast(customers, c => {return(c.id === lastBig.customerId)});

// Insert the transaction and customer information for the most recent large transaction into the HTML
document.getElementById('last-large-transaction').innerText = `The last total over $200 was: $${lastBig.amount} by ${customerOfLastBigTransaction.firstName} ${customerOfLastBigTransaction.lastName}`;

// Calculating the amount of small (<25), medium(25<75) and large(75+) transactions
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

// Inserting the transaction counts into the HTML
document.getElementById('small-transactions').innerText = `There are ${transactionSizes.small.length} small transactions in this set`;
document.getElementById('medium-transactions').innerText = `There are ${transactionSizes.medium.length} medium transactions in this set`;
document.getElementById('large-transactions').innerText = `There are ${transactionSizes.large.length} large transactions in this set`;

// Which customers had a transaction over $200 
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