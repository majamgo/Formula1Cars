const mongoose = require('mongoose');
let bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: { unique: true }
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        index: { unique: true }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [3, 'Password needs to be longer!']
    }
}, { timestamps: true });


userSchema.pre('save', async function (next) {
    const user = this;
    // hvis bruger er rettet men password ikke ændret så spring dette over ... next() betyder forlad denne middleware
    if (!user.isModified('password')) return next();
    //Lav nye password
    const hashedPassword = await bcrypt.hash(user.password, 10)
    //Erstat password med det krypterede password
    user.password = hashedPassword
    next()
});

// Verification - cb = callback
userSchema.methods.comparePassword = function (pressedPassword, cb) { // Tager 'brugerSchema og putter en 'metode' på, som hedder 'comparePassword. 
    bcrypt.compare(pressedPassword, this.password, function (err, isMatch) { // Kalder 'bcrypt'. Comparer 'indtastetPassword' med database passwordet.
     if (err) return cb(err); // Hvis fejl, så kommer 'error'.
     cb(null, isMatch); // Returnerer true el false.
     });
    };


    module.exports = mongoose.model('User', userSchema);