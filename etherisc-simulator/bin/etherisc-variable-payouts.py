#!/usr/bin/env python

# -*- coding: utf-8 -*-
# @Author: Jake Brukhman
# @Date:   2016-11-26 11:29:18
# @Last Modified by:   Jake Brukhman
# @Last Modified time: 2016-11-28 19:28:30

import numpy as np

from etherisc.variable import VariablePool, VariableEstimator
from scipy.stats import uniform, norm
from optparse import OptionParser

def estimate(ps=None, Ps=None, n=10, Pa=500, seedcapital=0):
  
  # get a vector of probabilities
  if not ps:
    ps = uniform.rvs(size=n) / 10
  if not Ps:
    Ps = abs(norm.rvs(loc=Pa, scale=50, size=n))

  print('n:  %s' % n)
  print('ps: %s' % ps)
  print('Ps: %s' % Ps)

  estimator = VariableEstimator(ps=ps, Ps=Ps, seedcapital=seedcapital)
  print(estimator)

def simulate():
  pass


if __name__ == '__main__':
  parser = OptionParser()
  parser.add_option('--estimate', help='do one estimation of the model', action='store_true')
  parser.add_option('-n', help='size of the probability vector to generate', default=10, type='int')
  parser.add_option('--average-payout', help='average payout', type='int', default=500)
  parser.add_option('--seed', help='estimate with seed capital', type='float', default=0.0)
  (opts, args) = parser.parse_args()

  np.set_printoptions(precision=3, suppress=True)

  if opts.estimate:
    estimate(n=opts.n, Pa=opts.average_payout, seedcapital=opts.seed)
  else:
    parser.print_help()