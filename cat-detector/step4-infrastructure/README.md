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
```

This defines just two SQS queues, one for the crawler and one for the analysis service. 

Note that it is a point for discussion as to where underlying infrastructure should be defined, within a serice definition or seperately. A good rule of thumb is that infrstructure that is used by only one service should live with the service, infrastructure that is needed by multiple services can be managed as a shared pool. We are following this pattern here.

Let's deploy these two queues!

Go to the container prompt that we opened earlier or, if you closed the container connection run the following command to reconnect.

```sh
$ docker exec -ti (docker ps -a -q) /bin/bash
```

Once at the command prompt, `cd` into the `work/system/resources` directory and run the following command:

```sh
$ cd work/system/resources
$ serverless deploy
```

After a few seconds the serverless framework should report that the deployment completed. Let's check the resources in the AWS console.

Firstly go to the cloud formation console. You should see a stack named `resources-dev`. This is the cloud formation stack that we just deployed. Next go to the SQS console. You should see two queues named `MyAnalysisQueue` and `MyCrawlerQueue`.

Congratulations! You have just deployed some shared infrastructure. In the next step we will deploy the crawler service.

