# -*- coding: utf-8 -*-
# @Author: Jake Brukhman
# @Date:   2016-11-30 22:01:55
# @Last Modified by:   Jake Brukhman
# @Last Modified time: 2016-12-01 16:24:17

from scipy.stats import norm, uniform
from etherisc.variable import VariableEstimator
from etherisc.data import FlightCsvLoader

def estimaterandom(n=10, payout=500):
  """
  Print an estimate for the Etherisc credit model.
  """
  ps = uniform.rvs(size=n) / 10
  Ps = abs(norm.rvs(loc=payout, scale=50, size=n))

  print('n:  %s' % n)
  print('ps: %s' % ps)
  print('Ps: %s' % Ps)

  estimator = VariableEstimator(ps=ps, Ps=Ps)
  print(estimator)

def estimatedata(filename, datatype='flightcsv'):
  """
  Load actual data for model estimation.
  """
  if datatype is 'flightcsv':
    loader = FlightCsvLoader(filename)
    data = loader.extract()
    print(data)
  else:
    raise Exception('unknown datatype %s' % datatype)

  # estimator = VariableEstimator(ps=data.probs(), Ps=data.payouts(), labels=data.labels())
  # print(estimator)