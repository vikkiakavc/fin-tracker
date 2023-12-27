
const CC = require('currency-converter-lt')

// let currencyConverter = new CC({ from: "USD", to: "JPY", amount: 100, isDecimalComma: true })


// currencyConverter.convert().then((response) => {
//   console.log(response) //or do something else
// })

async function convertCurrency(amount, fromCurrency, toCurrency) {
  // amount = parseFloat(amount)
  console.log(parseFloat(amount))
  console.log(fromCurrency)
  console.log(toCurrency)
  // console.log('I am here')
  if (fromCurrency === toCurrency) {
    return amount
  }
  try {
    let currencyConverter = new CC({ from: fromCurrency, to: toCurrency, amount: parseFloat(amount) })

    // const exchangeRate = await fetchExchangeRate(fromCurrency, toCurrency);
    let convertedAmount = await currencyConverter.convert();
    // convertedAmount = Math.round(convertedAmount * 100) / 100
    console.log(convertedAmount)
    console.log('done')
    return convertedAmount; // Round to two decimal places
  } catch (error) {
    throw error;
  }
}


// convert(100, "USD", "JPY").then(data => console.log(data)).catch((e) => console.log(e))



// async function doStuff() {
//   const data = await convert(100, "USD", "JPY");
//   console.log(Math.round(data * 100) / 100)

// }

// doStuff()
module.exports = convertCurrency;