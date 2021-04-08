from lambda_function import *
from sendMail import *
import time

def createPosting(body, table):
    
    try:
        item_uuid = str(uuid.uuid4())
        random_ac = ''.join([str(random.randint(0, 999)).zfill(3) for _ in range(2)])
        response = table.put_item(
            Item = {
                'UUID': item_uuid,
                'contactEmail': body['contactEmail'],
                'contactPhone': body['contactPhone'],
                'city': body['city'],
                'description': body['description'],
                'postingType': body['postingType'],
                'dateLostFound': body['dateLostFound'],
                'coordinates': body['coordinates'],
                'petName': body['petName'],
                'animalType': body['animalType'],
                'datePosted': str(int(time.time())),
                'active': 1,
                'accessCode': random_ac,
                'imgKey': body['imgKey']
            }
        )
        sendMail(body['contactEmail'],item_uuid, random_ac, body['postingType'], body['animalType'], body['city'])
        
    except Exception as e:
        raise Exception('Error: ' + str(e))
    
    statusCode = response['ResponseMetadata']['HTTPStatusCode']
    if(statusCode == 200):
        responseBody = "Posting created successfully."
    else:
        responseBody = "Posting created unsuccessfully."
    
    responseObject = {
        "statusCode": statusCode,
        "responseBody": responseBody
    }
        
    return responseObject