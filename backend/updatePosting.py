from lambda_function import *

def updatePosting(body, uuid, table):
    
    try:
        response = table.update_item(
            Key={
                'UUID': uuid
            },
            UpdateExpression='SET contactEmail = :contactEmail, \
                                  contactPhone = :contactPhone, \
                                  city = :city, \
                                  description = :description, \
                                  postingType = :postingType, \
                                  coordinates = :coordinates, \
                                  petName = :petName, \
                                  animalType = :animalType, \
                                  active = :active',
            ExpressionAttributeValues={
                ':contactEmail': body['contactEmail'],
                ':contactPhone': body['contactPhone'],
                ':city': body['city'],
                ':description': body['description'],
                ':postingType': body['postingType'],
                ':coordinates': body['coordinates'],
                ':petName': body['petName'],
                ':animalType': body['animalType'],
                ':active': body['active']
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