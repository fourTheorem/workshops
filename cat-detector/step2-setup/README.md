# Cat Detector Step 2 - Setup
For your convienience we have created a docker container that is configured with all of the required sotware tools for the workshop. The `Dockerfile` for the container can be found in the `/container` directory in this repository. The container has the following installed:

* python 3.7
* Jupyter Labs server
* AWS CLI
* node.js
* serverless framework

If you are already comfortable with using these tools on your development machine then you don't necessicarily need the container however we recommend that you use it in order to have the same working environment.

## Setup Docker
If you don't already have docker installed then you will need to set it up. Platform specific instructions can be found here:
[https://docs.docker.com/get-docker]( https://docs.docker.com/get-docker)

## Get the container
We have published the container to docker hub, the quickest way to get the container is to run:

```sh
$ docker pull fourtheorem/aiworkshop
```

Alternatively, the container can be built from source as follows:

```sh
$ cd container
$ docker build -t fourtheorem/aiworkshop .
```

## Configure the Container
Once you have the container you will need to configure it. We have provided a Docker Comppose template file in the `container` directory in this repository. To configure the container `cd` into this directory and copy the file `docker-compose-template.yml` to `docker-compose.yml`. Open the file `docker-compose.yml` in a text editor and change the following lines:

```yaml
environment:
  AWS_ACCESS_KEY_ID: <your access key id>           <-- your AWS access key
  AWS_SECRET_ACCESS_KEY: <your secret access key>   <-- your secret access key
  AWS_DEFAULT_REGION: eu-west-1
  AWS_REGION: eu-west-1
  AWS_ACCOUNT_ID: <your account id>                 <-- your AWS account id
  MY_CRAWLER_QUEUE: MyCrawlerQueue
  MY_ANALYSIS_QUEUE: MyAnalysisQueue
  MY_BUCKET_NAME: <your bucket name>                <-- your bucket name
```

Use your specific AWS credentials to configure the file. For the bucket name you will need to pick a globally unique name to avoid a collision. We suggest something like:

```
<your last name><your company name><todays date>
```

For example: `elgerfourtheoremseptember122020`

## Run the Container
We have provided a run script for the container. To start the container:

```sh
$ cd container
$ bash ./run.sh
```

This will run the container and give you a command prompt inside the container. You should see output similar to the following:

```sh
To access the notebook, open this file in a browser:
			file:///root/.local/share/jupyter/runtime/nbserver-28-open.html
	Or copy and paste one of these URLs:
			http://fa153e27d046:8888/?token=4bf8586b7a2b357b0cca12b9586360bfb5fb77bec99fb88b
	 or http://127.0.0.1:8888/?token=4bf8586b7a2b357b0cca12b9586360bfb5fb77bec99fb88b

root@fa153e27d046:/home/dev#
```

## Confirm the container is configured correctly
To confirm that your container is correctly configured run the following from the command prompt

```sh
# aws s3 ls s3://
```

This should return a list of all of the buckets on the configured account.

Next copy and paste the url to the notebook from the container output into a browser and check that Jupyter loads correctly. For example:

```
http://127.0.0.1:8888/?token=4bf8586b7a2b357b0cca12b9586360bfb5fb77bec99fb88b
```

Naviagte to the `step2-setup` directory and open the notebook `step2.ipynb`. This notebook contains the rest of the setup code so you should work through this to create a bucket for the workshop and also to upload some test images.

## Exit and stop the container
If you need to exit or stop the container at any time, simply type `exit` at the command prompt in the container:

```sh
# exit
```

This will leave the container running in the background to reconnect run:

```sh
$ docker exec -ti $(docker ps -a -q) /bin/bash
```

To stop all running container execute:

```sh
$ docker kill $(docker ps -a -q)
```

