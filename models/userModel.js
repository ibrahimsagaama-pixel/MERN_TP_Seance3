
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"]
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters long"]
        },
        age: {
            type: Number,
            min: [4, "Minimum allowed age is 4"]
        },
        role: {
            type: String,
            enum: {
                values: ["user", "admin"],
                message: "{VALUE} is not a valid role"
            },
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
