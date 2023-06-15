let uniqueCustomers = [];

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

// Define the currency format
const currencyFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

// How many invalid transactions are there and what percentage of customers are valid?
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

// Duplicate customers 

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
let lastBig = findLast(validTransactions, t => t.amount > 200);
let formattedLastBigAmount = currencyFormat.format(lastBig.amount);

// Find the customer who made the last big transaction
let customerOfLastBigTransaction = findLast(customers, c => c.id === lastBig.customerId && !containsCustomer(dupCustomers, c));

// Insert the transaction and customer information for the most recent large transaction into the HTML
document.getElementById('last-large-transaction').innerText = `The last total over $200 was: ${formattedLastBigAmount} by ${customerOfLastBigTransaction.firstName} ${customerOfLastBigTransaction.lastName}`;

// Calculating the amount of small (<$25), medium($25 < $75) and large($75+) transactions and total transactions
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

let smallPercentage = (transactionSizes.small.length / totalTransactions * 100).toFixed(2);
let mediumPercentage = (transactionSizes.medium.length / totalTransactions * 100).toFixed(2);
let largePercentage = (transactionSizes.large.length / totalTransactions * 100).toFixed(2);

// Inserting the transaction counts and percentages into the HTML
document.getElementById('small-transactions').innerText = `Small Transactions: ${transactionSizes.small.length}`;
document.getElementById('small-breakdown').innerText = `Percentage of Total Transactions: ${smallPercentage}%`;

document.getElementById('medium-transactions').innerText = `Medium Transactions: ${transactionSizes.medium.length}`;
document.getElementById('medium-breakdown').innerText = `Percentage of Total Transactions: ${mediumPercentage}%`;

document.getElementById('large-transactions').innerText = `Large Transactions: ${transactionSizes.large.length}`;
document.getElementById('large-breakdown').innerText = `Percentage of Total Transactions: ${largePercentage}%`;

// Calculate the total revenue for each category
let smallTotal = reduce(transactionSizes.small, (value, accumulated) => accumulated + value.amount, 0);
let mediumTotal = reduce(transactionSizes.medium, (value, accumulated) => accumulated + value.amount, 0);
let largeTotal = reduce(transactionSizes.large, (value, accumulated) => accumulated + value.amount, 0);

// Formatting the totals
let formattedSmallTotal = currencyFormat.format(smallTotal);
let formattedMediumTotal = currencyFormat.format(mediumTotal);
let formattedLargeTotal = currencyFormat.format(largeTotal);

// Calculate the total revenue
let totalRevenue = smallTotal + mediumTotal + largeTotal;

// Calculate the percentage of total revenue for each category
let smallPercentageRevenue = ((smallTotal / totalRevenue) * 100).toFixed(2);
let mediumPercentageRevenue = ((mediumTotal / totalRevenue) * 100).toFixed(2);
let largePercentageRevenue = ((largeTotal / totalRevenue) * 100).toFixed(2);

// Insert the transaction revenues and their percentages of total revenue into the HTML
document.getElementById('small-revenue').innerText = `Small Transactions Total Revenue: ${formattedSmallTotal}, Percentage of Total Revenue: ${smallPercentageRevenue}%`;
document.getElementById('medium-revenue').innerText = `Medium Transactions Total Revenue: ${formattedMediumTotal}, Percentage of Total Revenue: ${mediumPercentageRevenue}%`;
document.getElementById('large-revenue').innerText = `Large Transactions Total Revenue: ${formattedLargeTotal}, Percentage of Total Revenue: ${largePercentageRevenue}%`;

// Which customers had a transaction over $200 
    // Output it as a list of customer objects, then as a list of first last name strings
    let bigTransactions = filter(validTransactions, t => t.amount > 200);
    let highRollers = pairIf(bigTransactions, customers, (transaction, customer) => transaction.customerId === customer.id && !containsCustomer(dupCustomers, customer));
    uniqueCustomers = reduce(highRollers, (value, accumulatedResult) => {
        if (!accumulatedResult.includes(value[1])){
            accumulatedResult.push(value[1]);
        } return accumulatedResult;}, []);
    console.log("Customers with transactions over $200: ");
    console.log(uniqueCustomers);
    let customerNames = map(uniqueCustomers, c => c.firstName + " " + c.lastName);
    console.log("Names of customers with transactions over $200: ");
    console.log(customerNames);

  // Updating the page based on user input
// Access transaction amount input
let transactionAmountInput = document.getElementById("transaction-amount-input");

// Add an event listener to update transaction amount
document.getElementById("update-transaction").addEventListener('click', function() {
    let newTransactionAmount = parseFloat(transactionAmountInput.value);

    // Input verification and error prompt
    if (isNaN(newTransactionAmount)) {
        alert("Invalid transaction amount");
        return;
    }

    // Update the question with the new transaction amount
    document.getElementById('transaction-question').innerText = `How much was the last transaction for over $${newTransactionAmount}?`;

    // How much was the last transaction for over $newTransactionAmount? We only look at valid transactions now
    let lastBig = findLast(validTransactions, t => {return(t.amount > newTransactionAmount)});
    let formattedLastBigAmount = currencyFormat.format(lastBig.amount);

    // Find the customer who made the last big transaction, but exclude duplicate customers
    let customerOfLastBigTransaction = findLast(customers, c => {return(c.id === lastBig.customerId) && !containsCustomer(dupCustomers, c)});

    // Insert the transaction and customer information for the most recent large transaction into the HTML
    document.getElementById('last-large-transaction').innerText = `The last total over $${newTransactionAmount} was: ${formattedLastBigAmount} by ${customerOfLastBigTransaction.firstName} ${customerOfLastBigTransaction.lastName}`;

    // Which customers had a transaction over $newTransactionAmount? We only look at valid transactions now and exclude duplicate customers
    let transactionsOverNewAmount = filter(validTransactions, t => {return(t.amount > newTransactionAmount)});
    let highRollers = pairIf(transactionsOverNewAmount, customers, (transaction, customer) => {return(transaction.customerId === customer.id && !containsCustomer(dupCustomers, customer))});
    let uniqueCustomers = reduce(highRollers, (value, accumulatedResult) => {
        if (!accumulatedResult.includes(value[1])){
            accumulatedResult.push(value[1]);
        } return accumulatedResult;}, []);
    console.log(`Customers with transactions over $${newTransactionAmount}: `);
    console.log(uniqueCustomers);
    let customerNames = map(uniqueCustomers, c => {return (c.firstName + " " + c.lastName)});
    console.log(`Names of customers with transactions over $${newTransactionAmount}: `);
    console.log(customerNames);
});

// Function to convert an array of objects to a CSV string
function convertToCSV(data) {
  const headers = Object.keys(data[0]).join(",") + "\n";
  const rows = data.map(obj => Object.values(obj).join(",")).join("\n");
  return headers + rows;
}

// Function to download a CSV file
function downloadCSV(csv, filename) {
  const csvBlob = new Blob([csv], { type: "text/csv" });
  const csvURL = URL.createObjectURL(csvBlob);
  const link = document.createElement("a");
  link.href = csvURL;
  link.download = filename;
  link.click();
}

// Add event listeners to the buttons
document.getElementById("save-customer-names").addEventListener("click", function () {
  const csv = convertToCSV(map(uniqueCustomers, c => ({ firstName: c.firstName, lastName: c.lastName })));
  downloadCSV(csv, "customer_names.csv");
});

document.getElementById("save-detailed-customer-list").addEventListener("click", function () {
  const csv = convertToCSV(uniqueCustomers);
  downloadCSV(csv, "detailed_customer_list.csv");
});


// Access transaction amount input
let customerTransactionAmountInput = document.getElementById("customer-transaction-amount-input");

// Add an event listener to update transaction amount
document.getElementById("update-customer-transaction").addEventListener('click', function() {
    let newCustomerTransactionAmount = parseFloat(customerTransactionAmountInput.value);

    // Input verification and error prompt
    if (isNaN(newCustomerTransactionAmount)) {
        alert("Invalid transaction amount");
        return;
    }

    // Update the question with the new transaction amount
    document.getElementById('customer-transaction-question').innerText = `Which customers had a transaction over $${newCustomerTransactionAmount}?`;

    // Which customers had a transaction over $newCustomerTransactionAmount?
    // We only look at valid transactions now and exclude duplicate customers
    let transactionsOverNewAmount = filter(validTransactions, t => {return(t.amount > newCustomerTransactionAmount)});
    let highRollers = pairIf(transactionsOverNewAmount, customers, (transaction, customer) => {return(transaction.customerId === customer.id && !containsCustomer(dupCustomers, customer))});
    uniqueCustomers = reduce(highRollers, (value, accumulatedResult) => {
        if (!accumulatedResult.includes(value[1])){
            accumulatedResult.push(value[1]);
        } return accumulatedResult;}, []);
    console.log(`Customers with transactions over $${newCustomerTransactionAmount}: `);
    console.log(uniqueCustomers);
    let customerNames = map(uniqueCustomers, c => {return (c.firstName + " " + c.lastName)});
    console.log(`Names of customers with transactions over $${newCustomerTransactionAmount}: `);
    console.log(customerNames);

    // Add event listeners to the buttons
    document.getElementById("save-customer-names").addEventListener("click", function () {
      const csv = convertToCSV(map(uniqueCustomers, c => ({ firstName: c.firstName, lastName: c.lastName })));
      downloadCSV(csv, "customer_names.csv");
    });

    document.getElementById("save-detailed-customer-list").addEventListener("click", function () {
      const csv = convertToCSV(uniqueCustomers);
      downloadCSV(csv, "detailed_customer_list.csv");
    });
});

// Generating the invalid transaction report
document.getElementById("save-invalid-transaction-report").addEventListener("click", function () {
  let invalidTransactions = filter(transactions, t => {
      return t.amount <= 0 || t.amount == null || !(t.product === "FIG_JAM" || t.product === "FIG_JELLY" || t.product === "SPICY_FIG_JAM" || t.product === "ORANGE_FIG_JELLY")
  });
  
  // Printing the invalid transaction to the console for checking them without having to download the file
  console.log("Invalid transactions: ");
  console.log(invalidTransactions);

  // Downloadable report option
  const csv = convertToCSV(invalidTransactions);
  downloadCSV(csv, "invalid_transactions.csv");
});

// Generating the duplicate customer report
document.getElementById("save-duplicate-customer-report").addEventListener("click", function () {
  console.log("Duplicate customers: ");
  console.log(dupCustomers);

  const csv = convertToCSV(dupCustomers);
  downloadCSV(csv, "duplicate_customers.csv");
});

// Generating the report for the last big transaction
document.getElementById("save-last-large-purchase-report").addEventListener("click", function () {

  // Checking for bad transactions
  if (!lastBig || !lastBig.product) {
      console.error("Data for the last large purchase is not available or incomplete.");
      return;
  }

  const lastBigTransactionData = [
      {
          'Transaction Amount': formattedLastBigAmount,
          'Customer First Name': customerOfLastBigTransaction.firstName,
          'Customer Last Name': customerOfLastBigTransaction.lastName,
          'Product': lastBig.product
      }
  ];
  
  const csv = convertToCSV(lastBigTransactionData);
  downloadCSV(csv, "last_big_transaction.csv");

  // Print to the console
  console.log("The last large transaction was: ")
  console.log(JSON.stringify(lastBigTransactionData));
});

