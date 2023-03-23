import mongoose, {ObjectId, now} from 'mongoose'

const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: 	{type:String, required:true, match: /^[\w\s]{2,60}$/ },
  email: 	{
    type: String, 
    required:true, 
    unique: true,
    dropDups: true,
    match: /^[\w\-\_\.]{2,60}@[\w\-\_]{2,60}(\.[\w\-\_]{2,60}){1,3}$/,
  },
  birth: 	Date,
  creationDate : {type: Date, dafault: now()},
  lastUpdate: {type: Date, dafault: now ()},
  password: {
    type:String, 
    required:true, 
    //match: /^[\w\-\_\.]{6,20}$/ //Esto aplica al hash
  },
  username: {
    type:String, 
    required:true, 
    unique: true,
    dropDups: true,
    match: /^[\w\.]{4,60}$/ 
  },
  active: {type: Boolean, default: false},
  cartId: ObjectId,
  verifyKey: {type: String, required: true},
  admin: {type: Boolean, default: false}
  // cart: [
  //   {"_id": ObjectId, quantity: Number }
  // ]
}); 

const UserModel = mongoose.model('User', UserSchema)

export default UserModel