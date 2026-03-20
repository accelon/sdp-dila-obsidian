const fs=require('fs');
const { writeFileSync } = require('node:fs');
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);


const baseurl='https://sdp.dila.edu.tw/juans/html?work=';
const mulu=[
    ['T0262',7]//什譯
    /*
    ,['T0263',7]//護譯
    ,['T0264',7]//闍笈
    ,['Sd-Kn',8] //寫本
    ,['C3-Td',8]
    ,['C4-Td',8]
    ,['Kg-Td',8]
    ,['Pe-Td',8]
    ,['Ka-Td',8]
    ,['Fb-Td',8]
    ,['CF-Td',8]
    ,['LM-JZ',8]
    ,['En-Kn',8]
    ,['CK131',8]//藏譯
    ,['T1716',8]//法華玄義
    ,['T1717',8]//法華釋籤
    ,['T1718',8]//法華文句
    ,['X0618',8]  //大成科
    ,['X0619',8]  //大成
*/
]
const tidy=content=>{
    console.log(content)
    return content;
}

async function scrap(book,juan){
    const url=baseurl+book+'&juan='+juan;
    console.log(url)
    //let t=tidy(((await exec('curl "'+url+'"')).stdout));
    let response=await fetch(url);
    console.log(response)
    const t=await response.text();
    console.log(t)
    writeFileSync('html/'+book+juan+'.txt',t.join('\n'),'utf8');
}

async function fetchhtml(){
    for (let i=0;i<mulu.length;i++) {
        for (let j=0;j<mulu[i][1];j++) {
            await scrap(mulu[i][0],j+1);
        }
    }        
}

 fetchhtml();