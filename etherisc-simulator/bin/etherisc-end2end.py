#!/usr/bin/env python

# -*- coding: utf-8 -*-
# @Author: Jake Brukhman
# @Date:   2016-11-27 19:04:37
# @Last Modified by:   Jake Brukhman
# @Last Modified time: 2016-11-28 19:22:49

from etherisc.end2end import Etherisc, ExcessRiskPool
from scipy.stats import poisson

import numpy as np

def start(saledepth=1.0):
  """
  saledepth:   fraction of supply assumed sold at crowdsale
  seedpct:     how much of the required average collateral to seed from sale proceeds
  """
  np.set_printoptions(precision=3, suppress=True)
  etherisc = Etherisc()

  print('=== Etherisc Desired Parameters ===')
  print(etherisc)

  print('=== Crowdsale Parameters ===')
  rscsupply = etherisc.crowdsale()
  print(rscsupply)
  
  print('=== Crowdsale Outcome ===')
  proceeds = rscsupply.proceeds(saledepth)
  print("""
    supply on offer:        %12.2f
    supply sold:            %12.2f%%
    proceeds:              $%12.2f
  """ % (rscsupply.supplyonoffer(), saledepth * 100, proceeds))

  eriskpool = ExcessRiskPool(tokens=saledepth * rscsupply.supply(), collateral=proceeds)

if __name__ == '__main__':
  start(saledepth=1)