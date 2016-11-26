# -*- coding: utf-8 -*-
# @Author: Jake Brukhman
# @Date:   2016-11-25 20:50:53
# @Last Modified by:   Jake Brukhman
# @Last Modified time: 2016-11-26 12:16:08

import numpy as np
from scipy.stats import binom
from scipy.stats.mstats import mquantiles

class VariableEstimator():

  """
  An insurance model estimator for a model with
  variable payouts and event probabilities, as
  described: 

  https://www.sharelatex.com/project/582f437341592a79643495e3
  """

  def __init__(self, ps, Ps, pi=.9999, N=100000):
    """
    Inputs:

      ps             a vector of event probabilities
      Ps             a vector of desired payouts
      pi             desired confidence level
      N              iterations for Monte Carlo simulation

    Outputs:
      
      C              required capitalization
      L              total liability
      Pr             a vector of corresponding premiums
      r              return multiple
    """

    self.ps  = np.array(ps)      
    self.Ps = np.array(Ps)       
    self.pi = pi                 
    self.N  = N               

    if len(ps) != len(Ps):
      raise Exception('len(p) != len(Ps)')

    self.__calculate()

  def __calculate(self):

    self.n  = len(self.ps)

    # payout liability mean and stdev
    self.mu = np.sum(self.ps * self.Ps)
    self.sd = np.sqrt(np.sum(self.Ps**2 * (1 - self.ps) * self.ps))

    # total liability
    self.L  = np.sum(self.Ps)

    # do a Monte Carlo simulation to find C, collateral
    m = np.matrix([binom.rvs(1, p, size=self.N) for p in self.ps])
    samples = np.array(self.Ps * m)
    self.C = mquantiles(samples, prob=[self.pi], alphap=1, betap=1) # Type 7

    # calculate the premiums
    self.Pr = self.Ps / self.L * self.C

    # return multiple
    self.r  = self.L / self.C

  def __str__(self):
    m = np.matrix((range(self.n), self.ps, self.Pr, self.Ps)).getT()
    return """
      mu:  %0.2f
      sd:  %0.2f
      L:   $%0.2f
      C:   $%0.2f
      r:   %0.2f

      out:\n%s
    """ % (self.mu, self.sd, self.L, self.C, self.r, m)

class VariablePool():

  def __init__(self, ps=[], Ps=[], pi=.9999, N=100000):
    self.ps  = ps
    self.Ps = Ps
    self.pi = pi
    self.N  = N
    self.C  = 0
  
  def issue(self, payout, prob=None, index=None):
    if prob:
      self.ps = np.append(self.ps, prob)
      self.Ps = np.append(self.Ps, payout)
      index = -1
    elif index:
      self.Ps[index] += payout
    else:
      raise Exception('must provide prob or index')

    estimator = VariablePayoutsEstimator(self.ps, self.Ps, self.pi, self.N)
    print('* issuing policy @ %0.2f paying %0.2f (r=%0.2f)' % (estimator.Pr[index], estimator.Ps[index], estimator.Ps[index] / estimator.Pr[index]))

    self.C += estimator.Pr[index]
    self.L = estimator.L