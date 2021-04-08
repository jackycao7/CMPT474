import smtplib
import random
from email.message import EmailMessage

# CHANGE TO YOUR OWN AMPLIFY LINK
amplifyLink = 'https://dev.deycwj94w1425.amplifyapp.com'



def sendMail(contactEmail, item_uuid, random_ac, postingType, animalType, city):
    editLink = amplifyLink + '/edit/' + item_uuid
    deleteLink = amplifyLink + '/delete/' + item_uuid
    msg = EmailMessage()
    msg.set_content('''
    Dear User,
    
    Thank you for creating a posting at PetFindr!
    
    Here is your access code: {}
    
    This posting is for the {} {} in {}.
    
    Edit postings link: {}
    Delete postings link: {}
    
    Please keep this email somewhere safe.
    
    Respectfully,
    
    Jacky Bao
    CEO PetFindr
    
    '''.format(random_ac, postingType, animalType, city, editLink, deleteLink))
    msg['Subject'] = 'PetFindr signup'
    msg['From'] = 'petfindr474@gmail.com'
    msg['To'] = contactEmail

    try:
        server = smtplib.SMTP_SSL('smtp.gmail.com: 465')
        server.login('petfindr474@gmail.com', 'mizytswiuzjmkbjx')
        server.send_message(msg)
        server.quit()
        print('successfully sent\n')
        
    except Exception as e:
        raise Exception('Error:', e)

    return