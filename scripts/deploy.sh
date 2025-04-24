#!/bin/bash

# Default values
PROFILE_ARG=""
DIST_DIR="dist"
S3_BUCKET="s3://dimosaic.dev/pdfa"
CF_DISTRIBUTION_ID="ELIKG4D5XSD7R"

# Parse arguments: Expecting --profile <profile_name>
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --profile)
            if [[ -z "$2" || "$2" == -* ]]; then
                echo "Error: --profile requires an argument."
                exit 1
            fi
            PROFILE_ARG="--profile $2"
            shift # past argument
            ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift # past argument or value
done

# Ensure the profile argument is correctly formed if provided
if [[ -n "$PROFILE_ARG" ]]; then
  echo "Using profile: ${PROFILE_ARG#* }"
else
  echo "Using default AWS profile."
fi

# Sync to S3
echo "Syncing $DIST_DIR to $S3_BUCKET..."
aws s3 sync "$DIST_DIR" "$S3_BUCKET" --delete $PROFILE_ARG

# Check if sync was successful
if [ $? -ne 0 ]; then
  echo "S3 sync failed. Aborting deployment."
  exit 1
fi

# Invalidate CloudFront
echo "Creating CloudFront invalidation for distribution $CF_DISTRIBUTION_ID..."
aws cloudfront create-invalidation --distribution-id "$CF_DISTRIBUTION_ID" --paths "/*" $PROFILE_ARG --no-cli-pager --output yaml

if [ $? -ne 0 ]; then
  echo "CloudFront invalidation failed."
  exit 1
fi

echo "Deployment successful!" 