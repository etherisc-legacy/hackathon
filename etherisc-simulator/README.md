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
      riscsim.py estimaterandom [-n N] [-p PAYOUT]
      riscsim.py estimatedata FILENAME [-p PAYOUT] [-r SAMPLESIZE] [--minprob MINPROB] [--maxprob MAXPROB]


    Options:
      -n, --events N             the number of insurable events [default: 10]
      -p, --payout PAYOUT        the average payout parameter [default: 500]
      -r, --random SAMPLESIZE    select a random sample of events [default: 0]
      -m, --minprob MINPROB      set the minimum event probability we're willing to underwrite [default: 0.001]
      -M, --maxprob MAXPROB      set the maximum event probability we're willing to underwrite [default: 0.20]   

### Examples

Simulate the Etherisc insurance model with randomly generated data:

    riscsim.py estimaterandom --events 100 --payout 500

Simulate the Etherisc insurance model with real flight delay data:

    riscsim.py estimatedata data/flightRatings.csv --payout 200

Cap the maximum event probability we're willing to underwrite:

    riscsim.py estimatedata data/flightRatings.csv --payout 200 --maxprob 0.10

Estimate the model on a smaller random subset of flights:

    riscsim.py estimatedata data/flightRatings.csv -r 30

