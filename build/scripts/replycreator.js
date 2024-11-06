function reply_element(){
    var reply = document.createElement('div')
    reply.className = "reply"

    var reply_actions = document.createElement('div')
    reply_actions.className = "replyactions"
    document.getElementById("content").appendChild(reply_actions);
    
    var reply_actions_space = document.createElement('div')
    reply_actions_space.className = "replyactions-space"
    var reply_actions_buttonblock = document.createElement('div')
    reply_actions_buttonblock.className = "replyactions-buttonblock"

    reply_actions.appendChild(reply_actions_space)
    reply_actions.appendChild(reply_actions_buttonblock)

    var reply_buttonquote = document.createElement('button')
    reply_buttonquote.className = "replybutton"
    reply_buttonquote.innerHTML = "Quote"
    var reply_buttonreport = document.createElement('button')
    reply_buttonreport.className = "replybutton-accent"
    reply_buttonreport.innerHTML = "Report"
    reply_actions_buttonblock.appendChild(reply_buttonquote)
    reply_actions_buttonblock.appendChild(reply_buttonreport)

    //main bulk of the reply
    var reply_user = document.createElement('div')
    reply_user.className = "replyuser"

    var reply_win = document.createElement('div')
    reply_win.className = "replywin"

    reply.appendChild(reply_user)
    reply.appendChild(reply_win)
    
    var reply_username = document.createElement('div')
    reply_username.innerHTML = "Username"
    
    var reply_userstatus = document.createElement('div')
    reply_userstatus.innerHTML = "Online"
    reply_userstatus.className = "replyuserstatus"

    var reply_avatar = document.createElement('img')
    reply_avatar.src = "../../assets/images/avatar/base.png"
    
    var reply_buttonblock = document.createElement('div')
    reply_buttonblock.className = "replybuttonblock"

    var reply_buttonfriend = document.createElement('button')
    reply_buttonfriend.className = "replybutton"
    reply_buttonfriend.innerHTML = "Friend"
    var reply_buttonpm = document.createElement('button')
    reply_buttonpm.className = "replybutton"
    reply_buttonpm.innerHTML = "PM"
    reply_buttonblock.appendChild(reply_buttonfriend)
    reply_buttonblock.appendChild(reply_buttonpm)

    reply_user.appendChild(reply_username)
    reply_user.appendChild(reply_userstatus)
    reply_user.appendChild(reply_avatar)
    reply_user.appendChild(reply_buttonblock)

    var reply_header = document.createElement('div')
    reply_header.className = "replywin-header"
    reply_header.innerHTML = "Header"

    var reply_body = document.createElement('div')
    reply_body.className = "replywin-body"
    reply_body.innerHTML = "Body"

    reply_win.appendChild(reply_header)
    reply_win.appendChild(reply_body)

    document.getElementById("content").appendChild(reply);

    //only add signature if the user has one
    var reply_signature = document.createElement('div')
    reply_signature.className = "replysignature"

    var reply_signature_space = document.createElement('div')
    reply_signature_space.className = "replysignature-space"

    var reply_signature_content = document.createElement('div')
    reply_signature_content.className = "replysignature-content"
    reply_signature_content.innerHTML = "Signature here"
    
    reply_signature.appendChild(reply_signature_space);
    reply_signature.appendChild(reply_signature_content);
    
    document.getElementById("content").appendChild(reply_signature);
}

for (let i = 0; i < 5 ; ++i) {
    reply_element()
}