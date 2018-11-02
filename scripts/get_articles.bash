#!/bin/bash

# First argument is the Graphql host.
# Second argument is directory where to output if not supplied it will use current

host=${1}
path=${2}

articles=`
curl \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"query":"query getArticles { articles { translations { id yaml } } } "}' \
  ${host}
`

for row in $(echo "${articles}" | jq -r '.data.articles[].translations[] | @base64'); do
   decoded_row=`echo ${row} | base64 --decode`
   filename=`echo ${decoded_row} | jq -r '.id'`

   echo ${decoded_row} | jq -r '.yaml' > ${path:-`echo .`}/${filename}.md
done
