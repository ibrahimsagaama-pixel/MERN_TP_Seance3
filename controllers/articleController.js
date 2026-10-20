
const mongoose = require("mongoose");
const Article = require("../models/articleModel");

// GET : récupérer tous les articles avec les informations de l'auteur
const getAllArticles = async (req, res) => {
    try {
        const articles = await Article.find()
            .populate("author", "name email");

        res.status(200).json({
            total: articles.length,
            articles
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET : récupérer un article par son ID
const getArticleById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                error: "ID article invalide"
            });
        }

        const article = await Article.findById(req.params.id)
            .populate("author", "name email");

        if (!article) {
            return res.status(404).json({
                error: "Article introuvable"
            });
        }

        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST : créer un article
const createArticle = async (req, res) => {
    try {
        const { title, content, author } = req.body;

        if (!title || !content || !author) {
            return res.status(400).json({
                error: "Le titre, le contenu et l'auteur sont obligatoires"
            });
        }

        if (!mongoose.isValidObjectId(author)) {
            return res.status(400).json({
                error: "ID auteur invalide"
            });
        }

        const nouvelArticle = await Article.create({
            title,
            content,
            author
        });

        await nouvelArticle.populate("author", "name email");

        res.status(201).json({
            message: "Article créé avec succès",
            article: nouvelArticle
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                error: error.message
            });
        }

        res.status(500).json({ error: error.message });
    }
};

// PUT : modifier un article
const updateArticle = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                error: "ID article invalide"
            });
        }

        const { title, content, author } = req.body;
        const modifications = {};

        if (title !== undefined) modifications.title = title;
        if (content !== undefined) modifications.content = content;

        if (author !== undefined) {
            if (!mongoose.isValidObjectId(author)) {
                return res.status(400).json({
                    error: "ID auteur invalide"
                });
            }

            modifications.author = author;
        }

        const article = await Article.findByIdAndUpdate(
            req.params.id,
            modifications,
            { new: true, runValidators: true }
        ).populate("author", "name email");

        if (!article) {
            return res.status(404).json({
                error: "Article introuvable"
            });
        }

        res.status(200).json({
            message: "Article mis à jour",
            article
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                error: error.message
            });
        }

        res.status(500).json({ error: error.message });
    }
};

// DELETE : supprimer un article
const deleteArticle = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                error: "ID article invalide"
            });
        }

        const article = await Article.findByIdAndDelete(req.params.id);

        if (!article) {
            return res.status(404).json({
                error: "Article introuvable"
            });
        }

        res.status(200).json({
            message: "Article supprimé avec succès"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle
};
