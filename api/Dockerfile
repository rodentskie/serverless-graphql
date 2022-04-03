
FROM public.ecr.aws/lambda/nodejs:12
ARG FUNCTION_DIR="/var/task"

RUN mkdir -p ${FUNCTION_DIR}

COPY . ${FUNCTION_DIR}

RUN npm install

CMD [ "index.handler" ]