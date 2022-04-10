pages=( "404.html" "support.html" "theatre.html" "contact.html" "privacy.html" "proxy.html" "opensource.html" )

npm run build

for i in "${pages[@]}"
do
	cp ./build/index.html ./build/$i
done