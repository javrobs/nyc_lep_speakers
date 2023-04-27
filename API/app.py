#Import flask and jsonify to run the api
from flask import Flask,jsonify

#Define app to run api using Flask
app = Flask(__name__)

@app.route("/")
def home():
    return 'Hello'

        
#Run app code
if __name__=="__main__":
    app.run(debug=True)