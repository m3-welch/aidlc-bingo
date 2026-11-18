# Deploying to Google Cloud Run

Cloud Run scales to zero and Firestore has a free tier, so a small mob costs ~$0.
The `Deploy to Cloud Run` workflow deploys on every push to `main`.

## One-time setup

Replace the values below, then run in a shell with `gcloud` authenticated as a project owner.

```sh
export PROJECT_ID=your-project REGION=us-central1 REPO=m3-welch/aidlc-bingo
gcloud config set project $PROJECT_ID
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com \
  firestore.googleapis.com iamcredentials.googleapis.com
gcloud firestore databases create --location=$REGION

# Deployer service account used by GitHub Actions
gcloud iam service-accounts create gh-deployer
SA=gh-deployer@$PROJECT_ID.iam.gserviceaccount.com
for role in run.admin cloudbuild.builds.editor artifactregistry.writer storage.admin serviceusage.serviceUsageConsumer; do
  gcloud projects add-iam-policy-binding $PROJECT_ID --member=serviceAccount:$SA --role=roles/$role
done
# Cloud Run's runtime identity needs Firestore access, and the deployer must act as it
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
RUNTIME=$PROJECT_NUMBER-compute@developer.gserviceaccount.com
gcloud projects add-iam-policy-binding $PROJECT_ID --member=serviceAccount:$RUNTIME --role=roles/datastore.user
gcloud iam service-accounts add-iam-policy-binding $RUNTIME --member=serviceAccount:$SA --role=roles/iam.serviceAccountUser

# Keyless auth from GitHub (Workload Identity Federation)
gcloud iam workload-identity-pools create github --location=global
gcloud iam workload-identity-pools providers create-oidc github-oidc --location=global \
  --workload-identity-pool=github --issuer-uri=https://token.actions.githubusercontent.com \
  --attribute-mapping=google.subject=assertion.sub,attribute.repository=assertion.repository \
  --attribute-condition="assertion.repository=='$REPO'"
gcloud iam service-accounts add-iam-policy-binding $SA --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/github/attribute.repository/$REPO"
echo "GCP_WORKLOAD_IDENTITY_PROVIDER=projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/github/providers/github-oidc"
echo "GCP_SERVICE_ACCOUNT=$SA"
```

## GitHub repository variables (Settings → Secrets and variables → Actions → Variables)

`GCP_PROJECT_ID`, `GCP_REGION`, `GCP_WORKLOAD_IDENTITY_PROVIDER`, `GCP_SERVICE_ACCOUNT` (values from above).

Push to `main` (or run the workflow manually); the service URL is printed in the job output.

## Notes

- `--max-instances=2` caps cost. Real-time progress uses 4s polling of one Firestore document.
- Running locally (`npm run dev`) uses an in-memory store; set `STORE=firestore` plus
  `GOOGLE_CLOUD_PROJECT` and credentials (or the Firestore emulator) to use Firestore.
