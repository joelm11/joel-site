My intentions here are to write my blog posts in markdown, then use a CLI tool like `marked` to generate the HTML. From there, I can figure out hosting etc.

Pandoc command for generating HTML.
`pandoc -s waves.md -o waves.html --mathjax`

Python for hosting locally
`python3 -m http.server 8000`