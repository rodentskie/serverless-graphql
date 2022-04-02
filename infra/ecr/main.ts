import { Construct } from "constructs";
import { App, TerraformStack, S3Backend } from "cdktf";
import { AwsProvider, ecr } from "@cdktf/provider-aws";

class EcrStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new AwsProvider(this, "AWS", {
      region: "ap-southeast-1",
    });

    new ecr.EcrRepository(this, "rod-test", {
      name: "rod-test",
      imageTagMutability: "MUTABLE",
      imageScanningConfiguration: {
        scanOnPush: false,
      },
      tags: {
        Terraform: "true",
      },
    });

    new S3Backend(this, {
      bucket: "onewallet-cdktf-test",
      key: "cdktf/ecr.json",
      region: "ap-southeast-1",
    });
  }
}

const app = new App();
new EcrStack(app, "ecr");

app.synth();
