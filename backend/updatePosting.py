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
    
        coordinates = [0] * 2
        coordinates[0] = decimal.Decimal(str(body['coordinates'][0]))
        coordinates[1] = decimal.Decimal(str(body['coordinates'][1]))
        response = table.update_item(
            Key={
                'UUID': uuid
            },
            UpdateExpression='SET city = :city, \
                                  description = :description, \
                                  coordinates = :coordinates, \
                                  petName = :petName, \
                                  animalType = :animalType',
            ExpressionAttributeValues={
                ':city': body['city'],
                ':description': body['description'],
                ':coordinates': coordinates,
                ':petName': body['petName'],
                ':animalType': body['animalType'],
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