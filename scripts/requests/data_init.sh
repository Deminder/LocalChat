#!/bin/bash
./init_user.sh user123
./init_user.sh user456
./init_user.sh user789

./init_user.sh peter
CID=$(./init_conv.sh conv_peter '["user789","user456"]')
./msg/create.sh "$CID" 'hello this is a message from peter'

./init_user.sh karl
CID2=$(./init_conv.sh conv_karl '["user456", "user123"]')
./msg/create.sh "$CID2" 'hello this is a message from karl'
./users/invalidate.sh
./users/login.sh user456
./msg/create.sh "$CID2" 'me is user456 bot [hello to you back!]'
./users/invalidate.sh
./users/login.sh user123
./msg/create.sh "$CID2" 'me is user123 bot [hello to you back!]'


