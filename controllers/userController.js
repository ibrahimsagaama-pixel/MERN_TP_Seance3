
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const Article = require("../models/articleModel");

// Générer un token JWT
const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
};

// POST : inscription d'un utilisateur
const register = async (req, res) => {
    try {
        const { name, email, password, age, bio, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                error: "Name, email and password are required"
            });
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (existingUser) {
            return res.status(409).json({
                error: "Cette adresse email existe déjà"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            age,
            bio,
            phone
        });

        res.status(201).json({
            message: "Inscription réussie",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token: generateToken(user._id)
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                error: "Cette adresse email existe déjà"
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                error: error.message
            });
        }

        res.status(500).json({
            error: error.message
        });
    }
};

// POST : connexion d'un utilisateur
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required"
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (!user) {
            return res.status(401).json({
                error: "Email ou mot de passe incorrect"
            });
        }

        const passwordIsValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(401).json({
                error: "Email ou mot de passe incorrect"
            });
        }

        res.status(200).json({
            message: "Connexion réussie",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

// GET : récupérer tous les utilisateurs
const getAllUsers = async (req, res) => {
    try {
        const { role } = req.query;
        const filtre = role ? { role } : {};

        const users = await User.find(filtre).select("-password");

        res.status(200).json({
            total: users.length,
            users
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

// GET : récupérer un utilisateur par son ID
const getUserById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                error: "ID utilisateur invalide"
            });
        }

        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            return res.status(404).json({
                error: "Utilisateur introuvable"
            });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

// POST : créer un utilisateur (fonction conservée pour le TP précédent)
const createUser = async (req, res) => {
    try {
        const { name, email, password, age, role, bio, phone } = req.body;

        if (!password) {
            return res.status(400).json({
                error: "Password is required"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const nouvelUser = await User.create({
            name,
            email,
            password: hashedPassword,
            age,
            role,
            bio,
            phone
        });

        res.status(201).json({
            message: "Utilisateur créé avec succès",
            user: {
                id: nouvelUser._id,
                name: nouvelUser.name,
                email: nouvelUser.email,
                role: nouvelUser.role
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                error: "Cette adresse email existe déjà"
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                error: error.message
            });
        }

        res.status(500).json({
            error: error.message
        });
    }
};

// DELETE : supprimer un utilisateur
const deleteUser = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                error: "ID utilisateur invalide"
            });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                error: "Utilisateur introuvable"
            });
        }

        const article = await Article.findOne({
            author: user._id
        });

        if (article) {
            return res.status(409).json({
                error: "Impossible de supprimer cet utilisateur : il possède des articles"
            });
        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Utilisateur supprimé avec succès"
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

module.exports = {
    register,
    login,
    getAllUsers,
    getUserById,
    createUser,
    deleteUser
};
