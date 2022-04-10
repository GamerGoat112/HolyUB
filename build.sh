pages=( "404.html" "support.html" "games.html" "contact.html" "privacy.html" "proxy.html" "licenses.html" )

npm run build

for i in "${pages[@]}"
do
	cp ./build/index.html ./build/$i
done