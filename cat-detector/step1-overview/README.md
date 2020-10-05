# Cat Detector Step 1 - Overview
In this workshop we are going to deploy our serverless cat detection system (actually it will detect any images). By the end, you will have configured and deployed a small system to AWS that is capable of reading and recognizing images from a web page, and displaying the results for review.

## Workshop Overview
This workshop is divided into the following sections.

### Section 1 - Overview and Setup
* [step1-overview](./step1-overview/README.md) - this explanation
* [step2-setup](./step2-setup/README.md) - ensure that you have the correct tooling ready to go
* [step3-rekognition](./step3-rekognition/README.md) - an investigation of the capabilites of AWS Rekognition
* [step4-serverless](./step4-serverless/README.md) - An overview of the serverless fraework and other tooling

###  Section 2 - Infrastrcutre and Asynchronous Services
* [step5-infrastructure](./step5-infrastructure/README.md) - deployment of infrastructure for the system
* [step6-crawler](./step6-crawler/README.md) - deploy and test the crawler service
* [step7-analysis](./step7-analysis/README.md) - depoy and test the analysis service

###  Section 3 - UI Deploy and test. Wrapup
* [step8-ui](./step8-ui/README.md)
* [step9-full](./step9-full/README.md)
* [step10-wrapup](./step10-wrapup/README.md)

## Finished System UI
It's good to have a goal to aim for! The UI for our finished system looks like the following:

![UI](./cats.png "System UI")


## Architecture
The image below depicts the architecture for our cat detector:

![Architecture](./Chapter2SystemAWSDetails.png "System Architecture")

Briefly, the system works as follows:

* A single page front end application is served up from an S3 bucket.
* The frontend calls Lambda functions in the UI-service through API gateway.
* Our UI-service provides an API to post messages into an SQS queue as well as APIs for fetching results for display.
* The Crawler and Analyzer services (Lambda functions) are triggered via an SQS queue.
* The Crawler is responsible for fetching images for analysis
* The Analysis funciton is responsible for running the image recognition tasks using AWS Rekognition

