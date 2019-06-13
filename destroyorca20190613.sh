heroku pipelines:destroy orca20190613-pipeline
heroku apps:destroy -a orca20190613-dev -c orca20190613-dev
heroku apps:destroy -a orca20190613-staging -c orca20190613-staging
heroku apps:destroy -a orca20190613-prod -c orca20190613-prod
rm -- "destroyorca20190613.sh"
