#!/bin/bash

if [[ "$*" == "--yes" ]]
then
    echo "seting up a developing environment [CI mode]"
else
  read -p "This will clean this repo first and reinstall all depedencies. Do you wish to continue? (y/n) " yn

  case $yn in
      [Yy]* ) echo "\nseting up a developing environment";;
      [Nn]* ) exit;;
      * )
        echo "Please answer yes or no."
        exit;
      ;;
  esac
fi

echo "cleaning repo and (re)installing dependencies"
npm run clean
npm install

echo "building packages"
npm run build:ui
npm run build:client
npm run package:dev
