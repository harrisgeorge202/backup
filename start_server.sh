export MAIL_URL='smtp://numistreetsandbox%40gmail.com:numistreet123%231@smtp.gmail.com:465/';
kill `lsof -t -i:3000`
export MONGO_URL=mongodb://192.168.2.56:27017/meteor
export ROOT_URL='http://localhost:3000'
export PORT=3000
echo "SERVER PORT: $PORT"
meteor --settings settings.json &
# meteor --port 3000 &
echo "server starting, visit $ROOT_URL"






