# Cat Detector Step 7 - Analysis Service
The analysis service is responsible for feeding the downloaded images to Rekogntion for analysis. The code for this service is in the `system/analysis-service` directory in this repository.

This should look fairly familiar as the code is similar to the Crawler Service so we won't go through the serverless configuraion in detail except to note that the analysis service needs additional permissions in order to allow it to call the detectLabels API for us.

```yaml
    - Effect: "Allow"
      Action:
        - "rekognition: DetectLabels"
      Resource: "*"
```

As with the Crawler Service the code is in `handler.js`. Take a moment to inspect the code and be sure that you understand what it is doing. 

The main entry point is `analyzeImages`. This unpacks the SQS message and looks at the images refrenced in the message. Each downloaded image is sent to Rekogntion for analysis in the function `analyzeImageLabels`.

Let's go ahead and deploy the Analysis Service. Go to the shell prompt in your container and run:

```sh
$ cd work/system/analysis-service
$ npm install
$ serverless deploy
```

After a few seconds the serverless framework should report that the lamda function was successfully deployed. If you now take a look at the CloudFormation console on AWS you should see that a third stack has been deployed. Also go ahead and open the Lambda console to view the function that we just deployed.

Before we proceed we should test that our service is operating correctly. Point your browser to the Jupyter server running in your container and open the notebook `step6-crawler/step7.ipynb`.

maybe pull the CW logs into a notebook ???? to prove that it's working??
Maybe just deploy??

- analysis service
  - review the code
  - deploy the service
  - notebook to test it
    - exercise to edit the message and post it to the sqs queue (to analyse previous images)
    - check the contents of the bucket (was data scraped OK) in notebook
    - also check from the console if you wish
