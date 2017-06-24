# angular-autosize
Automatically resizes textarea height based on its content while preserving textarea width.
Works as a textarea directive for any Angular 2+ application.

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

## License
MIT
