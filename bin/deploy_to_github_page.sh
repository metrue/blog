#!/bin/bash

git checkout master
cp -rf _site/* .
git add *
git commit -m "deploy"
git push
git checkout develop
