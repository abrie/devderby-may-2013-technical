#!/bin/bash
rm -rf output
mkdir output
cp paper.html result.html
git tag | xargs -n1 sh -c './replaceTagWithCommit.sh $0 < result.html > result.html.1 && mv result.html.1 result.html'
mv result.html output/paper.html
cp *.png output
