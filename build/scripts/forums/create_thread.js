class CreateThread {
    constructor(url_vars) {
        this._url_vars = url_vars

        var internalcontent_container = document.getElementById("internal-body")
        
        var title_input = document.createElement("input")
        title_input.className = "title-input"
        title_input.placeholder = "Title of thread"
        internalcontent_container.append(title_input)

        var content_header = document.createElement("div")
        content_header.className = "content-header"
        internalcontent_container.append(content_header)

        var content_body = document.createElement("div")
        content_body.className = "content-body"

        var content_input = document.createElement("textarea")
        content_input.className = "content-input"
        content_input.placeholder = "Content of thread"

        content_body.append(this.create_buttons(content_input))
        content_body.append(content_input)
        
        internalcontent_container.append(content_body)
    }

    create_buttons(input_box) {
        var buttons_menu = document.createElement("toolbar")

        buttons_menu.append(this.create_modifier_button(input_box, "<b>B</b>", "<b>", "</b>"))
        buttons_menu.append(this.create_modifier_button(input_box, "<i>I</i>", "<i>", "</i>"))
        buttons_menu.append(this.create_modifier_button(input_box, "<u>U</u>", "<u>", "</u>"))
        buttons_menu.append(this.create_modifier_button(input_box, "<s>S</s>", "<s>", "</s>"))

        buttons_menu.append(this.create_button_spacing())

        //TODO: Get proper icons for these
        buttons_menu.append(this.create_modifier_button(input_box, "../../../assets/images/icons/create_post/left-align.png", "<p style='text-align: left'>", "</p>"))
        buttons_menu.append(this.create_modifier_button(input_box, "../../../assets/images/icons/create_post/center-align.png", "<p style='text-align: center'>", "</p>"))
        buttons_menu.append(this.create_modifier_button(input_box, "../../../assets/images/icons/create_post/right-align.png", "<p style='text-align: right'>", "</p>"))

        buttons_menu.append(this.create_button_spacing())
        
        var font_size_contents = ["10px", "12px", "14px", "16px", "20px", "22px"]
        buttons_menu.append(this.create_font_style_dropdown_modifier_button(input_box, "<font style='font-size:11px'>A</font><font style='font-size:14px'>A</font>", font_size_contents, "font-size: ", true))
        
        var font_style_contents = ["Arial", "Verdana", "Tahoma", "Times New Roman", "Georgia", "Courier New", "Comic Sans MS"]
        buttons_menu.append(this.create_font_style_dropdown_modifier_button(input_box, "<font style='font-family:Courier New'>Font</font>", font_style_contents, "font-family: ", true))
        
        var font_color_contents = ["#f44336", "#ff994f", "#ffd966", "#6aa84f", "#3d9fa1", "#92cbe5", "#3d85c6", "#674ea7", "#cf99c5", "#ed7777", "#a2596f", "#bcbcbc"]
        buttons_menu.append(this.create_font_style_expand_modifier_button(input_box, "<font style='color:#ed7777'>Color</font>", font_color_contents, "color: "))
        
        buttons_menu.append(this.create_button_spacing())

        //TODO: Get proper icons for these
        buttons_menu.append(this.create_hyperlink_button(input_box, "../../../assets/images/icons/create_post/link.png"))
        buttons_menu.append(this.create_image_button(input_box, "../../../assets/images/icons/create_post/image.png"))
        buttons_menu.append(this.create_modifier_button(input_box, "../../../assets/images/icons/create_post/quote.png", "<q>", "</q>"))

        return buttons_menu
    }

    create_button_spacing() {
        var spacing = document.createElement("text")
        spacing.className = "text-button-divider"
        return spacing
    }

    create_modifier_button(input_box, display, modifier_start, modifier_end) {
        var button = document.createElement("button")

        if (display.endsWith(".png")) {
            button.className = "text-button-image"
            button.style.backgroundImage = "url(" + display + ")"
            button.innerHTML = "-"
        }
        else {
            button.className = "text-button"
            button.innerHTML = display
        }

        button.onclick = function() { modifier_button_click(input_box, modifier_start, modifier_end) }
        return button
    }

    create_font_style_dropdown_modifier_button(input_box, display, contents, modifier, apply_style_to_content = false) {
        var button = document.createElement("button")
        button.className = "text-button-dropdown"
        button.innerHTML = display
        
        var dropdown_content = document.createElement("div")
        dropdown_content.className = "text-button-content"
        
        button.onclick = function() { 
            dropdown_content.style.visibility = (dropdown_content.style.visibility == "visible") ? "hidden" : "visible"
        }
        
        contents.forEach(x => {
            var content = document.createElement("div")
            if (apply_style_to_content) 
                content.innerHTML = "<font style='" + modifier + x + "'>" + x + "</font>"
            else
                content.innerHTML = x
            content.className = "text-button-content-entry"
            content.onclick = function() { modifier_button_click(input_box, "<font style='" + modifier + x + "'>", "</font>") }
            dropdown_content.append(content)
        });

        button.append(dropdown_content)
        return button
    }

    create_font_style_expand_modifier_button(input_box, display, contents, modifier) {
        var button = document.createElement("button")
        button.className = "text-button-dropdown"
        button.innerHTML = display

        var expand_content = document.createElement("div")
        expand_content.className = "text-button-content"
        
        button.onclick = function() { 
            expand_content.style.visibility = (expand_content.style.visibility == "visible") ? "hidden" : "visible"
        }
        
        contents.forEach(x => {
            var content = document.createElement("text")
            content.style.background = x
            content.innerHTML = " "
            content.className = "tiny-button"
            content.onclick = function() { modifier_button_click(input_box, "<font style='" + modifier + x + "'>", "</font>") }
            expand_content.append(content)
        });

        button.append(expand_content)
        return button
    }
    
    create_hyperlink_button(input_box, image_path) {
        var button = document.createElement("button")
        button.className = "text-button-input"
        button.style.backgroundImage = "url(" + image_path + ")"
        button.innerHTML = "-"

        var expand_content = document.createElement("div")
        expand_content.className = "text-button-input-content"
        
        button.onclick = function() { 
            expand_content.style.visibility = (expand_content.style.visibility == "visible") ? "hidden" : "visible"
        }
        
        var link_content = document.createElement("input")
        link_content.className = "text-button-input-content-entry"
        link_content.placeholder = "Link"

        link_content.onclick = function(e) {
            e.stopPropagation();
        }

        var displaytext_content = document.createElement("input")
        displaytext_content.className = "text-button-input-content-entry"
        displaytext_content.placeholder = "Display text"
        
        displaytext_content.onclick = function(e) {
            e.stopPropagation();
        }
        
        var submit_button = document.createElement("button")
        submit_button.innerHTML = "Submit"
        submit_button.className = "text-button-input-submit"

        expand_content.append(link_content)
        expand_content.append(displaytext_content)
        expand_content.append(submit_button)

        button.append(expand_content)
        return button
    }
    
    create_image_button(input_box, image_path) {
        var button = document.createElement("button")
        button.className = "text-button-input"
        button.innerHTML = "IMG"
        button.style.backgroundImage = "url(" + image_path + ")"
        button.innerHTML = "-"

        var expand_content = document.createElement("div")
        expand_content.className = "text-button-input-content"
        
        button.onclick = function() { 
            expand_content.style.visibility = (expand_content.style.visibility == "visible") ? "hidden" : "visible"
        }
        
        var link_content = document.createElement("input")
        link_content.className = "text-button-input-content-entry"
        link_content.placeholder = "Link to image"

        link_content.onclick = function(e) {
            e.stopPropagation();
        }
        
        var submit_button = document.createElement("button")
        submit_button.innerHTML = "Submit"
        submit_button.className = "text-button-input-submit"

        expand_content.append(link_content)
        expand_content.append(submit_button)

        button.append(expand_content)
        return button
    }
}

function modifier_button_click(input_box, modifier_start, modifier_end) {
    const bef_str = input_box.value.substring(0, input_box.selectionStart)
    const mid_str = input_box.value.substring(input_box.selectionStart, input_box.selectionEnd)
    const aft_str = input_box.value.substring(input_box.selectionEnd, input_box.value.length)
    input_box.value = bef_str + modifier_start + mid_str + modifier_end + aft_str;
    
    input_box.focus()
    var end_insert_pos = (bef_str + modifier_start + mid_str + modifier_end).length
    input_box.selectionEnd = end_insert_pos
}

export default CreateThread