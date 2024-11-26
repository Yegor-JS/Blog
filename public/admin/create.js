const layout = require("../../views/layout");

module.exports = (user) => {
  return layout(user, {
    content: `
    <div>
        <button onclick="tagSelectedText('<h1>', '</h1>')">Header H1</button>
        <button onclick="tagSelectedText('<h2>', '</h2>')">Header H2</button>
        <button onclick="tagSelectedText('<h3>', '</h3>')">Header H3</button>
        <button onclick="tagSelectedText('<b>', '</b>')">Bold text</button>
        <button onclick="tagSelectedText('<i>', '</i>')">Italic</button>
        <button onclick="tagSelectedText('<a href=LINK>', '</a>')">Hyperlink</button>
        <button onclick="tagSelectedText('<strike>', '</strike>')">Strikethrough</button>
        <button onclick="makeList('<ul>', '</ul>')">List (bullets)</button>
        <button onclick="makeList('<ol>', '</ol>')">List (numeric)</button>
        <button onclick="replaceTags(['<p>', '</p>'], ['<li>', '</li>'])">Add list lines only</button>
        <button onclick="replaceTags(['<li>', '</li>', '<ol>\n', '\n</ol>', '<ul>\n', '\n</ul>','<ol>', '</ol>', '<ul>', '</ul>'], ['<p>', '</p>','','','','','','','',''])">Remove list</button>

        
        <form method="POST" enctype="multipart/form-data" action="/images/new">
            <input type="submit" value="Insert an image" />
                <div class="field">
                    <label>Image:</label>            
                    <input type="file" name="image" accept="image/png, image/jpeg"/>
                </div>
        </form>
        <form method="POST">
            <label for="title">title</label>
            <input placeholder="A clear and precise title" name="title"><br><br>
            <label for="body">body</label>
            <textarea id="bodyInput" style="height:400px;width:600px;font-size:14pt;"
                placeholder="A vibrant and engaging article" name="body"><p></textarea><br><br>
            <button>Create</button>
        </form>
    </div>
    <script src="./article-formatting.js"></script>
</html>
`,
  });
};
