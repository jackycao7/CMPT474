from lambda_function import *

def deletePosting(body, table):
    
    try:
        # checks if uuid is in table and if accessCode is correct
        check = table.get_item(Key={'UUID': body['uuid']})
        if 'Item' in check:
            if body['accessCode'] != check['Item']['accessCode']:
                raise Exception('Error: Incorrect accessCode')
        else:
            raise Exception('Error: UUID does not exist.')
            
        response = table.delete_item(
            Key={
                'UUID': body['uuid']
            }
        )
    except Exception as e:
        raise Exception('Error: ' + str(e))

    statusCode = response['ResponseMetadata']['HTTPStatusCode']
    if(statusCode == 200):
        responseBody = "Delete successful."
    else:
        responseBody = "Delete unsuccessful."
    
    responseObject = {
        "statusCode": statusCode,
        "responseBody": responseBody
    }

    return responseObject