#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
    echo $DIR
    whoami

    echo "Looking for latest Firmware Bin"
    cd $DIR
    cd ../os/sleepy_binaries

    echo "Checking for firmware updates. Please Wait..."
    ls
    if git pull | grep -q "Already up to date"; then
        echo "Already up to date for sleepy_binaries!"
    else
        echo "sleepy_binaries repo updated!"
    fi

   
    # if sudo git pull | grep -q "fatal:"; then
    #     echo "Cound not Access Repo!"
    #     exit 0
    # fi

    

    echo "Updates Available!"
    # cd $DIR 
    # sudo ./UpdateFirmware.sh
    exit 1


