import { Construct } from "constructs";
import { App, TerraformStack, S3Backend, TerraformOutput } from "cdktf";
import { Vpc } from "../../.gen/modules/terraform-aws-modules/aws/vpc";
import { AwsProvider, vpc, ec2 } from "@cdktf/provider-aws";
import { datasources } from "../../.gen/providers/aws";

class VpcStack extends TerraformStack {
  public vpc: Vpc;

  constructor(scope: Construct, id: string, clusterName: string) {
    super(scope, id);

    new AwsProvider(this, "AWS", {
      region: "ap-southeast-1",
    });

    const eip = new ec2.DataAwsEip(this, "eip_dev", {
      tags: {
        Name: "eip_dev",
        Environment: "dev",
        Terraform: "true",
      },
    });

    const allAvailabilityZones = new datasources.DataAwsAvailabilityZones(
      this,
      "all-availability-zones",
      {}
    ).names;

    this.vpc = new Vpc(this, "vpc", {
      name: "rod-test-vpc-dev",
      cidr: "10.0.0.0/16",
      azs: allAvailabilityZones,
      privateSubnets: ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"],
      publicSubnets: ["10.0.4.0/24", "10.0.5.0/24", "10.0.6.0/24"],
      enableNatGateway: true,
      singleNatGateway: true,
      enableDnsHostnames: true,
      enableDnsSupport: true,
      reuseNatIps: true,
      externalNatIpIds: [eip.id],
      tags: {
        [`kubernetes.io/cluster/${clusterName}`]: "shared",
        Environment: "dev",
      },
      publicSubnetTags: {
        [`kubernetes.io/cluster/${clusterName}`]: "shared",
        "kubernetes.io/role/elb": "1",
        Environment: "dev",
      },
      privateSubnetTags: {
        [`kubernetes.io/cluster/${clusterName}`]: "shared",
        "kubernetes.io/role/internal-elb": "1",
        Environment: "dev",
      },
    });

    const securityGroup = new vpc.SecurityGroup(this, "mongodb_port", {
      namePrefix: "mongodb_port",
      vpcId: this.vpc.vpcIdOutput,

      egress: [
        {
          fromPort: 27017,
          toPort: 27017,
          protocol: "tcp",

          cidrBlocks: ["0.0.0.0/0"],
        },
      ],
    });

    new TerraformOutput(this, "security_group_id", {
      value: securityGroup.id,
    });

    new S3Backend(this, {
      bucket: "onewallet-cdktf-test",
      key: "cdktf/vpc.json",
      region: "ap-southeast-1",
    });
  }
}

const app = new App();
new VpcStack(app, "vpc", "rod_test");

app.synth();
