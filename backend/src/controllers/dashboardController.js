const Task = require("../models/Task");
const Project = require("../models/Project");

const getDashboard = async (req, res) => {
    try {
        const isAdmin = req.user.role === "admin";
        const userId = req.user.userId;

        // Build scope filters for non-admins
        const taskFilter = isAdmin ? {} : {
            $or: [
                { createdBy: userId },
                { assignedTo: userId },
            ],
        };
        const projectFilter = isAdmin ? {} : { createdBy: userId };

        // Totals
        const totalProjects = await Project.countDocuments(projectFilter);
        const totalTasks = await Task.countDocuments(taskFilter);

        // Status breakdown
        const todo = await Task.countDocuments({ ...taskFilter, status: "Todo" });
        const inProgress = await Task.countDocuments({ ...taskFilter, status: "In Progress" });
        const qa = await Task.countDocuments({ ...taskFilter, status: "QA" });
        const done = await Task.countDocuments({ ...taskFilter, status: "Done" });

        // Priority breakdown
        const high = await Task.countDocuments({ ...taskFilter, priority: "High" });
        const critical = await Task.countDocuments({ ...taskFilter, priority: "Critical" });

        res.status(200).json({
            totalProjects,
            totalTasks,
            status: { todo, inProgress, qa, done },
            priority: { high, critical },
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};

module.exports = { getDashboard };
