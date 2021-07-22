# typesense-cli

STATUS: INCOMPLETE

My goal is to create a command line interface using node.js (allowing dependencies to be dealt with using npm). The CLI should allow for easy management of your Typesense server. It will build on top of the Typesense JS library and allow its back-end functionality to be used in the command line. For example, you should be able to manage schemas, collections, and keys as well as index data into memory, all from the command line. You should be able to run the command ‘typesense’ and append specific flags to customise the command. Front end functionality such as searching would not be supported.

Potential flags:

--i
This will be the index flag. It will be flexible allowing for you to index to multiple collections each with multiple data sets with just a single command. It will take an array of objects each one representing a collection. The objects will have two properties.

The collection property will refer to the collection and associated schema that will be used to index the data into memory.
The data array will include all the data sets that will be indexed to the collection. The data sets can either be placed in a directory created at installation and referenced as a string, or have the user pass the path to the data.json files.
Side Note:
I am aware that the way the data needs to be presented to the application is complex, however it is the simplest implementation that can keep the command flexible. While migrating over from Algolia to a self-hosted typesense search server I have to index three data sets that share an automatic schema and a fourth which has its own custom schema. This would allow me to index all that data correctly with a single command. As a result, I assume that others may also wish to do more than index one data set into a single collection at a time. Hence the collection data objects structure as an input.
Example:
typesense --i=” [{collection: “exampleCollection”, data: [“exampleData1”, “exampleData2”]}]”
This command will index the two example data sets into the example collection using a predefined schema which is stored in a schemas.json file.

--s
Will return the schemas currently defined in the schemas.json file. Having the schemas stored in a single file will make it easy to update and define new schemas. The file will have a predefined auto schema that can be used as a starting point.

--node
On the initial setup the cli will ask you to point to a server node and provide the relevant information such as the API key and access port. However, if this were to change in the future, running the “--node” command would allow you to make any necessary changes to the required information.
That said, it is possible to manage the configuration with a config file similarly to the way in which nginx operates.

--version
Will return the version of Typesense CLI that is installed (assuming that it is updated in the future)

--help
Will give a full list of possible commands and how they operate.

--key
This will refer to an operation carried out on the API key list. This flag will be followed by a second flag that will determine the operation. Without any follow up flags it will simply return a list of the all the API keys
--key -rm=”12”
(remove) this will take the keys ID as an argument and will then delete the key.
--key -n=”{description: “admin key”, permissions:””, collections:””}”
(new) this will make a new key based on the parameters given and return it to the user. It can also include a message to note the full key down somewhere as the full key cannot be returned in the future.

--col
This will refer to operations carried out on the collection list. Without a follow up flag, it will return a list of all the collections on the server.
--col -rm=“collection”
(remove) will delete the named collection.
The remove functions will be limited to single keys and collections to mitigate accidents. However, if it is more useful to allow multiple keys/ collections to be removed at a time then this could be implemented.

This is just my initial plan for what I want to build (nothing is set in stone). The commands I have described above are simply mirroring the methods of the typescript class I made to handle this functionality. However, more can be added at some point.
I really hope this looks like a useful tool and would greatly appreciate your feedback on possible improvements on its implementation.
