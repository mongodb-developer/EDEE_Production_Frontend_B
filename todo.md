
~~~Add org to telemetry~~~
service needs to terminate children for commandRUnner
Create automated testing of examples.

Add transaction support

 // Needs constant Mongoclient so backend change
 // startSession Command
 {
     startSession: 1
   }

  {
     commitTransaction: 1,
     txnNumber: <long>,
     writeConcern: <document>,
     autocommit: false,
     comment: <any>
   }

      {
     abortTransaction: 1,
     txnNumber: <long>,
     writeConcern: <document>,
     autocommit: false,
     comment: <any>
   }


   //After Start session - to use transaction
  startTransaction

First Command lsid, tanNumber (Managed by driver), startTransaction: truie, autocommit: false


{
    insert : "test",
    documents : [{}],
    lsid : { id : <UUID> }
    txnNumber: NumberLong(1),
    // The "level" is optional, supported values are "local", "majority"
    // and "snapshot". "afterClusterTime" is only present in causally
    // consistent sessions.
    readConcern : {
        level : "snapshot",
        afterClusterTime : Timestamp(42,1)
    },
    startTransaction : true,
    autocommit : false
}

Subsequent commands

{
    find : "test",
    filter : {},
    lsid : { id : <UUID> }
    txnNumber : NumberLong(1),
    autocommit : false
}


 

Add vector examples
Add multimedia for vectors

Add Automated test for all examples
Allow Save not just Download
Add Transactions
Review Driver return / exception format
If possible make Endpoint a Dropdown (Parse code)
Add Java type Helpers/Builders for QUery, Update, Etc
Add POJO/POCO Examples? (SpringBoot examples?)


Backlog
=====


Talks

Fewer design patterns, explain the idea of a DP and a simple example with more about how and why. Maybe only one!

Numbers for bucket pattern.

Computes pattern

Worked example, maybe soa is better

Better object persist slides

Add CSFLE and hashing back

What can I remove.

Add 'Java' 'C#' and 'Python' support(Document - add Constructor, add/put/get,toJSON,parse)
Remove await and async
Add Filters and similar
Add types