
let code,response,endpointName,databox,infobox
const serviceHostname = "https://hostname:5500/service/"
async function onLoad()
{
    code = document.getElementById('codediv')
    output = document.getElementById('response')
    postdata = document.getElementById('postdata')
    endpointName = document.getElementById('endpoint')
   document.getElementById('url').innerText=serviceHostname;
    await loadTemplateCode('template.js')
   // messageBox("hi  ");
   
}



function messageBox(str) 
{
    document.getElementById('infobox').innerText=str;
}

async function callService(method) {
    try {
    const fullURL = serviceHostname+endpointName.innerText


     const response = await callVirtualEndpoint(fullURL,method)
 

    let renderOut = ""
    renderOut += `"StatusCode": ${response._status}\n`
    for( const key in response._headers) {
        renderOut += `"${key}": ${response._headers[key]}\n\n`
    }
  
    if (typeof response._data === 'string' || response._data  instanceof String)
    {
        renderOut += `${response._data}`
    } else {
        renderOut += JSON.stringify(response._data,null,2)
    }

    output.innerText = renderOut
    }
    catch(error) {
        console.error(error)
        messageBox(error  );
    }
}

//Load a JS file and populate the code side

async function loadTemplateCode(fname) {
    const response = await fetch(`/${fname}`)
    const js = await response.text()
    code.innerText = js;
    try {
    const postexample = await fetch(`/${fname}.data`)
    const posttemaplte = await postexample.text()
    postdata.innerText = posttemaplte;
    } catch(e) {
        console.log(e)
    }
}