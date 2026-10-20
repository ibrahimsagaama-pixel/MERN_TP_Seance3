
const mongoose = require("mongoose");
const User = require("../models/userModel");
const Article = require("../models/articleModel");

// GET : récupérer tous les utilisateurs
const getAllUsers = async (req, res) => {
    try {
        const { role } = req.query;
        const filtre = role ? { role } : {};

        const users = await User.find(filtre);

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

        const user = await User.findById(req.params.id);

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

// POST : créer un utilisateur
const createUser = async (req, res) => {
    try {
        const { name, email, age, role, bio, phone } = req.body;

        const nouvelUser = await User.create({
            name,
            email,
            age,
            role,
            bio,
            phone
        });

        res.status(201).json({
            message: "Utilisateur créé avec succès",
            user: nouvelUser
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
        // Vérifier le format de l'ID
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                error: "ID utilisateur invalide"
            });
        }

        // Rechercher l'utilisateur
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                error: "Utilisateur introuvable"
            });
        }

        // Vérifier si l'utilisateur possède des articles
        const article = await Article.findOne({
            author: user._id
        });

        if (article) {
            return res.status(409).json({
                error: "Impossible de supprimer cet utilisateur : il possède des articles"
            });
        }

        // Supprimer l'utilisateur s'il ne possède aucun article
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
    getAllUsers,
    getUserById,
    createUser,
    deleteUser
};
