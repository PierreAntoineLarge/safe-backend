# SAFE :

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

sur powershell :
cd MonAppReactNative
npx expo start --tunnel
(si cela ne fonctionne pas et affiche écran bleu, désinstaller expo go du mobile et télécharger l'apk recommandé)

NB : changer API_URL dans le back ET le front
