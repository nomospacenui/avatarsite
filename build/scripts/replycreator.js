function reply_element(){
    var reply = document.createElement('div')

    var reply_header = document.createElement('div')
    reply_header.className = "replywin-header"
    reply_header.innerHTML = "Header"

    var reply_body = document.createElement('div')
    reply_body.className = "replywin-body"
    reply_body.innerHTML = "Body"

    reply.appendChild(reply_header)
    reply.appendChild(reply_body)

    document.getElementById("reply_content").appendChild(reply);
}

reply_element()