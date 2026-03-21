import fs from 'fs';
const { writeFileSync } = fs;

const baseurl='https://sdp.dila.edu.tw/juans/html?work=';
const mulu=[
    ['T0262',7]//什譯
    ,['T0263',10]//護譯
    ,['T0264',7]//闍笈
    ,['CK131',8]//藏譯
    ,['T1716',10]//法華玄義
    ,['T1717',20]//法華釋籤
    ,['T1718',10]//法華文句
    ,['X0618',1]  //大成科
    ,['X0619',9]  //大成
    ,['Sd-Kn',1] //寫本
    ,['C3-Td',1]
    ,['C4-Td',1]
    ,['Kg-Td',1]
    ,['Pe-Td',1]
    ,['Ka-Td',1]
    ,['Fb-Td',1]
    ,['CF-Td',1]
    ,['LM-JZ',1]
    ,['En-Kn',1]
]
const tidy=content=>{
    return content;
}

async function scrap(book,juan){
    const url=baseurl+book+'&juan='+juan;
    console.log(url)
    //let t=tidy(((await exec('curl "'+url+'"')).stdout));
    let response=await fetch(url);
    const t=(await response.text()).split(/\r?\n/);
    writeFileSync('html/'+book+'-'+juan+'.txt',t.join('\n'),'utf8');
}

async function fetchhtml(){
    for (let i=0;i<mulu.length;i++) {
        for (let j=0;j<mulu[i][1];j++) {
            await scrap(mulu[i][0],j+1);
        }
    }        
}

 fetchhtml();