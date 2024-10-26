const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../models/user');

function generateJwtToken(userId) {
    return new Promise((resolve, reject) => {
        const jwtPayload = {user: {id: userId}};
        jwt.sign(jwtPayload, process.env.JWT_SECRET, {expiresIn: 36000}, (err, token) => {
            if (err) reject(err);
            else resolve(token);
        });
    });
}

async function createUser(name, email, password, bitcoinClient) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const bitcoinAddress = await bitcoinClient.getNewAddress();

    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        bitcoinAddress,
    });
    await newUser.save();
    return newUser;
}

module.exports = {
    generateJwtToken,
    createUser,
};
