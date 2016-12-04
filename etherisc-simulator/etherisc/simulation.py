# -*- coding: utf-8 -*-
# @Author: Jake Brukhman
# @Date:   2016-12-03 16:24:30
# @Last Modified by:   Jake Brukhman
# @Last Modified time: 2016-12-03 19:45:00

from random import randint
from numpy import maximum
from etherisc.variable import VariableEstimator

import numpy as np

class Policy():
  """
  Simulate an Etherisc insurance policy.
  """
  def __init__(self, id, eventkey, premium, payout):
    self.id       = id
    self.eventkey = eventkey
    self.premium  = premium
    self.payout   = payout
    self.status   = 'valid'

  def expire(self, claim=False):
    """
    Expire a policy.

      claim     if True, the status is set to 'claimed'; otherwise 'expired'
    """
    if claim:
      self.status = 'claimed'
    else:
      self.status = 'expired'

  def __str__(self):
    """
    Return the policy as a string.
    """
    return "{%d/%s: $%0.2f @ $%0.2f / %s}" % (self.id, self.eventkey, self.payout, self.premium, self.status)

class EtheriscSimulator():

  def __init__(self, data, auxcapital=0.0):
    """
    Initialize an Etherisc simulator.

    data        a dataframe of event probabilities
    """
    self.data = data          # all insuranble events
    self.policies = {}
    self.collateral = 0.0
    self.auxcapital = 0.0

    # add a column for payouts to the data
    self.data['payouts'] = 0.0
    self.data['policies'] = 0
    self.ids = 0

  def underwrite(self, payout, index=None):
    """
    Underwrite a new policy, returning it.
    
      index       if provided, will underwrite against the `index`-th event
    """

    # use index, or random index to
    # select the event for which we
    # are underwriting
    if not index:
      index = randint(0, len(self.data) - 1)
    
    # get the event key and policy id
    eventkey = self.data.iloc[index].name
    id = self.ids
    self.ids += 1

    # set the payout
    self.data['payouts'][index] = self.data['payouts'][index] + payout

    # count the number of policies
    self.data['policies'][index] = self.data['policies'][index] + 1

    # get the active event/payouts data
    data = self.data[self.data['payouts'] > 0]

    # estimate the model on the current data
    estimator = VariableEstimator(ps=data['probs'], Ps=data['payouts'], labels=list(data.index))

    # find the premium
    premium = self.__getpremium(estimator, eventkey)
      
    print(estimator)
    
    # save the policy
    policy = Policy(id, eventkey, premium, payout)
    self.policies[id] = policy

    # add to collateral pool
    self.collateral += premium
    print('collat: ', self.collateral)

    return policy

  def __getpremium(self, estimator, eventkey):
    numpolicies = self.data['policies'].loc[eventkey]
    avgpremium  = estimator.df['premiums'].loc[eventkey] / numpolicies
    excess = estimator.C - self.collateral
    if excess < 0:
      return avgpremium
    return max(excess, avgpremium)

  def expire(self, policy, claim=False):
    policy.expire(claim)
    self.data['payouts'].loc[policy.eventkey] -= policy.payout
    self.data['policies'].loc[policy.eventkey] -= 1
    if claim:
      self.collateral -= policy.payout
    self.policies.pop(policy.id)
    return policy
