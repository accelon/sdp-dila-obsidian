import {filesFromPattern,nodefs, 
    DOMFromString,
    writeChanged, readTextLines, readTextContent,walkDOM} from 'ptk/nodebundle.cjs'
await nodefs;
const srcfolder='html/'
let files=filesFromPattern('*.txt',srcfolder);
files=['T0262-1.txt'];

const onOpen={
    'div':(el,ctx)=>{

    },
    'span':(el,ctx)=>{
        ctx.hide=false
        const cls=el.attrs.class;
        if (!cls) return;
        if (~cls.indexOf('lb')) ctx.hide=true;
        if (~cls.indexOf('kp')) {
            const kpid=el.attrs['id'].substr(ctx.bookid.length);
            return '^'+kpid+' ';
        }
        if (~cls.indexOf('note_anchor')&&el.attrs['data-t']) {//inline note


        }
        if (~cls.indexOf('getApp')&&el.attrs['data-n']) {//apparatus
            
        }
    },
    'a':(el,ctx)=>{
        const target=el.attrs['data-target'];
        if (target){
//            ctx.hide=true;
            return '^link#'+target+'（';
        }
    },
    'p':(el,ctx)=>{
    }
}
const onClose={
    'a':(el,ctx)=>{
        return '）'
    }
}
const onText=(t,ctx)=>{
    if (!ctx.hide) {
        return t;
    }
    return '';
}

for (let i=0;i<files.length;i++) {
    const content=readTextContent(srcfolder+files[i]);
    const el=DOMFromString(content);
    
    const suffix=files[i].match(/(\-\d+\.txt)$/)[1];
    const ctx={bookid:files[i].slice(0,files[i].length-suffix.length)};
    walkDOM(el,ctx,onOpen,onClose,onText);
    console.log(ctx)
    ctx.out='';
}