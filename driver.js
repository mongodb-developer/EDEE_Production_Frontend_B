/*
   Hi - If you are reading this you are looking behind the curtains of
   a demo of what driver coding looks  like - it's built using Atlas App Services
   serverless functions you need to use a real driver for the
   next step beyond playing with this jsfiddle - which you will use from node
   or java or python or dozens of other languages  not from browser JS,
   you use it to write the services you call fron the browser. */

class MongoClient {

    constructor(URI) {
        this.connected = false;
        this.lastError = ""
        const regEx = /^mongodb\+srv:\/\/(.*?):(.*?)@/
        const getCreds = URI.match(regEx)
        if (getCreds && getCreds.length == 3) {
            this.userName = getCreds[1]
            this.passWord = getCreds[2]
        }

        
    }

    getDatabase(dbName) {
        const db = new MongoDatabase(dbName, this)
        return db;
    }

    async connect() {
        if (this.connected) { return true }
        //TODO error message
        if (this.userName == null || !this.passWord == null) {
            this.lastError = "Invalid Credentials"
            return false
        }

        //This is weirdly critical as JSFiddle clears the session cookies each time
        //So anonymous users aren't retained we also want to be able to get back to our data
        const realmApp = new Realm.App({ id: 'mongodb-qdthj' });
        const credential = Realm.Credentials.emailPassword(this.userName, this.passWord)
        try {
            this.user = await realmApp.logIn(credential)
            this.lastError = "Existing User Authenticated"
            this.connected = true;
            return true;
        } catch (e) {
            //On error try to regiuster as new user
            try {
                const deets = { email: this.userName, password: this.passWord }
                await realmApp.emailPasswordAuth.registerUser(deets);
                this.user = await realmApp.logIn(credential);
                this.lastError = "New User Created"
                this.connected = true;
                return true;
            } catch (e) {
                this.lastError = e;
                return false;
            }
        }

    }

}
class MongoDatabase {
    constructor(dbName, client) {
        this.mongoClient = client;
        this.dbName = dbName
    }

    getCollection(collName) {
        const coll = new MongoCollection(collName, this.dbName,this.mongoClient)
        return coll
    }
}

class MongoCollection {
    constructor(collName,dbName,mongoClient) {
        this.collName = collName;
        this.dbName = dbName;
        this.mongoClient = mongoClient
    }

    async insertOne (document) {
        if (!await this.mongoClient.connect()) return { ok: false, lastError }
        const rval = await this.mongoClient.user.functions.insert(this.dbName, this.collName, [document])
        return rval
    }

    async insertMany (documents) {
        if (!await this.mongoClient.connect()) return { ok: false, lastError }
        const rval = await this.mongoClient.user.functions.insert(this.dbName, this.collName, documents)
        return rval
    }

    async  find (query, projection) {
        if (!await this.mongoClient.connect()) return { ok: false, lastError }
        //TODO - Make this return a 'cursor like thing'
        const rval = await this.mongoClient.user.functions.find(this.dbName, this.collName, query, projection, 10000)
        return rval.result
    }

    async  findOne (query, projection) {
        if (!await this.mongoClient.connect()) return { ok: false, lastError }

        const rval = await this.mongoClient.user.functions.find(this.dbName, this.collName, query, projection, 1)
        console.log(rval)
        if (rval.result && rval.result.length > 0) return rval.result[0]
        return null;
    }

    async  updateMany (query, updates) {
        if (!await this.mongoClient.connect()) return { ok: false, lastError }

        const rval = await this.mongoClient.user.functions.update(this.dbName, this.collName, query, updates)
        return rval;
    }
    async  updateOne (query, updates) {
        if (!await this.mongoClient.connect()) return { ok: false, lastError }

        const rval = await this.mongoClient.user.functions.update(this.dbName, this.collName, query, updates, true)
        return rval;
    }

    async  deleteMany (query) {
        if (!await this.mongoClient.connect()) return { ok: false, lastError }
        const rval = await this.mongoClient.user.functions.delete(this.dbName, this.collName, query)
        return rval;
    }

    async  deleteOne (query) {
        if (!await this.mongoClient.connect()) return { ok: false, lastError }

        const rval = await this.mongoClient.user.functions.delete(this.dbName, this.collName, query, true)
        return rval;
    }
    async  aggregate (pipeline) {
        if (!await this.mongoClient.connect()) return { ok: false, lastError }
        //TODO - Make this return a 'cursor like thing'
        const rval = await this.mongoClient.user.functions.aggregate(this.dbName, this.collName, pipeline)
        return rval.result
    }

    async  countDocuments (query) {
        if (!await this.mongoClient.connect()) return { ok: false, lastError }

        const rval = await this.mongoClient.user.functions.count(this.dbName, this.collName, query)
        return rval.result
    }
}

class MongoCursor {

}

