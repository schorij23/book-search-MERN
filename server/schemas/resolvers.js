const { User, Book } = require('../models');
// const { AuthenticationError } = require('apollo-server-express');
const { signToken,AuthenticationError } = require('../utils/auth');

const resolvers = {
   Query: {
    me: async (parent, args, context) => {
        if (context.user) {
            const userData = await User.findOne({ _id: context.user._id })
            .select('-__v -password')
            return userData;
        }
        throw AuthenticationError('You need to logged in');
    }
   },
   Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if(!user) {
                throw AuthenticationError('No user found')
            }
            const correctPw = await user.isCorrectPassword(password);
            if(!correctPw) {
                throw AuthenticationError('Incorect Password Entered')
            }
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, { book }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: {savedBooks: book} },
                    { new: true }
                );
                return updatedUser;
            }
            throw AuthenticationError('You are not logged in')
        },
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
              const updatedUser = await User.findByIdAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId }}},
                { new: true }
              );
              return updatedUser;
            }
            throw AuthenticationError('You are not logged in');
        },
   }
}
module.exports = resolvers;