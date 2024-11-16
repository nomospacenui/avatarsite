class Post {
    constructor(post_data) {
        this._post_data = post_data

        var postcontent_container = document.getElementById("body_contentbox")

        postcontent_container.appendChild(this.create_actions())

        var bulk = document.createElement("div")
        bulk.className = "postbulk"
        bulk.appendChild(this.create_user())
        bulk.appendChild(this.create_win())
        postcontent_container.appendChild(bulk)

        postcontent_container.appendChild(this.create_signature())
    }

    create_actions() {
        var post_actions = document.createElement("div")
        post_actions.className = "postactions"
        
        var post_actions_space = document.createElement("div")
        post_actions_space.className = "postactions-space"
        var post_actions_buttonblock = document.createElement("div")
        post_actions_buttonblock.className = "postactions-buttonblock"

        post_actions.appendChild(post_actions_space)
        post_actions.appendChild(post_actions_buttonblock)
        
        var post_buttonquote = document.createElement("button")
        post_buttonquote.className = "postbutton"
        post_buttonquote.innerHTML = "Quote"

        var post_buttonreport = document.createElement("button")
        post_buttonreport.className = "postbutton-accent"
        post_buttonreport.innerHTML = "Report"

        post_actions_buttonblock.appendChild(post_buttonquote)
        post_actions_buttonblock.appendChild(post_buttonreport)
        
        return post_actions;
    }

    create_user() {
        var post_user = document.createElement("div")
        post_user.className = "postuser"

        var post_username = document.createElement("div")
        post_username.innerHTML = "Username"
        
        var post_userstatus = document.createElement("div")
        post_userstatus.innerHTML = "Online"
        post_userstatus.className = "postuserstatus"

        var post_avatar = document.createElement("img")
        post_avatar.src = "../../assets/images/avatar/base.png"
        
        var post_buttonblock = document.createElement("div")
        post_buttonblock.className = "postbuttonblock"

        var post_buttonfriend = document.createElement("button")
        post_buttonfriend.className = "postbutton"
        post_buttonfriend.innerHTML = "Friend"
        var post_buttonpm = document.createElement("button")
        post_buttonpm.className = "postbutton"
        post_buttonpm.innerHTML = "PM"
        post_buttonblock.appendChild(post_buttonfriend)
        post_buttonblock.appendChild(post_buttonpm)

        post_user.appendChild(post_username)
        post_user.appendChild(post_userstatus)
        post_user.appendChild(post_avatar)
        post_user.appendChild(post_buttonblock)

        return post_user
    }

    create_win() {
        var post_win = document.createElement("div")
        post_win.className = "postwin"

        var post_header = document.createElement("div")
        post_header.className = "postwin-header"
        post_header.innerHTML = "Header"

        var post_body = document.createElement("div")
        post_body.className = "postwin-body"
        post_body.innerHTML = this._post_data["content"]

        post_win.appendChild(post_header)
        post_win.appendChild(post_body)

        return post_win
    }

    create_signature() {
        var post_signature = document.createElement("div")
        post_signature.className = "postsignature"

        var post_signature_space = document.createElement("div")
        post_signature_space.className = "postsignature-space"

        var post_signature_content = document.createElement("div")
        post_signature_content.className = "postsignature-content"
        post_signature_content.innerHTML = "Signature here"
        
        post_signature.appendChild(post_signature_space);
        post_signature.appendChild(post_signature_content);
        
        return post_signature
    }
}

export default Post