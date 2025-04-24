# PDF Analyzer Application

## Deployment

The application is deployed to AWS S3 and served via CloudFront.

1.  **Build the project:**
    ```bash
    npm run build
    ```
    This creates an optimized production build in the `dist/` directory.

2.  **Deploy to Production:**
    ```bash
    npm run deploy:prod -- --profile <aws-profile>
    ```
    Replace `<aws-profile>` with the name of your configured AWS CLI profile. This script performs the following actions:
    *   Syncs the `dist/` directory contents to the `s3://dimosaic.dev` S3 bucket.
    *   Creates a CloudFront invalidation for distribution `ELIKG4D5XSD7R` to ensure the latest changes are served.


