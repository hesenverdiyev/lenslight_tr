import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from 'validator';

const { Schema} = mongoose;

const userSchema = new Schema(
    {
    username: {
        type: String,
        required: [true, "Username is required"],
        lowercase: true,
        validate: [validator.isAlphanumeric, "Only alphanumeric characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        validate: [validator.isEmail, "Write a valid email"]
    },
    password: {
        type: String,
        required: [true, "Password area is required"],
        validate: [
            function (value) {
              return validator.isLength(value, { min: 4 });
            },
            'At least 4 character',
          ],
    },
    followers:[
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    followings:[
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
},
{
    timestamps: true
}
);

userSchema.pre('save', function(next) {
 const user = this;
 bcrypt.hash(user.password, 10, (err,hash) => {
    user.password = hash;
    next();
 });
});

const User = mongoose.model("User", userSchema);

export default User;