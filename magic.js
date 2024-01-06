let syntaxOKFlag,syntaxErrorMessage

async function callVirtualEndpoint(url,method) {
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
    req._method = method
    if(method == "POST") req.setBody(postdata.innerText)


    window.initWebService(); // We are doing this each time although we wouldn't 

    if (window[`_${req.params[2]}`]) {
        try {
            await window[`_${req.params[2]}`](req, res)
        } catch(e) {
            console.log(e)
            res.status(500);
            res.send(`Server Error ocurred: ${e}`)
        }
    } else {
        res.status(404);
        res.send(`Not Found /${req.params[2]}`)
    }
    return res;
}

function cleanCode(sourcecode) {
    sourcecode = sourcecode.replaceAll("const ", "var ")
    sourcecode = sourcecode.replaceAll("let ", "var ")
    return sourcecode
}