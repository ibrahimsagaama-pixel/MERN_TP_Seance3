
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        age: {
            type: Number,
            min: 0
        },
        role: {
            type: String,
            default: "user"
        },
        bio: {
            type: String,
            default: "",
            maxlength: [200, "La bio ne doit pas dépasser 200 caractères"]
        },
        phone: {
            type: String,
            default: "",
            trim: true,
            match: [/^[0-9]{8}$/, "Le numéro de téléphone doit contenir 8 chiffres"]
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);
