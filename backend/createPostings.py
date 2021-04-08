from lambda_function import *
from sendMail import *

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
                'datePosted': strftime("%a, %d %b %Y %H:%M:%S +0000", gmtime()),
                'active': 1,
                'accessCode': random_ac
            }
        )
        
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