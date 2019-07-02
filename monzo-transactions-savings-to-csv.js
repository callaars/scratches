/**
 * Transforms Monzo transactions tagged with #savings into a CSV output.
 */

const R = require('ramda')
const dayjs = require('dayjs')
const path = require('path')

const transactions = require(path.join(
  __dirname,
  'data',
  'monzo-transactions-savings-to-csv.json'
))

const quote = x => `"${x}"`

const filterSavings = R.compose(
  R.filter(
    R.compose(
      R.not,
      R.isEmpty,
      R.match(/#savings/i),
      R.prop('notes')
    )
  ),
  R.prop('transactions')
)

const getAmount = R.compose(
  quote,
  Math.abs,
  R.divide(R.__, 100),
  R.prop('amount')
)

const getCreated = R.compose(
  quote,
  x => dayjs(x).format('DD/MM/YYYY'),
  R.prop('created')
)

const getDescription = R.compose(
  quote,
  R.trim,
  R.prop('description')
)

const getNotes = R.compose(
  quote,
  R.trim,
  R.replace(/\n/g, ' '),
  R.defaultTo(''),
  R.prop('notes')
)

const turnIntoCSV = R.compose(
  R.join('\n'),
  R.map(
    R.compose(
      R.join(','),
      R.juxt([getAmount, getCreated, getDescription, getNotes])
    )
  )
)

const convert = R.compose(
  console.log,
  turnIntoCSV,
  filterSavings
)

convert(transactions)
