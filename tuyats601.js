const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const tz = require('zigbee-herdsman-converters/converters/toZigbee');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const extend = require('zigbee-herdsman-converters/lib/extend');
const e = exposes.presets;
const ea = exposes.access;
const tuya = require('zigbee-herdsman-converters/lib/tuya');

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
    onEvent: tuya.onEventSetTime, // Add this if you are getting no converter for 'commandMcuSyncTime'
    configure: tuya.configureMagicPacket,
    exposes: [
        e.child_lock(), e.battery(),e.max_temperature(), e.min_temperature(),
        e.position(), e.window_detection(),
        e.binary('window', ea.STATE, 'CLOSED', 'OPEN').withDescription('Window status closed or open '),
        e.binary('fault', ea.STATE, 'ON', 'OFF').withDescription('Thermostat in error state'),
        //e.enum('fault', ea.STATE, ['fault_sensor', 'fault_motor', 'fault_low_batt', 'fault_ug_low_batt']).withDescription('Alarm type'),
        e.climate()
            .withLocalTemperature(ea.STATE).withSetpoint('current_heating_setpoint', 5, 35, 0.5, ea.STATE_SET)
            .withLocalTemperatureCalibration(-30, 30, 0.1, ea.STATE_SET)
            .withPreset(['auto', 'manual', 'off', 'heat'],
                'MANUAL MODE ☝ - In this mode, the device executes manual temperature setting. ' +
            'When the set temperature is lower than the "minimum temperature", the valve is closed (forced closed). ' +
            'AUTO MODE ⏱ - In this mode, the device executes a preset week programming temperature time and temperature. ' +
            'ON - In this mode, the thermostat stays open ' +
            'OFF - In this mode, the thermostat stays closed')
            .withSystemMode(['auto', 'heat', 'off'], ea.STATE_SET)
            .withRunningState(['idle', 'heat'], ea.STATE),
    ],
    meta: {
        // All datapoints go in here
        tuyaDatapoints: [
           [1, 'system_mode', tuya.valueConverterBasic.lookup({'auto': tuya.enum(0), 'manual': tuya.enum(1), 'off': tuya.enum(2), 'heat': tuya.enum(3)})],
           //[1, 'preset', tuya.valueConverterBasic.lookup(
              /// {'auto': tuya.enum(0), 'manual': tuya.enum(1), 'off': tuya.enum(2), 'heat': tuya.enum(3)})],
           [2, 'current_heating_setpoint', tuya.valueConverter.divideBy10],
           [3, 'local_temperature', tuya.valueConverter.divideBy10],
           [1, 'running_state', tuya.valueConverterBasic.lookup({'auto': 0, 'manual': 1, 'off': 2, 'heat': 3})],
           
           [7, 'window', tuya.valueConverterBasic.lookup({'OPENED': 1, 'CLOSED': 0})],
           [8, 'window_detection', tuya.valueConverter.onOff],
           [12, 'child_lock', tuya.valueConverter.lockUnlock],
           [13, 'battery', tuya.valueConverter.raw],
           [14, 'fault', tuya.valueConverter.onOff],
           //[14, 'fault', tuya.valueConverterBasic.lookup({
           ///         'fault_sensor': tuya.enum(0), 'fault_motor': tuya.enum(1), 'fault_low_batt': tuya.enum(2), 'fault_ug_low_batt': tuya.enum(3),
           ///     })],
           [15, 'min_temperature', tuya.valueConverter.divideBy10],
           [16, 'max_temperature', tuya.valueConverter.divideBy10],
           [101, 'local_temperature_calibration', tuya.valueConverter.localTempCalibration1],
           [108, 'position', tuya.valueConverter.raw],
        ],
    },
};

module.exports = definition;
