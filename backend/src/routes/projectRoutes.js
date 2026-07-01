const express = require('express');
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const { createProject, getProjects, getProjectById, updateProject, deleteProject } = require("../controllers/projectController");

router.post("/", protect, createProject);
router.get("/", protect, getProjects);
router.get("/:id", protect, getProjectById);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);

module.exports = router;