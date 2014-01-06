function NCL2HTML() {
};

NCL2HTML.prototype = {
  load: function(app_url) {
    self = this;
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = this.on_load;
    xhr.open("GET", app_url, true);
    xhr.send();
  },

  on_load: function() {
    if (xhr.readyState == 4) {
      self.parse(xhr.responseText);
    }
  },

  parse: function(ncl_code) {
    var parser = new DOMParser();
    var ncl_doc = parser.parseFromString(ncl_code, "text/xml");
    var dom_elements = ncl_doc.getElementsByTagName("*");
    var result = self.convertTags(dom_elements);

    self.start_app(result);
  },

  convertTags: function(dom_elements) {
    var result = "";

    for (var i = 0; i < dom_elements.length; i++) {
      current_element = dom_elements[i];
      if (current_element.tagName == "ncl") {
        result += self.createHtmlTag(current_element);
      }
      else if (current_element.tagName == "media") {
        result += self.createMediaTag(current_element);
      }
      else {
        log("WARN", "Tag wasn't converted: " + current_element.tagName);
      }
    }

    return result;
  },

  createHtmlTag: function(ncl_tag) {
    tag = "<html ";
    for (var i=0; i < ncl_tag.attributes.length; i++) {
      current_attr = ncl_tag.attributes[i];
      tag += current_attr.name + "=" + current_attr.value + " ";
    }
    return tag + ">";
  },

  createMediaTag: function(media_tag) {
    media_src = media_tag.getAttribute("src");
    if (is_image(media_src)) {
      tag = "<img ";
    }

    for (var i=0; i < media_tag.attributes.length; i++) {
      current_attr = media_tag.attributes[i];
      tag += current_attr.name + "=" + current_attr.value + " ";
    }
    return tag + ">";
    console.log(tag);
  },

  start_app: function(html_code) {
    main_iframe = document.getElementById("ncl2html");
    main_iframe.contentWindow.document.open();
    main_iframe.contentWindow.document.write(html_code);
    main_iframe.contentWindow.document.close();
  }
}

function is_image(media_tag) {
  return media_tag.match("(.*).(bmp|gif|jpg|png|mng|jpeg|)");
}


function log(lvl, text) {
  console = document.getElementById("console");
  console.innerHTML += "<b>" + lvl + "</b> " + text + "<br>";
}
