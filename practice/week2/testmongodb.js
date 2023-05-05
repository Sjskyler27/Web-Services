const {MongoClient} = require('mongodb');

async function main() {
    //how to connect to the database
    const uri = "mongodb+srv://sjskyler27:10013263@cluster0.vykxdok.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri);


    try{
        await client.connect();
        console.log('success');

        await updateListing(client, "Loft", {
            bedrooms: 8, beds: 11
        });

        //hers
        // await findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(client, {
        //     minimumNumberOfBedrooms: 4,
        //     minimumNumberOfBathrooms: 2,
        //     maximumNumberOfResults: 5
        // });


        //read certain files 
        // await minBedBathRecentReviews(client, {
        //     minimumNumberOfBedrooms: 4,
        //     minimumNumberOfBathrooms: 2,
        //     maximumNumberOfResults: 5
        // });

        //await findListing(client, "Loft");



        //create listings
        // await createlistings(client,[ 
        // {
        //     name:"Loft", summary: "charming", bedrooms: 1, bathrooms: 1
        // }, 
        // {
        //     name:"bed", 
        //     summary: "wpw", 
        //     bedrooms: 5, 
        //     bathrooms: 3
        // },
        // {
        //     name:"tru", 
        //     summary: "really", 
        //     bedrooms: 7, 
        //     bathrooms: 2
        // }]);


    } catch(e){
        console.error(e);
        console.log('failed');
    } finally{
        await client.close();
        console.log('closing');
    }

}
// run main
main().catch(console.error);











//function to test inserting one item
async function createlisting(client,newListing){
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertOne(newListing);
    console.log("New Listing id: " + result.insertedId);
}

//function to list data
async function listData(client){
    const dbList = await client.db().admin().listDatabases();
    console.log("DATA:");
    dbList.databases.forEach(data => {
        console.log(data.name);
    });
} 

//find one listing
async function findListing(client, listing){
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({name: listing});
    if (result){
     console.log("found listing: " + listing + "\n");
     console.log(result)
    }else{
     console.log("listing not found");
    }
 }




 // find specific types of listings
async function minBedBathRecentReviews(client, 
    {
        minimumNumbersOfBedroomes = 0,
        minimumNumbersOfBathrooms = 0,
        maximumNumberOfResults = Number.MAX_SAFE_INTEGER
    } = {}){

        const cursor = await client.db("sample_airbnb").collection("listingsAndReviews").find({
            bedrooms: { $gte: minimumNumbersOfBedroomes},
            bathrooms: {$gte: minimumNumbersOfBathrooms}
        }).sort({last_review: -1}).limit(maximumNumberOfResults);

       const results =  await cursor.toArray();
       
       if (results.length > 0){ 
        console.log("listing results");
        results.forEach((r,i) => {
            console.log(i+1);
            console.log(r.name);
       });
    }else
        console.log("no results found");


}


 //her find specific listings 
async function findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(client, {
    minimumNumberOfBedrooms = 0,
    minimumNumberOfBathrooms = 0,
    maximumNumberOfResults = Number.MAX_SAFE_INTEGER
} = {}) {

    // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#find for the find() docs
    const cursor = client.db("sample_airbnb").collection("listingsAndReviews")
        .find({
            bedrooms: { $gte: minimumNumberOfBedrooms },
            bathrooms: { $gte: minimumNumberOfBathrooms }
        }
        )
        .sort({ last_review: -1 })
        .limit(maximumNumberOfResults);

    // Store the results in an array
    const results = await cursor.toArray();

    // Print the results
    if (results.length > 0) {
        console.log(`Found listing(s) with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms:`);
        results.forEach((result, i) => {
            const date = new Date(result.last_review).toDateString();

            console.log();
            console.log(`${i + 1}. name: ${result.name}`);
            console.log(`   _id: ${result._id}`);
            console.log(`   bedrooms: ${result.bedrooms}`);
            console.log(`   bathrooms: ${result.bathrooms}`);
            console.log(`   most recent review date: ${date}`);
        });
    } else {
        console.log(`No listings found with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms`);
    }
}




// function to test inserting many
async function createlistings(client,newListings){
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertMany(newListings);

    console.log(result.insertedCount + " listing added: ");
    console.log(result.insertedIds);
}







async function updateListing(client, nameOfListing, newListing){
   const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateOne(
        { name: nameOfListing}, {$set: newListing});  // set will not update any old things if you dont pass it, it wont clear

   console.log(result.matchedCount + ' matched');
   console.log(result.modifiedCount + " updated");
}
