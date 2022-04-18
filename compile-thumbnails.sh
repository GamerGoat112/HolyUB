categories=( "social" "html5" "ports" "gba" "genesis" "nes" )

mkdir ./src/assets/thumbnails/

cd game-thumbnails
	for category in "${categories[@]}"
	do
		cd $category
			convert +append ./* ../../src/assets/thumbnails/$category.png
		cd ..
	done
cd ..

# convert +append image_1.png image_2.png -resize x500 new_image_conbined.png