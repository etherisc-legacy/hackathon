# -*- coding: utf-8 -*-
# @Author: Jake Brukhman
# @Date:   2016-11-30 22:01:55
# @Last Modified by:   Jake Brukhman
# @Last Modified time: 2016-12-03 16:22:46

from scipy.stats import norm, uniform
from etherisc.variable import VariableEstimator
from etherisc.data import extract_flight_csv

def estimaterandom(n=10, payout=500):
  """
  Print an estimate for the Etherisc credit model.
  """
  ps = uniform.rvs(size=n) / 10
  Ps = abs(norm.rvs(loc=payout, scale=50, size=n))

  estimator = VariableEstimator(ps=ps, Ps=Ps)
  print(estimator)


def estimatedata(filename, datatype='flightcsv', payout=500, randomsample=0, minprob=0.001, maxprob=0.20):
  """
  Load actual data for model estimation.
  """
  estimator = __estimatedata(filename, datatype=datatype, payout=payout, 
    randomsample=randomsample, minprob=minprob, maxprob=maxprob)
  print(estimator)


def __estimatedata(filename, datatype='flightcsv', payout=500, randomsample=0, minprob=0.001, maxprob=0.20):
  data = __loaddata(filename, datatype='flightcsv')
  if randomsample > 0:
    data = data.sample(randomsample)
  
  # get the model parameters
  probs = data['probs']
  payouts = [payout] * len(probs)
  labels = list(data.index)

  # estimate
  estimator = VariableEstimator(ps=probs, Ps=payouts, labels=labels)
  return estimator


def __loaddata(filename, datatype='flightcsv', minprob=0.001, maxprob=0.20):
  """
  Load event probability data.
  """
  if datatype is 'flightcsv':
    data = extract_flight_csv(filename, minprob=minprob, maxprob=maxprob)
    return data
  else:
    raise Exception('unknown datatype %s' % datatype)

def simulate(filename, datatype='flightcsv', payout=500 minprob=0.001, maxprob=0.20):
  data = 
  pass