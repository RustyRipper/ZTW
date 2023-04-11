const { gql } = require("apollo-server");

const typeDefs = gql`

    type ToDoItem{
        id: ID!
        title: String!
        completed: Boolean!
        user: User!
        userId: String!
    }
    type User{
        id: ID!
        name: String!
        email: String!
        login: String!
        todos: [ToDoItem!]!
    }
    type Query {
        todos: [ToDoItem!]
        todo(id: ID!): ToDoItem
        users: [User!]
        user(id: ID!): User
    }
    input UserIn {
        name: String,
        email: String,
        login: String
    }
    input ToDoIn {
        title: String,
        completed: Boolean,
        userId: String
    }
    type Mutation {
        createUser(user: UserIn): User,
        deleteUser(id: ID): String,
        updateUser(id: ID, user: UserIn): User,
        createToDo(todo: ToDoIn): ToDoItem,
        deleteToDo(id: ID): String,
        updateToDo(id: ID, todo: ToDoIn): ToDoItem,
    }
`;

module.exports = typeDefs;