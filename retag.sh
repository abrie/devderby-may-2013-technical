#!/bin/sh
#Tag all the commits with an example_x; this is to be used after rebases.
git log --reverse --oneline | awk '{count++; print "example_" count-1 " " $1;}' | xargs -n2 sh -c 'git tag -a -m $0 $0 $1'
