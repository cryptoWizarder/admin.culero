import mongoose, { Schema } from 'mongoose';
const reviewSchema = new mongoose.Schema(
    {
        reviewed_user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        review: {
            type: [
                {
                    content: {
                        type: String,
                        default: '',
                    },
                    score: {
                        type: String,
                        default: '',
                    },
                    reviewer_id: {
                        type: Schema.Types.ObjectId,
                        ref: 'User',
                    },
                    anonymous_user: {
                        type: Boolean,
                        default: false,
                    },
                    date: {
                        type: Date,
                        default: new Date(),
                    }
                },
            ],
            default: [],
        },
    },
    { timestamps: true },
);


const Review = mongoose.model('Review', reviewSchema);

export default Review;
