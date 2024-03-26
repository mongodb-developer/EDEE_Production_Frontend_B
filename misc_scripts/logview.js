log = db.getSiblingDB("admin").runCommand({ getLog: "global" }).log;
last = new Date("2024-01-01");

var log = db.getSiblingDB("admin").runCommand({ getLog: "global" }).log;
  for (line of log) {
    data = EJSON.parse(line);
 
    if (data.t > last) {
      printjson(data);
      printjson(last,data.t)
      last = data.t;
    }
    false;
  }
  
