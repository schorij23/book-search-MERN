const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    }
    type Book{
        _id: ID
        authors: [String]
        description: String
        bookId: String
        title: String
        image: String
        link: String
    }
    type Query {
        me: User
    }
    type Auth {
        token: ID!
        user: User
        }
    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(book: SavedBookInput): User
        removeBook(bookId: String!): User
    }
`;

module.exports = typeDefs;