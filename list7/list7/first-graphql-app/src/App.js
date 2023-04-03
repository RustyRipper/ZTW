const {ApolloServer, gql} = require('apollo-server');
const axios = require("axios");

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
        users: async () => getRestUsersList(),
        todos: async () => getRestToDoItemsList(),
        todo: async (parent, args, context, info) => todoById(parent, args, context, info),
        user: async (parent, args, context, info) => userById(parent, args, context, info),
    },
    User: {
        todos: async(parent, args, context, info) => {
            const todosListRest = await getRestToDoItemsList();
            return todosListRest.filter(t => t.userId == parent.id);
        }
    },
    ToDoItem: {
        user: async(parent, args, context, info) => {
            const usersListRest = await getRestUsersList();
            return usersListRest.find(u => u.id == parent.userId);
        }
    }
};

async function todoById(parent, args, context, info) {
    const todosListRest = await getRestToDoItemsList();
    console.log('todo')
    return todosListRest.find(t => t.id == args.id);
}

async function userById(parent, args, context, info) {
    const usersListRest = await getRestUsersList();
    console.log("user")
    return usersListRest.find(u => u.id == args.id);
}

async function getRestUsersList() {
    try {
        const users = await axios.get("https://jsonplaceholder.typicode.com/users")
        //console.log(users);
        return users.data.map(({id, name, email, username, todos}) => ({
            id: id,
            name: name,
            email: email,
            login: username,
            todos: todos
        }))
    } catch (error) {
        throw error
    }
}

async function getRestToDoItemsList() {
    try {
        const todos = await axios.get("https://jsonplaceholder.typicode.com/todos")
        //console.log(todos);
        return todos.data.map(({id, title, completed, userId}) => ({
            id: id,
            title: title,
            completed: completed,
            userId: userId
        }))
    } catch (error) {
        throw error
    }
}


const typeDefs = require("./schema");
const {isOutputType} = require("graphql/type");

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

server.listen().then(({url}) => {
    console.log(`🚀 Server ready at ${url}`);
});