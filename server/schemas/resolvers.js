const { Book, User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, { _id, username }) => {
            return await User.findOne({ _id, username});
        },

    },
    Mutation: {
        addUser: async (parent, {username, email, password}) => {
            const user = await User.create({ username, email, password});
            const token = signToken(user);
            return { token, user};
        },
        saveBook: async (parent, { book }, context) => {
            if (context.user) {
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id},
                { $addToSet: { savedBooks: book} },
                { new:true, runValidators: true }
            );
            return updatedUser;
        }},
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw AuthenticationError;
            }

            const validPassword = await user.isCorrectPassword(password);

            if (!validPassword) {
                throw AuthenticationError;
            }

            const token = signToken(user);

            return { token, user};
        },
        removeBook: async (parent, { user, params }, context) => {
            if (context.user) {
                return User.findOneAndUpdate(
                    { _id: user._id },
                    {
                        $pull: {
                            savedBooks: {
                                bookId: params.bookId
                            },
                        },
                    },
                    { new: true }
                );
            }
            throw AuthenticationError;
        },
    },
};

module.exports = resolvers;