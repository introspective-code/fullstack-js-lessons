const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const PORT = process.env.PORT || 8000;

const app = express();

const ONE_SECOND = 1000;

const MOCK_USERS_DB = [
  {
    id: '0',
    name: 'Caick',
    country: 'BR'
  },
  {
    id: '1',
    name: 'Nafeu',
    country: 'CA'
  },
  {
    id: '2',
    name: 'Micah',
    country: 'US'
  }
];

const MOCK_COUNTRIES_DB = [
  {
    id: 'BR',
    name: 'Brazil',
    population: 212600000
  },
  {
    id: 'CA',
    name: 'Canada',
    population: 38010000
  },
  {
    id: 'US',
    name: 'United States',
    population: 329500000
  },
];

const fetchUsers = () => new Promise(resolve => {
  setTimeout(() => {
    resolve(MOCK_USERS_DB)
  }, ONE_SECOND)
})

const fetchCountries = () => new Promise(resolve => {
  setTimeout(() => {
    resolve(MOCK_COUNTRIES_DB)
  }, ONE_SECOND)
})

const schema = buildSchema(`
  type Query {
    getUsers: [User]
  }
  type User {
    id: String
    name: String
    city: Country
  }
  type Country {
    id: String
    name: String
    population: Int
  }
`);

const getUsers = () => {
  return MOCK_USERS_DB
}

const graphApiRoot = {
  getUsers
}

app.use(express.json());

app.listen(PORT, () => {
  const clearConsole = process.argv[2] === 'clear';
  if (clearConsole) console.clear();

  console.log(`[ index.js ] Server listening on port ${PORT}`);
});

app.use(
  '/api',
  graphqlHTTP({
    schema,
    graphApiRoot,
    graphiql: true,
  }),
);
