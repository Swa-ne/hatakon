// requirements
import mongoose, { Schema } from 'mongoose';

// Login Schema
const userCredentialSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Please enter your username.'],
        unique: true,
    },
    personalEmail: {
        type: String,
        required: [true, 'Please enter your personal Email.'],
        unique: true,
    },
    passwordHash: {
        type: String,
        required: [true, 'Please enter your password.'],
    },
    userType: {
        type: String,
        required: [true, 'Please enter user type.'],
    },
    studentInformation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        default: null,
    },
    adminInformation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        default: null,
    },
    notification: [
        {
            type: Schema.Types.ObjectId,
            ref: 'NotificationHolder',
            default: null,
        },
    ],
});
export const UserCredentials = mongoose.model('UserCredentials', userCredentialSchema);

//Student schema
const studentSchema = new Schema(
    {
        firstName: {
            type: String,
            required: [true, 'Please enter your first name'],
        },
        middleName: {
            type: String,
        },
        lastName: {
            type: String,
            required: [true, 'Please enter your last name'],
        },
        studentID: {
            type: String,
            required: [true, 'Please enter your student id number'],
            unique: true,
        },
        userCredentials: {
            type: Schema.Types.ObjectId,
            ref: 'UserCredentials',
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const adminSchema = new Schema(
    {
        firstName: {
            type: String,
            required: [true, 'Please enter your first name'],
        },
        middleName: {
            type: String,
        },
        lastName: {
            type: String,
            required: [true, 'Please enter your last name'],
        },
        userCredentials: {
            type: Schema.Types.ObjectId,
            ref: 'UserCredentials',
            default: null,
        },
    },
    {
        timestamps: true,
    }
);
export const Student = mongoose.model('Student', studentSchema);
export const Admin = mongoose.model('Admin', adminSchema);
