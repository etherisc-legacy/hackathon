# -*- coding: utf-8 -*-
# @Author: Jake Brukhman
# @Date:   2016-12-03 16:24:30
# @Last Modified by:   Jake Brukhman
# @Last Modified time: 2016-12-03 18:02:21

from random import randint

class EtheriscSimulator():

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
      return "{%d: $%0.2f @ $%0.2f / %s}" % (self.id, self.payout, self.premium, self.status)


  def __init__(self, data, auxcapital=0.0):
    """
    Initialize an Etherisc simulator.

    data        a dataframe of event probabilities
    """
    self.data = data          # all insuranble events
    self.policies = []
    self.collateral = 0.0
    self.auxcapital = 0.0

    # add a column for payouts to the data
    self.data['payouts'] = 0.0
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

    # get the active event/payouts data
    data = self.data[self.data['payouts'] > 0]
    estimator = VariableEstimator(ps=data['probs'], Ps=data['payouts'], labels=list(data.index))

    # find the premium
    premium = estimator.C - self.collateral

    # save the policy
    policy = Policy(id, eventkey, premium, payout)
    self.policies.append(policy)

    # add to collateral pool
    self.collateral += premium

    return policy