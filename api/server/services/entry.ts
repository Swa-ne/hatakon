import { ObjectId, Types } from 'mongoose';
import { HttpResponse } from '../models/http-response';
import { UserCredentials, Student, Admin } from '../models/user';
import * as bcrypt from 'bcrypt';

export const loginUsertoDatabase = async (userIdentifier: string, password: string) => {
    try {
        let result = await UserCredentials.findOne({
            $or: [{ username: { $regex: new RegExp(`^${userIdentifier}$`, 'i') } }, { personalEmail: { $regex: new RegExp(`^${userIdentifier}$`, 'i') } }],
        });
        if (result) {
            if (await bcrypt.compare(password, result.passwordHash)) {
                return new HttpResponse({ 'message': 'success' }, 200);
            }
            return new HttpResponse({ 'message': 'Wrong Password.' }, 200);
        }
        return new HttpResponse({ 'message': 'User not Found.' }, 200);
    } catch {
        return new HttpResponse({ 'message': 'Internal Server Error.' }, 500);
    }
};

export const registerUsertoDatabase = async (firstName: string, middleName: string, lastName: string, username: string, personalEmail: string, password: string, userType: string, studentID: string) => {
    let userCredentialResult;

    try {
        const saltRounds = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        userCredentialResult = await new UserCredentials({
            username,
            personalEmail,
            passwordHash: hashedPassword,
            userType,
        }).save();
        let user;
        if (userType.toLowerCase() === 'student') {
            user = new Student({
                firstName,
                middleName,
                lastName,
                studentID,
                userCredentials: userCredentialResult._id,
            });
            userCredentialResult.studentInformation = user._id;
        } else if (userType.toLowerCase() === 'admin') {
            user = new Admin({
                firstName,
                middleName,
                lastName,
                userCredentials: userCredentialResult._id,
            });
            userCredentialResult.adminInformation = user._id;
        }
        if (user) {
            await userCredentialResult.save();
            await user.save();
            return { message: 'User saved to the database', httpCode: 200 };
        } else {
            await UserCredentials.deleteOne({ _id: userCredentialResult._id });
            return { message: 'Error on saving the user', httpCode: 500 };
        }
    } catch (error) {
        console.log(error);
        if (userCredentialResult) {
            await userCredentialResult.deleteOne();
        }
        return { message: error, httpCode: 500 };
    }
};
export const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    try {
        const result = (await UserCredentials.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } })) === null;

        return result;
    } catch (error) {
        return false;
    }
};

export const checkPersonalEmailAvailability = async (emailAddress: string): Promise<boolean> => {
    try {
        const result: boolean = (await UserCredentials.findOne({ personalEmail: { $regex: new RegExp(`^${emailAddress}$`, 'i') } })) === null;
        return result;
    } catch (error) {
        return false;
    }
};
export const getUserIDandType = async (userIdentifier: string): Promise<string[] | null> => {
    const result = await UserCredentials.findOne({ $or: [{ username: { $regex: new RegExp(userIdentifier, 'i') } }, { personalEmail: { $regex: new RegExp(userIdentifier, 'i') } }] })
        .populate('studentInformation')
        .populate('adminInformation');
    if (result) {
        let userID: unknown = result.userType === 'student' ? result.studentInformation : result.adminInformation;

        const userType: unknown = result.userType;
        const userData: any = userType === 'student' ? result.studentInformation : result.adminInformation;
        const userFullName: unknown = `${userData?.firstName} ${userData?.middleName ?? userData?.middleName} ${userData?.lastName}`;
        const username: unknown = result?.username;
        return [userID as string, userType as string, userFullName as string, username as string];
    }
    return null;
};

// export const getUserIDByUsername = async (username: String): Promise<boolean> => {
// const [result] : Array<any> = await pool.query(`SELECT UserID FROM user_login_data WHERE Username = ?;`, username)

// return result[0]["UserID"]
//     return false;
// };

// export const getUserIDByEmailAddress = async (email: String): Promise<boolean> => {
// const [result] : Array<any> = await pool.query(`SELECT UserID FROM user_login_data WHERE EmailAddress = ?;`, email)

// return result[0]["UserID"]
//     return false;
// };
// export const addRefreshToken = async (refreshToken : string) => {
//     try{
//         const [result] : Array<any> = await pool.query(`INSERT INTO refresh_token (token) VALUES (?)`, refreshToken)
//         return true
//     } catch {
//         return false
//     }

// }
// export const checkRefreshToken = async (refreshToken : string) => {
//     const [result] : Array<any> = await pool.query(`SELECT * FROM refresh_token WHERE token = ?;`, refreshToken)

//     return result.length == 0
// }
// export const deleteRefreshToken = async (refreshToken : string) => {
//     // TODO: Delete token from db
//     try{
//         const [result] : Array<any> = await pool.query(`INSERT INTO refresh_token (token) VALUES (?)`, refreshToken)
//         return true
//     } catch {
//         return false
//     }
// }
