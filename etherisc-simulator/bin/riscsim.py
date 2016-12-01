#!/usr/bin/env python

# -*- coding: utf-8 -*-
# @Author: Jake Brukhman
# @Date:   2016-11-30 20:43:17
# @Last Modified by:   Jake Brukhman
# @Last Modified time: 2016-11-30 21:29:51

from optparse import OptionParser
from etherisc.variable import VariableEstimator

import numpy as np
import json

def start(opts):
  if opts.flightdata:
    with open(opts.flightdata) as fp:
      data = json.load(fp)
      inputs = {}
      for item in data:
        flight_id = '_'.join(item[0:4])

        try:
          arr = item[4]
        except IndexError:
          pass

        if arr:
          obj = arr[0]
          if type(obj) == dict:
            ontimePercent = obj.get('ontimePercent')
            if ontimePercent:
              inputs[flight_id] = 1 - ontimePercent
              
      print(inputs)
      ps = list(inputs.values())
      Ps = [opts.payout] * len(ps)
      estimator = VariableEstimator(ps=ps, Ps=Ps, labels = list(inputs.keys()))
      print(estimator)

if __name__ == '__main__':
  np.set_printoptions(precision=3, suppress=True)
  parser = OptionParser()
  parser.add_option('--flightdata', type=str, help='provide a JSON flight data file')
  parser.add_option('--payout', type=float, help='set a fixed payout amount', default=200)
  (opts, args) = parser.parse_args()
  start(opts)