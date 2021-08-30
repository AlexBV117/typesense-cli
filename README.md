# typesense-cli

Welcome to Typesense-CLI;

Typesnese cli is a node js application that aims to improve the back-end management of your self-hosted typesense server. It utilizes the [typesense-js](https://github.com/typesense/typesense-js) client library to achieve its functionality.

# Getting Started

clone repo:
```sh
git clone https://github.com/AlexBV117/typesense-cli.git
```
then run:
```sh
npm run typesense-cli
```
This will install dependencies and do the initialization

If you want to be able to call the cli from anywhere using `typesense`
you will need to add typesense to your path. Otherwise, you will have to use `./bin/typesense`
in the typesense-cli directory. 

Or you can use 
```sh
npm link
```
However, this often needs to be run as sudo

# List of Commands: 

--help,          -h:      prints the help message

--index,         -i:      Indexes documents into a collection. Can index to multiple collections with multiple data sets at a time

--append         -a:      Indexes documents into a collection. However unlike --index it does not clear the preexisting collections

--schemas,       -s:      returns out the list of defined schemas in ~/.typesense-cli/schemas.json file

--version,       -v:      returns the version of typesense-cli that you are running

--server,        n/a:     allows you to update the server node that the cli will use

--collections,   -c:      returns the collections on the server

--key,           -k:      returns the active Api keys

--new,           -n:      append to either --keys to create a new api keys

--remove,        -r:      append to either --keys or --collections and will remove all keys or collections passed


# Command Examples:

typesense --index=
'[{ "collection":"col1", "data":["example/path/to/data1.json", "example/path/data2.json"] }, { "collection":"col2", "data":["example/path/to/data3.json"] }]'

Running this command will index data sets 1&2 into collection1 and data3 int collection2. It is important to note that everything between the '' must be valid
json. The current operation of the --index command will clear all previously indexed documents in that collection. --append will be added later allowing you to
add new documents without deleting ones currently indexed in the collection. The make sure that the collection has a defined schema of the same name in
~/.typesense-cli/schemas.json.

typesense --keys -r "1 3 10"

Running this command will remove the Api keys with id 1, 3, and 10.

typesense --keys -n {"description": "admin key", "actions": ["*"], "collections": ["*"]}

Running this command will create a new admin Api key. See [Typesense Docs](https://typesense.org/docs/0.20.0/api/api-keys.html) for more info on creating api keys
NOTE: this command will return the full key to you at this point only so make a note of it somewhere.

typesense --collections -r "automatic col1 col2"

Running this command will delete the collections listed

# Other important info
On startup a new hidden folder is created in your home directory .typesense-cli. This directory contains the config file as well as a place to define your 
schemas. By default, the cli chunks the data sets provided into chunks of 10,000 documents to index at a time. Increasing the chunk size may cause instabilities.
Finally, there is a data file located in .typesense-cli that you can use to store your documents if you wish to.

