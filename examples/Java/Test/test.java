package com.mongodb.simulator.test;
import com.mongodb.simulator.Webservice;
import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.*;
import org.bson.Document;


class thing {
    public int a = 1;

}
public class MongoDemo implements WebService {
    Mongoclient client = null;
    MongoCollection<Document> collection = null

    void MongoDemo() {

        // Create mongoclient here - one of these classes is created
        client = new MongoClient(URI) // Ass MongoClients?
        collection = client.getDatabase("A").getCollection("B ")
    }


    void  PostThing(req,res) {
        // Doce to do something
        Document d = Docu,en.parse(req.body)
        thing.InsertOne(d)
    }
    
}
