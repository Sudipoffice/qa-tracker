const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");

const createTask = async (req, res) => {
    try{
        const {
            title,
            description,
            project,
            assignedTo,
            priority,
        } = req.body;

        const existingProject = await Project.findById(project);
        if(!existingProject){
            return res.status(404).json({
                error: "Project not found",
            });
        }
        if(assignedTo){
            const user = await User.findById(assignedTo);
            if(!user){
                return res.status(404).json({
                    error: "Assigned user not found",
                });
            }
        }

        const task = await Task.create({
            title,
            description,
            project,
            assignedTo,
            priority,
            createdBy: req.user.userId
        });

        res.status(201).json(task);
    }
    catch(error){
        res.status(500).json({
            error: error.message,
        });
    }
}

const getTasks = async (req, res) => {
    try{
        const filter = {};

        if(req.query.status){
            filter.status = req.query.status;
        }
        if (req.query.priority) {
            filter.priority = req.query.priority;
        }
        if(req.query.search){
            filter.title = {
                $regex: req.query.search,
                $options: "i"
            }
        }
        let query = Task.find(filter).populate("project", "name status").populate("assignedTo", "name email role").populate("createdBy", "name email");

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        if (req.query.sort) {
            query = query.sort(req.query.sort);
            }
        else {
                query = query.sort("-createdAt");
            }

        const total = await Task.countDocuments(filter);
        const tasks = await query.skip(skip).limit(limit);

        res.status(200).json({
            tasks,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    }
    catch(error){
        res.status(500).json({
            error: error.message,
        })
    }
}

const getTaskByProject = async (req, res) => {
    try{
        const tasks = await Task.find({
            project: req.params.projectId,
        }).populate("assignedTo", "name email").populate("createdBy", "name email");

        res.status(200).json(tasks);
    }
    catch(error){
        res.status(500).json({
            error: error.message,
        })
    }
}

const updateTask = async (req,res) => {
    try{
        const task = await Task.findById(req.params.id)
        if(!task){
            return res.status(404).json({
                message: "Task not found"
            })
        }

        if(task.createdBy.toString() !== req.user.userId && req.user.role !== "admin"){
            return res.status(403).json({
                message: "Not Authorized",
            })
        }

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.status = req.body.status || task.status;
        task.priority = req.body.priority || task.priority;
        task.assignedTo = req.body.assignedTo || task.assignedTo;

        await task.save();
        res.status(200).json(task);
    }
    catch(error){
        res.status(500).json({
            error: error.message,
        })
    }
}

const deleteTask = async (req,res) => {
    try{
        const task = await Task.findById(req.params.id)
        if(!task){
            return res.status(404).json({
                message: "Task not found"
            })
        }
        
        if(task.createdBy.toString() !== req.user.userId && req.user.role !== "admin"){
            return res.status(403).json({
                message : "Not Authorized"
            })
        }

        await task.deleteOne();

        res.status(200).json({
            message: "Task deleted successfully"
        });
    }
    catch(error){
        res.status(500).json({
            error: error.message,
        })
    }
}

module.exports = {
    createTask,
    getTasks,
    getTaskByProject,
    updateTask,
    deleteTask
}