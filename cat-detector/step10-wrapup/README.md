# Cat Detector Step 10 - Wrap up
Congratulations on getting to the end of the workshop! We hope you enjoyed it.

Before we finish, don't forget to delete all of the resources that you just deployed. To help with this we have provided you with a script `remove.sh` in the `system` directory in this repository.

Before you run this you will need to remove all of the files from the bucket you created for this workshop. You can do this manually using the AWS S3 console or by running the following at the container command prompt:

```sh
# aws s3 rm s3://${MY_BUCKET_NAME} --recursive
```

(we generally avoid putting recursive delete operations in code if we can avoid it!)

To run the remove script go to the command prompt in your container and run the following:

```sh
# cd work/system
# bash ./remove.sh
```

This will remove all of the lambda functions and SQS queues, however you will need to remove the S3 bucket yourself manually using the S3 console. You should also confirm that all resources from this workshop have indeed been removed by checking in the AWS console.

Finally you can stop the container by running:

```sh
$ docker kill workshop
$ docker rm workshop
```

We covered a lot of ground and you may have some outstanding questions. Please feel free to contact us if you'd like to have a longer chat about any thing that wasn't clear.

## Get in touch
This workshop is brought to you by fourTheorem [https://www.fourtheorem.com](https://www.fourtheorem.com).

You can reach us at: `hello at fourtheorem dot com`

Tweet/DM us at: @pelger, @eoinsha

Linkedin: [https://www.linkedin.com/in/peterelger/](https://www.linkedin.com/in/peterelger/)

