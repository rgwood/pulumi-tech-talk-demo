import * as pulumi from "@pulumi/pulumi";
import * as cloud from "@pulumi/cloud-aws";

let loggingConfig = new pulumi.Config("logging");

// Create log table, but only initialize it if logTableName exists in config
let logTable: cloud.Table;
let logTableName = loggingConfig.get("logTableName");
if (logTableName != undefined) {
    logTable = new cloud.Table(logTableName as string, "route");
}

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

        if (logTable != undefined) {
            let currDate = new Date();
            console.log(`logging current time '${currDate}' to log table`);
            logTable.insert({ route, currDate });
        }
    });
});

exports.endpoint = endpoint.publish().url;