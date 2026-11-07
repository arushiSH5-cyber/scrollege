#!/bin/sh
# Saves your API keys into .env.local (git-ignored). Typing is hidden.
cd "$(dirname "$0")/.." || exit 1
printf "Paste your Anthropic key (starts with sk-ant-), then press Enter: "
stty -echo; read -r AK; stty echo; echo
if [ -z "$AK" ]; then echo "No Anthropic key entered. Nothing changed."; exit 1; fi
case "$AK" in sk-ant-*) ;; *) echo "That doesn't look like an Anthropic key (it should start with sk-ant-). Nothing changed."; exit 1;; esac
umask 077
{
  echo "ANTHROPIC_API_KEY=$AK"
  echo "DEMO_MODE=false"
} > .env.local
echo "✓ Saved to .env.local (only on this computer, never committed)."
echo "Now restart the app: press Ctrl-C in the dev server tab, then run: npm run dev"
