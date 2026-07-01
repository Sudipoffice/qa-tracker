const Project = require("../models/Project");


const createProject = async (req, res) => {
    try{
        const {name, description} = req.body;

        const project = await Project.create({
            name,
            description,
            createdBy: req.user.userId,
        });

        res.status(201).json(project);
    }
    catch(error){
        res.status(500).json({
            error: error.message,
        });
    }
};

const getProjects = async (req, res) => {
    try{
        const projects = await Project.find().populate("createdBy", "name email");
        res.status(200).json(projects);
    }
    catch(error){
        res.status(500).json({
            error: error.message,
        });
    }
}

const getProjectById = async (req, res) => {
    try{
        const project = await Project.findById(req.params.id).populate("createdBy", "name email");
        if(!project){
            return res.status(404).json({
                message: "Project not found",
            });
        }
        res.status(200).json(project);
    }
    catch(error){
        res.status(500).json({
            error: error.message,
        })
    }
};

const updateProject = async (req,res) => {
    try{
        const project = await Project.findById(req.params.id);
        if(!project){
            return res.status(404).json({
                message: "Project not found",
            });
        }

        if (project.createdBy.toString() !==req.user.userId) {
            return res.status(403).json({
                message: "Not authorized",
            });
}
        project.name = req.body.name || project.name;
        project.description = req.body.description || project.description;
        project.status = req.body.status || project.status;

        await project.save();

        res.status(200).json(project);

    }
    catch(error){
        res.status(500).json({
            error: error.message,
        });
    }
}

const deleteProject = async (req,res) => {
    try{
        const project = await Project.findById(req.params.id);
        if(!project){
            return res.status(404).json({
                message: "Project not found",
            });
        }

         if (project.createdBy.toString() !==req.user.userId) {
                return res.status(403).json({
                    message: "Not authorized",
                });
    }
        await project.deleteOne();

        res.status(200).json({
            message: "Project deleted successfully",
        });

    }
    catch(error){
        res.status(500).json({
            error: error.message
        });
    }
}

module.exports = { createProject, getProjects, getProjectById, updateProject, deleteProject };