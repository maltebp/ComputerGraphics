# Bash script to build the compiled TypeScript, all html
# and css into the target 'out' folder.

# Stop script if any command fails
set -e

printf "Cleaning 'out' folder...\n"
rm -rf out
mkdir out

printf "Copying HTML, JavaScript and resources...\n"
# rsync -a website/ out --exclude *.ts
cd website
cp -r `ls -A | grep -v "*.ts"` ../out


printf "Building TypeScript...\n"
tsc
cd ..

printf "Done!"