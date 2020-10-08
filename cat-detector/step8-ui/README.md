# Cat Detector Step 8 - UI Service
So far we have deployed our Crawler and Analysis services and tested them. Now we need to complete the system by deploying a user interface. To enable this we will need to provide some kind of API! This is what we will deploy in this step.

The code for the UI service is in the `system/ui-service` directory in this repository. This defines three API end points which we will use to drive our user interface.

The serverless configuration file for the UI service is as follows:

```yaml
service: ui-service
frameworkVersion: ">=1.30.0"
custom:
  bucket: ${env:MY_BUCKET_NAME}
  crawlerqueue: ${env:MY_CRAWLER_QUEUE}
  region: ${env:AWS_DEFAULT_REGION, 'eu-west-1'}
  accountid: ${env:AWS_ACCOUNT_ID}

provider:
  name: aws
  runtime: nodejs12.x
  region: ${env:AWS_DEFAULT_REGION, 'eu-west-1'}
  iamRoleStatements:
    - Effect: Allow
      Action:
        - s3:PutObject
        - s3:GetObject
        - s3:ListBucket
        - s3:ListObjects
        - s3:ListObjectsV2
      Resource: "arn:aws:s3:::${self:custom.bucket}/*"
    - Effect: Allow
      Action:
        - s3:ListBucket
        - s3:ListObjects
        - s3:ListObjectsV2
      Resource: "arn:aws:s3:::${self:custom.bucket}"
    - Effect: Allow
      Action:
        - sqs:SendMessage
        - sqs:DeleteMessage
        - sqs:GetQueueUrl
      Resource: "arn:aws:sqs:*:*:${self:custom.crawlerqueue}"
    - Effect: Allow
      Action:
        - sqs:ListQueues
      Resource: "arn:aws:sqs:::*"

functions:
  analyzeUrl:
    handler: handler.analyzeUrl
    environment:
      BUCKET: ${self:custom.bucket}
      QUEUE: ${self:custom.crawlerqueue}
      REGION: ${self:custom.region}
      ACCOUNTID: ${self:custom.accountid}
    events:
      - http:
          path: url/analyze
          method: post
          cors: true
  listUrls:
    handler: handler.listUrls
    environment:
      BUCKET: ${self:custom.bucket}
    events:
      - http:
          path: url/list
          method: get
          cors: true
  listImages:
    handler: handler.listImages
    environment:
      BUCKET: ${self:custom.bucket}
    events:
      - http:
          path: image/list
          method: get
          cors: true
```

Whilst this is a bit more involved that the previous services, it does follow the same structure. We use the custom block to import some environment variables and the provider block defines a set of permissions for our lambda functions.

Note that in this case we are defining three lambda functions, one for each API end point. Each of these is triggered by a http event. The serverless framework will use this information to infer that it should create API Gateway endpoints to trigger our functions. When deployed this configuration will create the following API endpoints

* POST /url/analyze - a HTTP post to this endpoint will trigger a message to the crawler queue with the supplied URL
* GET /url/list - list the urls that the system has analyzed
* GET /image/list - list the images for a url that has been analyzed

The handler functions are defined in the file `handler.js` as before.

Note that we have not taken any steps to secure or lock down our API. Of course for a real system we would need to consider security as a priority and consider the use of services such as WAF and Cognito.

Let's deploy our UI service. As before, go to the container command prompt and run:

```sh
# cd work/system/ui-service
# npm install
# serverless deploy
```

Once the deployment has completed you should see some output similar to the following:

```
endpoints:
  POST - https://tkv7wa9hj4.execute-api.eu-west-1.amazonaws.com/dev/url/analyze
  GET - https://tkv7wa9hj4.execute-api.eu-west-1.amazonaws.com/dev/url/list
  GET - https://tkv7wa9hj4.execute-api.eu-west-1.amazonaws.com/dev/image/list
```

Let's quickly test the UI service. You will need to copy and paste these URLs into the notebook to test the API.
Point your browser to the Jupyter server running in your container and open the notebook `step8-analysis/step8.ipynb`.

Next step: [step9-full](../step9-full)

