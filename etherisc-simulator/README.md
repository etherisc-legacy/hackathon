## Etherisc Insurance Simulator
A Python based simulation of the Etherisc basic insurance risk model.

Author: @jbrukh  
Email: jake@coinfund.io

### Installation

Developed on Python 3.5. Use `pip` to install:

    pip install .
    
### Upgrading

    pip install . --upgrade
    
### Usage

The simulator runs as a single command line program called `riscsim.py`, which currently has the following functionality.

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

### Examples

Simulate the Etherisc insurance model with real flight delay data:

    riscsim.py estimatedata data/flightRatings.csv --payout 200

Cap the maximum event probability we're willing to underwrite:

    riscsim.py estimatedata data/flightRatings.csv --payout 200 --maxprob 0.10

Estimate the model on a smaller random subset of flights:

    riscsim.py estimatedata data/flightRatings.csv -r 30

