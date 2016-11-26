# -*- coding: utf-8 -*-
# @Author: Jake Brukhman
# @Date:   2016-11-25 20:50:53
# @Last Modified by:   Jake Brukhman
# @Last Modified time: 2016-11-25 22:11:22

import numpy as np
from scipy.stats import binom
from scipy.stats.mstats import mquantiles

class VariablePayoutsEstimator():

  def __init__(self, p, Ps, pi=.9999, N=100000):
    self.p  = np.array(p)        # array of event probabilities
    self.Ps = np.array(Ps)       # array of corresponding desired payouts
    self.pi = pi                 # desired confidence level for solvency
    self.N  = N                  # Monte Carlo iterations

    if len(p) != len(Ps):
      raise Exception('len(p) != len(Ps)')

    self.__calculate()

  def __calculate(self):

    # payout liability mean and stdev
    self.mu = np.sum(self.p * self.Ps)
    self.sd = np.sqrt(np.sum(self.Ps**2 * (1 - self.p) * self.p))

    # total liability
    self.L  = np.sum(self.Ps)

    # do a Monte Carlo simulation to find C, collateral
    m = np.matrix([binom.rvs(1, p, size=self.N) for p in self.p])
    samples = np.array(self.Ps * m)
    self.C = mquantiles(samples, prob=[self.pi], alphap=1, betap=1) # Type 7

    # calculate the premiums
    self.Pr = self.Ps / self.L * self.C

    # return multiple
    self.r  = self.L / self.C

  def __str__(self):
    return """
      mu:  %0.2f
      sd:  %0.2f
      L:   $%0.2f
      C:   $%0.2f
      r:   %0.2f

      p:   %s
      Ps:  %s
      Pr:  %s
    """ % (self.mu, self.sd, self.L, self.C, self.r, self.p, self.Ps, self.Pr)

class VariablePool():

  def __init__(self, p=[], Ps=[], pi=.9999, N=100000):
    self.p  = p
    self.Ps = Ps
    self.pi = pi
    self.N  = N
    self.C  = 0
  
  def issue(self, payout, prob=None, index=None):
    if prob:
      self.p = np.append(self.p, prob)
      self.Ps = np.append(self.Ps, payout)
      index = -1
    elif index:
      self.Ps[index] += payout
    else:
      raise Exception('must provide prob or index')

    estimator = VariablePayoutsEstimator(self.p, self.Ps, self.pi, self.N)
    print('* issuing policy @ %0.2f paying %0.2f (r=%0.2f)' % (estimator.Pr[index], estimator.Ps[index], estimator.Ps[index] / estimator.Pr[index]))

    self.C += estimator.Pr[index]
    self.L = estimator.L