# Dataset.js 

Brief overview: `dataset.js` is an integral part of our application, housing key data in two distinct arrays: `transactions` and `customers`. This structured data arrangement enables thorough analysis and operational use cases involving customer transactions.

In the development of this application, I have implemented a local file dataset.js that mimics the data structure of a typical API response. This JSON object, containing comprehensive data on customers and transactions, serves as an efficient means to develop, test and debug our code. By not relying on external API calls during the initial stages of development, we avoid potential network latency, rate limiting, and other uncertainties that can arise from such dependencies. Furthermore, utilizing this local dataset helps us ensure a consistent data structure, which is crucial for reliable testing. As the application grows and when ready to integrate with a real-world API, this local dataset can be smoothly transitioned, due to its structured setup that closely emulates real-world data models.

## Transactions

The `transactions` array contains individual objects, each representing a unique transaction. Each transaction object includes the following properties:

- `id` (Number): A unique identifier for the transaction.
- `amount` (Number): The dollar value of the transaction. Transactions are deemed invalid if the `amount` is $0 or not present (either null or undefined).
- `product` (String): A descriptor of the product involved in the transaction. Only four values are considered valid: "FIG_JAM", "FIG_JELLY", "SPICY_FIG_JAM", and "ORANGE_FIG_JELLY". Any other product will render the transaction invalid.
- `customerId` (Number): An identifier connecting the transaction to a specific customer.

Transactions are further categorized based on their `amount`:
- Small: Less than $25 
- Medium: $25 to $75 
- Large: More than $75

Here's an example of a transaction object:

```json
{
  "id": 12345,
  "amount": 111.11,
  "product": "FIG_JAM",
  "customerId": 67890
}
```

## Customers

The `customers` array consists of objects, each of which represents a unique customer. Each customer object contains the following properties:

- `id` (Number): A unique identifier for each customer.
- `firstName` (String): The customer's first name.
- `lastName` (String): The customer's last name.
- `emailAddress` (String): The customer's email address.

In instances where two customers have the same email address but different `id` values, they are deemed duplicates.

Here's an example of a customer object:

```json
{
  "id": 67890,
  "firstName": "Alan",
  "lastName": "Turing",
  "emailAddress": "alan.turing@internet.com"
}
```

`dataset.js` ensures efficient data handling and allows for seamless integration into various analytical operations and processes thanks to its streamlined structure,
