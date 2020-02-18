import merge from 'lodash/merge';
import * as broker from './broker/db'
import * as policy from './policy/db'
import * as user from './user/db'
import * as brokerHelper from './broker/helper'
import * as policyHelper from './policy/helper'
import * as userHelper from './user/helper'


export const db = merge(
    broker,
    policy,
    user
);

export const helper = merge(
    brokerHelper,
    policyHelper,
    userHelper
)
