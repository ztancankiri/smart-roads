#include "src/OV2640.h"
#include <WiFi.h>
#include <WebServer.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>

#include "src/SimStreamer.h"
#include "src/OV2640Streamer.h"
#include "src/CRtspSession.h"

#include <Wire.h>
#include <SparkFunBME280.h>
#include <PubSubClient.h> // Should be like this in the header -> MQTT_MAX_PACKET_SIZE 1024

// I2C Configuration
#define SDA 14
#define SCL 15
#define FREQ 400000

// BME280 Configuration
#define BME280_ADDRESS 0x76

// Sensor Data Sending Frequency
#define DATA_INTERVAL 5000

// Retry Limit for Sendind Data
#define RETRY_LIMIT 50

// Camera Configuration
#define PWDN_GPIO_NUM 32
#define RESET_GPIO_NUM -1
#define XCLK_GPIO_NUM 0
#define SIOD_GPIO_NUM 26
#define SIOC_GPIO_NUM 27
#define Y9_GPIO_NUM 35
#define Y8_GPIO_NUM 34
#define Y7_GPIO_NUM 39
#define Y6_GPIO_NUM 36
#define Y5_GPIO_NUM 21
#define Y4_GPIO_NUM 19
#define Y3_GPIO_NUM 18
#define Y2_GPIO_NUM 5
#define VSYNC_GPIO_NUM 25
#define HREF_GPIO_NUM 23
#define PCLK_GPIO_NUM 22

OV2640 cam;

WebServer server(80);
WiFiServer rtspServer(8554);

void callback(char* topic, byte* payload, unsigned int length) {
	// handle message arrived
}

WiFiClient wifiClient;
PubSubClient mqttClient("192.168.0.25", 1883, callback, wifiClient);

const char *ssid =     "<SSID>";         // Put your SSID here
const char *password = "<PASSWORD>";      // Put your PASSWORD here

int retryCounter = 0;

// Sensor Data Variables
unsigned long prevUpdate = 0;
unsigned long currUpdate = 0;

// Sensor
TwoWire I2C = TwoWire(0);
BME280 bme;

void setupI2C() {
	Serial.print("Connecting to I2C.");
	while (!I2C.begin(SDA, SCL, FREQ)) {
		delay(500);
		Serial.print(".");
	}
	Serial.println();
	Serial.println("I2C connected.");
	Serial.println();
}

void setupBME280() {
	bme.setI2CAddress(BME280_ADDRESS);

	Serial.print("Connecting to BME280.");
	while (!bme.beginI2C(I2C)) {
		delay(500);
		Serial.print(".");
	}
	Serial.println();
	Serial.println("BME280 connected.");
	Serial.println();
}

float round2(float value) {
	return (int) (value * 100 + 0.5) / 100.0F;
}

void sendData() {
	String messageBody;
	StaticJsonDocument<200> json;

	json["temperature"] = round2(bme.readTempC());
	json["humidity"] = round2(bme.readFloatHumidity());
	json["pressure"] = round2(bme.readFloatPressure() / 100.0F);
	json["altitude"] = round2(bme.readFloatAltitudeFeet());
	serializeJson(json, messageBody);

	if (mqttClient.connected()) {
		if (mqttClient.publish("data", (char*) messageBody.c_str())) {
			Serial.println(messageBody);
		}
		else {
			Serial.println("Publish failed");
		}
	}
}

void handle_jpg_stream() {
	WiFiClient client = server.client();
	String response = "HTTP/1.1 200 OK\r\n";
	response += "Content-Type: multipart/x-mixed-replace; boundary=frame\r\n\r\n";
	server.sendContent(response);

	while (1)
	{
		cam.run();
		if (!client.connected())
			break;
		response = "--frame\r\n";
		response += "Content-Type: image/jpeg\r\n\r\n";
		server.sendContent(response);

		client.write((char *) cam.getfb(), cam.getSize());
		server.sendContent("\r\n");
		if (!client.connected())
			break;
	}
}

void handle_jpg() {
	WiFiClient client = server.client();

	cam.run();

	if (!client.connected()) {
		return;
	}

	String response = "HTTP/1.1 200 OK\r\n";
	response += "Content-disposition: inline; filename=capture.jpg\r\n";
	response += "Content-type: image/jpeg\r\n\r\n";
	server.sendContent(response);
	client.write((char *) cam.getfb(), cam.getSize());
}

void handleNotFound() {
	String message = "Server is running!\n\n";
	message += "URI: ";
	message += server.uri();
	message += "\nMethod: ";
	message += (server.method() == HTTP_GET) ? "GET" : "POST";
	message += "\nArguments: ";
	message += server.args();
	message += "\n";
	server.send(200, "text/plain", message);
}

void setup() {
	Serial.begin(115200);

	camera_config_t config;
	config.ledc_channel = LEDC_CHANNEL_0;
	config.ledc_timer = LEDC_TIMER_0;
	config.pin_d0 = Y2_GPIO_NUM;
	config.pin_d1 = Y3_GPIO_NUM;
	config.pin_d2 = Y4_GPIO_NUM;
	config.pin_d3 = Y5_GPIO_NUM;
	config.pin_d4 = Y6_GPIO_NUM;
	config.pin_d5 = Y7_GPIO_NUM;
	config.pin_d6 = Y8_GPIO_NUM;
	config.pin_d7 = Y9_GPIO_NUM;
	config.pin_xclk = XCLK_GPIO_NUM;
	config.pin_pclk = PCLK_GPIO_NUM;
	config.pin_vsync = VSYNC_GPIO_NUM;
	config.pin_href = HREF_GPIO_NUM;
	config.pin_sscb_sda = SIOD_GPIO_NUM;
	config.pin_sscb_scl = SIOC_GPIO_NUM;
	config.pin_pwdn = PWDN_GPIO_NUM;
	config.pin_reset = RESET_GPIO_NUM;
	config.xclk_freq_hz = 20000000;
	config.pixel_format = PIXFORMAT_JPEG;
	config.frame_size = FRAMESIZE_SVGA;
	config.jpeg_quality = 12;
	config.fb_count = 2;

	cam.init(config);

	sensor_t* s = esp_camera_sensor_get();
	s->set_vflip(s, 1);

	IPAddress ip;

	WiFi.begin(ssid, password);

	Serial.print("Connecting to WiFi.");
	while (WiFi.status() != WL_CONNECTED) {
		delay(500);
		Serial.print(".");
	}
	Serial.println();
	Serial.println("WiFi connected.");
	Serial.println();

	ip = WiFi.localIP();
	Serial.println(F("WiFi connected"));
	Serial.println("");
	Serial.println(ip);
	Serial.print("Stream Link: rtsp://");
	Serial.print(ip);
	Serial.println(":8554/mjpeg/1");

	setupI2C();
	setupBME280();

	server.on("/", HTTP_GET, handle_jpg_stream);
	server.on("/jpg", HTTP_GET, handle_jpg);
	server.onNotFound(handleNotFound);
	server.begin();

	rtspServer.begin();

	if (mqttClient.connect("ESP")) {
		Serial.println("Connected to MQTT broker");

		if (mqttClient.publish("data", "hello from ESP8266")) {
			Serial.println("Publish ok");
		}
		else {
			Serial.println("Publish failed");
		}
	}
	else {
		Serial.println("MQTT connect failed");
		Serial.println("Will reset and try again...");
		abort();
	}
}

CStreamer *streamer;
CRtspSession *session;
WiFiClient client;

void loop() {
	currUpdate = millis();
	if (currUpdate - prevUpdate >= DATA_INTERVAL) {
		prevUpdate = currUpdate;
		sendData();
	}

	server.handleClient();

	uint32_t msecPerFrame = 100;
	static uint32_t lastimage = millis();

	if(session) {
		uint32_t now = millis();
		if(now > lastimage + msecPerFrame || now < lastimage) {
			session->broadcastCurrentFrame(now);
			lastimage = now;

			// check if we are overrunning our max frame rate
			now = millis();
			if(now > lastimage + msecPerFrame)
				printf("warning exceeding max frame rate of %d ms\n", now - lastimage);
		}

		if(session->m_stopped) {
			delete session;
			delete streamer;
			session = NULL;
			streamer = NULL;
		}
	}
	else {
		client = rtspServer.accept();

		if(client) {
			streamer = new OV2640Streamer(&client, cam);
			session = new CRtspSession(&client, streamer);
		}
	}
}
