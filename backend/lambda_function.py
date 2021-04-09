import json
import boto3
import decimal
import uuid
from time import gmtime, strftime
from boto3.dynamodb.conditions import Key, Attr
from createPostings import *
from getPostings import *
from updatePosting import *
from deletePosting import *
from verifyCaptcha import *

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Postings')

def lambda_handler(event, context):

    try:
        if event['http_method'] == 'GET':
            # Get one posting by uuid, ignores any filter in request body
            if 'uuid' in event['body'] and event['body']['uuid'] != "":
                response = getPostingByUUID(table, event['body']['uuid'])
                responseBody = response['responseBody']
                statusCode = response['statusCode']
                
            # Get all postings based on filters
            else:
                response = getPosting(event['body'], table)
                responseBody = response['responseBody']
                statusCode = response['statusCode']
        
        # Create posting with captcha verification
        elif event['http_method'] == 'POST':
            coordinates = [0] * 2
            coordinates[0] = decimal.Decimal(str(event['body']['coordinates'][0]))
            coordinates[1] = decimal.Decimal(str(event['body']['coordinates'][1]))
            event['body']['coordinates'] = coordinates
            
            captchaSuccess = verifyCaptcha(event['body'])
            
            if captchaSuccess:
                response = createPosting(event['body'], table)
                responseBody = response['responseBody']
                statusCode = response['statusCode']
            else:
                response = "Captcha failed"
                statusCode = 500
        
        # Edit posting
        elif event['http_method'] == 'PUT':
            response = updatePosting(event['body']['requestBody'], event['body']['uuid'], table)
            responseBody = response['responseBody']
            statusCode = response['statusCode']
            
        # Delete posting
        elif event['http_method'] == 'DELETE':
            response = deletePosting(event['body']['requestBody'], event['body']['uuid'], table)
            responseBody = response['responseBody']
            statusCode = response['statusCode']
            
        else:
            statusCode = 404
            responseBody = 'Resource not found.'
        
    except Exception as e:
        raise Exception(e)
    
    return {
        'statusCode': statusCode,
        'body': responseBody,
    }
