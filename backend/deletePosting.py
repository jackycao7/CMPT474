from lambda_function import *

def deletePosting(body, table):
    
    try:
        response = table.delete_item(
            Key={
                'UUID': body['uuid']
            },
        )
        
    except Exception as e:
        raise Exception('Error: ' + str(e))

    statusCode = response['ResponseMetadata']['HTTPStatusCode']
    if(statusCode == 200):
        responseBody = response
    else:
        responseBody = "Delete unsuccessful."
    
    responseObject = {
        "statusCode": statusCode,
        "responseBody": responseBody
    }

    return responseObject