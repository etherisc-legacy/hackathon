#!/usr/bin/env python

# -*- coding: utf-8 -*-
# @Author: Jake Brukhman
# @Date:   2016-11-26 11:29:18
# @Last Modified by:   Jake Brukhman
# @Last Modified time: 2016-11-26 11:39:39

import numpy as np

from etherisc.variable import VariablePool
from scipy.stats import uniform, norm

def start(ps = None, Ps = None, n = 10):
  
  # get a vector of probabilities
  if not ps:
    ps = uniform.rvs(size=n) / 10
  if not Ps:
    Ps = norm.rvs(loc=500, scale=50, size=n)

  np.set_printoptions(precision=3)

  print('n:  %s' % n)
  print('ps: %s' % ps)
  print('Ps: %s' % Ps)


if __name__ == '__main__':
  start()