#!/bin/sh
git archive --format=tar --prefix=$1/ $1 | (tar xf -)
echo "<li><a href='$1/application.html'>$1</a></li>" >> index.html
