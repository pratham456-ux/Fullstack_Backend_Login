
import { asyncHandler } from "../utills/asyncHandler.js"
import { ApiError } from "../utills/ApiError.js"
import { ApiResponse } from "../utills/ApiResponse.js";
import jwt from 'jsonwebtoken'
import { User } from "../model/user.model.js";
export const  verifyJwt = asyncHandler(async (req, res, next) => {
    try {
      const token = req.cookies?.accessToken || req.header("Authorization")?.replace(/^Bearer\s*/i, "")
      console.log("Token received:", token)
      if (!token) {
            throw new ApiError(401, "Unauthorixed Request")
        }
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decode?._id).select("-password -refreshToken")
        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }
        req.user = user;
        next();
        
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid Access token")
    }
})