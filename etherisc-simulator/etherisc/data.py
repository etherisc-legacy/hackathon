# -*- coding: utf-8 -*-
# @Author: Jake Brukhman
# @Date:   2016-12-01 15:25:37
# @Last Modified by:   Jake Brukhman
# @Last Modified time: 2016-12-01 16:42:26

import numpy as np
import pandas as pd


def extract_flight_csv(filename, minprob=0.001, maxprob=.20):
  """
  Return the flight delay data as a properly
  formatted pandas DataFrame.
  """
  df = pd.read_csv(filename)
  labels = df.apply(lambda x: '%s_%s_%s_%s' % (x['airlineFsCode'], x['flightNumber'], x['departureAirportFsCode'], x['arrivalAirportFsCode']),
    axis = 1
  )
  df = 1.0 - df[[
    'ontimePercent'
  ]]
  df.index = labels
  df.columns = ['probs']
  return df[(df['probs'] >= minprob) & (df['probs'] <= maxprob)]

