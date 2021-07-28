let fs = require("fs");
let fsPromises = require("fs").promises;
let i = require("./modules/changeNodeSettings");

class createEnvironment {
  private settings: any;
  private schemas: any;

  private async createContent() {
    let x = await i.nodeSettings();
    let y = {
      serverNode: {
        nodes: [
          {
            host: x.host,
            port: x.port,
            protocol: x.protocol,
          },
        ],
        apiKey: x.apiKey,
      },
      chunckSize: 10000,
      displayTitle: true,
    };
    let z = {
      automatic: {
        name: "automatic",
        fields: [
          { name: ".*", type: "auto" },
          { name: "title", type: "string", facet: true },
        ],
      },
      forum: {
        name: "forum",
        fields: [
          { name: "docType", type: "string" },
          { name: "url", type: "string" },
          { name: "body", type: "string" },
          { name: "title", type: "string" },
          { name: "reply", type: "bool" },
          { name: "date", type: "int32" },
        ],
      },
    };
    this.schemas = JSON.stringify(z);
    this.settings = JSON.stringify(y);
  }

  public async createFiles() {
    await this.createContent();
    fsPromises
      .mkdir(process.env.HOME + "/.typesense-cli", { recursive: true })
      .then((error) => {
        if (error) throw error;
        console.log(
          "New directory .typesense-cli created in the home directory"
        );
        fsPromises
          .writeFile(
            process.env.HOME + "/.typesense-cli/typesense-cli.config.json",
            this.settings
          )
          .then(async (error) => {
            if (error) throw error;
            console.log(
              "typesense-cli.config.json successfully created in .typesense-cli"
            );
            let set = await fsPromises.open(
              process.env.HOME + "/.typesense-cli/typesense-cli.config.json",
              "r"
            );
            fs.fchmod(set.fd, 0o777, (err) => {
              if (err) throw err;
              console.log(
                "permissions for typesense-cli.config.json updated to rwx for all users"
              );
            });
          });
        fsPromises
          .writeFile(
            process.env.HOME + "/.typesense-cli/schemas.json",
            this.schemas
          )
          .then(async (error) => {
            if (error) throw error;
            console.log("schemas.json successfully created in .typesense-cli");
            let sch = await fsPromises.open(
              process.env.HOME + "/.typesense-cli/schemas.json",
              "r"
            );
            fs.fchmod(sch.fd, 0o777, (err) => {
              if (err) throw err;
              console.log(
                "permissions for schemas.json updated to rwx for all users"
              );
            });
          });
      });
  }
}

let App = new createEnvironment();

App.createFiles();
