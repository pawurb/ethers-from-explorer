echo "Watching files"
fswatch -or main.js test | xargs -n1 -I{} npm run test

