#!/bin/sh

export PATH=/usr/local/bin:$PATH
forever start /Users/omar_juarez/Documents/WebDev/Phaser/Phaser-Test6/game/server.js > /dev/null;
sleep 10s;
open /Users/omar_juarez/Documents/WebDev/Phaser/Phaser-Test6/StartupScripts/webapp.app;
