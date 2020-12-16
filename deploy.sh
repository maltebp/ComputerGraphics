#!/usr/bin/env bash

# Deploys the solutions onto my personal DTU student webpage

USER=s185139
SERVER=login.gbar.dtu.dk
KEY="$SSH_KEY"

# Create target directory
ssh -i "$KEY" "$USER"@"$SERVER" "rm -rf ~/public_html/*" &&\
scp -r -i "$KEY" out/ "$USER"@"$SERVER":./public_html/thisisaveryhiddenfolder