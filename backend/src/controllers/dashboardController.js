const Project = require("../models/Project");
const Task = require("../models/Task");

const getDashboardStats = async (req, res) => {
    try{
        const [
    totalProjects,
    totalTasks,
    todoTasks,
    inProgressTasks,
    qaTasks,
    doneTasks,
    lowPriority,
    mediumPriority,
    highPriority,
    criticalPriority,
] = await Promise.all([

    Project.countDocuments(),

    Task.countDocuments(),

    Task.countDocuments({
        status: "Todo",
    }),

    Task.countDocuments({
        status: "In Progress",
    }),

    Task.countDocuments({
        status: "QA",
    }),

    Task.countDocuments({
        status: "Done",
    }),

    Task.countDocuments({
        priority: "Low",
    }),

    Task.countDocuments({
        priority: "Medium",
    }),

    Task.countDocuments({
        priority: "High",
    }),

    Task.countDocuments({
        priority: "Critical",
    }),

]);

        res.status(200).json({
            totalProjects,
            totalTasks,
            todoTasks,
            inProgressTasks,
            qaTasks,
            doneTasks,
            lowPriority,
            mediumPriority,
            highPriority,
            criticalPriority
        });
    }
    catch(error){
        res.status(500).json({
            error: error.message,
        });
    }
}

module.exports = {
    getDashboardStats,
};