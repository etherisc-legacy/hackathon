# -*- coding: utf-8 -*-
# @Author: Jake Brukhman
# @Date:   2016-11-25 20:50:53
# @Last Modified by:   Jake Brukhman
# @Last Modified time: 2016-12-15 15:58:04

import numpy as np
import pandas as pd

from scipy.stats import binom
from scipy.stats.mstats import mquantiles


class EtheriscEstimator():

  def __init__(self, data, pi=.9999, N=100000):
    """
    Initialize an Etherisc estimator.

      data          a pandas.DataFrame with 'prob' and 'payout' columns
      pi            desired confidence level of portfolio solvency
      N             number of Monte Carlo iterations to perform during
                    estimations
    """
    self.data = data
    self.pi   = pi
    self.N    = N

  def estimate(self):
    # get the event prob and payout vectors
    self.ps = np.array(self.data['prob'])
    self.Ps = np.array(self.data['payout'])

     # payout liability mean and stdev
    self.mu = np.sum(self.ps * self.Ps)
    self.sd = np.sqrt(np.sum(self.Ps**2 * (1 - self.ps) * self.ps))

    # total liability
    self.L  = np.sum(self.Ps)

    # do a Monte Carlo simulation to find C, collateral
    m = np.matrix([binom.rvs(1, p, size=self.N) for p in self.ps])
    samples = np.array(self.Ps * m)
    self.C = mquantiles(samples, prob=[self.pi], alphap=1, betap=1) # Type 7

    self.data['premium'] = (self.ps * self.Ps) / (np.sum(self.ps * self.Ps)) * self.C

    # return multiple
    self.r  = self.L / self.C
    self.c  = self.C / self.L

    # revenue
    self.R  = self.C - self.mu

  def __str__(self):
    return """
      n:   %d
      mu:  %0.2f
      sd:  %0.2f
      L:   $%0.2f
      C:   $%0.2f
      %%:   %0.2f
      r:   %0.2f
      R:   $%0.2f
    """ % (len(self.data), self.mu, self.sd, self.L, self.C, self.c * 100, self.r, self.R)