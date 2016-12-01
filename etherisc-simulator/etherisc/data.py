# -*- coding: utf-8 -*-
# @Author: Jake Brukhman
# @Date:   2016-12-01 15:25:37
# @Last Modified by:   Jake Brukhman
# @Last Modified time: 2016-12-01 16:32:09

import numpy as np
import pandas as pd

class FlightCsvLoader():
  """
  Load flight delay data in CSV format.
  """
  def __init__(self, filename):
    self._filename = filename

  def extract(self):
    """
    Return the flight delay data as a properly
    formatted pandas DataFrame.
    """

    df = pd.read_csv(self._filename)
    labels = df.apply(lambda x: '%s_%s_%s_%s' % (x['airlineFsCode'], x['flightNumber'], x['departureAirportFsCode'], x['arrivalAirportFsCode']),
      axis = 1
    )
    df = 1.0 - df[[
      'ontimePercent'
    ]]
    df.index = labels
    df.columns = ['probs']
    return df

