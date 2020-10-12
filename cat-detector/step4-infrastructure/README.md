# Cat Detector Step 4 - Infrastructure
We are now ready to deploy some infrastructure using the serverless framework!

The code is in the `system` directory in this repository. This is broken out into the following services:

* analysis-service
* crawler-service
* frontend-service
* resources
* ui-service

In this step we are going to deploy the resources. This directory contains just a sinlge `serverless.yml` file as follows:

```yaml
service: resources
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

resources:
  Resources:
    CrawlerQueue:
      Type: "AWS::SQS::Queue"
      Properties:
        QueueName: "${self:custom.crawlerqueue}"
    AnalysisQueue:
      Type: "AWS::SQS::Queue"
      Properties:
        QueueName: "${self:custom.analysisqueue}"

service: resources
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

resources:
  Resources:
    WebAppS3Bucket:
      Type: AWS::S3::Bucket
      Properties:
        BucketName: ${self:custom.bucket}
        AccessControl: PublicRead
        WebsiteConfiguration:
          IndexDocument: index.html
          ErrorDocument: index.html
    WebAppS3BucketPolicy:
      Type: AWS::S3::BucketPolicy
      Properties:
        Bucket:
          Ref: WebAppS3Bucket
        PolicyDocument:
          Statement:
            - Sid: PublicReadGetObject
              Effect: Allow
              Principal: "*"
              Action:
                - s3:GetObject
              Resource: arn:aws:s3:::${self:custom.bucket}/*
    Chap2CrawlerQueue:
      Type: "AWS::SQS::Queue"
      Properties:
        QueueName: "${self:custom.crawlerqueue}"
    Chap2AnalysisQueue:
      Type: "AWS::SQS::Queue"
      Properties:
        QueueName: "${self:custom.analysisqueue}"
```

This defines two SQS queues, one for the crawler and one for the analysis service, and an S3 bucket.

Note that it is a point for discussion as to where underlying infrastructure should be defined, within a serice definition or seperately. A good rule of thumb is that infrstructure that is used by only one service should live with the service, infrastructure that is needed by multiple services can be managed as a shared pool. We are following this pattern here.

The bucket is used by the system for holding downloaded images and for storing result information. We will also use the buket for some API investigation in the next step. The Queues are used to trigger the crawler and analysis lambda functions asynchronously.

Note that we have configured the bucket for public access and to serve up a static web site. For this demonstration system this is fine as there is no sensitive information placed into the bucket. Obviously for a real system we would need much more stringent controls on who can access our bucket data!

If you look at the top of this configuration file you will see that the environment variables that we set on our container in step 2 are used. Note the use of `MY_BUCKET_NAME`. Which will be used as the bucket name when we deploy this file.

Let's deploy this infrastructure!

Go to the container prompt that we opened earlier or, if you exited the container prompt run the following command to reconnect.

```sh
docker exec -ti workshop  /bin/bash
```

Once at the command prompt, `cd` into the `work/system/resources` directory and run the following command:

```sh
cd work/system/resources
serverless deploy
```

After a few seconds the serverless framework should report that the deployment completed. However, if you see output similar to that below, it means that the buket name that you chose is not unique and you will need to select another.

```
 Serverless Error ---------------------------------------
 
   An error occurred: WebAppS3Bucket - mybucket already exists.
```

If you need to do this you should go back to step 2 and follow the instructions there on how to choose a unique bucket name.

Once the deployment has completed, go to the cloud formation web console. You should see a stack named `resources-dev`. This is the cloud formation stack that we just deployed. Next go to the SQS console. You should see two queues named `MyAnalysisQueue` and `MyCrawlerQueue`.

Finally go to the S3 console and check that your bucket was created OK.

Congratulations! You have just deployed some shared infrastructure. In the next step we will take a look at the Rekogntion API.

Next step: [step5-rekognition](../step5-rekognition)

