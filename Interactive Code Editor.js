  function runCode() {
            const html = document.getElementById('htmlCode').value;
            const css = document.getElementById('cssCode').value;
            const js = document.getElementById('jsCode').value;
            const output = document.getElementById('output');

            function sanitizeHTML(input) {
                if (!input) return '';
                const bodyMatch = input.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
                if (bodyMatch) return bodyMatch[1];
                const htmlMatch = input.match(/<html[^>]*>([\s\S]*?)<\/html>/i);
                if (htmlMatch) {
                    const inner = htmlMatch[1];
                    const innerBodyMatch = inner.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
                    if (innerBodyMatch) return innerBodyMatch[1];
                    return inner.replace(/<head[\s\S]*?<\/head>/i, '');
                }
                return input.replace(/<!doctype[\s\S]*?>/i, '');
            }

            const bodyContent = sanitizeHTML(html);

            var code = '<!DOCTYPE html><html><head><meta charset="utf-8"><style>' + css + '</style></head><body>' + bodyContent + '<script>' + js + '</' + 'script></body></html>';

            output.srcdoc = code;
        }

        function resetCode() {
            document.getElementById('htmlCode').value = '<!DOCTYPE html>\n<html>\n<head>\n    <title>My Page</title>\n</head>\n<body>\n    <h1>Hello World!</h1>\n    <p>Edit the code and click Run</p>\n    <button id="myBtn">Click me!</button>\n</body>\n</html>';

            document.getElementById('cssCode').value = 'body {\n    font-family: Arial, sans-serif;\n    text-align: center;\n    padding: 2rem;\n    background: linear-gradient(135deg, #667eea, #764ba2);\n    color: white;\n}\n\nbutton {\n    padding: 10px 20px;\n    font-size: 16px;\n    cursor: pointer;\n    background: #FFD700;\n    border: none;\n    border-radius: 5px;\n    margin-top: 1rem;\n}\n\nbutton:hover {\n    transform: scale(1.1);\n}';

            document.getElementById('jsCode').value = 'document.getElementById(\'myBtn\').addEventListener(\'click\', function() {\n    alert(\'Button clicked! 🎉\');\n    this.textContent = \'Clicked!\';\n    this.style.background = \'#00ca4e\';\n});';

            runCode();
        }

        function copyCode() {
            const html = document.getElementById('htmlCode').value;
            navigator.clipboard.writeText(html).then(() => {
                alert('Code copied to clipboard! ✅');
            });
        }

        function switchTab(e, tab) {
            const tabs = document.querySelectorAll('.tab');
            tabs.forEach(t => t.classList.remove('active'));
            try {
                const btn = (e && (e.currentTarget || e.target)) || document.querySelector('.tab[onclick*="' + tab + '"]');
                const button = btn && btn.closest ? btn.closest('.tab') : btn;
                if (button) button.classList.add('active');
            } catch (err) {
                // fallback: activate first matching tab
                const fallback = document.querySelector('.tab[onclick*="' + tab + '"]');
                if (fallback) fallback.classList.add('active');
            }
        }

        runCode();