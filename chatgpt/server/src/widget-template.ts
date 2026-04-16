export function createWidgetHtml({ script, css }: { script: string; css: string }) {
  return [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '  <head>',
    '    <meta charset="utf-8" />',
    '    <meta name="viewport" content="width=device-width, initial-scale=1" />',
    '    <title>Passport.ET Results</title>',
    `    <style>${css}</style>`,
    '  </head>',
    '  <body>',
    '    <div id="app"></div>',
    `    <script type="module">${script}</script>`,
    '  </body>',
    '</html>',
  ].join('\n')
}
