#  External convertor for:  TRV Valve Avatto-TRV07-TS0601 Zigbee2MQTT
#  ManufacturerName:   _TZE200_bvrlmajk

![Alt text](pictures/Avatto-TRV07-TS0601.JPG)

The convertor has been tested and worked fine with Zigbee2MQTT fresh installed.

I recommend fresh installation of zigbee2MQTT in case other converters were used for this type of valve. 


## Installation

Upload tuyats601.js to zigbee2mqtt folder.
Add to zigbee2mqtt/configuration.yaml 

```bash
external_converters:
  - tuyats601.js
  - other_convertor.js
```
Restart zigbee2MQTT service and start to pair devices. 

In mostly  times it is necessary to re-pair two times each device in order to configured on zigbee GUI

![Alt text](pictures/Zigbee_Device.JPG)

## Usage

This TRV can be used in Home Assistant with automations or  topics MQTT.

Example to create temperature sensor from TRV valve in Home Assistant

Add to /homeassistant/configuration.yaml under mqtt config:

```bash
mqtt:
  sensor:
  - name: "trvzone1_temperature"
    state_topic: "zigbee2mqtt/trvzone1"
    unique_id: trvzone1temperature
    unit_of_measurement: "°C"
    device_class: "temperature"
    qos: 0
    value_template: "{{ (value|from_json)['local_temperature'] }}"
```
Restart Home Assistant to take effect.

## Presentation
About 

![Alt text](pictures/Avatto-About_TRV07-TS0601.JPG)

Temperature sensor 

![Alt text](pictures/Temperature_sensor.JPG)

Climate TRV on Home Assistant

![Alt text](pictures/Avatto_Climate_TRV.JPG)

On exposes GUI can be found below options

![Alt text](pictures/Avatto_exposes_1.JPG)

# Scheduler 

![Alt text](pictures/Avatto_exposes_Schedule.JPG)

#  Display brightness Level, Screen orientation, Climate Mode

![Alt text](pictures/Avatto_exposes_2.JPG)

## Helper source :

https://github.com/zigpy/zha-device-handlers/issues/2750
    
https://github.com/Koenkk/zigbee-herdsman-converters/blob/master/src/devices/tuya.ts

## License
[GPL](https://choosealicense.com/licenses/gpl-3.0/)
