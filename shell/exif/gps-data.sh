

if [ -n "$1" ]; then
	exiftool -c '%.6f' $1 | grep GPS
else
	echo "Usage:"
	echo "    $0 ( PATH TO FILE )"
fi
