# Graphql API

A quick project demo. Just one function to sign up a user and return a token.


### Serverless.yaml

A config file for us to create a serverless application.

- Provider - specify the provider to use, here we use AWS connected to the `VPC` we created.
- Function - `index.handler`, format is (file name).(function name): the function you want to invoke during the event specified within the function. Here we will invoke the function on the `HTTP` method of GET or POST on `/graphql` path.
