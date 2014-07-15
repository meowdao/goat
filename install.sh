#!/bin/bash

npm install
bower install

wget http://www.unicode.org/Public/cldr/latest/json.zip
unzip json.zip -d dist/vendors/cldrjs/dist/cldr
rm json.zip