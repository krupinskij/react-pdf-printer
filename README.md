# React Pdf Printer

<br>

## Description

Library for creating and printing pdf documents using React.

<br>

## Installation

```bash
$ npm install react-pdf-printer
```

<br>

## Usage

Importing

```typescript
import { Document, Page, View, Pagination, usePrinter } from 'react-pdf-printer';
```

<br>

---

<br>

### Document

Document is a top level component wrapped around the other ones and configurating the whole file.

| Name                                 | Desc                                                                                                        | Type                                                                                                                          | Required | Default value |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------- | ------------- |
| header                               | Default header for the document                                                                             | React.ReactNode                                                                                                               | yes      | ---           |
| footer                               | Default footer for the document                                                                             | React.ReactNode                                                                                                               | yes      | ---           |
| children                             | Content of the document                                                                                     | React.ReactElement\<ArticleProps\> \| Array\<React.ReactElement\<ArticleProps\>\>                                             | yes      | ---           |
| screen                               | Hide document view from the user and show the substitute screen                                             | React.ReactNode                                                                                                               | no       | ---           |
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

<br>

---

<br>

### Page

Undivisible into many pages component.

| Name     | Desc                 | Type            | Required | Default value             |
| -------- | -------------------- | --------------- | -------- | ------------------------- |
| header   | Header for the page  | React.ReactNode | no       | (default Document header) |
| footer   | Footer for the page  | React.ReactNode | no       | (default Document footer) |
| children | Content for the page | React.ReactNode | yes      | ---                       |

**_NOTE_**: If the content of the Page is larger than the height of the page overflow content isn't visible.

<br>

---

<br>

### View

Divisible into many pages component.

| Name     | Desc                 | Type            | Required | Default value             |
| -------- | -------------------- | --------------- | -------- | ------------------------- |
| header   | Header for the page  | React.ReactNode | no       | (default Document header) |
| footer   | Footer for the page  | React.ReactNode | no       | (default Document footer) |
| children | Content for the page | React.ReactNode | yes      | ---                       |

**_NOTE_**: Inner components that can be divided into many pages should have `data-printer-divisible` attribute. Rare use of this attribute can cause overflowed content and weird behaviour.

<br>

---

<br>

### Pagination

Component for marking which page is it. Configured by Document.

**_NOTE_**: This component should be placed in your footer.

<br>

---

<br>

### usePrinter

Printer hook

```typescript
const { isPrinter, subscribe } = usePrinter();
```

| Name      | Desc                                                       | Type                        |
| --------- | ---------------------------------------------------------- | --------------------------- |
| isPrinter | Value indicating if it component inside Document component | boolean                     |
| subscribe | Function subscribing loading content                       | (key: string) => () => void |

`subscribe` function is useful when you are fetching some data from backend and don't want to print your document immediately

```tsx
const MyComponent = () => {
  const [data, setData] = useState([]);
  const [run, setRun] = useState<() => void>();
  const { subscribe } = usePrinter();

  useEffect(() => {
    setRun(() => subscribe('my-unique-key'));

    const newData = fetchData();
    setData(newData);
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    run?.();
  }, [data, run]);

  return (
    <>
      {data.map((elem) => (
        <div key={elem.id}>{elem.value}</div>
      ))}
    </>
  );
};
```

**_NOTE_**: Running `subscribe` function outside Document throws an error.
**_NOTE_**: Using `subscribe` function makes sense only when `isAsync` flag is set to `true`.

<br>

## Development

```bash
# building
$ npm run build

# building in watch mode
$ npm run build:watch
```
