#!/usr/bin/env python

# -*- coding: utf-8 -*-
# @Author: Jake Brukhman
# @Date:   2016-11-30 20:43:17
# @Last Modified by:   Jake Brukhman
# @Last Modified time: 2016-11-30 22:05:30

"""
riscsim.py
Etherisc decentralized insurance model simulator.

Usage:
  riscsim.py estimaterandom [-n N] [-p PAYOUT]

Options:
  -n, --events N          the number of insurable events [default: 10]
  -p, --payout PAYOUT     the average payout parameter [default: 500]
"""

from docopt import docopt
from etherisc.output import estimaterandom

import numpy as np

def main(args):
  """
  Interpret arguments and deploy.
  """
  if args['estimaterandom']:
    """
    Estimate the Etherisc credit model.
    """
    n, payout = int(args['--events']), int(args['--payout'])
    estimaterandom(n=n, payout=payout)

  elif args['flightdata']:
    pass


def settings():
  """
  Turn on default settings for the environment.
  """
  np.set_printoptions(precision=3, suppress=True)


if __name__ == '__main__':
  """
  Read the command line arguments.
  """
  args = docopt(__doc__)
  settings()
  main(args)


# def start(opts):
#   if opts.flightdata:
#     with open(opts.flightdata) as fp:
#       data = json.load(fp)
#       inputs = {}
#       for item in data:
#         flight_id = '_'.join(item[0:4])

#         try:
#           arr = item[4]
#         except IndexError:
#           pass

#         if arr:
#           obj = arr[0]
#           if type(obj) == dict:
#             ontimePercent = obj.get('ontimePercent')
#             if ontimePercent:
#               inputs[flight_id] = 1 - ontimePercent

#       print(inputs)
#       ps = list(inputs.values())
#       Ps = [opts.payout] * len(ps)
#       estimator = VariableEstimator(ps=ps, Ps=Ps, labels = list(inputs.keys()))
#       print(estimator)
