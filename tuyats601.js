//# Copyright 2024, eteodun
//# Licensed under the GPL-3.0 License
const {} = require('zigbee-herdsman-converters/lib/modernExtend');
// Add the lines below
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const tuya = require('zigbee-herdsman-converters/lib/tuya');
const {} = require('zigbee-herdsman-converters/lib/tuya');
const e = exposes.presets;
const ea = exposes.access;

const definition = {
    // Since a lot of TuYa devices use the same modelID, but use different datapoints
    // it's necessary to provide a fingerprint instead of a zigbeeModel
    fingerprint: [
        {
            // The model ID from: Device with modelID 'TS0601' is not supported
            // You may need to add \u0000 at the end of the name in some cases
            modelID: 'TS0601',
            // The manufacturer name from: Device with modelID 'TS0601' is not supported.
            manufacturerName: '_TZE200_bvrlmajk',
        },
    ],
    model: 'TS0601',
    vendor: 'AVATTO',
    description: 'Avatto-TRV-TRV07',
    supports: 'thermostat, temperature',
    fromZigbee: [tuya.fz.datapoints],
    toZigbee: [tuya.tz.datapoints],
    onEvent: tuya.onEventSetLocalTime, // Add this if you are getting no converter for 'commandMcuSyncTime'
    configure: tuya.configureMagicPacket,
    exposes: [
        e.battery(), e.child_lock(), e.max_temperature(), e.min_temperature(),
        e.position(), e.window_detection(),tuya.exposes.faultAlarm(),
        exposes.binary('window', ea.STATE, 'OPEN', 'CLOSE').withDescription('Window status closed or open '),
        exposes.climate()
            .withLocalTemperature(ea.STATE).withSetpoint('current_heating_setpoint', 5, 35, 0.5, ea.STATE_SET)
            .withLocalTemperatureCalibration(-30, 30, 0.1, ea.STATE_SET)
            .withPreset(['auto', 'manual', 'off', 'on'],
                'MANUAL MODE ☝ - In this mode, the device executes manual temperature setting. ' +
                'When the set temperature is lower than the "minimum temperature", the valve is closed (forced closed). ' +
                'AUTO MODE ⏱ - In this mode, the device executes a preset week programming temperature time and temperature. ' +
                'ON - In this mode, the thermostat stays open ' +
                'OFF - In this mode, the thermostat stays closed')
            .withSystemMode(['auto', 'heat', 'off'], ea.STATE)
            .withRunningState(['idle', 'heat'], ea.STATE),
        ...tuya.exposes.scheduleAllDays(ea.STATE_SET, 'HH:MM/C HH:MM/C HH:MM/C HH:MM/C'),
        e.enum('display_brightness', ea.STATE_SET, ['high', 'medium', 'low']).withDescription('Display brightness'),
        e.enum('screen_orientation', ea.STATE_SET, ['up', 'down']).withDescription('Screen orientation'),
        e.enum('mode', ea.STATE_SET, ['comfort', 'eco']).withDescription('Hysteresis - comfort > switches off/on exactly at reached ' +
            'temperature with valve smooth from 0 to 100%, eco > 0.5 degrees above or below, valve either 0 or 100%'),
    ],
    meta: {
        // All datapoints go in here
        tuyaDatapoints: [
           [1, null, tuya.valueConverter.thermostatSystemModeAndPreset(null)],
           [1, 'system_mode', tuya.valueConverter.thermostatSystemModeAndPreset('system_mode')],
           [1, 'preset', tuya.valueConverter.thermostatSystemModeAndPreset('preset')],
           [2, 'current_heating_setpoint', tuya.valueConverter.divideBy10],
           [3, 'local_temperature', tuya.valueConverter.divideBy10],
           [6, 'running_state', tuya.valueConverterBasic.lookup({'heat': 1, 'idle': 0})],
           [7, 'window', tuya.valueConverterBasic.lookup({'OPEN': 1, 'CLOSE': 0})],
           [8, 'window_detection', tuya.valueConverter.onOff],
           [12, 'child_lock', tuya.valueConverter.lockUnlock],
           [13, 'battery', tuya.valueConverter.raw],
           [14, 'fault_alarm', tuya.valueConverter.trueFalse1],
           [15, 'min_temperature', tuya.valueConverter.divideBy10],
           [16, 'max_temperature', tuya.valueConverter.divideBy10],
           [17, 'schedule_monday', tuya.valueConverter.thermostatScheduleDayMultiDPWithDayNumber(1)],
           [18, 'schedule_tuesday', tuya.valueConverter.thermostatScheduleDayMultiDPWithDayNumber(2)],
           [19, 'schedule_wednesday', tuya.valueConverter.thermostatScheduleDayMultiDPWithDayNumber(3)],
           [20, 'schedule_thursday', tuya.valueConverter.thermostatScheduleDayMultiDPWithDayNumber(4)],
           [21, 'schedule_friday', tuya.valueConverter.thermostatScheduleDayMultiDPWithDayNumber(5)],
           [22, 'schedule_saturday', tuya.valueConverter.thermostatScheduleDayMultiDPWithDayNumber(6)],
           [23, 'schedule_sunday', tuya.valueConverter.thermostatScheduleDayMultiDPWithDayNumber(7)],
           [101, 'local_temperature_calibration', tuya.valueConverter.localTempCalibration1],
           [108, 'position', tuya.valueConverter.divideBy10],
           [111, 'display_brightness', tuya.valueConverterBasic.lookup({'high': tuya.enum(0), 'medium': tuya.enum(1), 'low': tuya.enum(2)})],
           [113, 'screen_orientation', tuya.valueConverterBasic.lookup({
               'up': tuya.enum(0), 'right': tuya.enum(1), 'down': tuya.enum(2), 'left': tuya.enum(3),
           })],
           [114, 'mode', tuya.valueConverterBasic.lookup({'comfort': tuya.enum(0), 'eco': tuya.enum(1)})],

        ],
    },
};

module.exports = definition;
