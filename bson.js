//Hoist these up to top level objets


const EJSON = Realm.BSON.EJSON;

/**
 * BSON ObjectId
 * 
 * <p><a href="https://www.npmjs.com/package/bson#documentation">MongoDB Docs HERE</a>
 */
class ObjectId extends Realm.BSON.ObjectId {}

/**
 * BSON Binary
 * <p><a href="https://www.npmjs.com/package/bson#documentation">MongoDB Docs HERE</a>
 */
class Binary extends Realm.BSON.Binary {}

/**
 * BSON Double
 *<p><a href="https://www.npmjs.com/package/bson#documentation">MongoDB Docs HERE</a>
 */
class Double extends Realm.BSON.Double {}

/**
 * BSON Integer
 * <p><a href="https://www.npmjs.com/package/bson#documentation">MongoDB Docs HERE</a>
 */
class Integer extends Realm.BSON.Int32 {}

/**
 * Bson Long
 * <p><a href="https://www.npmjs.com/package/bson#documentation">MongoDB Docs HERE</a>
 */

class Long extends Realm.BSON.Long {}
