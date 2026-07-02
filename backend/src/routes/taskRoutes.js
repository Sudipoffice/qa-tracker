const express = require('express');
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const { createTask, getTasks, getTaskByProject, updateTask, deleteTask } = require("../controllers/taskController");

router.post("/", protect, createTask);
router.get("/", protect, getTasks);
router.get("/:projectId", protect, getTaskByProject);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);

module.exports = router;