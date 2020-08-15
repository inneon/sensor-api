# sensor-api

Excercise for the take home software engineering interview for Jonny Wright.

## Pre-requisites

Node and NVM installed and available on the command line. Docker and docker-compose installed and available on the command line.

## Quick start

```
npm i
npm start
```

## Other commands

### Testing

- `npm run test` - runs the unit tests
- `npm run test:acceptance` - runs the acceptance tests (redis must be running before any integration tests - this is done with `docker-compose up redis`)

## Further work / improvements

If I was creating a service like this for-real, or I had as much time as I wanted there are some improvements/changes that I would make. Hopefully this section can act as a jumping off point for discussions.

- Change the two calls to Redis during a PUT to a single call. I probably would spend a lot more time reading the docs to see if a "add if it doesn't exist" call, falling back to writing a custom script that runs inside of Redis which checks if the key exists and conditionally inserts it.
- Deploying the application. I would create a AWS ECS group (with load-balancing/redundency/...) for running the app and use Redis hosted in AWS or switched to ElastiCache. It would also require an API Gateway. I would consider handing off the heavy lifting work of sending alerts to some combination of Lambda, SES and SQS. I would deploy all of these with Terraform.
- Add logging and monitoring hooks. For a live application I would want to have information on the usage to know if there are any problems or potential problems. Things like the query time, server utilisation, status codes returned, errors, ...
- Ability to unsubscribe from alerts and only sending alerts once until the sensor reading goes good again.
- Look into the number of subscriptions expected to evaluate whether storing them in external storage and querying on the relevant ones is faster than caching all locally and filtering in the app. If the in the app is still faster then ordering them by increasing threshold to improve filter speed.
