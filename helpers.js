//Define helpers for common operators and expressions

const mongo_query_operators = [
  "eq",
  "gt",
  "gte",
  "lt",
  "lte",
  "not",
  "ne",
  "in",
  "nin",
  "and",
  "regex",
  "or",
  "nor",
  "exists",
  "elemMatch",
  "expr",
  "jsonSchema",
  "size",
  "type",
];

for (let op of mongo_query_operators) {
  this[op] = function () {
    if (arguments.length == 2 ) {
      return { [`${arguments[0]}`] : { [`$${op}`]: arguments[1] }};
    } else {
      return { [`${arguments[0]}`] : { [`$${op}`]: [...arguments].shift() }};
    }
  };
}

function empty() { return {} }


const Filters = { empty, 
eq,
gt,
gte,
lt,
lte,
not,
ne,
in: this.in,
nin,
and,
regex,
or,
nor,
exists,
elemMatch,
expr,
jsonSchema,
size,
type, }