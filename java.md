imports are included for illustration only in the simulator

Every variable should be defined as var ( or const ) - or just used without declaration
The type of all global functions is function or async function
The type of class function can be ignored or just be async
use await in front of any function that makes a database call or a system.getenv call
Any fucntion that calls an async function should use await


Do not declare class varaibles and refer to them as this.variablename
if a function performs a network operation - like talking the database it needs the additonal type asymc
any function calll to the database needs await in front of it
for (var car : cars) is for (var car of cars)

No main() is required 




