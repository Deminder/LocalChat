CONVERSATION_NAME=$1
MESSAGE=${2:-someMessage}

CID=$(./conv/list.sh | grep -oP $CONVERSATION_NAME)
./msg/create.sh "$CID" "$MESSAGE"
