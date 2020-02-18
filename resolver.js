const WITHDRAWAL_EVENT = "373067d876795b5ef439839132055b09";

module.exports = {
  Query: {
    getContract: (parent, args, ctx) => {
      
      return {
        "name": "hugo",
        "policyNo": "851105212",
        "password": "hugo123",
        "policyValue": 880452.34,
        "brokers": [{
            "name": "anthony",
            "brokerCanEdit": true,
            "brokerCanWithdraw": true
        }]
    }
    },

  },
  Mutation: {
    editContract: (parent, {policyNo, amount}) => {
      return "success";
    },

    withdrawContract: (parent, {policyNo, amount}, {pubsub}) => {
      pubsub.publish(WITHDRAWAL_EVENT, 
        {
          newWithdrawal : {
              policyNo : policyNo,
              amount: amount
          }
        }
      )
      return "success";
    },

    deleteContract: (_, {policyNo}) => {
      return "success";
    },
    

  },
  Subscription: {
    newWithdrawal:{
      subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator(WITHDRAWAL_EVENT)
    }
  }
};