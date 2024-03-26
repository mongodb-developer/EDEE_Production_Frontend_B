var databases = db.adminCommand('listDatabases').databases
for(d of databases) {
    if(d.name.match(/^[a-f0-9]{24}/)) {
        print(d.name)
        db.getSiblingDB(d.name).dropDatabase()
    }
}