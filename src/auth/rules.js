import {
    rule,
} from 'graphql-shield'
const db = require('../context/db').db
const helper = require('../context/db').helper


const isAllowedToEdit = rule({
    cache: 'no_cache'
})(
    async (parent, args, ctx, info) => {
        const policyNo = args.policyNo
        const amount = args.amount
        const user = ctx.user.name
        console.log("debug")
        if (
            helper.isValidPolicy(policyNo) &&
            db.users[user].role === 'broker' &&
            helper.findPolicyByPolicyNo(policyNo).brokers.some((broker) => {return broker.name === user}) &&
            helper.findPolicyByPolicyNo(policyNo).brokers.find((broker) => {return broker.name === user}).brokerCanEdit) {
            console.log("isAllowedToEdit: " + (amount < db.brokerInfo[user].allowedEditLimit).toString())
            return amount < db.brokerInfo[user].allowedEditLimit
        } else if (
            helper.isValidPolicy(policyNo) &&
            db.users[user].role === 'sub-broker' &&
            helper.findPolicyByPolicyNo(policyNo).brokers.some((broker) => {return broker.name === helper.findMyBoss(user)}) &&
            helper.findPolicyByPolicyNo(policyNo).brokers.find((broker) => {return broker.name === helper.findMyBoss(user)}).brokerCanEdit) {
            console.log("isAllowedToEdit: " + (amount < db.brokerInfo[user].allowedEditLimit).toString())
            return amount < db.brokerInfo[user].allowedEditLimit
        } else {
            console.log("isAllowedToEdit: false")
            return false
        }
    }
)

const isAllowedToWithdraw = rule({
    cache: 'no_cache'
})(
    async (parent, args, ctx, info) => {
        const policyNo = args.policyNo
        const amount = args.amount
        const user = ctx.user.name
        console.log("debug")

        if (
            helper.isValidPolicy(policyNo) &&
            db.users[user].role === 'broker' &&
            helper.findPolicyByPolicyNo(policyNo).brokers.some(broker => broker.name === user) &&
            helper.findPolicyByPolicyNo(policyNo).brokers.find(broker => broker.name === user).brokerCanWithdraw) {
            console.log("isAllowedToWithdraw: " + (amount < db.brokerInfo[user].allowedWithdrawLimit).toString())
            return amount < db.brokerInfo[user].allowedWithdrawLimit
        } else if (
            helper.isValidPolicy(policyNo) &&
            db.users[user].role === 'sub-broker' &&
            helper.findPolicyByPolicyNo(policyNo).brokers.some(broker => broker.name === helper.findMyBoss(user)) &&
            helper.findPolicyByPolicyNo(policyNo).brokers.find(broker => broker.name === helper.findMyBoss(user)).brokerCanWithdraw) {
            console.log("isAllowedToWithdraw: " + (amount < db.brokerInfo[user].allowedWithdrawLimit).toString())
            return amount < db.brokerInfo[user].allowedWithdrawLimit
        } else {
            console.log("isAllowedToEdit: false")
            return false
        }
    }
)



// Rules
const isAuthenticated = rule({
    cache: 'contextual'
})(
    async (parent, args, ctx, info) => {
        console.log("isAuthenticated: "+ (db.users[ctx.user.name] !== null).toString())
        return db.users[ctx.user.name] !== null
    }, )

const isAdmin = rule({
    cache: 'contextual'
})(
    async (parent, args, ctx, info) => {
        console.log("isAdmin: "+ (ctx.user.role === 'admin').toString())
        return ctx.user.role === 'admin'
    },
)

const isBroker = rule({
    cache: 'contextual'
})(
    async (parent, args, ctx, info) => {
        console.log("isBroker: "+ (ctx.user.role === 'broker').toString())
        return ctx.user.role === 'broker'
    },
)


const isSubBroker = rule({
    cache: 'contextual'
})(
    async (parent, args, ctx, info) => {
        console.log("isSubBroker: "+ (ctx.user.role === 'sub-broker').toString())
        return ctx.user.role === 'sub-broker'
    },
)


const isInvestor = rule({
    cache: 'contextual'
})(
    async (parent, args, ctx, info) => {
        console.log("isInvestor: "+ (ctx.user.role === 'investor').toString())
        return ctx.user.role === 'investor'
    },
)


export {
    isAdmin,
    isBroker,
    isSubBroker,
    isInvestor,
    isAllowedToEdit,
    isAllowedToWithdraw,
    isAuthenticated, 
}