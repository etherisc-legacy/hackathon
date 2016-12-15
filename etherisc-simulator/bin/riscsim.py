#!/usr/bin/env python

# -*- coding: utf-8 -*-
# @Author: Jake Brukhman
# @Date:   2016-11-30 20:43:17
# @Last Modified by:   Jake Brukhman
# @Last Modified time: 2016-12-15 16:00:24

"""
riscsim.py
Etherisc decentralized insurance model simulator.

Usage:
  riscsim.py estimatedata FILENAME [-p PAYOUT] [-r SAMPLESIZE] [--minprob MINPROB] [--maxprob MAXPROB]
  riscsim.py simulate FILENAME [-p PAYOUT] [--minprob MINPROB] [--maxprob MAXPROB] [--auxcapital AUXCAP]

Options:
  -p, --payout PAYOUT        the average payout parameter [default: 500]
  -r, --random SAMPLESIZE    select a random sample of events [default: 0]
  -m, --minprob MINPROB      set the minimum event probability we're willing to underwrite [default: 0.001]
  -M, --maxprob MAXPROB      set the maximum event probability we're willing to underwrite [default: 0.20]
  -c, --auxcapital AUXCAP    set the initial capital seeded to the insurance contract [default: 0.0]
"""

from docopt import docopt
from etherisc.output import estimatedata, simulate

import numpy as np

def main(args):
  """
  Interpret arguments and deploy.
  """
  payout        = int(args['--payout'])
  samplesize    = int(args['--random'])
  minprob       = float(args['--minprob'])
  maxprob       = float(args['--maxprob'])
  auxcapital    = float(args['--auxcapital'])

  if args['estimatedata']:
    """
    Estimate the Etherisc credit model from a CSV file.
    """
    estimatedata(args['FILENAME'], payout=payout, randomsample=samplesize,
      minprob=minprob, maxprob=maxprob)

  elif args['simulate']:
    """
    Simulate Etherisc.
    """
    simulate(args['FILENAME'], payout=payout, maxprob=maxprob, minprob=minprob, auxcapital=auxcapital)


def __settings():
  """
  Turn on default settings for the environment.
  """
  np.set_printoptions(precision=3, suppress=True)


if __name__ == '__main__':
  """
  Read the command line arguments.
  """
  args = docopt(__doc__)
  __settings()
  main(args)