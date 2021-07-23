const iot = require('alibabacloud-iot-device-sdk');

const device = iot.device({
    productKey: "a1kFFaZUC1C", //将<productKey>修改为实际产品的ProductKey
    deviceName: "LED713",//将<deviceName>修改为实际设备的DeviceName
    deviceSecret: "ee7a24c6010c98bdb5a0db789606b49b",//将<deviceSecret>修改为实际设备的DeviceSecret
});
const device1 = iot.device({
    productKey: "a1qgnLCMoht", //将<productKey>修改为实际产品的ProductKey
    deviceName: "SHT1",//将<deviceName>修改为实际设备的DeviceName
    deviceSecret: "a5e46e0ace8185f5bc55ad128960107b",//将<deviceSecret>修改为实际设备的DeviceSecret
});
const fan = iot.device({
    productKey: 'a1Fm3loARNS', //将<productKey>修改为实际产品的ProductKey
    deviceName: 'fan1', //将<deviceName>修改为实际设备的DeviceName
    deviceSecret: 'b5029629874f841022aaffdd741d320e', //将<deviceSecret>修改为实际设备的DeviceSecret
})
const ac = iot.device({
    productKey: 'a1Q05obNjW9', //将<productKey>修改为实际产品的ProductKey
    deviceName: 'aircondition1', //将<deviceName>修改为实际设备的DeviceName
    deviceSecret: '99c052e44f3a5dca71c7dbaea21a4c73', //将<deviceSecret>修改为实际设备的DeviceSecret
})


//监听connect事件
device.on('connect', () => {
    //将<productKey> <deviceName>修改为实际值
    device.subscribe('/a1kFFaZUC1C/LED713/user/get');
    console.log('connect successfully!');
    device.publish('/a1kFFaZUC1C/LED713/user/update', 'hello world!');
});

device1.on('connect', () => {
    //将<productKey> <deviceName>修改为实际值
    device1.subscribe('/a1qgnLCMoht/SHT1/user/get');
    console.log('connect successfully!');
    device1.publish('/a1qgnLCMoht/SHT1/user/update', 'hello world!');
});
fan.on('connect', () => {
    device.subscribe('/a1Fm3loARNS/fan1/user/get');
    console.log('connect successfully!');
    device.publish('/a1Fm3loARNS/fan1/user/update', 'hello world!');
})
ac.on('connect', () => {
    device.subscribe('/a1Q05obNjW9/aircondition1/user/get');
    console.log('connect successfully!');
    device.publish('/a1Q05obNjW9/aircondition1/user/update', 'hello world!');
})


//监听message事件
device.on('message', (topic, payload) => {
    // console.log(topic, payload.toString());
    // if (topic === ledSubTopic) {
    //     LightStatus = Number(payload);
    // }
});

device1.on('message', (topic, payload) => {
    console.log(topic, payload.toString());
});

fan.on('message', (topic, payload) => {
    // console.log(topic, payload.toString());
});
ac.on('message', (topic, payload) => {
    // console.log(topic, payload.toString());
});



// 上报设备属性
device.postProps({
    LightStatus: 1,
    LightVolt: 220
}, (res) => {
    console.log(res);
});
fan.postProps({
    PowerSwitch: 0,
    WindSpeed: 0
}, (res) => {
    console.log(res);
})
ac.postProps({
    PowerSwitch: 0,
}, (res) => {
    console.log(res);
});

var lightStatus = 0;
// var LightVolt=220;
// 监听云端设置属性服务消息，示例代码为一个灯
device.onProps((cmd) => {
    // console.log('>>>onProps',cmd); //打印完整的属性设置消息
    for (var key in cmd.params) {
        if (key == 'LightStatus') { //判断是否设置的是LightSwitch属性
            console.log('灯的状态', key);
            //示例代码将云端设置的属性在本地进行保存，实际产品开发时需要修改为去将灯打开或者关闭
            // LightStatus = cmd.params.LightStatus; 
            //本地设置完毕之后，将更新后的状态报告给云端。
            //注意：云端下发命令后，云端属性的值并不会改变，云端需要等待来自设备端的属性上报
            // aliLedStatus = Number(cmd.params.LightStatus);
            lightStatus = Number(cmd.params.LightStatus);
            if (lightStatus == 0) {
                console.log('灯从云端关闭');
            } else {
                console.log('灯从云端开启');
            }
            device.postProps({ 'LightStatus': lightStatus });
        }
    }
})
var fan_status = 0;
var powerSwitch = 0;
var windSpeed = 0;
fan.onProps((cmd) => {
    // console.log('>>>onProps',cmd);
    for (var key in cmd.params) {
        if (key == 'PowerSwitch') {
            console.log('风扇的状态:', key);
            powerSwitch = Number(cmd.params.PowerSwitch);
            fan_status = powerSwitch;
            // if(powerSwitch==1){
            //     console.log('风扇从云端开启');
            // }else 
            if (powerSwitch == 0) {
                console.log('风扇从云端关闭');
            }
        }
        if (key == 'WindSpeed') {
            console.log('风速:', key);
            windSpeed = Number(cmd.params.WindSpeed);
            fan_status = windSpeed;
            if (windSpeed == 1) {
                console.log('低风');
            } else if (windSpeed == 2) {
                console.log('高风');
                // fan_status=windSpeed;
            }
        }
    }
    fan.postProps({ 'PowerSwitch': powerSwitch, 'WindSpeed': windSpeed });
});

var acStatus = 0;
ac.onProps((cmd) => {
    // console.log('>>>onProps',cmd); //打印完整的属性设置消息
    for (var key in cmd.params) {
        if (key == 'PowerSwitch') { //判断是否设置的是LightSwitch属性
            console.log('空调的状态', key);
            acStatus = Number(cmd.params.PowerSwitch);
            if (acStatus == 0) {
                console.log('空调从云端关闭');
            } else {
                console.log('空调从云端开启');
            }
        }
    }
    ac.postProps({ 'PowerSwitch': acStatus });
})
module.exports = {
    device: device,
    device1: device1,
    fan: fan,
    ac: ac,
    getAcStatus: function () {
        console.log("acStatus:" + acStatus);
        return acStatus;
    },
    getfan_status: function () {
        console.log("fan_status:" + fan_status);
        return fan_status;
    },
    getLightStatus: function () {
        console.log("lightStatus:" + lightStatus);
        return lightStatus;
    },
    setLightStatus: function (status) {
        lightStatus = status;
    },
    setAcStatus: function (status) {
        acStatus = status;
    },
    setFanStatus: function (status) {
        fan_status = status;
    }
}