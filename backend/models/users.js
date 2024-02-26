const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const userSchema = mongoose.Schema(
{
    username:
    {
        type: String,
        required: [true, 'pls enter a username'],
        unique: [true, 'username alrdy taken']
    },
    password:
    {
        type: String,
        required: [true, 'pls enter a password']
    },
    role:
    {
        type: String,
        default: "basic"
    },
},
)

userSchema.post('save', function (doc, next) {
    console.log('new user created', doc)
    next()
})

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

userSchema.statics.login = async function(username, password) {
    if (!username || !password) {
        throw Error('Username and password are required');
    }
    
    console.log(password)
    const user = await this.findOne({ username });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw new Error("Incorrect password");
    }
    throw new Error('Username not found');
};

userSchema.statics.signup = async function(username, password)
{
    if (!username || !password)
    {
        throw Error('need to fill in everything')
    }
    
    const exists = await this.findOne({username})
    if (exists)
    {
        throw Error('Username already exists')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const user = await this.create({username, password: hash})
    return user
}

userSchema.statics.hashPassword = async function (password) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (error) {
        throw new Error('Error hashing password');
    }
};

const User = mongoose.model('user', userSchema);
module.exports = User;