import {
    shield,
    and,
    or,
    chain,
} from 'graphql-shield';

const rules = require('./rules')

export const authorize = shield({
    Query: {
        getContract: and(
            rules.isAuthenticated,
            or(
                rules.isBroker,
                rules.isInvestor,
                rules.isAdmin
            )
        ),
    },
    Mutation: {
        editContract: and(
            rules.isAuthenticated,
            or(
                and(rules.isBroker, rules.isAllowedToEdit),
                and(rules.isSubBroker, rules.isAllowedToEdit),
                rules.isInvestor,
                rules.isAdmin
            )
        ),
        withdrawContract: and(
            rules.isAuthenticated,
            or(
                and(rules.isBroker, rules.isAllowedToWithdraw),
                and(rules.isSubBroker, rules.isAllowedToWithdraw),
                rules.isInvestor,
                rules.isAdmin
            )
        ),
        deleteContract: chain(rules.isAuthenticated, rules.isAdmin)
    },
    Subscription: {
        newWithdrawal : rules.isAuthenticated
    },
    Contract: {
        password: rules.isInvestor, // only the owner can view hrules.is password
    }
}, {
    allowExternalErrors: true
})