#!/usr/bin/env python

# -*- coding: utf-8 -*-
# @Author: Jake Brukhman
# @Date:   2016-11-21 21:27:48
# @Last Modified by:   Jake Brukhman
# @Last Modified time: 2016-11-25 22:12:17

from etherisc.insurance import InsurancePool
from etherisc.multipayouts import VariablePool
from numpy.random import poisson
from random import random
import numpy as np
from scipy.stats import norm, uniform

def start(p = 0.05, P=100, lam=10):
  """
  Pool simulation.
  """

  pool = InsurancePool(p, P, seed=1000)
  
  for i in range(1000):
    # assume policies come in with a Poisson
    # distribution at a certain rate per day
    if i % 2 == 0:
      policies = poisson(lam=lam)
      for _ in range(policies):
        pool.issue()

    else:    
      arrivals = policies
      for _ in range(arrivals):
        rnd = random()
        if pool.n > 0:
          if rnd < p:
            pool.claim()
          else:
            pool.expire()
        else:
          break


    # pool.p = pool.claims / pool.issued

    print(pool)
    input('---> press any key to continue\n')

def start2():
  pool = VariablePool()

  for i in range(1000):
    payout = norm.rvs(loc=500, scale=50)
    prob   = uniform.rvs(1) / 100
    pool.issue(payout, prob=prob)

if __name__ == '__main__':
  start2()