FROM ubuntu:18.04

SHELL ["/bin/bash", "-c"]

RUN apt-get update
RUN apt purge -y python-minimal
RUN apt purge -y python2.7-minimal
RUN apt purge -y python2.7

RUN apt-get install -y software-properties-common
RUN apt-get install -y apt-utils git zip bzip2 unzip tar curl vim build-essential ccache make gcc g++ ca-certificates

RUN add-apt-repository ppa:deadsnakes/ppa
RUN apt-get update
RUN apt-get install -y python3.7 python3-venv

RUN useradd -ms /bin/bash dev
WORKDIR /home/dev
USER root

RUN mkdir work
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs
RUN npm install -y -g serverless

RUN update-alternatives --remove python /usr/bin/python2
RUN update-alternatives --install /usr/bin/python python /usr/bin/python3 10

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
RUN unzip awscliv2.zip
RUN ./aws/install

COPY requirements.txt /home/dev
RUN python -m venv .env
RUN source /home/dev/.env/bin/activate && pip install -r requirements.txt

RUN npm install -g --unsafe-perm ijavascript
RUN source /home/dev/.env/bin/activate && ijsinstall --install=global
COPY ./start.sh /home/dev
RUN chmod 755 /home/dev/start.sh

CMD ./start.sh
