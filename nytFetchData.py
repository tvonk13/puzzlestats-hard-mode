import json
import urllib3
from datetime import datetime

def lambda_handler(event, context):
    try:
        DATE_FORMAT = '%Y-%m-%d'
        jwt = None
        date = None
        body = {
            'data': None
        }


        eventData = json.loads(event['body'])
        print(eventData)

        date_s = eventData['date']
        date = datetime.strptime(date_s, DATE_FORMAT);
        jwt = eventData['jwt']

        responseCode = 200

        print("Getting stats for " + date_s)

        date_str = datetime.strftime(date, DATE_FORMAT)
        try:
            http = urllib3.PoolManager()
            puzzle_resp = http.request('GET', f'https://nyt-games-prd.appspot.com/svc/crosswords/v2/puzzle/daily-{date_str}.json')
            puzzle_id = json.loads(puzzle_resp.data)['results'][0]['puzzle_id']
            #print(f'puzzle id: {puzzle_id}')

            stats_resp = http.request('GET', f'https://nyt-games-prd.appspot.com/svc/crosswords/v2/game/{puzzle_id}.json', headers={'Cookie': f'NYT-S={jwt}'})
            print(stats_resp)
            body['data'] = json.loads(stats_resp.data)['results']
            body['data']['puzzleDate'] = date_str

            print(body)

        except Exception as e:
            print(f'error fetching data for {date}: {e}')

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