# Puzzle Stats (hard mode)

This is a copy of my full puzzle stats app with the aws config files removed to allow it to be used by others. Please feel free to fork this project or submit updates for improvement!

The purpose of this project is to create a web app that allows users to sync their New York Times Crossword data and view more informative statistics and graphs based on that data.

# Setup Instructions
* Checkout or fork this repository

### Setup AWS Amplify
* Follow these instructions to configure aws amplify https://docs.amplify.aws/start/getting-started/installation/q/integration/react
    * Skip the steps to create a new react app
    * In the section to create a GraphQL API and database, use the schema.graphql contents in the top level folder of this project
    
### Setup AWS Auth
    amplify add auth
    
    ? Do you want to use the default authentication and security configuration? Default configuration
    ? How do you want users to be able to sign in? Username
    ? Do you want to configure advanced settings?  No, I am done.
    
    amplify push

### Setup API
* Create 2 lambdas in AWS Lambda - nytLogin and nytFetchData - using the provided python code in the top level folder of this project (nytLogin.py and nytFetchData.py)
* Create an API in API Gateway with nytLogin as a GET endpoint and nytFetchData as a POST endpoint
* Replace the value of the baseUrl variable in /src/Utils/util.js with the url of your API

\*The api code was adapted from this [project](https://github.com/mattdodge/nyt-crossword-stats.git) by mattdodge
