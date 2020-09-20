#!/bin/bash
USERNAME=${1:-user789}
PASSWORD=12345678

function grepUIDByName {
    grep -oP '"id":\d+,"username":"'$1'"' | grep -oP '\d+' | head -n 1
}

./users/invalidate.sh
./users/register.sh $USERNAME $PASSWORD || return "register for $USERNAME failed!"

# login as admin
./users/login.sh 
USERID=$(./users/list-disabled.sh 2> /dev/null | grepUIDByName $USERNAME)
if [ -z $USERID ]; then
    echo "USERID not found!"
    exit 1
fi
./users/enable.sh $USERID
./users/invalidate.sh

## login as new user
./users/login.sh $USERNAME $PASSWORD
./users/self.sh
