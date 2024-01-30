const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');


const resolvers = {
   Query: {
    // Resolver for the 'me' query
    me: async (parent, args, context) => {
        if (context.user) {
            // If the user is authenticated, retrieve user data
            const userData = await User.findOne({ _id: context.user._id })
            .select('-__v -password')
            return userData;
        }
        // If user is not authenticated, throw an error
        throw new Error('You need to logged in');
    }
   },
   Mutation: {
        // Resolver for the 'addUser' mutation
        addUser: async (parent, args) => {
            // Create a new user
            const user = await User.create(args);
            // Generate a token for the user
            const token = signToken(user);
            return { token, user };
        },
        // Resolver for the 'login' mutation
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if(!user) {
                throw new Error('No user found')
            }
            // Check if the entered password is correct
            const correctPw = await user.isCorrectPassword(password);
            if(!correctPw) {
                throw new Error ('Incorect Password Entered')
            }
            // Generate a token for the user
            const token = signToken(user);
            console.log(token);
            return { token, user };
        },
        // Resolver for the 'saveBook' mutation
        saveBook: async (parent, { book }, context) => {
            console.log(book,"---- SaveBook ----", context.user);
            if (context.user) {
                // Add the book to the user's savedBooks array
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: {savedBooks: book} },
                    { new: true }
                );
                console.log(updatedUser)
                return updatedUser;
            }
            // If user is not logged in, throw an error
            throw new Error ('You are not logged in')
        },
        // Resolver for the 'removeBook' mutation
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                // Remove a book from the user's savedBooks array
              const updatedUser = await User.findByIdAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId }}},
                { new: true }
              );
              return updatedUser;
            }
            // If user is not logged in, throw an error
            throw new Error ('You are not logged in');
        },
   }
}
module.exports = resolvers;