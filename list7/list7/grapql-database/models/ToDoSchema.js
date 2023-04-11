
const mongoose = require('mongoose');

const ToDoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
});

const ToDo = mongoose.model('todo', ToDoSchema);
module.exports = ToDo;

