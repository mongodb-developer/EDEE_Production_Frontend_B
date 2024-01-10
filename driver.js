/*
   Hi - If you are reading this you are looking behind the curtains of
   a demo of what driver coding looks  like - it's built using Atlas App Services
   serverless functions you need to use a real driver for the
   next step beyond playing with this jsfiddle - which you will use from node
   or java or python or dozens of other languages  not from browser JS,
   you use it to write the services you call fron the browser. */

class Document {
    set(key, value) {
        this[key] = value
    }

    get(key) {
        return this[key]
    }


}

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
            this.lastError = "Invalid Credentials Supplied"
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
            console.log(e);
            //On error try to regiuster as new user
            try {
                const deets = { email: this.userName, password: this.passWord }
                await realmApp.emailPasswordAuth.registerUser(deets);
             
                this.user = await realmApp.logIn(credential);
                this.lastError = "New User Created"
                this.connected = true;
                return true;
            } catch (e) {
                this.lastError = "MongoDB Authentication fail: User exists but incorrect password"
                localStorage.clear();
                codeChanged = true;
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
        const coll = new MongoCollection(collName, this.dbName, this.mongoClient)
        return coll
    }
}

class MongoCollection {
    constructor(collName, dbName, mongoClient) {
        this.collName = collName;
        this.dbName = dbName;
        this.mongoClient = mongoClient
    }

    async insertOne(document) {
        if (!await this.mongoClient.connect()) throw new Error(this.mongoClient.lastError)
        const rval = await this.mongoClient.user.functions.insert(this.dbName, this.collName, [document])
        return rval
    }

    async insertMany(documents) {
        if (!await this.mongoClient.connect())throw new Error(this.mongoClient.lastError)
        const rval = await this.mongoClient.user.functions.insert(this.dbName, this.collName, documents)
        return rval
    }


    find(query, projection) {
        const findCursor = new MongoCursor("FIND", this.mongoClient, this.dbName, this.collName)
        findCursor._query = query
        findCursor._projection = projection
        return findCursor
    }

    async findOne(query, projection) {
        if (!await this.mongoClient.connect()) throw new Error(this.mongoClient.lastError)

        const rval = await this.mongoClient.user.functions.find(this.dbName, this.collName, query, projection, 1)
        console.log(rval)
        if (rval.result && rval.result.length > 0) return rval.result[0]
        return null;
    }

    async updateMany(query, updates) {
        if (!await this.mongoClient.connect()) throw new Error(this.mongoClient.lastError)

        const rval = await this.mongoClient.user.functions.update(this.dbName, this.collName, query, updates)
        return rval;
    }
    async updateOne(query, updates) {
        if (!await this.mongoClient.connect()) throw new Error(this.mongoClient.lastError)

        const rval = await this.mongoClient.user.functions.update(this.dbName, this.collName, query, updates, true)
        return rval;
    }

    async deleteMany(query) {
        if (!await this.mongoClient.connect()) throw new Error(this.mongoClient.lastError)
        const rval = await this.mongoClient.user.functions.delete(this.dbName, this.collName, query)
        return rval;
    }

    async deleteOne(query) {
        if (!await this.mongoClient.connect()) throw new Error(this.mongoClient.lastError)

        const rval = await this.mongoClient.user.functions.delete(this.dbName, this.collName, query, true)
        return rval;
    }
    aggregate(pipeline) {
        const aggCursor = new MongoCursor("AGGREGATE", this.mongoClient, this.dbName, this.collName)
        aggCursor._pipeline = pipeline
        return aggCursor
    }

    async countDocuments(query) {
        if (!await this.mongoClient.connect()) throw new Error(this.mongoClient.lastError)

        const rval = await this.mongoClient.user.functions.count(this.dbName, this.collName, query)
        return rval.result
    }
}

class MongoCursor {
    constructor(cursorType, mongoClient, dbName, collName) {
        this._cursorType = cursorType
        this.collName = collName
        this.dbName = dbName
        this.mongoClient = mongoClient
        this._limit = 10000
        this._query = undefined;
        this._projection = undefined
        this._results = undefined;
        this._position = undefined;
        this._exhaused = false;
        this._pipeline = null;
    }

    limit(x) {
        if (x > 10000) x = 10000;
        if (x < 0) x = 0;
        this.limit = x;
        return this;
    }

    [Symbol.asyncIterator]() {
        let cursor=this
        return {
            next: async function() {
                let doc = await cursor.next()
                if(doc == null) { return { done:true}}
                return { value: doc, done:false}
            }
        }
    }

    async next() {
        if (this._exhausted) {
            return null;
        }
        if (!this._results) {
            if (this._cursorType == "FIND") {
                await this.runFind();
            } else if (this._cursorType == "AGGREGATE") {
                await this.runAgg()
            }
        }

        if (this._results.error) {
            throw new Error("Database Error: " + this._results.error)
        }
        if (this._position >= this._results.length) {
            return null;
        }
        const doc = this._results?.result[this._position]
        this._position++;
        return doc;
    }

    async toArray() {
        if (this._exhausted) {
            throw new Error("Cursor Exhausted")
            return null;
        } else {
            if (this._cursorType == "FIND") {
                await this.runFind();
                if (this._results.error) {
                    throw new Error("Database Error: " + this._results.error)
                }
                cursor.exhaused = true;
                return this._results.result;
            }
            if (this._cursorType == "AGGREGATE") {
                await this.runAgg();
                if (this._results.error) {
                    throw new Error("Database Error: " +  this._results.error)
                }
                cursor.exhaused = true;
                return this._results.result;
            }
        }
    }

    async runFind() {
        console.log(this.mongoClient)
        if (!await this.mongoClient.connect()) throw new Error(this.mongoClient.lastError)
        this._results = await this.mongoClient.user.functions.find(this.dbName,
            this.collName, this._query, this._projection, this._limit)

        this._position = 0;

    }

    async runAgg() {

        if (!await this.mongoClient.connect()) throw new Error(this.mongoClient.lastError)
        this._results = await this.mongoClient.user.functions.aggregate(this.dbName,
            this.collName, this._pipeline)

        this._position = 0;


    }


}

