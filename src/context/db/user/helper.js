const users = require('./db').users

export const getUser = (req) => {
    if (req){
        const name = req.headers['user']
        if (users[name]) {
            return users[name]
        } else {
            throw new Error(`user ${name} not found`)
        }
    }else {
        console.log("req not defined. might be a subscription event")
        // admin user
        return "soumya"
    }
}