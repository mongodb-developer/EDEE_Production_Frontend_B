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

    /* Don't have the idea of iterable cursors in the Browser version yet */
    /* I could add them but this is simple */

    getDatabase(dbName) {
        return {
            mongoclient: this,
            dbName,
            getCollection: function (collName) {
                return {
                    mongoclient: this.mongoclient,
                    collName,
                    dbName,
                    insertOne: async function (document) {
                        if (!await this.mongoclient.connect()) return { ok: false, lastError }
                        const rval = await this.mongoclient.user.functions.insert(dbName, collName, [document])
                        return rval
                    },
                    insertMany: async function (documents) {
                        if (!await this.mongoclient.connect()) return { ok: false, lastError }
                        const rval = await  this.mongoclient.user.functions.insert(dbName, collName, documents)
                        return rval
                    },
                    find: async function (query, projection) {
                        if (!await this.mongoclient.connect()) return { ok: false, lastError }
                        //TODO - Make this return a 'cursor like thing'
                        const rval = await  this.mongoclient.user.functions.find(dbName, collName, query, projection, 10000)
                        return rval.result
                    },
                    findOne: async function (query, projection) {
                        if (!await this.mongoclient.connect()) return { ok: false, lastError }

                        const rval = await  this.mongoclient.user.functions.find(dbName, collName, query, projection, 1)
                        console.log(rval)
                        if (rval.result && rval.result.length > 0) return rval.result[0]
                        return null;
                    },
                    updateMany: async function (query, updates) {
                        if (!await this.mongoclient.connect()) return { ok: false, lastError }

                        const rval = await  this.mongoclient.user.functions.update(dbName, collName, query, updates)
                        return rval;
                    },
                    updateOne: async function (query, updates) {
                        if (!await this.mongoclient.connect()) return { ok: false, lastError }

                        const rval = await  this.mongoclient.user.functions.update(dbName, collName, query, updates, true)
                        return rval;
                    },
                    deleteMany: async function (query) {
                        if (!await this.mongoclient.connect()) return { ok: false, lastError }
                        const rval = await  this.mongoclient.user.functions.delete(dbName, collName, query)
                        return rval;
                    },
                    deleteOne: async function (query) {
                        if (!await this.mongoclient.connect()) return { ok: false, lastError }

                        const rval = await  this.mongoclient.user.functions.delete(dbName, collName, query, true)
                        return rval;
                    },
                    aggregate: async function (pipeline) {
                        if (!await this.mongoclient.connect()) return { ok: false, lastError }
                        //TODO - Make this return a 'cursor like thing'
                        const rval = await  this.mongoclient.user.functions.aggregate(dbName, collName, pipeline)
                        return rval.result
                    },
                    countDocuments: async function (query) {
                        if (!await this.mongoclient.connect()) return { ok: false, lastError }

                        const rval = await  this.mongoclient.user.functions.count(dbName, collName, query)
                        return rval.result
                    },
                }
            }
        }
    }


    //Change this to use email/password auth and auto enroll new users 

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
        const credential = Realm.Credentials.emailPassword(this.userName , this.passWord )
        try {
            this.user = await realmApp.logIn(credential)
            this.lastError = "Existing User Authenticated"
            this.connected = true;
            return true;
        } catch (e) {
            //On error try to regiuster as new user
            try {
                const deets = { email: this.userName , password:  this.passWord  }
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