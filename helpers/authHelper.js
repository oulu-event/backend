const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

SECRET_KEY=process.env.SECRET_KEY

async function encryptPassword(password) {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    } catch (error) {
        throw new Error('Error encrypting password');
    }
}

async function checkPassword(password, hashedPassword) {
    try {
        const match = await bcrypt.compare(password, hashedPassword);
        return match;
    } catch (error) {
        return false;
    }
}

async function generateToken(user) {
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    return token;
}


module.exports = { encryptPassword, checkPassword, generateToken};