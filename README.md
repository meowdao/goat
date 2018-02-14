GOAT
====

## Pre installation

mac
```bash
sudo port install nodejs8 npm4 mongodb mongodb-tools redis
```


ubuntu
```bash
# obtain pem key
chmod 400 coinswift.pem
ssh -i "goat.pem" ubuntu@ec2-XXX-XXX-XXX-XXX.compute-1.amazonaws.com

# configure EC2 instance
sudo groupadd www
sudo usermod -a -G www ubuntu
exit
sudo mkdir /var/www
sudo chown -R root:www /var/www
sudo chmod 2775 /var/www

# add source for node.js
curl -sL https://deb.nodesource.com/setup_8.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh

# install
sudo apt-get update

# production
sudo apt-get install nodejs redis-server mongodb nginx

sudo nano /etc/nginx/sites-available/default
sudo nginx -s reload
```

To make the first build run:

generate ssh key
```bash
ssh-keygen -t rsa -b 4096 -C "trejgun@gmail.com"
cat ~/.ssh/id_rsa.pub
```

clone repo
```bash
git clone git@bitbucket.org:trejgun/goat.git
```

install
```bash
cp ./server/shared/configs/mongo.sample.js ./server/shared/configs/mongo.js
cp ./server/shared/configs/config.sample.js ./server/shared/configs/config.js
npm i
```

run in dev mode
```bash
npm start
```

run in prod mode
```bash
npm run build
node_modules/.bin/pm2 start ecosystem.production.json
# or
NODE_ENV=production npm start
```

test
```bash
npm t
```

code coverage
```bash
npm run coverage
```

eslint
```bash
npm run lint
```
