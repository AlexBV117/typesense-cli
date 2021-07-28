import { O_CREAT } from "constants";

let fs = require("fs");
let fsPromises = require("fs").promises;
let i = require("./modules/changeNodeSettings");

class createEnvironment {
  private settings: any;
  private schemas: any;
  private home = process.env.HOME;

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
        fields: [{ name: ".*", type: "auto" }],
      },
    };
    this.schemas = JSON.stringify(z);
    this.settings = JSON.stringify(y);
  }

  public async createFiles() {
    await this.createContent();
    fsPromises
      .mkdir(this.home + "/.typesense-cli", { recursive: true }, (err) => {
        if (err) throw err;
      })
      .then(async () => {
        console.log(
          "New directory .typesense-cli created in the home directory"
        );
        fsPromises
          .writeFile(
            this.home + "/.typesense-cli/typesense-cli.config.json",
            this.settings,
            (err) => {
              if (err) throw err;
            }
          )
          .then(async () => {
            console.log(
              "typesense-cli.config.json successfully created in .typesense-cli"
            );
            try {
              let set = await fsPromises.open(
                this.home + "/.typesense-cli/typesense-cli.config.json",
                "r"
              );
              fs.fchmod(set.fd, 0o777, (err) => {
                if (err) throw err;
                console.log(
                  "permissions for typesense-cli.config.json updated to rwx for all users"
                );
              });
            } catch (error) {
              console.log(error);
            }
          });
        fsPromises
          .writeFile(
            this.home + "/.typesense-cli/schemas.json",
            this.schemas,
            (err) => {
              if (err) throw err;
            }
          )
          .then(async () => {
            console.log("schemas.json successfully created in .typesense-cli");
            try {
              let sch = await fsPromises.open(
                this.home + "/.typesense-cli/schemas.json",
                "r"
              );
              fs.fchmod(sch.fd, 0o777, (err) => {
                if (err) throw err;
                console.log(
                  "permissions for schemas.json updated to rwx for all users"
                );
              });
            } catch (error) {
              console.log(error);
            }
          });
      });
  }
}

let App = new createEnvironment();

App.createFiles();
