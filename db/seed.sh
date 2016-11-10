mongo blog --eval "db.users.drop(); db.articles.drop();  db.repairDatabase()"
mongoimport --db blog --collection users --file ./db/users.json --jsonArray
mongoimport --db blog --collection articles --file ./db/articles.json --jsonArray