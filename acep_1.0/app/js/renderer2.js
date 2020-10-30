const ipcRenderer = require('electron').ipcRenderer;
const ReadLine = require('@serialport/parser-readline')
const serialport = require('serialport')
const tableify = require('tableify')

let config = new Array();

const submitButton = document.getElementById('submit');
const read_old_info = document.getElementById('read_old_info');
const reboot = document.getElementById('reboot');
const powerSwitch = document.getElementById('onoffswitch')
const isOpen = document.getElementById('isopen');
const reset = document.getElementById('reset');
const cancel = document.getElementById('cancel');
const content_foot_list = document.getElementById('content_foot_list');
const wifi_ssid = document.getElementById('wifi_ssid');
const wifi_password = document.getElementById('wifi_password');
const wifi_auth = document.getElementById('wifi_auth');
const wifi_dhcp = document.getElementById('wifi_dhcp');
const wifi_ip = document.getElementById('wifi_ip');
const wifi_gateway = document.getElementById('wifi_gateway');
const wifi_netmask = document.getElementById('wifi_netmask');
const wifi_dns1 = document.getElementById('wifi_dns1');
const wifi_dns2 = document.getElementById('wifi_dns2');
const mqtt_server = document.getElementById('mqtt_server');
const mqtt_port = document.getElementById('mqtt_port');
const mqtt_client_id = document.getElementById('mqtt_client_id');
const mqtt_username = document.getElementById('mqtt_username');
const mqtt_password = document.getElementById('mqtt_password');


config.push(wifi_ssid);
config.push(wifi_password);
config.push(wifi_auth);
config.push(wifi_dhcp);
config.push(wifi_ip);
config.push(wifi_gateway);
config.push(wifi_netmask);
config.push(wifi_dns1);
config.push(wifi_dns2);
config.push(mqtt_server);
config.push(mqtt_port);
config.push(mqtt_client_id);
config.push(mqtt_username);
config.push(mqtt_password);

let sp = new serialport(localStorage.getItem('targetPort'), {
    baudRate: 115200
});


submitButton.addEventListener('click', (e) => {
    console.log(wifi_ssid.value);
    console.log(wifi_password.value);
    let arr = new Array();

    config.forEach(element => {
        if (element.value !== "") {
            if(element.id !== 'wifi_dhcp' && element.id !== 'mqtt_port') {
                arr.push('at+' + element.id + '="' + element.value + '"' + '\r\n');
            }
            else {
                arr.push('at+' + element.id + '=' + element.value + '\r\n');
            }
        }
    });

    const parser = new ReadLine();
    let body = '';
    const pattern = /<AT>(.*?)<\/AT>/;
    let array;
    let res;

    sp.pipe(parser);

    //确认是否成功打开串口
    sp.on('error', (err) => {
        console.log(err.message);
    });

    //进入配置模式
    sp.write('+++\r\n');

    arr.forEach(element => {
        sp.write(element);
    });
    sp.write('AT+RESET_NETWORK=\r\n')
    console.log(444);


    parser.on('data', (data) => {
        console.log('DATA: ', data.toString());
        data = data.trim();
        body += data;
        array = pattern.exec(body);

        if (array !== null) {
            res = array[1];
            let curTime = new Date();
            console.log('res:' + res);
            let info = JSON.parse(res);
            const node = document.createElement('pre');
            if (info.RESULT === 'SUCCESS') {
                node.innerText = info.RESULT + '    ' + curTime.toLocaleString() + '    ' + info.CMD;
            } else {
                node.innerText = info.RESULT + '     ' + curTime.toLocaleString() + '    ' + info.CMD;
            }

            console.log(node.innerText);
            content_foot_list.appendChild(node);
            body = '';
        }
    })

})

reset.addEventListener('click', (e) => {
    wifi_ssid.value = "";
    wifi_password.value = "";
    wifi_auth.value = "";
    wifi_dhcp.value = "";
    wifi_ip.value = "";
    wifi_gateway.value = "";
    wifi_netmask.value = "";
    wifi_dns1.value = "";
    wifi_dns2.value = "";
    mqtt_server.value = "";
    mqtt_port.value = "";
    mqtt_client_id.value = "";
    mqtt_username.value = "";
    mqtt_password.value = "";
})

cancel.addEventListener('click', (e) => {
    window.location.href = '5-2.html'
})

read_old_info.addEventListener('click', (e) => {
    const parser = new ReadLine();
    let body = '';
    const pattern = /<AT>(.*?)<\/AT>/;
    let array;
    let res;

    sp.pipe(parser);

    //确认是否成功打开串口
    sp.on('error', (err) => {
        console.log(err.message);
    });


    sp.write('+++\r\n');

    config.forEach(element => {
        sp.write('at+' + element.id + '?\r\n');
    });

    parser.on('data', data => {
        // console.log('DATA: ', data.toString());
        data = data.trim();
        body += data;
        array = pattern.exec(body);

        // console.log('body: ' + body);
        if(array !== null) {
            res = array[1];
            console.log('res: ' + res);
            let info = JSON.parse(res);
            if(info.RESULT == 'SUCCESS') {
                let cmd = info.CMD.toString();
                let length = cmd.length;
                console.log('length: ' + length);
                let artical = cmd.substring(3, length - 1);

                console.log('artical: ' + artical);
                config.forEach(element => {
                    if(element.id === artical) {
                        console.log('successsss');
                        element.value = info.DATA;
                        // break;
                    }
                })
            }
            body = '';
        }
        
    })
})

reboot.addEventListener('click', (e) => {
    sp.write('+++\r\n');
    sp.write('AT+RESET=\r\n');
})