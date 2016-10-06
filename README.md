GOAT
====
[![Build Status](https://travis-ci.org/TrejGun/goat.svg?branch=master)](https://travis-ci.org/TrejGun/goat)

:)

To make the first build run:

install
```bash
cp ./configs/config.sample.js ./configs/config.js
npm install
```

run 
```bash
npm run start:pm2
```

test
```bash
npm run test test/test.js
```

or
```bash
NODE_ENV=test mocha test/test.js
```

eslint
```bash
npm run lint
```