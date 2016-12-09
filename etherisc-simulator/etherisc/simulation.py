# -*- coding: utf-8 -*-
# @Author: Jake Brukhman
# @Date:   2016-12-03 16:24:30
# @Last Modified by:   Jake Brukhman
# @Last Modified time: 2016-12-08 21:07:37

from random import randint
from numpy import maximum
from etherisc.variable import EtheriscEstimator

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
    self.collateral = auxcapital

    # add a column for payouts to the data
    self.data['premium'] = 0.0
    self.data['payout'] = 0.0
    self.data['policies'] = 0

    # counter
    self.counter = 0


  def __changepayout(self, index, payoutdelta):
    """
    Add or subtract a payout amount from the portfolio event
    indexed at `index`.
    """
    self.data['payout'].iloc[index] += payoutdelta

  def __changepolicycount(self, index, policiesdelta):
    """
    Add or subtract a policy count from the portfolio event
    indexed at `index`.
    """
    self.data['policies'].iloc[index] += policiesdelta

  def __changepremium(self, index, premiumdelta):
    """
    Add or subtract premium information from the portfolio event
    indexed at `index`.
    """
    self.data['premium'].iloc[index] += premiumdelta

  def __getavgpremium(self, index):
    """
    Get the average premium for the event at this index.
    """
    return self.data['payout'].iloc[index] * self.data['prob'].iloc[index]

  def __eventkey(self, index):
    """
    Return the name of the event at `index`.
    """
    return self.data.index[index]

  def __recalcr(self):
    self.data['r'] = self.data['payout'] / self.data['premium']

  def __id(self):
    """
    Return a unique id.
    """
    self.counter += 1
    return self.counter

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
    eventkey = self.__eventkey(index)
    id       = self.__id()

    # set the payout
    self.__changepayout(index, payout)

    # count the number of policies
    self.__changepolicycount(index, 1)

    # estimate the model on the current data
    estimator = EtheriscEstimator(self.data)
    estimator.estimate()

    # find the premium
    premium = self.__getpremium(estimator, index)
    print('collateral: ', self.collateral, 'C: ', estimator.C, 'premium: ', premium, '\n')
    self.__changepremium(index, premium)
    self.collateral += premium
      
    print(estimator)
    print(self.data[self.data['payout'] > 0], '\n')
    
    # save the policy
    policy = Policy(id, eventkey, premium, payout)
    self.policies[id] = policy

    self.__recalcr()

    return policy

  def __getpremium(self, estimator, index):
    
    # if we are overcollateralized, just
    # give them the average premium for this
    # event
    if estimator.C <= self.collateral:
      return self.__getavgpremium(index)

    # get the excess
    return estimator.C - self.collateral

