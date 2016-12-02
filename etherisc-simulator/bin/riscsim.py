#!/usr/bin/env python

# -*- coding: utf-8 -*-
# @Author: Jake Brukhman
# @Date:   2016-11-30 20:43:17
# @Last Modified by:   Jake Brukhman
# @Last Modified time: 2016-12-02 10:22:33

"""
riscsim.py
Etherisc decentralized insurance model simulator.

Usage:
  riscsim.py estimaterandom [-n=<N>] [-p=<PAYOUT>]
  riscsim.py estimatedata FILENAME [-p=<PAYOUT>] [-r=<SAMPLESIZE>]


Options:
  -n, --events=<N>              the number of insurable events [default: 10]
  -p, --payout=<PAYOUT>         the average payout parameter [default: 500]
  -r, --random=<SAMPLESIZE>     select a random sample of events [default: 0] 
"""

from docopt import docopt
from etherisc.output import estimaterandom, estimatedata

import numpy as np

def main(args):
  """
  Interpret arguments and deploy.
  """
  n             = int(args['--events'])
  payout        = int(args['--payout'])
  samplesize    = int(args['--random'])

  if args['estimaterandom']:
    """
    Estimate the Etherisc credit model.
    """
    estimaterandom(n=n, payout=payout)

  elif args['estimatedata']:
    """
    Estimate the Etherisc credit model from a CSV file.
    """
    estimatedata(args['FILENAME'], payout=payout, randomsample=samplesize)

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
  print(args)
  settings()
  main(args)