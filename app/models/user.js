const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const bcrypt  = require('bcrypt');
const saltRounds = 10;

const UserSchema = new Schema({
    name: {type: String, default: '', requried: true},
    email: {type: String, default: '', require: true},
    password: {type: String, default: '', required: true},
});

UserSchema.path('name').validate(function(name){
    return name.length;
}, 'Name cannot be blank');

UserSchema.path('email').validate(function(email){
    return email.length;
}, 'email cannot be blank');

UserSchema.pre('save', function(next){
    if(this.isNew || this.modifiedPaths('password')){
        const document = this;
        bcrypt.hash(document.password, saltRounds,
            function(err, hashedPassword){
                if(err){
                    next(err);
                }else{
                    document.password = hashedPassword;
                    next();
                }
            })
    }else{
        next();
    }
})

UserSchema.methods = {
    isCorrectPassword: function(password, callback){
//        console.log(`${password}:${this.password}.`);
        bcrypt.compare(password, this.password, function(err,same){ 
            console.log(err, same)
            if(err){
                callback(err);
            }else{
                callback(err, same);
            }
        })
    }
};

mongoose.model('User', UserSchema);
