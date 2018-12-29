# buergermap_OSM
Project to visualize local specific features contained within the OpenStreetMap database based on the OSM map.

## Current version 29.12.2019
- MVP shows the OSM map for Karben with a green dot for garbage cans and a red dot for OSM tag vending:excrement_bags

# Hardware / VM
- f1-micro (1 vCPU, 0,6 GB Speicherplatz) 
- HTTP firewall rule enabled
- Debian GNU/Linux 9 (stretch) - 10GB

# Setup of machine

sudo apt-get install curl
```
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt install nodejs
sudo apt-get install build-essential nodejs
```
Check of install was successfull
```
node --version
npm --version
```

create project directory
```
mkdir <project name>
cd <project name>
npm install ol
npm install --save-dev parcel-bundler
```

Initialize npm project
```
cd <project name>
npm init
```
add the following to the package.json file
```
cd <project name>
nano package.json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "parcel index.html",
    "build": "parcel build --public-url . index.html"
  }
```

#To start test
```
cd <project name>
npm start
```
>> a port is provided (e.g. localhost:1234) if successfull. connect to it to test your first result

#Create a production version
```
cd <project name>
npm run-script build
sudo cp dist/* /var/www/html/
```

#to pull from git
```
cd <project name>
git pull https://github.com/pandabear-de/buergermap_OSM.git
```
#to start, stop, restart, status apache2
```
sudo systemctl start apache2.service
sudo systemctl stop apache2.service
sudo systemctl restart apache2.service
sudo systemctl status apache2.service
```
