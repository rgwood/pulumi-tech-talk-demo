import * as pulumi from "@pulumi/pulumi";
import * as cloud from "@pulumi/cloud-aws";

// Create a counter table with a PK of "route"
let counterTable = new cloud.Table("counterTable", "route");

// Create an API endpoint
let endpoint = new cloud.API("hello-world");
endpoint.get("/{route+}", (request, response) => {
    let route: string = request.params["route"];
    console.log(`Getting count for '${route}'`);

    counterTable.get({ route }).then(value => {
        // get previous value
        let count: number = (value && value.count) || 0;
        count++;

        counterTable.insert({ route, count: count }).then(() => {
            response.status(200).json({ route, count });
            console.log(`Got count ${count} for '${route}'`);
        });
    });
});

exports.endpoint = endpoint.publish().url;