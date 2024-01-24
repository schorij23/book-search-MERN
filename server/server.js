const express = require('express');
//Uncomment after building queries and mutations in client
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');

const path = require('path');
const { authMiddleware } = require('./utils/auth');
// Uncomment the following code once you have built the queries and mutations in the client folder
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
// Comment out this code once you have built out queries and mutations in the client folder
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  await server.start();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/graphql', expressMiddleware(server, {
  context: authMiddleware
}));

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}
// Comment out this code once you have built out queries and mutations in the client folder
app.use(routes);
  
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
})

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
});
};
// Uncomment the following code once you have built the queries and mutations in the client folder
startApolloServer();
