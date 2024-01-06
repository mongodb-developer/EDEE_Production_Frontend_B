let syntaxOKFlag,syntaxErrorMessage

async function callVirtualEndpoint(url,verb) {
    const res = new SimResponse()
    document.getElementById("codehost")?.remove()

    const codehost = document.createElement("script")
    codehost.id = "codehost"
    document.body.appendChild(codehost)
    let source = code.innerText
    source = cleanCode(source)


    window.addEventListener("error", (event) => {
        console.log(event)
        syntaxOKFlag = false
        syntaxErrorMessage =`${event.message} : Line ${event.lineno} Col: ${event.colno}`
    }
    )


    syntaxOKFlag = true
    codehost.innerHTML = source

    if (!syntaxOKFlag) {
        res.status(500);

        res.send(`Server Error ocurred: ${syntaxErrorMessage}`)
        return res;
    }

    const req = new SimRequest()

    req.setPath(url)
    req.method = verb
    if(verb == "POST") req.setBody(postdata.innerText)


    window.initWebService(); // We are doing this each time although we wouldn't 
    const fName = `${verb.toLowerCase()}_${req.params[2]}`
    if (window[fName]) {
        try {
            await window[fName](req, res)
        } catch(e) {
            console.log(e)
            res.status(500);
            res.send(`Server Error ocurred: ${e}`)
        }
    } else {
        res.status(404);
        res.send(`Not Found handler ${fName}`)
    }
    return res;
}

function cleanCode(sourcecode) {
    sourcecode = sourcecode.replaceAll("const ", "var ")
    sourcecode = sourcecode.replaceAll("let ", "var ")
    return sourcecode
}