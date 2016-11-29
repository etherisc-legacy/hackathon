## Etherisc Insurance Simulator
A Python based simulation of the Etherisc basic insurance risk model.

Author: @jbrukh  
Email: jake@coinfund.io

### Installation

Developed on Python 3.5. Use `pip` to install:

    pip install .
    
### Upgrading

    pip install . --upgrade
    
### Simple model

Run the simple model:

    ./etherisc-simple-model.py

This model simulates incoming premiums and outgoing payouts over time, modeled as a Poisson distribution. At each round, we use a simple insurance model which assumes a constant payout across all policies and a single probability of insurable events.

### Variable payouts model

In the variable payouts model, we accept as input a vector of event probabilities and a vector of desired payouts. The model calculates the collateral required for the portfolio and the premiums corresponding to the payouts.

To see one round of estimation for the model (with randomly generated probabilities and premiums), run:

    ./etherisc-variable-payouts.py --estimate

You can also adjust the number of events `-n` and the `--average-payout`:

    ./etherisc-variable-payouts.py --estimate -n 100 --average-payout 300
