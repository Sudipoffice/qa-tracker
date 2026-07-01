const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        status:{
            type: String,
            enum: ["Todo", "In Progress", "QA", "Done"],
            default: "Todo",
        }, 
        priority: {
            type: String,
            enum: ["Low", "Medium", "High", "Critical"],
            default: "Medium",
        },
        project:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,   
    }
);

module.exports = mongoose.model("Task", taskSchema);