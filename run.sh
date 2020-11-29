# Stop script if any command fails
set -e

printf "Cleaning 'out' folder...\n"
rm -rf out

printf "Copying HTML, JavaScript and resources...\n"
rsync -a website/ out --exclude *.ts

printf "Building TypeScript...\n"
cd website
tsc
cd ..

printf "Done!"