# Infra

Our serverless application needs only the following infra.

* `ECR` - we push our docker image in here
* `EIP`
* `VPC` - works togethere with `EIP` to make our network secure
* `Mongo` - Mongodb atlas cluster


The infra mentioned above are all created using `CDKTF`. It is integrated with `Bazel` for efficient deployment and destroying of the infra.