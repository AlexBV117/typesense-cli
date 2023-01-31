export TYPESENSE_API_KEY=b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAlwAAAAdzc2gtcn

mkdir $(pwd)/typesense_data

docker run -p 8108:8108 -v$(pwd)/typesense-data:/data typesense/typesense:0.23.1 \
  --data-dir /data --api-key=$TYPESENSE_API_KEY --enable-cors