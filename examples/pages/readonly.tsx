import Editor, { ValueWithLegacy } from '@react-page/editor';
import React from 'react';
import { cellPlugins } from '../plugins/cellPlugins';
import { decompress } from '../utils/compressor';

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
  const content = decompress(data.record.params.content);

  return { props: { content } };
};

export default function ReadOnly({ content }: { content: ValueWithLegacy }) {
  return (
    <>
      <Editor cellPlugins={cellPlugins} value={content} lang="en" readOnly />
    </>
  );
}
