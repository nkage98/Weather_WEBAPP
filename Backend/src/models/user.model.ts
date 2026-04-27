import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        favoriteCities: {
            type: [String],
            default: [],
            set: (cities: string[]) => [...new Set(cities)],
        },
    },
    { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
