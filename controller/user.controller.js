import { MongoAPIError } from "mongodb";
import { asyncHandler } from "../utills/asyncHandler.js"
import { ApiError } from "../utills/ApiError.js"
import { ApiResponse } from "../utills/ApiResponse.js";
import jwt from "jsonwebtoken";

import { User } from "../model/user.model.js";

const generateAccessandRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const refreshToken = user.genrateRefreshToken()
        const accessToken = user.generateAccessToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something Went wrong while generating Token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


    const { fullName, email, password } = req.body
    //console.log("email: ", email);

    if (
        [fullName, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({email 
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }


    const user = await User.create({
        fullName,
        email,
        password,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

})

const loginUser = asyncHandler(async (req, res) => {
    //credantial should be enter by user
    //check credentials
    // find user
    // check password 
    //access and refresh token genrate it
    //send cookie
    //send response

    const { email, fullName, password } = req.body
    const username = fullName
    if (!email && !username) {
        throw new ApiError(400, "Username or Email required")
    }
    if (!password) {
        throw new ApiError(400, "Password Must be Entred")
    }
    const user = await User.findOne({ $or: [{ username }, { email }] })
    if (!user) {
        throw new ApiError(404, "User Doesnot exist")
    }
    const validPassword = await user.isPasswordCorrect(password)
    if (!validPassword) {
        throw new ApiError(401, "Invalid user Password")
    }
    const { accessToken, refreshToken } = await generateAccessandRefreshTokens(user._id)
    const logUser = await User.findById(user._id).select("-password -refreshToken")
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                user: logUser, accessToken, refreshToken
            },
                "User logged in SuccessFully"

            )
        )
})
const logoutUser = asyncHandler(async (req, res) => {
    //clearing cookies
    //remove tokens or reset
    await User.findByIdAndUpdate(
        req.user._id, {
        $set: {
            refreshToken: undefined

        }
    },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User Logged out SuccesFully"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    //it will take refreshToken from cookie or body
    try {
        //
        const incomingToken = req.cookies.refreshToken || req.body.refreshToken
        if (!incomingToken) {
            throw new ApiError(401, "unauthrize Access")
        }
        const rawToken = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(rawToken?._id)
        if (!user) {
            throw new ApiError(401, "Invalid Refresh Token")
        }
        if (incomingToken !== user?.refreshToken) {
            throw new ApiError(401, "Invalid Refresh Token")
        }
        const options = {
            httpOnly: true,
            secure: true,
        }
        const { accessToken, newrefreshToken } = await generateAccessandRefreshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken)
            .cookie("refreshToken", newrefreshToken, options)
            .json(
                new ApiResponse(200, { accessToken, newrefreshToken }, "AccessToken is refreshed SuccessFully")
            )
    } catch (error) {
        console.log("Something Went wrong at refreshAccess TOken User Controller : ", error);

    }

})


export {
  
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
}