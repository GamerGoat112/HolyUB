echo You need ImageMagick installed and added to your path to use this script.

categories=( "social" "html5" "ports" "gba" "genesis" "nes" )

mkdir ./src/assets/thumbnails/ 2> /dev/null

cd game-thumbnails
	for category in "${categories[@]}"
	do
		cd $category
			echo Converting * in $category
			convert +append ./* ../../src/assets/thumbnails/$category.png
		cd ..
	done
cd ..