

badfields = ["minimum_nights","maximum_nights","price","weekly_price",
"monthly_price","cleaning_fee","extra_people","guests_included"]

toSet = {}
for(let f of badfields) {
    toSet[f] = { $convert : { input: `$${f}`, to: "double", onError: 0, onNull: 0 }}
}

printjson(toSet)

db.listingsAndReviews.updateMany({},[{$set:toSet}])