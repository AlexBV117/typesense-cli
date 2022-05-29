let fs = require("fs");
let fsPromises = require("fs").promises;
let i = require("./modules/inquire");

class createEnvironment {
  private settings: any;
  private schemas: any;
  private home = process.env.HOME;
  private help = `Welcome to Typesense-cli!!! 

  List of Commands: 
  
  --help          -h      prints this message;
  --index         -i      Indexes documents into a collection;
  --append        -a:     Indexes documents into a collection. However unlike --index it does not clear the preexisting collections;
  --schemas       -s      returns out the list of defined schemas in ~/.typesense-cli/schemas.json file;
  --version       -v      returns the version of typesense-cli that you are running;
  --server        n/a     allows you to update the server node that the cli will use;
  --collections   -c      returns the collections on the server;
  --key           -k      returns the active Api keys;
  --new           -n      append to either --keys to create a new api keys;
  --remove        -r      append to either --keys or --collections and will remove all keys or collections passed;
  
  for more information on these commands and how to structure arguments please see the README.md 
  in the typesense-cli repo.
  `;

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
          .mkdir(
            this.home + "/.typesense-cli/data",
            { recursive: true },
            (err) => {
              if (err) throw err;
            }
          )
          .then(() => {
            console.log("New data directory created in .typesense-cli");
          });
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
        fsPromises
          .writeFile(
            this.home + "/.typesense-cli/help.txt",
            this.help,
            (err) => {
              if (err) throw err;
            }
          )
          .then(() => {
            console.log("help.txt successfully created in .typesense-cli");
          });
      });
  }
}

let App = new createEnvironment();

App.createFiles();
