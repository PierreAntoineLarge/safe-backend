# safe

# Démarrer la BDD :

sudo apt update && sudo apt upgrade
sudo service mysql start

si problème :
sudo service mysql status

# Démarrer l'app':

ngrok http 3000

cd backendsafe
export HOST=0.0.0.0
npm run start

# During dev :

1. Go to postman
2. post on auth/login
3. copy paste token and put it in MyReactNative/app.js
4. ctrl s

cd MonAppReactNative
npx expo start --tunnel
r
