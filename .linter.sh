#!/bin/bash
cd /home/kavia/workspace/code-generation/secureauth-with-supabase-108584-ff48ae7a/secureauth_with_supabase
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

