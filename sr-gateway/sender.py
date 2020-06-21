import requests
import json
import paho.mqtt.client as paho

broker = "23.251.142.247"
port = 1883

def on_publish(client,userdata,result):
    print("data published \n")
    pass

clientG = paho.Client("gateway")
clientG.on_publish = on_publish
clientG.connect(broker, port)

global last_read
last_read = ""

while True:
    f = open("sent.txt", "r")
    json_text = f.read()
    
    if last_read != json_text:
        try:
            print(json_text)
            last_read = json_text
            json_data = json.loads(json_text)
            dataToSend = {"sensor_id": 19, "temperature": json_data["temperature"], "humidity": json_data["humidity"], "pressure": json_data["pressure"], "vehicle_count": json_data["vehicle_count"]}
            clientG.publish("data", json.dumps(dataToSend))
        except:
            a = None