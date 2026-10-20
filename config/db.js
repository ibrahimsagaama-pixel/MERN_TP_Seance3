
const mongoose = require("mongoose");

async function connectDB(uri) {
    if (!uri) {
        throw new Error("L'URI MongoDB est manquant dans le fichier .env");
    }

    await mongoose.connect(uri, {
        autoIndex: true
    });

    console.log("Connexion à MongoDB Atlas réussie !");
}

module.exports = connectDB;

