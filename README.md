# Puzzlestats (hard mode)

This is a copy of my full puzzlestats app with the aws config files removed to allow it to be used by others. Please feel free to fork this project or submit updates for improvement!

# Setup Instructions
- Checkout or fork this repository

### Setup AWS Amplify
- Follow these instructions to configure aws amplify https://docs.amplify.aws/start/getting-started/installation/q/integration/react
    - Skip the steps to create a new react app
    - In the section to create a GraphQL API and database, use the schema.graphql contents in the top level folder of this project
    
### Setup AWS Auth
    amplify add auth
    
    ? Do you want to use the default authentication and security configuration? Default configuration
    ? How do you want users to be able to sign in? Username
    ? Do you want to configure advanced settings?  No, I am done.
    
    amplify push
