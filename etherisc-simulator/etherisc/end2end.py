# -*- coding: utf-8 -*-
# @Author: Jake Brukhman
# @Date:   2016-11-27 18:12:50
# @Last Modified by:   Jake Brukhman
# @Last Modified time: 2016-11-28 19:25:40

from scipy.stats import norm, binom
from etherisc.variable import VariableEstimator
from random import random

import numpy as np

class RscSupply():
  """
  The RSC supply.
  """

  def __init__(self, supply=1000000, initialprice=1.05, preallocation=.10):
    self._supply         = supply
    self._preallocation  = preallocation
    self._initialprice   = initialprice

  def supply(self):
    """
    Return the current supply.
    """
    return self._supply

  def supplyonoffer(self):
    """
    Return the supply being sold at crowdsale.
    """
    return self._supply * (1.0 - self._preallocation)

  def valuation(self, price=None):
    """
    Return the valuation at crowdsale price, or a
    specified market price.
    """
    if not price:
      price = self._initialprice
    return self._supply * price

  def preallocvaluation(self, price=None):
    """
    Return the valutation of the team preallocation at
    crowdsale price, or a specified market price.
    """
    return self.valuation(price) * self._preallocation 

  def issue(self, qty, price):
    """
    Issue new RSC at the given price. Return
    the proceeds.
    """
    self._supply += qty
    return qty * price

  def buyback(self, qty, price):
    """
    Buy back RSC from the market at the given price
    and return the cost of the buy-back.
    """
    self._supply -= qty
    return qty * price

  def proceeds(self, saledepth):
    """
    Return the proceeds at crowdsale.
    """
    return self._initialprice * (1.0 - self._preallocation) * self._supply * saledepth

  def __str__(self):
    return """
      supply:               %12d
      preallocation:        %12.2f%%
      initial price:       $%12.4f
      crowdsale valuation: $%12.2f
      prealloc. valuation: $%12.2f
    """ % (self._supply, self._preallocation * 100, self._initialprice, self.valuation(), self.preallocvaluation())


class AverageRiskPool():
  
  def __init__(self, riskpool, pi=.9999, N=100000, seedcapital=0):
    self._pi = pi
    self._ps = []
    self._Ps = []
    self._C = seedcapital
    self._n = 0
    self._N = N
    self._riskpool = riskpool

  def n(self):
    """
    Get the number of events curerntly being insured.
    """
    return len(self._ps)

  def collateral(self):
    """
    Get the current collateral present in the pool.
    """
    return self._C

  def totalliability(self):
    """
    Get the total liability of the risk pool.
    """
    return np.sum(self._Ps)

  def excessliability(self):
    """
    Get the excess liability for long-tail coverage.
    """
    return np.sum(self._Ps) - self._C

  def issuepolicy(self, payout, prob=None, index=None):
    if prob:
      ps = np.append(self._ps, prob)
      Ps = np.append(self._Ps, payout)
    elif index:
      ps = np.copy(self._ps)
      Ps = np.copy(self._Ps)
      Ps[index] += payout
    else:
      raise Exception('must give index or prob')

    estimator = VariableEstimator(ps=ps, Ps=Ps, pi=self._pi, N=self._N)
    self._C += estimator.C
    self._ps = ps
    self._Ps = Ps

  def expirepolicy(self, index):
    self._ps = np.delete(self._ps, index)
    self._Ps = np.delete(self._Ps, index)
  
  def claimpolicy(self, index):
    self._C -= self._Ps[index]
    self.expirepolicy(index)
    # TODO: go to reinsurnace pool




class ExcessRiskPool():
  
  def __init__(self, tokens=0, collateral=0):
    self._tokens = tokens
    self._collateral = collateral

class Etherisc():

  def __init__(self, maxliability=1000000, avgpayout=500, avgp=.06, pi=.9999, saledepth=1):

    # parameters
    
    self._maxliability  = maxliability
    self._avgpayout     = avgpayout
    self._avgp          = avgp
    self._pi            = pi
    self._saledepth     = saledepth
    self._n             = None   # set by __estimate_excess_risk()
    self._C             = None   # estimated required collateral, set by __estimate_excess_risk()
    self._onoffer       = self.__estimate_excess_risk()


  def rscsupply(self):
    return self._rscsupply

  def requiredcollateral(self):
    return self._C

  def __str__(self):
    return """
      max policies:          %12d
      max liability:        $%12.2f
      avg payout:           $%12.2f
      avg p:                 %12.2f
      required collateral:  $%12.2f
      reinsurance on offer: $%12.2f
    """ % (self._n, self._maxliability, self._avgpayout, self._avgp, self._C, self._onoffer)

  def __estimate_excess_risk(self):
    # find the approximate number of policies
    self._n = int(self._maxliability / self._avgpayout)
    # find the approximate collateral required
    self._C = np.ceil(binom.ppf(self._pi, n=self._n, p=self._avgp)) * self._avgpayout
    # find the reinsurance on offer
    O = self._maxliability - self._C
    return O

  def crowdsale(self):
    supply = 1000000.0
    preallocation = .10
    price  = self._onoffer / ((1.0 - preallocation) * supply)
    self._rscsupply = RscSupply(supply=supply, initialprice=price, preallocation=preallocation)
    return self._rscsupply

  






