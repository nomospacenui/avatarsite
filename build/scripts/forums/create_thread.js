class CreateThread {
    constructor(url_vars) {
        this._url_vars = url_vars
        this._icon_image_root_dir = "../../../assets/images/icons/create_post/"

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

        this._content_input = document.createElement("textarea")
        this._content_input.className = "content-input"
        this._content_input.placeholder = "Content of thread"
        
        var submit_button = document.createElement("button")
        submit_button.className = "button"
        submit_button.innerHTML = "Submit"


        content_body.append(this.create_buttons())
        content_body.append(this._content_input)
        content_body.append(document.createElement("br"))
        content_body.append(submit_button)
        
        internalcontent_container.append(content_body)

        internalcontent_container.append(document.createElement("br"))

        var [preview, preview_text] = this.create_preview()
        internalcontent_container.append(preview)
        
        this._content_input.onchange = function () {
            preview_text.dispatchEvent(new CustomEvent("change", {'detail': {'input_box': this}}))
        }
        
        this._content_input.oninput = this._content_input.onchange
    }

    create_buttons() {
        var buttons_menu = document.createElement("toolbar")

        buttons_menu.append(this.create_modifier_button("bold.png", "<b>", "</b>"))
        buttons_menu.append(this.create_modifier_button("italic.png", "<i>", "</i>"))
        buttons_menu.append(this.create_modifier_button("underline.png", "<u>", "</u>"))
        buttons_menu.append(this.create_modifier_button("strikethrough.png", "<s>", "</s>"))

        buttons_menu.append(this.create_button_spacing())

        buttons_menu.append(this.create_modifier_button("left-align.png", "<p style='text-align: left'>", "</p>"))
        buttons_menu.append(this.create_modifier_button("center-align.png", "<p style='text-align: center'>", "</p>"))
        buttons_menu.append(this.create_modifier_button("right-align.png", "<p style='text-align: right'>", "</p>"))

        buttons_menu.append(this.create_button_spacing())
        
        var font_size_contents = ["10px", "12px", "14px", "16px", "20px"]
        buttons_menu.append(this.create_font_style_dropdown_modifier_button("text-size.png", font_size_contents, "font-size: ", true))
        
        var font_style_contents = ["Arial", "Verdana", "Tahoma", "Times New Roman", "Georgia", "Courier New", "Comic Sans MS"]
        buttons_menu.append(this.create_font_style_dropdown_modifier_button("font.png", font_style_contents, "font-family: ", true, ["60px", "120px"]))
        
        var font_color_contents = ["#f44336", "#ff994f", "#ffd966", "#6aa84f", "#3d9fa1", "#92cbe5", "#3d85c6", "#674ea7", "#cf99c5", "#ed7777", "#a2596f", "#bcbcbc"]
        buttons_menu.append(this.create_font_style_expand_modifier_button("text-color.png", font_color_contents, "color: "))
        
        buttons_menu.append(this.create_button_spacing())

        buttons_menu.append(this.create_hyperlink_button("link.png"))
        buttons_menu.append(this.create_image_button("image.png"))
        buttons_menu.append(this.create_modifier_button("quote.png", "<q>", "</q>"))

        return buttons_menu
    }

    create_button_spacing() {
        var spacing = document.createElement("text")
        spacing.className = "text-button-divider"
        return spacing
    }

    create_modifier_button(display, modifier_start, modifier_end, width = null) {
        var button = document.createElement("button")
        button.className = "text-button"

        var img = document.createElement("img")
        img.src = this._icon_image_root_dir + display
        button.append(img)

        if (width)
            button.style.width = width

        button.onclick = this.modifier_button_click.bind(null, this._content_input, modifier_start, modifier_end)
        return button
    }

    create_font_style_dropdown_modifier_button(display, contents, modifier, apply_style_to_content = false, width = null) {
        var button = document.createElement("button")
        button.className = "text-button"
 
        var img = document.createElement("img")
        img.src = this._icon_image_root_dir + display
        button.append(img)
        
        var dropdown_content = document.createElement("div")
        dropdown_content.className = "text-button-content"
        
        if (width) {
            button.style.width = width[0]
            dropdown_content.style.width = width[1]
        }
        
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
            content.onclick = this.modifier_button_click.bind(null, this._content_input, "<font style='" + modifier + x + "'>", "</font>")
            dropdown_content.append(content)
        });

        button.append(dropdown_content)
        return button
    }

    create_font_style_expand_modifier_button(display, contents, modifier) {
        var button = document.createElement("button")
        button.className = "text-button"
 
        var img = document.createElement("img")
        img.src = this._icon_image_root_dir + display
        button.append(img)

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
            content.onclick = this.modifier_button_click.bind(null, this._content_input, "<font style='" + modifier + x + "'>", "</font>")
            expand_content.append(content)
        });

        button.append(expand_content)
        return button
    }
    
    create_hyperlink_button(image_path) {
        var button = document.createElement("button")
        button.className = "text-button"

        var img = document.createElement("img")
        img.src = this._icon_image_root_dir + image_path
        button.append(img)

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
        
        var display_content = document.createElement("input")
        display_content.className = "text-button-input-content-entry"
        display_content.placeholder = "Display"

        display_content.onclick = function(e) {
            e.stopPropagation();
        }
        
        var submit_button = document.createElement("button")
        submit_button.innerHTML = "Submit"
        submit_button.className = "text-button-input-submit"
        
        const update_value = function(input_box, link_content, display_content) {
            input_box.value = input_box.value + "<a href=" + link_content.value + ">" + display_content.value + "</a>"
            input_box.onchange()
        }

        submit_button.onclick = update_value.bind(null, this._content_input, link_content, display_content)

        expand_content.append(link_content)
        expand_content.append(display_content)
        expand_content.append(submit_button)

        button.append(expand_content)
        return button
    }
    
    create_image_button(image_path) {
        var button = document.createElement("button")
        button.className = "text-button"

        var img = document.createElement("img")
        img.src = this._icon_image_root_dir + image_path
        button.append(img)

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
        
        const update_value = function(input_box, link_content) {
            input_box.value = input_box.value + "<img src=" + link_content.value + "></img>"
            input_box.onchange()
        }

        submit_button.onclick = update_value.bind(null, this._content_input, link_content)

        expand_content.append(link_content)
        expand_content.append(submit_button)

        button.append(expand_content)
        return button
    }

    create_preview() {
        var preview_container = document.createElement("div")
        preview_container.style.visibility = "hidden"
        
        var preview_header = document.createElement("div")
        preview_header.className = "content-header"
        preview_header.innerHTML = "Preview"
        preview_container.append(preview_header)

        var preview_body = document.createElement("div")
        preview_body.className = "preview-body"
        preview_container.append(preview_body)

        var preview_text = document.createElement("text")
        preview_text.innerHTML = ""
        preview_text.addEventListener('change', function (event) {
            preview_text.innerHTML = event.detail.input_box.value.replaceAll('\n', '<br>')
            preview_container.style.visibility = preview_text.innerHTML == "" ? "hidden": "visible"
        })

        preview_body.append(preview_text)

        return [preview_container, preview_text]
    }
    
    modifier_button_click(input_box, modifier_start, modifier_end) {
        const bef_str = input_box.value.substring(0, input_box.selectionStart)
        const mid_str = input_box.value.substring(input_box.selectionStart, input_box.selectionEnd)
        const aft_str = input_box.value.substring(input_box.selectionEnd, input_box.value.length)
        input_box.value = bef_str + modifier_start + mid_str + modifier_end + aft_str;
        
        input_box.focus()
        input_box.onchange()
        var end_insert_pos = (bef_str + modifier_start + mid_str + modifier_end).length
        input_box.selectionEnd = end_insert_pos
    }
}

export default CreateThread