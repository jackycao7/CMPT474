from lambda_function import *

def queryTableWithFilters(table, partitionKey, allFilters, lastEvaluatedKey, sortDateAscending):
    
    filterCount = 0
    # Converts each filter into an expression for the query
    for filterName in allFilters:
        if filterCount == 0:
            filterExpression = Attr(filterName).eq(allFilters[filterName])
        else:
            filterExpression = filterExpression & Attr(filterName).eq(allFilters[filterName])
        filterCount+=1
    
    try:
        if lastEvaluatedKey == '':
            response = table.query(
                            IndexName = 'postingType-datePosted-index',
                            KeyConditionExpression = Key('postingType').eq(partitionKey),
                            FilterExpression = filterExpression,
                            ScanIndexForward = sortDateAscending,
                            ProjectionExpression = '#uuid, contactEmail, contactPhone, city, description, postingType, dateLostFound, coordinates, petName, animalType, datePosted',
                            ExpressionAttributeNames = {'#uuid': 'UUID'}
                        )
        else:
            # Query with pagination
            response = table.query(
                            IndexName = 'postingType-datePosted-index',
                            KeyConditionExpression = Key('postingType').eq(partitionKey),
                            FilterExpression = filterExpression,
                            ScanIndexForward = sortDateAscending,
                            ProjectionExpression = '#uuid, contactEmail, contactPhone, city, description, postingType, dateLostFound, coordinates, petName, animalType, datePosted',
                            ExpressionAttributeNames = {'#uuid': 'UUID'},
                            ExclusiveStartKey = lastEvaluatedKey,
                        )
                        
    except Exception as e:
        raise Exception(e)
        
    return response
    
def queryTableWithoutFilters(table, partitionKey, lastEvaluatedKey, sortDateAscending):
    try:
        if lastEvaluatedKey == '':
            response = table.query(
                            IndexName = 'postingType-datePosted-index',
                            KeyConditionExpression = Key('postingType').eq(partitionKey),
                            ScanIndexForward = sortDateAscending,
                            ProjectionExpression = '#uuid, contactEmail, contactPhone, city, description, postingType, dateLostFound, coordinates, petName, animalType, datePosted',
                            ExpressionAttributeNames = {'#uuid': 'UUID'}
                        )
        else:
             response = table.query(
                            IndexName = 'postingType-datePosted-index',
                            KeyConditionExpression = Key('postingType').eq(partitionKey),
                            ScanIndexForward = sortDateAscending,
                            ProjectionExpression = '#uuid, contactEmail, contactPhone, city, description, postingType, dateLostFound, coordinates, petName, animalType, datePosted',
                            ExpressionAttributeNames = {'#uuid': 'UUID'},
                            ExclusiveStartKey = lastEvaluatedKey
                        )
                        
    except Exception as e:
        raise Exception(e)
        
    return response


def getPostingByUUID(table, uuid):
    try:
        response = table.get_item(
            Key={
                'UUID': uuid
            },
            ProjectionExpression = '#uuid, contactEmail, contactPhone, city, description, postingType, dateLostFound, coordinates, petName, animalType, datePosted',
            ExpressionAttributeNames = {'#uuid': 'UUID'}
        )
    except Exception as e:
        raise Exception(e)

    statusCode = response['ResponseMetadata']['HTTPStatusCode']
    responseBody = response['Item']
    
    responseObject = {
        "statusCode": statusCode,
        "responseBody": responseBody
    }

    return responseObject

def getPosting(body, table):
    postingType = body['postingType']
    if postingType not in ['Lost', 'Found']:
        raise Exception('Error: Posting type is incorrect.')
    
    # False -> descending sort order
    # True -> ascending sort order
    sortDateAscending = body['dateSortOrder'] == 'asc'
    
    lastEvaluatedKey = body['lastEvaluatedKey']
    
    # Collects all non-empty filters from the request body
    allFilters = {}
    for filter in body:
        if filter not in  ['postingType', 'lastEvaluatedKey', 'dateSortOrder'] and body[filter] != "":
            allFilters[filter] = body[filter]

    try:
        if len(allFilters) > 0:
            response = queryTableWithFilters(table, postingType, allFilters, lastEvaluatedKey, sortDateAscending)
        else:
            response =  queryTableWithoutFilters(table, postingType, lastEvaluatedKey, sortDateAscending)
            
    except Exception as e:
        raise Exception('Error: ' + str(e))

    statusCode = response['ResponseMetadata']['HTTPStatusCode']
    responseBody = {
        "numPostings": response['Count'],
        "postings": response['Items']
    }
    
    # If LastEvaluatedKey is returned from the table query, then there are more postings to retrieve
    # Otherwise, all postings have already been retrieved
    if 'LastEvaluatedKey' in response:
            responseBody['lastEvaluatedKey'] = response['LastEvaluatedKey']
            
    responseObject = {
        'responseBody': responseBody,
        'statusCode': statusCode
    }
    return responseObject