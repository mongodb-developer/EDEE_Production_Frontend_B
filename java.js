class Document {
  static parse(ejson) {
    const parsed = EJSON.parse(ejson);
    return new Document(parsed);
  }

  constructor(a, b) {
    if (typeof a == "string") {
      this[a] = b;
    } else if (typeof a == "object") {
      Object.assign(this, a);
    }
  }

  append(key, value) {
    this[key] = value;
    return this;
  }

  put(key, value) {
    this[key] = value;
  }

  putAll(obj) {
    Object.assign(this, obj);
  }

  clear() {
    const keys = Object.keys(this);
    for (let k of keys) {
      delete this[k];
    }
  }

  isEmpty() {
    return Object.keys(this).length == 0;
  }

  remove(key) {
    delete this[key];
  }
  toJson() {
    return EJSON.stringify(this);
  }

  get(key, defaultValue) {
    if (this[key] != undefined) return this[key];
    else if (defaultValue == undefined) return null;
    else return defaultValue;
  }

  getBoolean(key, defaultValue) {
    const val = this[key];
    if (val == undefined) {
      return defaultValue == undefined ? null : defaultValue;
    }
    if (typeof val == "boolean" || val === null) {
      return val;
    }
    throw new Error(
      `java.lang.ClassCastException: ${key} is not of type boolean`
    );
  }

  getString(key, defaultValue) {
    const val = this[key];
    if (val == undefined) {
      return defaultValue == undefined ? null : defaultValue;
    }
    if (typeof val == "string" || val === null) {
      return val;
    }
    throw new Error(
      `java.lang.ClassCastException: ${key} is not of type String`
    );
  }

  getInteger(key, defaultValue) {
    const val = this[key];
    if (val == undefined) {
      return defaultValue == undefined ? null : defaultValue;
    }
    if (
      val instanceof Realm.BSON.Int32 ||
      this[key] === null ||
      (typeof val == "number" && Number.isInteger(val))
    ) {
      return val;
    }
    throw new Error(
      `java.lang.ClassCastException: ${key} is not of type Integer`
    );
  }



  getDouble(key, defaultValue) {
    const val = this[key];
    if (val == undefined) {
      return defaultValue == undefined ? null : defaultValue;
    }
    if (
      val instanceof Realm.BSON.Double ||
      this[key] === null ||
      typeof val == "number"
    ) {
      return val;
    }
    throw new Error(
      `java.lang.ClassCastException: ${key} is not of type Double`
    );
  }

  getLong(key, defaultValue) {
    const val = this[key];
    if (val == undefined) {
      return defaultValue == undefined ? null : defaultValue;
    }
    if (val instanceof Realm.BSON.Long || this[key] === null) {
      return val;
    }
    throw new Error(`java.lang.ClassCastException: ${key} is not of type Long`);
  }

  getObjectId(key) {
    const val = this[key];
    if (val == undefined) return null;
    if (val instanceof Realm.BSON.ObjectId || val === null) {
      return val;
    }
    throw new Error(
      `java.lang.ClassCastException: ${key} is not of type ObjectId`
    );
  }

  getDate(key) {
    const val = this[key];
    if (val == undefined) return null;
    if (val instanceof Date || val === null) return val;
    throw new Error(`java.lang.ClassCastException: ${key} is not of type Date`);
  }
}

class BSON extends Document {}

class BSONDocument extends Document {}

function JAVATest() {
  o = new Document("a", new Long(1)).append("b", null).append("c", 100);
  console.log(o);
  console.log(o.getLong("a"));
  console.log(o.getLong("b"));
  console.log(o.getLong("c"));
  /*var b = new Document("a", 1);
  console.log(b);
  json = `{ "c": 1, "d": 2 }`;
  var c = Document.parse(json);
  console.log(c);
  console.log(c.get('a'))
  console.log(c.get('a','nope'))
  console.log(c.get('c','nope'))
  c.remove("d")
  console.log(c)
  console.log(`is it empty`)
  console.log(c.isEmpty())
  c.clear()
  console.log(c.isEmpty())*/
  console.log("--------------------");
}
