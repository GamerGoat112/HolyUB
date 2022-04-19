pages=( "404.html" "support.html" "games.html" "contact.html" "privacy.html" "proxy.html" "licenses.html" "proxies/" "proxies/rh.html" "proxies/st.html" "proxies/uv.html" "proxies/flash.html" )

npm run build

for i in "${pages[@]}"
do
	if [[ $i == */ ]]
	then
		mkdir -p $i
	else
		cp ./build/index.html ./build/$i
	fi
done