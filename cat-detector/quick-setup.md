# Quick Setup Instructions

## Clone this repository

```sh
git clone git@github.com:fourTheorem/workshops.git
```

## Install Docker
Docker is needed to run this workshop, if you don't have it installed already, please follow the instructions at this link.
[https://docs.docker.com/get-docker]( https://docs.docker.com/get-docker)

## Get the container
We have provided a container for running this workshop so that everyone can have the same development environment.
Get the container by running this command:

```sh
$ docker pull pelger/aiasaservice
```

## AWS Access Keys
To run this workshop you will need access to the AWS SDK. If you do not already have AWS API access keys please follow the instructions at this link: [https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html)

## Configure the Container
Once you have the container you will need to configure it. We have provided a template environment file in the `container` directory in this repository. To configure the container `cd` into this directory and copy the file `run.env.template` to `run.env`. Open the file `run.env` in a text editor and change the following lines:

__PLEASE ENSURE THAT YOU DON'T PUT IN ANY SPACES EITHER SIDE OF THE EQUALS SIGN!!__

```yaml
AWS_ACCESS_KEY_ID=<your access key id>           <-- your AWS access key
AWS_SECRET_ACCESS_KEY=<your secret access key>   <-- your secret access key
AWS_DEFAULT_REGION=eu-west-1
AWS_REGION=eu-west-1
AWS_ACCOUNT_ID=<your account id>                 <-- your AWS account id
MY_CRAWLER_QUEUE=MyCrawlerQueue
MY_ANALYSIS_QUEUE=MyAnalysisQueue
MY_BUCKET_NAME=<your bucket name>                <-- your bucket name
```

Use your specific AWS credentials to configure the file. For the bucket name you will need to pick a globally unique name to avoid a collision. We suggest something like:

```
<your last name><your company name><todays date>
```

For example: `elgerfourtheoremoctober122020`
