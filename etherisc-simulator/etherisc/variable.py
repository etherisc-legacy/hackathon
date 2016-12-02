# -*- coding: utf-8 -*-
# @Author: Jake Brukhman
# @Date:   2016-11-25 20:50:53
# @Last Modified by:   Jake Brukhman
# @Last Modified time: 2016-12-02 11:00:05

import numpy as np
import pandas as pd

from scipy.stats import binom
from scipy.stats.mstats import mquantiles

class VariableEstimator():
  """
  An insurance model estimator for a model with
  variable payouts and event probabilities, as
  described here: 

  https://www.sharelatex.com/project/582f437341592a79643495e3
  """
  def __init__(self, ps, Ps, labels=None, pi=.9999, N=100000):
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

    # set the input parameters
    self.ps  = np.array(ps)      
    self.Ps  = np.array(Ps)       
    self.pi  = pi                 
    self.N   = N

    # set the labels
    if not labels:
      self.labels = range(len(ps))
    else:
      self.labels = labels

    # consistency check
    if len(ps) != len(Ps):
      raise Exception('len(p) != len(Ps)')
    if len(self.labels) != len(ps):
      raise Exception('len(p) != len(labels)')

    # calculate the model outputs
    self.__calculate()

  def __calculate(self):
    """
    Calculate the model outputs based on the input parameters.
    """

    # number of insurable events
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
    self.Pr = (self.ps * self.Ps) / (np.sum(self.ps * self.Ps)) * self.C

    # return multiple
    self.r  = self.L / self.C

    # revenue
    self.R  = self.C - self.mu

  def df(self):
    df = pd.concat([
      pd.DataFrame(self.ps), 
      pd.DataFrame(self.Pr), 
      pd.DataFrame(self.Ps)], 
      axis=1)
    df.index = self.labels
    df.columns = ['probs', 'premiums', 'payouts']
    df['r'] = df['payouts'] / df['premiums']
    return df

  def __str__(self):
    return """
      outputs:\n\n%s\n
      n:   %d
      mu:  %0.2f
      sd:  %0.2f
      L:   $%0.2f
      C:   $%0.2f
      %%:   %0.2f
      r:   %0.2f
      R:   $%0.2f
    """ % (self.df(), self.n, self.mu, self.sd, self.L, self.C, self.C / self.L * 100, self.r, self.R)