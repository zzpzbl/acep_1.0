// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const ipcRenderer = require('electron').ipcRenderer;
const ReadLine = require('@serialport/parser-readline')
const serialport = require('serialport')
const tableify = require('tableify')
const select_com = document.getElementById('select_com');
const select_baud = document.getElementById('select_baud');
const button = document.getElementById('button');
const parser = new ReadLine();


serialport.list((err, ports) => {
    console.log('ports', ports);

    ports.forEach(element => {
        const node = document.createElement('option');
        node.innerText = element.comName;
        node.value = element.comName;
        node.class = 'selected_com';
        select_com.appendChild(node);
    });
})

button.addEventListener('click', (e) => {
    // console.log(111);
    // ipcRenderer.send('asynchronous-message', select.value);
    console.log(select_com.value);
    console.log(222);
    localStorage.setItem('targetPort', select_com.value);
    sp = new serialport(select_com.value, {
        baudRate: parseFloat(select_baud.value)
    });

    sp.pipe(parser);

    //确认是否成功打开串口
    sp.on('error', (err) => {
        console.log(err.message);
    });

    //进入配置模式并确认型号
    sp.write('+++\r\n');
    console.log(444);
    sp.write('AT+MODEL?\r\n');

    let body = '';

    const pattern = /<AT>(.*?)<\/AT>/;
    let array;
    let res;

    sp.on('data', (data) => {
        console.log('Data: ', data);
    })

    parser.on('data', (data) => {
        data = data.trim();
        body += data;
        array = pattern.exec(body);
        if (array !== null) {
            // console.log('555555');
            res = array[1];
            console.log('res: ' + res);
            let info = JSON.parse(res);
            if (info.CMD === 'AT+MODEL?') {
                console.log(info.DATA);
                window.location.href = '5-5.html'
            }
            body = '';
        };
    })
})

// ipcRenderer.on('pong-event', (event, arg) => {
//   alert('ssss');
//   arg.forEach(element => {
//     sp.write(element);
//   })
// })
