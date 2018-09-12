Worth thinking about 

pulumi stack init orbis-demo
pulumi config set aws:region us-west-2
npm install
pulumi update

demo in safari

look at and explain index.2.ts. "That's going to be optional in each environment, and we can opt into it with a config setting"

pulumi update (just to show that logging table won't be deployed, but don't deploy)

add to config:
  logging:logTableName: loggingTable

pulumi update (deploy this time)

try it out, view in logs

pulumi destroy