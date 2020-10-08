# Cat Detector Step 6 - Crawler
The crawler service is responsible for fetching images from a from a given URL. The URL in question is supplied via the crawler SQS queue that was deployed in the last step.

The code for the crawler is in the `system/crawler-service` directory in this repository. Let's take a quick look at it. The `serverless.yml` file is as follows:

```yaml
service: crawler-service
frameworkVersion: ">=1.30.0"
custom:
  bucket: ${env:MY_BUCKET_NAME}
  crawlerqueue: ${env:MY_CRAWLER_QUEUE}
  analysisqueue: ${env:MY_ANALYSIS_QUEUE}
  region: ${env:AWS_DEFAULT_REGION, 'eu-west-1'}
  accountid: ${env:AWS_ACCOUNT_ID}

provider:
  name: aws
  runtime: nodejs12.x
  stage: dev
  region: ${env:AWS_DEFAULT_REGION, 'eu-west-1'}
  iamRoleStatements:
    - Effect: Allow
      Action:
        - s3:PutObject
      Resource: "arn:aws:s3:::${self:custom.bucket}/*"
    - Effect: Allow
      Action:
        - sqs:ListQueues
      Resource: "arn:aws:sqs:${self:provider.region}:*:*"
    - Effect: Allow
      Action:
        - sqs:ReceiveMessage
        - sqs:DeleteMessage
        - sqs:GetQueueUrl
      Resource: "arn:aws:sqs:*:*:${self:custom.crawlerqueue}"
    - Effect: Allow
      Action:
        - sqs:SendMessage
        - sqs:DeleteMessage
        - sqs:GetQueueUrl
      Resource: "arn:aws:sqs:*:*:${self:custom.analysisqueue}"

functions:
  crawlImages:
    handler: handler.crawlImages
    environment:
      BUCKET: ${self:custom.bucket}
      ANALYSIS_QUEUE: ${self:custom.analysisqueue}
      REGION: ${self:custom.region}
      ACCOUNTID: ${self:custom.accountid}
    events:
      - sqs:
          arn: "arn:aws:sqs:${self:provider.region}:${env:AWS_ACCOUNT_ID}:${self:custom.crawlerqueue}"
```

This is a little more involved that the previous deployment. Briefly each section does the following:

* custom - Imports environment variables.
* provider - Defines the cloud as `aws` and the runtime as `node12.x`. We then define some IAM roles and permissions:
  * allow PutObject permissions to our bucket
  * allow SQS ListQueues
  * allow SQS ReceiveMessage, DeleteMessage and GetQueueUrl for the crawler queue
  * allow SQS SendMessage, DeleteMessae and GetQueueUrl for the analysis queue
* functions - defines a single lambda function with an entry point `handler.crawlImages`. This Lambda function will be triggered by messages on the crawler queue and we also supply some environment variables.

Note that the permissions defined here are granted to the Lambda function when it executes. It is good practice to always define only the minimum needed permissions for each function to operate correctly.

The Lambda function implementation is provided by the files `images.js` which provides some supporting functions and `handler.js` which defines the main entry point for the function.

We won't go into the code in detail, except to note that at the top of `handler.js` the function imports the `aws-sdk` and creates an `s3` and `sqs` object:

```javascript
const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const sqs = new AWS.SQS({region: process.env.REGION})
```

This should be familiar as we used similar code in the notebooks in previous steps.

The main entry point is shown below:

```javascript
module.exports.crawlImages = function (event, context, cb) {
  asnc.eachSeries(event.Records, (record, asnCb) => {
    let { body } = record

    try {
      body = JSON.parse(body)
    } catch (exp) {
      return asnCb('message parse error: ' + record)
    }

    if (body.action === 'download' && body.msg && body.msg.url) {
      const udomain = createUniqueDomain(body.msg.url)
      crawl(udomain, body.msg.url, context).then(result => {
        queueAnalysis(udomain, body.msg.url, context).then(result => {
          asnCb(null, result)
        })
      })
    } else {
      asnCb('malformed message')
    }
  }, (err) => {
    if (err) { console.log(err) }
    cb()
  })
}
```

When an SQS message is dispatched to this Lambda function, the code extracts and parses the message from the event object. The message contains a URL to crawl. The service then crawls the provided URL and places any images extracted from the page into our S3 bucket.

Let's go ahead and deploy the crawler service. Go to the shell prompt in your container and run:

```sh
$ cd work/system/crawler-service
$ npm install
$ serverless deploy
```

The `npm install` command installed the required dependencies for our function such as the AWS SDK. These are defined in the file `package.json`.

After a few seconds the serverless framework should report that the lambda function was successfully deployed. If you now take a look at the CloudFormation console on AWS you should see that a second stack has been deployed. Also go ahead and open the Lambda console to view the function that we just deployed.

Before we proceed we should test that our service is operating correctly. Point your browser to the Jupyter server running in your container and open the notebook `step6-crawler/step6.ipynb`.

Next step: [step7-analysis](../step7-analysis)

