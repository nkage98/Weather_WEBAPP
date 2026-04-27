import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        tokenHash: {
            type: String,
            required: true,
            unique: true,
        },
        expiresAt: {
            type: Date,
            required: true,
            index: { expires: 0 },
        },
    },
    { timestamps: true }
);

const RefreshTokenModel = mongoose.model("RefreshToken", refreshTokenSchema);

export default RefreshTokenModel;
