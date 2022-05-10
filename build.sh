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
	"compat/"
	"compat/rh.html"
	"compat/st.html"
	"compat/uv.html"
	"compat/fl.html"
	"settings/"
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