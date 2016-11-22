from scipy.stats import norm
from numpy import sqrt, ceil, maximum

class BernoulliEstimator():
  """
  Estimator for calculating premiums and/or payouts for a 
  basic Bernoulli distribution insurance model based on:

    * http://bit.ly/2g8fj7r
  
  """
  def __init__(self, p, n=0, pi=.9999, P=None, P0=None):
    """
      Inputs:

        p:   probability of claim
        n:   number of obligors
        pi:  desired confidence level for solvency
        P:   payout (optional, fixed across all policies)
        P0:  premium (optional)

      Outputs:
      
        mu:      expected number of claims
        sigma:   std deviation of claims
        z:       z-score corresponding to pi-confidence
        k:       number of claims to collateralize
        P or P0: payout or premium is an output
        r:       the return multiple of the policies in this pool
        L:       total liability of the pool      
    """
    self.n    = n
    self.p    = p
    self.pi   = pi
    self.P    = P
    self.P0   = P0
    self.__calculate()
      
  def __calculate(self):
    """
    Calculates all of the parameters of the model, given
    p, n, and either P or P0, and optionally pi.
    """
    self.mu     = self.n * self.p
    self.sigma  = sqrt(self.n * self.p * (1.0 - self.p))
    self.z      = norm.ppf(self.pi)
    self.k      = ceil(self.mu + self.z * self.sigma)

    if self.P:
      self.P0   = self.k / self.n * self.P
    elif self.P0:
      self.P    = self.n / self.k * self.P0
    else:
      raise Exception('need either P or P0')

    self.r      = self.P / self.P0
    self.L      = self.n * self.P

  def __str__(self):
    return """
      n:     %s
      p:     %s
      pi:    %s
      mu:    %s
      sigma: %s
      z:     %s
      k:     %s
      P0:    %s
      P:     %s
      r:     %s
      L:     %s
    """ % (self.n, self.p, self.pi, self.mu, self.sigma, self.z, self.k, self.P0, self.P, self.r, self.L)

class InsurancePool():
  """
  A perpetually rolling pool of insurance policies.
  """

  def __init__(self, p, P, seed=0, model=BernoulliEstimator):
    """
      p:     probability of insurable event
      P:     desired payout
      seed:  starting seed capital
    """
    self.n = 0
    self.p = p
    self.P = P
    self.L = 0
    self.cap = seed
    self.claims  = 0
    self.issued  = 0
    self.inbound = 0
    self.model   = model

  def issue(self):
    """
    Look at the current state of the pool, estimate the new 
    premium, and issue a new policy.
    """
    self.n += 1
    self.issued += 1

    # the effective number of collateralized policies
    # given the fact that we have seed capital
    eff_k = self.cap / self.P

    # estimate the premium taking into account total capital pool
    estimator = self.model(self.p, n=eff_k, P=self.P)

    self.cap += estimator.P0
    self.inbound += estimator.P0
    excess = self.cap - estimator.k * self.P
    
    print("* issued policy @ $%0.2f" % estimator.P0)

    self.L = self.n * self.P

  def claim(self):
    print('* policy claimed')
    self.n -= 1
    self.cap -= self.P
    self.claims += 1
    self.L -= self.P
    if self.cap < 0:
      raise Exception('* pool is insolvent')

  def expire(self):
    print('* policy expired')
    self.n -= 1
    self.L -= self.P

  def __str__(self):
    coll = 0 
    if self.L:
      coll = self.cap / self.L * 100
    excess = self.inbound - self.claims*self.P
    net = excess - self.L
    return """
      n:       %s
      P:       $%0.2f
      cap:     $%0.2f
      L:       $%0.2f
      coll %%:  %0.2f%%

      policies issued:   %-4d
      total $ collected: $%0.2f
      claims:            %-4d
      payouts:           $%0.2f
      sample p:          %0.4f
      excess capital:    $%0.2f
      net capital:       $%0.2f
    """ % (self.n, self.P, self.cap, self.L, coll, self.issued, self.inbound, \
      self.claims, self.claims*self.P, self.claims / self.issued, excess, net)
