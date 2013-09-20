#!/bin/sh
git archive --format=tar --prefix=$1/ $1 | (tar xf -)
echo "<a href='$1/application.html'>$1</a>" >> index.html
