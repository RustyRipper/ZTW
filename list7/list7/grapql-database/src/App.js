const {ApolloServer, gql} = require('apollo-server');
const axios = require("axios");
const mongoose = require('mongoose')
const User = require('../models/UserSchema');
const ToDo = require('../models/ToDoSchema');

const usersList = [
    {id: 1, name: "Jan Konieczny", email: "jan.konieczny@wonet.pl", login: "jkonieczny"},
    {id: 2, name: "Anna Wesołowska", email: "anna.w@sad.gov.pl", login: "anna.wesolowska"},
    {id: 3, name: "Piotr Waleczny", email: "piotr.waleczny@gp.pl", login: "p.waleczny"}
];
const todosList = [
    {id: 1, title: "Naprawić samochód", completed: false, user_id: 3},
    {id: 2, title: "Posprzątać garaż", completed: true, user_id: 3},
    {id: 3, title: "Napisać e-mail", completed: false, user_id: 3},
    {id: 4, title: "Odebrać buty", completed: false, user_id: 2},
    {id: 5, title: "Wysłać paczkę", completed: true, user_id: 2},
    {id: 6, title: "Zamówic kuriera", completed: false, user_id: 3},
];


const resolvers = {
    Query: {
        //users: () => usersList,
        //todos: () => todosList,
        users: async () => {
            const users = await User.find()
            return users
        },
        todos: async () => {
            const todos = await ToDo.find()
            return todos;
        },
        todo: async (parent, {id}, context, info) => {
            return ToDo.findById(id);
        },
        user: async (parent, {id}, context, info) => {
            return User.findById(id);
        }
    },
    User: {
        todos: async (parent, args, context, info) => {
            const todosListRest = await ToDo.find();
            return todosListRest.filter(t => t.userId == parent.id);
        }
    },
    ToDoItem: {
        user: async (parent, args, context, info) => {
            const usersListRest = await User.find();
            return usersListRest.find(u => u.id == parent.userId);
        }
    },
    Mutation: {
        createUser: async (parent, args, context, info) => {
            const {name, email, login} = args.user
            const user = new User({name, email, login})
            await user.save()
            return user;
        },
        deleteUser: async (parent, args, context, info) => {
            const {id} = args

            await User.findByIdAndDelete(id)
            return "Delete user: " + id
        },
        updateUser: async (parent, args, context, info) => {
            const {name, email, login} = args.user
            const {id} = args
            const user = await User.findByIdAndUpdate(
                id,
                {name, email, login},
                {new: true}
            );
            return user;
        },
        createToDo: async (parent, args, context, info) => {
            const {title, completed, userId} = args.todo
            const todo = new ToDo({title, completed, userId})
            await todo.save()
            return todo;
        },
        deleteToDo: async (parent, args, context, info) => {
            const {id} = args
            await ToDo.findByIdAndDelete(id)
            return "Delete todo: " + id
        },
        updateToDo: async (parent, args, context, info) => {
            const {title, completed, userId} = args.todo
            const {id} = args
            const todo = await ToDo.findByIdAndUpdate(
                id,
                {title, completed, userId},
                {new: true}
            );
            return todo;
        }
    }
};


const typeDefs = require("./schema");

const server = new ApolloServer({
    typeDefs,
    resolvers,
});
mongoose.connect('mongodb://localhost:27018/ztw', {
    useNewUrlParser: true
})

server.listen().then(({url}) => {
    console.log(`Server starts at ${url}`);
});