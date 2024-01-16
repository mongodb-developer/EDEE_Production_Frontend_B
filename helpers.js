//Define helpers for common operators and expressions

const mongo_query_operators = ['gt','gte','lt','lte','not','ne','in','nin','and','or','nor','exists','elemMatch']

for( let op of mongo_query_operators) {
    this[op] = function() {
        if(arguments.length == 1) {
        return { [`$${op}`] : arguments[0] }
        } else {
            return { [`$${op}`] : [...arguments] }
        }
    }
}