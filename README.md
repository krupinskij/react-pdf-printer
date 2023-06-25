# React Pdf Printer

## Description

Library for creating and printing pdf documents using React.

This library is for you if you:

- want to create pdf document from scratch,
- have working project and now you want to print pdf document using components you already have with little to none changes to them

**_NOTE_**: Saying _"print"_ I mean creating pdf document in your browser calling `window.print()`.

This library provides control over:

- placing content on proper page (especially when it comes to spliting large components into different pages),
- dealing with asynchronous content (e.g. fetching data, loading images),
- adding header and footer to every page with information about current page and number of all pages

## Installation

```bash
$ npm install react-pdf-printer
$ yarn add react-pdf-printer
```

## Usage

Importing

```typescript
import {
  PrinterProvider,
  Document,
  PortalDocument,
  Page,
  Pages,
  Pagination,
  usePrinter,
} from 'react-pdf-printer';
```

### PrinterProvider

Printer provider configurating every pdf document (some fields can later be overwritten for particular document).

| Name                                 | Desc                                                                                                                                                                                                                                    | Type                                                                                                                          | Required | Default value |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------- | ------------- |
| configuration                        | Configuration for every document                                                                                                                                                                                                        | PrinterConfiguration                                                                                                          | no       | (see below)   |
| configuration.useAsync               | Enable async data fetching (see [usePrinter](#useprinter))                                                                                                                                                                              | boolean                                                                                                                       | no       | false         |
| configuration.size                   | Size of the document according to [mdn](https://developer.mozilla.org/en-US/docs/Web/CSS/@page/size#values)                                                                                                                             | number \| [number, number] \| 'a3' \| 'a4' \| 'a5' \| 'b4' \| 'b5' \| 'jis-b4' \| 'jis-b5' \| 'letter' \| 'legal' \| 'ledger' | no       | 'a4'          |
| configuration.orientation            | Orientation of the document                                                                                                                                                                                                             | 'landscape' \| 'portrait'                                                                                                     | no       | 'portrait'    |
| configuration.pagination             | Configuration of pagination                                                                                                                                                                                                             | PaginationConfiguration                                                                                                       | no       | (see below)   |
| configuration.pagination.format      | Text of the paging                                                                                                                                                                                                                      | string                                                                                                                        | no       | '#p / #t'     |
| configuration.pagination.formatPage  | Token in `format` which later will be replaced by current page                                                                                                                                                                          | string                                                                                                                        | no       | '#p'          |
| configuration.pagination.formatTotal | Token in `format` which later will be replaced by number of all pages                                                                                                                                                                   | string                                                                                                                        | no       | '#t'          |
| configuration.pagination.style       | Style of pagination (see [mdn](https://developer.mozilla.org/en-US/docs/Web/CSS/@counter-style)). Value to provide is `<counter-style-name>` (see [mdn](https://developer.mozilla.org/en-US/docs/Web/CSS/@counter-style#formal_syntax)) | string                                                                                                                        | no       | 'decimal'     |
| children                             | Content of the application                                                                                                                                                                                                              | React.ReactNode                                                                                                               | yes      | ---           |

### Document

Document component configurating and wrapping content of the pdf component.

**_NOTE_**: This component is intended to be the only and top level component of the route (see example)

| Name                     | Desc                                                                                    | Type                                                                        | Required | Default value                                                    |
| ------------------------ | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | -------- | ---------------------------------------------------------------- |
| header                   | Default header for the document                                                         | React.ReactNode                                                             | yes      | ---                                                              |
| footer                   | Default footer for the document                                                         | React.ReactNode                                                             | yes      | ---                                                              |
| children                 | Content of the document                                                                 | React.ReactNode                                                             | yes      | ---                                                              |
| title                    | Title of the document (filename)                                                        | string                                                                      | no       | (document.title is used)                                         |
| screen                   | Hides document view from the user and show the substitute screen                        | React.ReactNode \| (({ isPrinting }) => React.ReactNode)                    | yes      | ---                                                              |
| configuration            | Configuration of the document                                                           | DocumentConfiguration = Omit<PrinterConfiguration, 'orientation' \| 'size'> | no       | (see below)                                                      |
| configuration.useAsync   | Enable async data fetching (see [PrinterProvider](#PrinterProvider))                    | boolean                                                                     | no       | ([PrinterProvider](#PrinterProvider)'s configuration.useAsync)   |
| configuration.pagination | Configuration for pagination (see [PrinterProvider](#PrinterProvider))                  | PaginationConfiguration                                                     | no       | ([PrinterProvider](#PrinterProvider)'s configuration.pagination) |
| onRender                 | Function fired after rendering pdf document                                             | () => void                                                                  | no       | window.print                                                     |
| renderOnInit             | Flag indicating if document should be rendered on init (or on user action (see `ref`))  | boolean                                                                     | no       | true                                                             |
| ref                      | Reference prop with render function (can be used when `renderOnInit` is set to `false`) | DocumentRef                                                                 | no       | ---                                                              |

### PortalDocument

Document component configurating and wrapping content of the pdf component.

This component allows to render pdf when other content is visible (see example)

| Name                     | Desc                                                                   | Type                                                                        | Required | Default value                                                    |
| ------------------------ | ---------------------------------------------------------------------- | --------------------------------------------------------------------------- | -------- | ---------------------------------------------------------------- |
| header                   | Default header for the document                                        | React.ReactNode                                                             | yes      | ---                                                              |
| footer                   | Default footer for the document                                        | React.ReactNode                                                             | yes      | ---                                                              |
| children                 | Content of the document                                                | React.ReactNode                                                             | yes      | ---                                                              |
| configuration            | Configuration of the document                                          | DocumentConfiguration = Omit<PrinterConfiguration, 'orientation' \| 'size'> | no       | (see below)                                                      |
| configuration.useAsync   | Enable async data fetching (see [PrinterProvider](#PrinterProvider))   | boolean                                                                     | no       | ([PrinterProvider](#PrinterProvider)'s configuration.useAsync)   |
| configuration.pagination | Configuration for pagination (see [PrinterProvider](#PrinterProvider)) | PaginationConfiguration                                                     | no       | ([PrinterProvider](#PrinterProvider)'s configuration.pagination) |
| onRender                 | Function fired after rendering pdf document                            | () => void                                                                  | no       | window.print                                                     |
| ref                      | Reference prop with render function                                    | DocumentRef                                                                 | no       | ---                                                              |

### Page

Component undivisible into many pages.

| Name     | Desc                 | Type            | Required | Default value                                                           |
| -------- | -------------------- | --------------- | -------- | ----------------------------------------------------------------------- |
| header   | Header for the page  | React.ReactNode | no       | ([Document](#document)'s or [PortalDocument](#portaldocument)'s header) |
| footer   | Footer for the page  | React.ReactNode | no       | ([Document](#document)'s or [PortalDocument](#portaldocument)'s footer  |
| children | Content for the page | React.ReactNode | yes      | ---                                                                     |

**_NOTE_**: If the content of the Page is larger than the height of the page overflow content is hidden.

### Pages

Component divisible into many pages.

| Name     | Desc                 | Type            | Required | Default value                                                           |
| -------- | -------------------- | --------------- | -------- | ----------------------------------------------------------------------- |
| header   | Header for the page  | React.ReactNode | no       | ([Document](#document)'s or [PortalDocument](#portaldocument)'s header) |
| footer   | Footer for the page  | React.ReactNode | no       | ([Document](#document)'s or [PortalDocument](#portaldocument)'s footer) |
| children | Content for the page | React.ReactNode | yes      | ---                                                                     |

**_NOTE_**: Inner components that can be divided into many pages should have `data-printer-divisible` attribute [(see)](#data-printer-divisible). Rare use of this attribute can cause overflowed content and weird behaviour.

**_NOTE_**: Both `Page` and `Pages` have to be placed inside [Document](#document) or [PortalDocument](#portaldocument) component.

### Pagination

Component for marking number of current page. Configured by [Document](#document) and [PortalDocument](#portaldocument).

**_NOTE_**: This component should be placed only in your header or footer.

### usePrinter

Printer hook

```typescript
const { isPrinter, isRendering, subscribe, run } = usePrinter(key?: string);
```

| Name        | Desc                                                                                                        | Type       |
| ----------- | ----------------------------------------------------------------------------------------------------------- | ---------- |
| isPrinter   | Flag indicating if it component inside [Document](#document) or [PortalDocument](#portaldocument) component | boolean    |
| isRendering | Flag indicating if any pdf document is currently rendering                                                  | boolean    |
| subscribe   | Function subscribing for asynchronous action                                                                | () => void |
| run         | Function to run after resolving asynchronous action                                                         | () => void |

`subscribe` and `run` functions are useful when dealing with some asynchronous code (e.g. fetching some data from backend) and not wanting to print document immediately.

```tsx
const MyComponent = () => {
  const { subscribe, run } = usePrinter('my-unique-key');
  const [data, setData] = useState([]);

  useEffect(() => {
    subscribe();
    fetch('...')
      .then(resp => resp.json())
      .then(resp => {
        setData(resp);
      })
      .finally(() => {
        run()
      })
  }, [subscribe, run]);

  return <div>{ data.map(item => ...) }</div>;
};
```

**_NOTE_**: Running `subscribe` and `run` from `usePrinter` with no `key` passed or outside [Document](#document) or [PortalDocument](#portaldocument) has no effect (they are empty functions).

**_NOTE_**: Using `subscribe` and `run` functions works only when `useAsync` flag is set to `true`.

**_NOTE_**: Setting `useAsync` flag to `true` and not running `subscribe` and `run` blocks rendering (these functions have to be used at least once).

### data-printer-divisible

HTML dataset attribute indicating that direct children of marked element can be splitted into many pages. Otherwise whole element will stay in one page (unless any of his nested children has such attribute).

This attribute can be used anywhere in the document tree and can be used recursively inside direct or indirect parent element with this attribute.

This attribute don't need any value.

**_NOTE_**: Using `data-printer-divisible` attribute on elements in [Page](#page) has no effect.

```tsx
<div data-printer-divisible>
  <div>This text</div>
  <div>can be</div>
  <div>splitted into</div>
  <div>many pages.</div>
</div>
<div>
  <div>And this</div>
  <div>will stay</div>
  <div>in one page</div>
</div>
```

### data-printer-span

HTML dataset attribute indicating how many direct next siblings will be treated as one element and won't be splitted into different pages.

This attribute takes a positive natural number (default value is `1`). Floating point number are rounded down to nearest integer number. Any value that eventually won't be positive natural number will fallback to `1`.

```tsx
<div data-printer-divisible>
  {/* 1 */} <h1 data-printer-span="3">This is a header</h1> {/* span = 3 */}
  {/* 2 */} <h2>This is a subheader</h2>
  {/* 3 */} <div>This still will be in the same page!</div>
  {/* 4 */} <div>This may or may not be moved to the next page</div>
</div>
```

## Notes

Due to poor browser compatibility e.g. lack of `vh` css unit in context of `@media print` doesn't work on Firefox.

## Development

```bash
# building
$ npm run build

# building in development mode
$ npm run build:dev

# building in watch mode
$ npm run build:watch
```
