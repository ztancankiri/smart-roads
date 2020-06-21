import paho.mqtt.subscribe as subscribe
import json

global no
no = 0

while True:
    msg = subscribe.simple("data", hostname="localhost")
    json_text = msg.payload.decode("utf-8")

    json_data = json.loads(json_text)
    json_data["no"] = no
    no += 1
    json_text = json.dumps(json_data)

    f = open("data.txt", "w")
    f.write(json_text)
    f.close()

    print(json_text)