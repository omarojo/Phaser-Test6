#!/bin/sh

export PATH=/usr/local/bin:$PATH
forever start /Users/omar_juarez/Documents/WebDev/Phaser/Phaser-Test6/game/server.js > /dev/null;
sleep 10s;
open -a /Applications/Google\ Chrome.app --args  --app="http://localhost:3000" --start-fullscreen
