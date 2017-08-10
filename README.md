# angular-autosize
Directive to automatically resize a textarea to fit its content.
The most comprehensive Angular 2+ textarea directive that follows material standards.

## Installation
```
npm install angular-autosize
```

## Usage
1) Import and declare the directive in your main App Module:
```
import { AutosizeDirective } from 'angular-autosize';

@NgModule({
  declarations: [
    AutosizeDirective
  ]
})
```
2) Use the directive inside a textarea element in HTML:
```
<textarea autosize>Autosized textarea for Angular 2 and above</textarea>
```

3) Optionally, specify minRows and maxRows boundaries
```
<textarea autosize autosizeMinRows="5" autosizeMaxRows="10">Autosized textarea that expands from 5 to 10 rows</textarea>
```

## License
MIT
