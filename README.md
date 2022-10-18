# React Pdf Printer

## Description

Library for creating and printing pdf documents using React.

The main goal of this library is to printing pdf documents with little to none changes to structure of the project.

**Did you write a website using react and now you want to print your view into pdf file? Nice. This library is for you.**

**Do you want to create pdf document from scratch? That awesome too.**

Saying _print_ I mean creating pdf document in your browser calling `window.print()` or clicking `ctrl + p` / `cmd + p`.

Let's try this now here: Come on, you can use this shortcut. Wherever your are now: github, npm or anywhere else your view probably won't look great. This library will help you have much more control e.g. customizing size of the page, pointing where your website can be splitted into many pages or setting custom header and footer with pagination.

Sounds awesome? Let's try it...

## Installation

```bash
$ npm install react-pdf-printer
```

## Usage

Importing

```typescript
import { Document, Page, View, Pagination, usePrinter } from 'react-pdf-printer';
```

### Document

Document is a top level component wrapped around the other ones and configurating the whole file.

| Name                                 | Desc                                                                                                        | Type                                                                                                                          | Required | Default value |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------- | ------------- |
| header                               | Default header for the document                                                                             | React.ReactNode                                                                                                               | yes      | ---           |
| footer                               | Default footer for the document                                                                             | React.ReactNode                                                                                                               | yes      | ---           |
| children                             | Content of the document                                                                                     | React.ReactNode                                                                                                               | yes      | ---           |
| screen                               | Hides document view from the user and show the substitute screen                                            | React.ReactNode \| ((isLoading: boolean) => React.ReactNode)                                                                  | no       | ---           |
| configuration                        | Configuration of the document                                                                               | DocumentConfiguration                                                                                                         | no       | (see below)   |
| configuration.size                   | Size of the document according to [mdn](https://developer.mozilla.org/en-US/docs/Web/CSS/@page/size#values) | number \| [number, number] \| 'a3' \| 'a4' \| 'a5' \| 'b4' \| 'b5' \| 'jis-b4' \| 'jis-b5' \| 'letter' \| 'legal' \| 'ledger' | no       | 'a4'          |
| configuration.orientation            | Orientation of the document                                                                                 | 'landscape' \| 'portrait'                                                                                                     | no       | 'portrait'    |
| configuration.pagination             | Configuration for pagination text                                                                           | Pagination                                                                                                                    | no       | (see below)   |
| configuration.pagination.format      | Text of the pagination                                                                                      | string                                                                                                                        | no       | '#p / #c'     |
| configuration.pagination.formatPage  | String to replace by current page number                                                                    | string                                                                                                                        | no       | '#p'          |
| configuration.pagination.formatCount | String to replace by number of all pages                                                                    | string                                                                                                                        | no       | '#c'          |
| isAsync                              | Enable async data fetching (see [usePrinter](#useprinter))                                                  | boolean                                                                                                                       | no       | false         |
| onLoaded                             | Function fired after loading pdf document                                                                   | () => void                                                                                                                    | no       | ---           |

```tsx
// Comprehensive example
<Document
  configuration={{
    size: 'a5',
    orientation: 'landscape',
    pagination: {
      format: 'page #page of #count',
      formatPage: '#page',
      formatCount: '#count',
    },
    isAsync: true,
  }}
  header={<Header />}
  footer={<Footer />}
  screen={<UserView />}
  onLoaded={() => window.print()}
>
  ...
</Document>
```

### View

Component divisible into many pages.

| Name     | Desc                 | Type            | Required | Default value             |
| -------- | -------------------- | --------------- | -------- | ------------------------- |
| header   | Header for the page  | React.ReactNode | no       | (default Document header) |
| footer   | Footer for the page  | React.ReactNode | no       | (default Document footer) |
| children | Content for the page | React.ReactNode | yes      | ---                       |

**_NOTE_**: Inner components that can be divided into many pages should have `data-printer-divisible` attribute [(see)](#data-printer-divisible). Rare use of this attribute can cause overflowed content and weird behaviour.

### Page

Component undivisible into many pages.

| Name     | Desc                 | Type            | Required | Default value             |
| -------- | -------------------- | --------------- | -------- | ------------------------- |
| header   | Header for the page  | React.ReactNode | no       | (default Document header) |
| footer   | Footer for the page  | React.ReactNode | no       | (default Document footer) |
| children | Content for the page | React.ReactNode | yes      | ---                       |

**_NOTE_**: If the content of the Page is larger than the height of the page overflow content is hidden.

**_NOTE_**: Using `data-printer-divisible` attribute on child elements here has no effect but using `Page` instead of `View` is faster.

**_NOTE_**: Both `Page` and `View` have to be placed inside `Document` component.

### Pagination

Component for marking number of current page. Configured by Document.

**_NOTE_**: This component should be placed only in your header or footer.

### usePrinter

Printer hook

```typescript
const { isPrinter, subscribe, run } = usePrinter(key?: string);
```

| Name      | Desc                                                       | Type       |
| --------- | ---------------------------------------------------------- | ---------- |
| isPrinter | Value indicating if it component inside Document component | boolean    |
| subscribe | Function stoping content from loading                      | () => void |
| run       | Function running loading of content                        | () => void |

`subscribe` and `run` functions are useful when dealing with some asynchronous code (e.g. fetching some data from backend) and not wanting to print document immediately.

```tsx
const MyComponent = () => {
  const { subscribe, run } = usePrinter('my-unique-key');

  useEffect(() => {
    subscribe();

    // document won't be printed until 10 seconds pass
    const timeout = setTimeout(() => {
      run();
    }, 10000);

    return () => clearTimeout(timeout);
  }, []);

  return <div>Some content</div>;
};
```

**_NOTE_**: Running `subscribe` and `run` from `usePrinter` with no `key` passed or outside `Document` has no effect (they are empty functions).

**_NOTE_**: Using `subscribe` and `run` functions works only when `isAsync` flag is set to `true`.

**_NOTE_**: Setting `isAsync` flag to `true` and not running neither `subscribe` nor `run` functions blocks printing.

### data-printer-divisible

HTML dataset attribute indicating that direct children of marked element can be splitted into many pages. Otherwise whole element will stay in one page (unless any of his nested children has such attribute).

This attribute can be used anywhere in the document tree and can be used recursively inside direct or indirect parent element with this attribute.

This attribute don't need any value.

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

HTML dataset attribute indicating how many direct next siblings will be treated as one element and won't be splitted to different pages.

This attribute takes a positive natural number (default value is `1`). Floating point number are rounded down to nearest integer number. Any value that eventually won't be positive natural number will fallback to `1`.

```tsx
<div data-printer-divisible>
  {/* 1 */} <h1 data-printer-span="3">This is a header</h1> {/* span = 3 */}
  {/* 2 */} <h2>This is a subheader</h2>
  {/* 3 */} <div>I still will be in the same page!</div>
  {/* 4 */} <div>I can be moved to the next page</div>
</div>
```

## Notes

Sadly doesn't work on Firefox.

## Development

```bash
# building
$ npm run build

# building in development mode
$ npm run build:dev

# building in watch mode
$ npm run build:watch
```
