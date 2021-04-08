from lambda_function import *

def updatePosting(body, table):
    
    try:
        response = table.update_item(
            Key={
                'UUID': body['uuid']
            },
            UpdateExpression='SET city = :city, \
                                  description = :description, \
                                  postingType = :postingType, \
                                  coordinates = :coordinates, \
                                  petName = :petName, \
                                  animalType = :animalType \
                                  imgKey = : imgKey',
            ExpressionAttributeValues={
                ':city': body['city'],
                ':description': body['description'],
                ':postingType': body['postingType'],
                ':coordinates': body['coordinates'],
                ':petName': body['petName'],
                ':animalType': body['animalType']
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