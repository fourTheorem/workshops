# Cat Detector Step 9 - Frontend
Now that everything has been deployed on the back end, we can finally deploy our frontend.
The code for this is in the directory `system/frontend-service` in this repository.

The front end is a single page application with some `javascript` and `html` templates. We will deploy this code to our bucket with if you recall was configured to serve up static web pages.

There is no `serverless.yml` configuration associated with the front end and we won't go into the details of the code.
Before we deploy however, you will need to make a change to the front end. Open the file `system/frontend-service/app/code.js` in a text editor, you should see the following two lines near the top of the file:

```javascript
const BUCKET_ROOT = 'https://s3-eu-west-1.amazonaws.com/<YOUR BUCKET NAME>'          // <-- replace with your bucket name
const API_ROOT = 'https://<YOUR API GW ID>.execute-api.eu-west-1.amazonaws.com/dev/' // <-- replace with your API gateway
```

Edit these lines to reflect your specific bucket name and API gateway. Save the file.

To deploy the frontend, go to the command prompt on your container and run the following:

```sh
# cd work/system/frontend-service
# aws s3 sync app/ s3://$MY_BUCKET_NAME
```

This will copy the files for the front end to your public facing bucket. 

You should now be able to point a browser to `https://<YOUR BUCKET NAME>.s3.amazonaws.com/index.html` and see the front-end.

Test out the system by running a search. For example search for Giraffe on Google, click the image results tab and copy the URL into the text box at the top of the applications page and click analyze. Refresh the page and you should see a new results page link.

