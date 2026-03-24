import {filesFromPattern,nodefs,  writeChanged,  readTextContent,
    alphabetically} from 'ptk/nodebundle.cjs'
await nodefs;
const srcfolder='html/'
const outfolder='md/'
let files=filesFromPattern('*.txt',srcfolder);
files.sort(alphabetically)
//files should not consist subfolder
//files=['T0262-1.txt'];
let bookid='',sutraid='',prevsutraid;//sutra id
const apparatus=[],notes=[],kepan=[];

const target2md=c=>{
    const m=c.match(/^(.+?)_(\d+)_(\d+)$/);
    if (!m) {
        console.log('error ',c)
        return;
    }
    return m[1]+'-k#^kp'+m[2]+'-'+m[3];
}
const kpid2obsidianid=c=>{
    return c.replace(sutraid+'_','').replace(/_/g,'-')
}
const parseContent=content=>{
    let res=content.
    replace(/<span n="(.+?)" title="gaiji\/缺字"><\/span>/g,(m,m1)=>{
        return '('+m1+')';
    }).
    replace(/<span class="t" data-lb="([^>]+?)">([^>]+?)<\/span>/g,(m,m1,m2)=>{
            return ~m2.indexOf('No.')?'':m2;//remove sutra id
        }).//remove lb inside data-lb attribute , t0262-1 1. Nidāna.
    replace(/<span class="note_anchor getApp hand" data-n="(.+?)">(.+?)<\/span>/g,(m,appid,caption)=>{
            return '[['+sutraid+'-a#^app'+appid.replace('app_','').replace(sutraid+'_','')+'|'+caption+']]';
        }).    
    replace(/<span class='note_anchor hand' data-t='(.+?)'>(.+?)<\/span>/g,(m,notetext,caption)=>{
            notes.push([caption,notetext]);
            return '' 
        }).
    replace(
        /<a data-target="(.+?)" class="align">(.+?)<\/a>/g,(m,m1,caption)=>{
            return '[['+target2md(m1)+'|'+caption+']]'
        })
    .replace(
        /<span class="kp" id="kp_(.+?)" data-path="(.+?)">(.+?)<\/span>/g,(m,kpid,datapath,innertext)=>{
            return innertext+' ^kp'+kpid2obsidianid(kpid)+'\n';
        })
    .replace(
        /<span class=".+?" id=".+?">.+?<\/span>/g,(m,m1)=>{//remove lb
            return ''
        })
    .replace(/<div class="lg-cell">/g,'　')
    .replace(/<div id='app_(.+?)-text'>(.+?)<\/div>/g,(m,appid,apptext)=>{
        apparatus.push(apptext+' ^app'+appid.replace(sutraid+'_','')+'\n')
    })
    .replace(/<div id='app.+?'>(.+?)<\div>/g,(m,appid,apptext)=>{
        return '';//remove table style apparatus
    })
    .replace(/<p .+?>/g,'\n')
//remove apparatus section

    let at2=res.indexOf('<div class="close">');
    res=res.slice(0,at2);
    res=res.replace(/<.+?>/g,'')

    //extract kepan
    const lines=res.split('\n');
    const out=[];
    let paraid=1,prevparaid=0;
    for (let i=0;i<lines.length;i++){
        const m=lines[i].match(/ (\^kp[\d\-]+)/);
        if (m) {
            kepan.push(lines[i].replace('／','').trim()+'\n')
            out.push('![['+sutraid+'-k#^'+m[1].slice(1)+']]');
            paraid++;
        } else {
            // if (paraid!==prevparaid) out.push('^p'+paraid+'\n');
            out.push(lines[i])
            prevparaid=paraid;
        }
    }
    return out.join('\n')
}
const writekepanapp=()=>{
        writeChanged(outfolder+prevsutraid+'-k.md',kepan.join('\n'),true)
        writeChanged(outfolder+prevsutraid+'-a.md',apparatus.join('\n'),true)

        if (prevsutraid) kepan.length=0;
        if (prevsutraid) apparatus.length=0;
}
for (let i=0;i<files.length;i++) {
    const suffix=files[i].match(/(\-\d+\.txt)$/)[1];
    bookid=files[i].replace('.txt','')
    sutraid=files[i].slice(0,files[i].length-suffix.length);

    //emit kepan of previous file group with same prefix
    
    if (prevsutraid!==sutraid&& prevsutraid) {
        writekepanapp();
    }

    let content=readTextContent(srcfolder+files[i]);
    const at=content.indexOf('<div class="juan_text"');
    if (~at) {
        const at2=content.indexOf('</div>',at)
        content=content.slice(at2)
    }
    const out=parseContent(content);
    writeChanged(outfolder+bookid+'.md',out,true);
    prevsutraid=sutraid;
 //   console.log(apparatus)
}
writekepanapp()