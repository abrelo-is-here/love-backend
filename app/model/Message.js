import mongoose from 'mongoose';


const messageSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    lovername: {
        type: String,
        required: true,
    }
}, { timestamps: true });

export const Message = mongoose.model('Message', messageSchema);