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
    recentTasks,
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

    Task.find()
        .sort("-createdAt")
        .limit(5)
        .populate("project", "name")
        .populate("assignedTo", "name email"),
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
            criticalPriority,
            recentTasks,
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