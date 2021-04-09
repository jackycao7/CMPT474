from lambda_function import *

def updatePosting(body, uuid, table):
    
    try:
        # checks if uuid is in table and if accessCode is correct
        check = table.get_item(Key={'UUID': uuid})
        if 'Item' in check:
            if body['accessCode'] != check['Item']['accessCode']:
                raise Exception('Error: Incorrect accessCode')
        else:
            raise Exception('Error: UUID does not exist.')
            
        response = table.update_item(
            Key={
                'UUID': uuid
            },
            UpdateExpression='SET city = :city, \
                                  description = :description, \
                                  postingType = :postingType, \
                                  coordinates = :coordinates, \
                                  petName = :petName, \
                                  animalType = :animalType, \
                                  imgKey = :imgKey',
            ExpressionAttributeValues={
                ':city': body['city'],
                ':description': body['description'],
                ':postingType': body['postingType'],
                ':coordinates': body['coordinates'],
                ':petName': body['petName'],
                ':animalType': body['animalType'],
                ':imgKey': body['imgKey']
            }
        )
        
    except Exception as e:
        raise Exception('Error: ' + str(e))

    statusCode = response['ResponseMetadata']['HTTPStatusCode']
    if(statusCode == 200):
        responseBody = "Edit successful."
    else:
        responseBody = "Edit unsuccessful."
    
    responseObject = {
        "statusCode": statusCode,
        "responseBody": responseBody
    }

    return responseObject