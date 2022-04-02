import { Construct } from "constructs";
import { App, TerraformStack, S3Backend, TerraformOutput } from "cdktf";
import {
  Cluster,
  MongodbatlasProvider,
  DatabaseUser,
} from "../../.gen/providers/mongodbatlas";

// staging variables
const region = "EU_WEST_2";
const public_key = "ehpulftv";
const private_key = "9139ab1e-5f47-40b4-9a14-b6e6b17ad25a";
const project_id = "5e5a1eb42397a70e9fc3675f";
const environment = "staging";
const num_shards = 1;
const disk_size_gb = 10;
const cluster_type = "REPLICASET";
const provider_instance_size_name = "M10";
const cloud_backup = true;
const dbuser = "onewallet_user_test";
const dbuser_password = "TNsK2IlOyHg3a3VuaAH3";

class mongoStack extends TerraformStack {
  public connection_string: string;
  public cluster: Cluster;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    new MongodbatlasProvider(this, "MONGO", {
      publicKey: public_key,
      privateKey: private_key,
    });

    this.cluster = new Cluster(this, "cluster", {
      projectId: project_id,
      name: "rod-cdktf-test",
      mongoDbMajorVersion: "4.4",
      providerName: "AWS",
      providerVolumeType: "STANDARD",
      providerInstanceSizeName: provider_instance_size_name,
      cloudBackup: cloud_backup,
      diskSizeGb: disk_size_gb,
      clusterType: cluster_type,
      replicationSpecs: [
        {
          numShards: num_shards,
          regionsConfig: [
            {
              regionName: region,
              electableNodes: 3,
              priority: 7,
              readOnlyNodes: 0,
            },
          ],
        },
      ],
      labels: [
        {
          key: "Environment",
          value: environment,
        },
        {
          key: "Project",
          value: "rod_cdktf",
        },
        {
          key: "CDKTF",
          value: "true",
        },
      ],
    });

    new DatabaseUser(this, "USER", {
      username: dbuser,
      password: dbuser_password,
      projectId: project_id,
      authDatabaseName: "admin",
      roles: [
        {
          roleName: "readWriteAnyDatabase",
          databaseName: "admin",
        },
      ],
    });

    this.connection_string = this.cluster.connectionStrings("0").standardSrv;

    new TerraformOutput(this, "mongo_uri", {
      value: this.connection_string,
    });

    new S3Backend(this, {
      bucket: "onewallet-cdktf-test",
      key: "cdktf/mongo.json",
      region: "ap-southeast-1",
    });
  }
}

const app = new App();
new mongoStack(app, "mongo");

app.synth();
