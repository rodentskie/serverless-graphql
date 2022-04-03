
FROM amazon/aws-lambda-nodejs:14.2022.03.23.16

ARG FUNCTION_DIR="/var/task"

RUN mkdir -p ${FUNCTION_DIR}

COPY . ${FUNCTION_DIR}

RUN npm install

CMD [ "index.handler" ]