# bot-status
 
Run local DB
```
docker rm -f mysql; \
docker run -d --name mysql \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=bot_status \
  -e MYSQL_USER=bot_status \
  -e MYSQL_PASSWORD=bot_status \
  mysql:8

# If there is a ER_NOT_SUPPORTED_AUTH_MODE error when accessing the DB, it will be necessary to run the following statement in the database: ALTER USER 'bot_status'@'%' IDENTIFIED WITH mysql_native_password BY 'bot_status'
```
