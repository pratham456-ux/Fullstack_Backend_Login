//for password protection of user we need to use bcrypt and jason web token(jwt)
//we can not directly use bcrypt or jwt we need to use mongoose  middleware pre
//pre is a hook whcih execute just before storing the data
//jwt is beare r token
//means if somebody give token we treat it as true
import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema({
   
    email :{
         type : String,
        require: true,
        unique : true,
        lowercase  :true,
        trim : true,
     },
     fullName : {
        type : String,
        require : true,
        lowercase  :true,
        trim : true,
        index : true,
     },
   
    password : {
        type : String,
        require : true
    },
    refreshToken : {
        type : String
    }

},{timestamps:true});

userSchema.pre("save",async function (next){
    //we have alredy talked about pre 
    //we have defined this function async because we need to authenticate user every time
    //here if we donit check password is modified or not than every time if change occure in user
    //password will be chagend
    //we give refrance to the bcrypt.hash function and encrypt is for n number of time 
    //here n is 10
    if (!this.isModified("password")){ return next();}
    
    if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password,10)
    next()
    }
   
}) // syntex .pre("functionality" , call back)

//no we need to create some method for password authentication given by user
//for creating a custoum schmemethod or custoum hooks we use 
//Schema_name.mehtods.name = function(){} //here schema property of methode we can create acustoum hook
userSchema.methods.isPasswordCorrect = async function (password) {
 return await bcrypt.compare(password,this.password)
}
//we need jwt authentication for that we aree gonna crete a custoum hook with methods
//after  that we aree goona encrypt with prebuilt method of jwt sign
//jwt.sign(payload)
//we genrate teo types of token firat is access and second is refresh

userSchema.methods.generateAccessToken = function(){
   return jwt.sign(
    {
        _id: this._id,
        email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
)

}
userSchema.methods.genrateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email : this .email,
   
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRATION
        }
    )

}
export const User = mongoose.model("User",userSchema)