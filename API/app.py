#Import flask and jsonify to run the api
from flask import Flask,jsonify
from pymongo import MongoClient
from flask_cors import CORS
import pandas as pd
from flask_cors import cross_origin

# Create an instance of MongoClient
client=MongoClient(port=27017)

# Assign the database to a variable name
languages=client.languages

# Assign the collections to variables
populations=languages.populations
communities=languages.communities

# Define app to run api using Flask
app = Flask(__name__)

CORS(app)

@app.route("/")
def home():
    return "This site is for developers only<br>\
            These are the possible routes:<br>\
            <a href='http://127.0.0.1:5000/communities'>/communities</a><br>\
            <a href='http://127.0.0.1:5000/populations_all'>/populations_all</a><br>\
            <a href='http://127.0.0.1:5000/populations/Spanish'>/populations/language </a> (Ex. Spanish)<br>\
            <a href='http://127.0.0.1:5000/demographic_all'>/demographic_all</a><br>\
            <a href='http://127.0.0.1:5000/demographic/Spanish'>/demographic/language </a> (Ex. Spanish)<br>"
            

@app.route("/communities")
def communities_api():
    communities_json=communities.find_one({})
    communities_json.pop("_id")
    return jsonify(communities_json)

@app.route("/populations_all")
def population_api():
    # Filter out 0 in LEP Population (To not show languages with 0 speakers every single time)
    query={'LEP Population (Estimate)':{"$gt":0}}
    population_json=populations.find(query)
    population_list=[]
    for each in population_json:
        each.pop("_id")
        population_list.append(each)
    return jsonify(population_list)

@app.route("/populations/<language>")
def population_language_api(language):
    query={'LEP Population (Estimate)':{"$gt":0},'Language':language}
    population_json=populations.find(query)
    population_list=[]
    for each in population_json:
        each.pop("_id")
        population_list.append(each)
    return jsonify(population_list)

@app.route("/demographic_all")
def demographics_all_api():
    # Filter out 0 in LEP Population (To not show languages  with 0 speakers every single time)
    query={'LEP Population (Estimate)':{"$gt":0}}
    population_json=populations.find(query)
    total_population_df = pd.DataFrame(population_json)
    total_population=sum(total_population_df['LEP Population (Estimate)'])
    response_dict = {}
    response_dict["language"]="ALL"
    response_dict["total_lep_population"] = total_population
    
# information for BIGGEST  5 LEP communities
    query={'LEP Population (Estimate)':{"$gt":0}}
    sort=[('LEP Population (Estimate)',-1)]
    fields ={"Borough":1,"LEP Population (Estimate)":1,"Community District Name":1,"Language":1}
    limit=5
    demo_list= []
    demo_data=populations.find(query,fields).sort(sort).limit(limit)
    for each in demo_data:
        each.pop("_id")
        demo_list.append(each)
    response_dict["biggest_communities"]=demo_list
    return jsonify(response_dict)


    

@app.route("/demographic/<language>")
def demographic_api(language):
    query={'LEP Population (Estimate)':{"$gt":0}}
    population_json=populations.find(query)
    total_population_df = pd.DataFrame(population_json)
    total_population=sum(total_population_df['LEP Population (Estimate)'])

    match_query= {'$match':{'Language': language}}
    group_query = {'$group':{'_id':'$Language','sum':{'$sum':'$LEP Population (Estimate)'}}}
    pipeline=[match_query,group_query]
    language_sum= list(populations.aggregate(pipeline))[0]['sum']
    result_dict={}
    result_dict['LEP_percentage']=language_sum/total_population*100
    result_dict['Language']=language
    result_dict['total_population']=language_sum
    # 5 biggest communities that speak this language!!!!
    query={'LEP Population (Estimate)':{"$gt":0},'Language':language}
    sort=[('LEP Population (Estimate)',-1)]
    fields ={"Borough":1,"LEP Population (Estimate)":1,"Community District Name":1,"Language":1}
    limit=5
    demo_list= []
    demo_data=populations.find(query,fields).sort(sort).limit(limit)
    for each in demo_data:
        each.pop("_id")
        demo_list.append(each)
    result_dict["biggest_communities"]=demo_list
    return (result_dict)
        
#Run app code
if __name__=="__main__":
    app.run(debug=True)