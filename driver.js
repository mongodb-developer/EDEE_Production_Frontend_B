/*
   Hi - If you are reading this you are looking behind the curtains of
   a demo of what driver coding looks  like - it's built using Atlas App Services
   serverless functions you need to use a real driver for the
   next step beyond playing with this jsfiddle - which you will use from node
   or java or python or dozens of other languages  not from browser JS,
   you use it to write the services you call fron the browser. */

/* TODO _ Make this multiple files */

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

    //Hello is used by a driver to learn about the server - it's available even without auth u
    async hello() {
        if (!await this.connect()) throw new Error(this.lastError)
        const rval = await this.user.functions.hello()
        return rval
    }
    async listDatabaseNames() {
        if (!await this.connect()) throw new Error(this.lastError)
        const rval = await this.user.functions.listDatabaseNames()
        return rval.result
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



    async listCollectionNames() {
        if (!await this.mongoClient.connect()) throw new Error(this.mongoClient.lastError)
        const rval = await this.mongoClient.user.functions.listCollectionNames(this.dbName)
        return rval.result
    }

    async drop() {
        if (!await this.mongoClient.connect()) throw new Error(this.mongoClient.lastError)
        const rval = await this.mongoClient.user.functions.dropDatabase(this.dbName)
        return rval
    }

    async createCollection(collName,options) {
        if (!await this.mongoClient.connect()) throw new Error(this.mongoClient.lastError)
        const rval = await this.mongoClient.user.functions.createCollection(this.dbName,collName,options)
        if(rval.result.ok == false) { throw new Error(JSON.stringify(rval))}
        return rval
    }
}



class MongoCollection {
    constructor(collName, dbName, mongoClient) {
        this.collName = collName;
        this.dbName = dbName;
        this.mongoClient = mongoClient
    }

    async createSearchIndex(name, definition) {
        if (!await this.mongoClient.connect()) throw new Error(this.mongoClient.lastError)
        const rval = await this.mongoClient.user.functions.createSearchIndex(this.dbName, this.collName, name, definition)
        if (rval.error) { throw new Error(rval.error) }

        return {ok:rval.ok,indexesCreated:rval.indexesCreated}
    }

    async listSearchIndexes() {
        if (!await this.mongoClient.connect()) throw new Error(this.mongoClient.lastError)

        const pipeline = [ { $listSearchIndexes : {}}]

        const rval = await this.mongoClient.user.functions.aggregate(this.dbName,
            this.collName, pipeline)
        for(let i of rval.result) {
            delete i.statusDetail // TMI
        }
        return rval.result;
    }



    async listIndexes(name, definition) {
        if (!await this.mongoClient.connect()) throw new Error(this.mongoClient.lastError)
        const rval = await this.mongoClient.user.functions.listIndexes(this.dbName, this.collName)
        if (rval.error) { throw new Error(rval.error) }
        return rval.cursor?.firstBatch
    }

    async dropSearchIndex(index) {
        console.log(index)
        if (!await this.mongoClient.connect()) throw new Error(this.mongoClient.lastError)
        const rval = await this.mongoClient.user.functions.dropSearchIndex(this.dbName, this.collName,index)
        if(rval.result.ok) {
            console.log(rval)
            return { ok: 1, nIndexesWas: rval.result.nIndexesWas }
        }
        return {ok: 0,error: rval.result.error};
    }

    async createIndex(name, definition) {
        if (!await this.mongoClient.connect()) throw new Error(this.mongoClient.lastError)
        const rval = await this.mongoClient.user.functions.createIndex(this.dbName, this.collName, name, definition)
        if (rval.error) { throw new Error(rval.error) }
        const { numIndexesBefore, numIndexesAfter, note } = rval;
        return { numIndexesBefore, numIndexesAfter, note };
    }

    async drop() {
        if (!await this.mongoClient.connect()) throw new Error(this.mongoClient.lastError)
        const rval = await this.mongoClient.user.functions.dropCollection(this.dbName, this.collName)
        return { ok: 1 }
    }

    async dropIndex(index) {
        console.log(index)
        if (!await this.mongoClient.connect()) throw new Error(this.mongoClient.lastError)
        const rval = await this.mongoClient.user.functions.dropIndex(this.dbName, this.collName,index)
        if(rval.result.ok) {
            console.log(rval)
            return { ok: 1, nIndexesWas: rval.result.nIndexesWas }
        }
        return {ok: 0,error: rval.result.error};
    }

    async insertOne(document) {
        if (!await this.mongoClient.connect()) throw new Error(this.mongoClient.lastError)
        const rval = await this.mongoClient.user.functions.insert(this.dbName, this.collName, [document])

        if(rval.error) {
            let firstBracket = rval.error.indexOf('{')
            let error = rval.error.substring(firstBracket,rval.error.length-1)
            throw new Error(JSON.stringify(EJSON.parse(error),null,2))
        }

        return rval
    }

    async insertMany(documents) {
        if (!await this.mongoClient.connect()) throw new Error(this.mongoClient.lastError)
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

        const rval = await this.mongoClient.user.functions.find(this.dbName, this.collName, query, projection, 1, 0)
        console.log(rval)
        if (rval.result && rval.result.length > 0) return rval.result[0]
        return null;
    }

    async findOneAndUpdate(query, updates, options) {
        if (!await this.mongoClient.connect()) throw new Error(this.mongoClient.lastError)

        const rval = await this.mongoClient.user.functions.findOneAndUpdate(this.dbName, this.collName, query, updates,options)
        return rval;
    }

    async updateMany(query, updates, options) {
        if (!await this.mongoClient.connect()) throw new Error(this.mongoClient.lastError)

        const rval = await this.mongoClient.user.functions.update(this.dbName, this.collName, query, updates, false, options)
        return rval;
    }
    async updateOne(query, updates, options) {
        if (!await this.mongoClient.connect()) throw new Error(this.mongoClient.lastError)

        const rval = await this.mongoClient.user.functions.update(this.dbName, this.collName, query, updates, true, options)
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
        this._limit = 30
        this._skip = 0
        this._query = undefined;
        this._projection = undefined
        this._results = undefined;
        this._position = undefined;
        this._exhaused = false;
        this._pipeline = null;
        this._sort = null;
    }

    sort(x) {
        if (typeof x != "object") {
            throw new Error("sort function takes an object not a " + typeof x)
        }
        this._sort = x
        return this
    }

    skip(x) {
        if (x < 0) x = 0;
        this._skip = x
        return this;
    }

    limit(x) {
        if (x > 10000) x = 10000;
        if (x < 0) x = 0;
        this._limit = x;
        return this;
    }

    [Symbol.asyncIterator]() {
        let cursor = this
        return {
            next: async function () {
                let doc = await cursor.next()
                if (doc == null) { return { done: true } }
                return { value: doc, done: false }
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
                this._exhausted = true;
                return this._results.result;
            }
            if (this._cursorType == "AGGREGATE") {
                await this.runAgg();
                if (this._results.error) {
                    throw new Error("Database Error: " + this._results.error)
                }
                this._exhausted = true;
                return this._results.result;
            }
        }
    }

    async runFind() {
        console.log(this.mongoClient)
        if (!await this.mongoClient.connect()) throw new Error(this.mongoClient.lastError)
        this._results = await this.mongoClient.user.functions.find(this.dbName,
            this.collName, this._query, this._projection, this._limit, this._skip, this._sort)

        this._position = 0;

    }

    async runAgg() {

        if (!await this.mongoClient.connect()) throw new Error(this.mongoClient.lastError)
        console.log(this._pipeline)
        this._results = await this.mongoClient.user.functions.aggregate(this.dbName,
            this.collName, this._pipeline)

        this._position = 0;


    }


}

