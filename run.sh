
printf "Cleaning...\n"
rm -rf out

printf "Copying...\n"
rsync -a website/ out --exclude *.ts

printf "Building...\n"
cd website
tsc
cd ..