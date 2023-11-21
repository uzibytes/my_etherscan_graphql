const { ApolloServer } = require("apollo-server"); 
const { importSchema } = require("graphql-import");
const EtherDataSource = require("./datasource/ethDatasource");

// Import GraphQL schema from schema.graphql file
const typeDefs = importSchema("./schema.graphql");  

require("dotenv").config(); 

const resolvers = {
  Query: {
    etherBalanceByAddress: (root, _args, { dataSources }) => // Resolver to get ether balance for an address
      dataSources.ethDataSource.etherBalanceByAddress(),

    totalSupplyOfEther: (root, _args, { dataSources }) => // Resolver to get total ether supply
      dataSources.ethDataSource.totalSupplyOfEther(),

    latestEthereumPrice: (root, _args, { dataSources }) => // Resolver to get latest ether price
      dataSources.ethDataSource.getLatestEthereumPrice(),

    blockConfirmationTime: (root, _args, { dataSources }) => // Resolver to get block confirmation time
      dataSources.ethDataSource.getBlockConfirmationTime(),
  },
};

// Create ApolloServer instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  
  // Instantiate EtherDataSource and make available via dataSources
  dataSources: () => ({
    ethDataSource: new EtherDataSource(),
  }),  
});

// Set no timeout for requests
server.timeout = 0; 

// Start the server
server.listen("9000").then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
