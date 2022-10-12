# React Pdf Printer

## Description

Library for creating and printing pdf documents using React.

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
| children                             | Content of the document                                                                                     | React.ReactElement\<ArticleProps\> \| Array\<React.ReactElement\<ArticleProps\>\>                                             | yes      | ---           |
| screen                               | Hide document view from the user and show the substitute screen                                             | React.ReactNode \| ((isLoading: boolean) => React.ReactNode)                                                                  | no       | ---           |
| configuration                        | Configuration of the document                                                                               | DocumentConfiguration                                                                                                         | no       | (see below)   |
| configuration.size                   | Size of the document according to [mdn](https://developer.mozilla.org/en-US/docs/Web/CSS/@page/size#values) | number \| [number, number] \| 'a3' \| 'a4' \| 'a5' \| 'b4' \| 'b5' \| 'jis-b4' \| 'jis-b5' \| 'letter' \| 'legal' \| 'ledger' | no       | 'a4'          |
| configuration.orientation            | Orientation of the document                                                                                 | 'landscape' \| 'portrait'                                                                                                     | no       | 'portrait'    |
| configuration.pagination             | Configuration for pagination text                                                                           | Pagination                                                                                                                    | no       | (see below)   |
| configuration.pagination.format      | Text of the pagination                                                                                      | string                                                                                                                        | no       | '#p / #c'     |
| configuration.pagination.formatPage  | String to replace by current page number                                                                    | string                                                                                                                        | no       | '#p'          |
| configuration.pagination.formatCount | String to replace by number of all pages                                                                    | string                                                                                                                        | no       | '#c'          |
| isAsync                              | Enable async data fetching (see [usePrinter](#useprinter))                                                  | boolean                                                                                                                       | no       | false         |
| onLoaded                             | Function fired after loading pdf document                                                                   | () => void                                                                                                                    | no       | ---           |

**_NOTE_**: His child components have to be Page or View.

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

### Page

Undivisible into many pages component.

| Name     | Desc                 | Type            | Required | Default value             |
| -------- | -------------------- | --------------- | -------- | ------------------------- |
| header   | Header for the page  | React.ReactNode | no       | (default Document header) |
| footer   | Footer for the page  | React.ReactNode | no       | (default Document footer) |
| children | Content for the page | React.ReactNode | yes      | ---                       |

**_NOTE_**: If the content of the Page is larger than the height of the page overflow content isn't visible.

### View

Divisible into many pages component.

| Name     | Desc                 | Type            | Required | Default value             |
| -------- | -------------------- | --------------- | -------- | ------------------------- |
| header   | Header for the page  | React.ReactNode | no       | (default Document header) |
| footer   | Footer for the page  | React.ReactNode | no       | (default Document footer) |
| children | Content for the page | React.ReactNode | yes      | ---                       |

**_NOTE_**: Inner components that can be divided into many pages should have `data-printer-divisible` attribute. Rare use of this attribute can cause overflowed content and weird behaviour.

### Pagination

Component for marking which page is it. Configured by Document.

**_NOTE_**: This component should be placed in your header or footer.

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

`subscribe` and `run` functions are useful when dealing with some asynchronous code (e.g. fetching some data from backend) and not wanting to print document immediately

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

## Development

```bash
# building
$ npm run build

# building in development mode
$ npm run build:dev

# building in watch mode
$ npm run build:watch
```
