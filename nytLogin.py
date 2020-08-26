import json
import urllib3

def lambda_handler(event, context):
    try:
        username = ''
        password = ''
        jwt = None
        body = {
            'jwt': None
        }

        queryStringParameters = event['queryStringParameters']
        username = queryStringParameters['username']
        password = queryStringParameters['password']

        responseCode = 200

        """Get the NYT-S cookie after logging in"""
        http = urllib3.PoolManager()
        try:
            login_resp = http.request('POST',
                'https://myaccount.nytimes.com/svc/ios/v2/login',
                fields={
                    'login': username,
                    'password': password,
                },
                headers={
                    'client_id': 'ios.crosswords',
                },
                encode_multipart=False
            )
        except Exception as e:
            responseCode = 500
            print(f'Unable to login to NYT: {e}')

        for cookie in json.loads(login_resp.data)['data']['cookies']:
            if cookie['name'] == 'NYT-S':
                jwt = cookie['cipheredValue']

        print(jwt)
        body['jwt'] = jwt

        response = {
            'statusCode': responseCode,
            'body': json.dumps(body),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }

        print(response)

        return response
    except Exception as e:
        return {
            'statusCode': 500,
            'body': str(e),
            'headers': {
                'Access-Control-Allow-Origin': '*'
            }
        }