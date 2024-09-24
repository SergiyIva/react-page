import Editor, { ValueWithLegacy } from '@react-page/editor';
import React from 'react';
import { cellPlugins } from '../../plugins/cellPlugins';
import { decompress } from '../../utils/compressor';
import { GetServerSidePropsContext } from 'next';

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const path = context.query.page ?? 'index';
  const response = await fetch(
    `http://localhost:3333/admin/api/resources/Page/actions/search/${path}`,
    {
      method: 'GET',
      headers: {
        'x-api-key': 'test',
      },
    }
  );
  const data = await response.json();
  if (!data.records[0])
    return {
      notFound: true,
    };

  const content = decompress(data.records[0].params.content);

  return { props: { content } };
};

export default function Page({ content }: { content: ValueWithLegacy }) {
  return (
    <>
      <Editor cellPlugins={cellPlugins} value={content} lang="en" readOnly />
    </>
  );
}
