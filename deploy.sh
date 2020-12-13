#!/usr/bin/env bash
USER=s185139
SERVER=login.gbar.dtu.dk
KEY="$SSH_KEY"

# Create target directory
ssh -i "$KEY" "$USER"@"$SERVER" "rm -rf ~/public_html/*" &&\
scp -r -i "$KEY" out/ "$USER"@"$SERVER":./public_html/thisisaveryhiddenfolder