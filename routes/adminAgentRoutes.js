const express = require("express");

const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");

const {
    getAgents,
    createAgent,
    toggleAgentStatus
} = require("../controllers/adminAgentController");

router.get(
    "/agents",
    verifyToken,
    getAgents
);

router.post(
    "/agents/create",
    verifyToken,
    createAgent
);

router.post(
    "/agents/:id/toggle",
    verifyToken,
    toggleAgentStatus
);

module.exports = router;