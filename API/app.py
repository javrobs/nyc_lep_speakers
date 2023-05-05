#Import flask and jsonify to run the api
from flask import Flask,jsonify
from pymongo import MongoClient
from flask_cors import CORS
import pandas as pd
from flask import render_template

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
            <a href='http://127.0.0.1:5000/communities_all'>/communities_all</a><br>\
            <a href='http://127.0.0.1:5000/communities/Spanish'>/communities/Spanish</a> (Ex. Spanish)<br>\
            <a href='http://127.0.0.1:5000/populations_all'>/populations_all</a><br>\
            <a href='http://127.0.0.1:5000/populations/Spanish'>/populations/language </a> (Ex. Spanish)<br>\
            <a href='http://127.0.0.1:5000/demographic_all'>/demographic_all</a><br>\
            <a href='http://127.0.0.1:5000/demographic/Spanish'>/demographic/language </a> (Ex. Spanish)<br>"
            

@app.route("/communities_all")
def communities_api():
    com_dict = communities.find_one({})
    com_dict.pop("_id")
    group = [{"$group":{"_id":"$Borough Community District Code", "sum":{"$sum":"$LEP Population (Estimate)"}}}]
    pop_dict= list(populations.aggregate(group))
    merged = {}
    for each in pop_dict:
        merged[each ["_id"]] = each ["sum"]
    for each in com_dict["features"]:
        try: 
            each["properties"]["population"]=merged[each["properties"]["boro_cd"]]
        except: 
            each["properties"]["population"]=0
    return jsonify(com_dict)

@app.route("/communities/<language>")
def communities_language_api(language):
    com_dict = communities.find_one({})
    com_dict.pop("_id")
    query = {"Language" : language}
    exclude = {"Language": 1, "LEP Population (Estimate)":1, "Borough Community District Code": 1}
    pop_dict= list(populations.find(query, exclude))
    merged = {}
    for each in pop_dict:
        merged[each ["Borough Community District Code"]] = each ["LEP Population (Estimate)"]
    for each in com_dict["features"]:
        try: 
            each["properties"]["population"]=merged[each["properties"]["boro_cd"]]
        except: 
            each["properties"]["population"]=0
    return jsonify(com_dict)


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
    response_dict["Language"]="All"
    response_dict["Total LEP population"] = total_population
    
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
    response_dict["Biggest Communities"]=demo_list
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
    result_dict['LEP Percentage']="{:.5%}".format(language_sum/total_population)
    result_dict['Language']=language
    result_dict['Total LEP population']=language_sum
    # 5 biggest communities that speak this language!!!!
    query={'LEP Population (Estimate)':{"$gt":0},'Language':language}
    sort=[('LEP Population (Estimate)',-1)]
    fields ={"Borough":1,"LEP Population (Estimate)":1,"Community District Name":1}
    limit=5
    demo_list= []
    demo_data=populations.find(query,fields).sort(sort).limit(limit)
    for each in demo_data:
        each.pop("_id")
        demo_list.append(each)
    result_dict[f"Biggest Communities"]=demo_list
    return (result_dict)

@app.route("/endpoint")
def endpoint():
    return (render_template('index.html'))


        
#Run app code
if __name__=="__main__":
    app.run(debug=True)