pages=(
	"404.html"
	"faq.html"
	"contact.html"
	"privacy.html"
	"proxy.html"
	"licenses.html"
	"games/"
	"games/popular.html"
	"games/category.html"
	"games/player.html"
	"proxies/"
	"proxies/rh.html"
	"proxies/st.html"
	"proxies/uv.html"
	"proxies/flash.html"
	"settings/general.html"
	"settings/appearance.html"
	"settings/tabcloak.html"
)

npm run build

for i in "${pages[@]}"
do
	if [[ $i == */ ]]
	then
		mkdir -p ./build/$i
	else
		cp ./build/index.html ./build/$i
	fi
done