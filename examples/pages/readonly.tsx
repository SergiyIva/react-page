import Editor, { ValueWithLegacy } from '@react-page/editor';
import React from 'react';
import { cellPlugins } from '../plugins/cellPlugins';
import pako from 'pako';

export const getServerSideProps = async () => {
  const response = await fetch(
    'http://localhost:3333/admin/api/resources/Page/records/7/show',
    {
      method: 'GET',
      headers: {
        'x-api-key': 'test',
      },
    }
  );
  const data = await response.json();
  const uint = new Uint8Array(
    data.record.params.content.split(',').map(Number)
  );
  const str = new TextDecoder().decode(pako.ungzip(uint));

  return { props: { content: JSON.parse(str) } };
};

export default function ReadOnly({ content }: { content: ValueWithLegacy }) {
  return (
    <>
      <Editor cellPlugins={cellPlugins} value={content} lang="en" readOnly />
    </>
  );
}
