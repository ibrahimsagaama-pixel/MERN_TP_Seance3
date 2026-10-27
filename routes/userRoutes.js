
const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

// Routes publiques : inscription et connexion
router.post("/register", userController.register);
router.post("/login", userController.login);

// Routes accessibles uniquement après authentification
router.get("/", protect, userController.getAllUsers);
router.get("/:id", protect, userController.getUserById);

// Création réservée aux administrateurs
router.post("/", protect, adminOnly, userController.createUser);

// Suppression réservée aux administrateurs
router.delete("/:id", protect, adminOnly, userController.deleteUser);

module.exports = router;
