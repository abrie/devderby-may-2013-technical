#!/bin/bash
#this rev-parse is for annotated tags
HASH=`git rev-parse --verify $1^{commit}`
PATTERN="{{hashFor_$1}}"
sed s/$PATTERN/$HASH/g < /dev/stdin
