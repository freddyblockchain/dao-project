release: sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
release: sudo chmod +x /usr/local/bin/docker-compose
release: sandbox/./sandbox up testnet
web: npm start