# -*- coding: utf-8 -*-
# @Author: Jake Brukhman
# @Date:   2016-11-21 21:23:13
# @Last Modified by:   Jake Brukhman
# @Last Modified time: 2016-11-21 21:32:23

from distutils.core import setup

setup(name='etherisc-simulator',
  version='0.0.3',
  description='a Python simulator for Etherisc decentralized insurance models',
  author='Jake Brukhman',
  author_email='jake@coinfund.io',
  url='http://github.com/etherisc/hackathon/etherisc-simulator',
  packages=['etherisc'],
  scripts=['bin/etherisc-sim.py'],
  install_requires=[
    'numpy',
    'scipy'
  ],
)