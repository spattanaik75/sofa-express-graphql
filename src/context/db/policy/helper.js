
const policyInfo = require('./db').policyInfo

export const findPolicyByName = (name) => {
    return policyInfo.find((policy) => {
        return policy.name === name
    })
}
export const findPolicyByPolicyNo = (policyNo) => {
    return policyInfo.find((policy) => {
        return policy.policyNo === policyNo
    })
}

export const isValidPolicy = (policyNo) => {
    return findPolicyByPolicyNo(policyNo);
}
