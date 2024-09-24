/* eslint-disable @typescript-eslint/no-explicit-any */
// The editor core
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import type { RaRecord } from 'ra-core';
import type { CellPlugin } from '@react-page/editor';
import slate, { pluginFactories } from '@react-page/plugins-slate';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import {
  Create,
  Datagrid,
  Edit,
  EditButton,
  List,
  Resource,
  ShowButton,
  SimpleForm,
  TextField,
  TextInput,
} from 'react-admin';
import { cellPlugins } from '../../plugins/cellPlugins';
import { createGenerateClassName, StylesProvider } from '@mui/styles';
import dataProvider from '../../providers/DataProvider';
import {
  RaReactPageInput,
  RaSelectReferenceInputField,
} from '@react-page/react-admin';
import { GetServerSidePropsContext } from 'next';

const generateClassName = createGenerateClassName({
  // By enabling this option, if you have non-MUI elements (e.g. `<div />`)
  // using MUI classes (e.g. `.MuiButton`) they will lose styles.
  // Make sure to convert them to use `styled()` or `<Box />` first.
  disableGlobal: true,
  // Class names will receive this seed to avoid name collisions.
  seed: 'mui-ra',
});

// see https://github.com/marmelab/react-admin/issues/5896
const Admin = dynamic(async () => (await import('react-admin')).Admin, {
  ssr: false,
});

/**
 * This is an example of a slate link plugin that uses react admin to select the target
 */
const PageIdSelector = (props: any) => (
  // pass the props
  <RaSelectReferenceInputField
    {...props}
    optionText="title"
    reference="pages"
    label="Page"
  />
);

const pageLinkPlugin = pluginFactories.createComponentPlugin<{
  pageId: string;
}>({
  icon: <span>Page</span>,
  type: 'pagelink',
  object: 'mark',
  label: 'Page link',
  addHoverButton: true,
  addToolbarButton: true,
  controls: {
    type: 'autoform',
    schema: {
      required: ['pageId'],
      type: 'object',
      properties: {
        pageId: {
          type: 'string',
          uniforms: {
            // you should lazy load this
            component: PageIdSelector,
          },
        },
      },
    },
  },
  // this code here lives primarly in your frontend, you would create the link however you like
  // and you would probably read more data from your datasource
  // this is just a simple example. The link does actually not work in our example, but you should get the idea
  Component: (props) => (
    <Link href={'/pages/' + props.pageId}>
      <a>{props.children}</a>
    </Link>
  ),
});

// let's add a custom slate plugin
const customSlate = slate((def) => ({
  ...def,
  plugins: {
    ...def.plugins,
    link: {
      ...def.plugins.link,
      // pageLink: pageLinkPlugin,
    },
  },
}));

const ProductIdSelector = (props: any) => (
  // pass the props
  <RaSelectReferenceInputField
    {...props}
    optionText="title"
    reference="products"
    label="Product"
  />
);

const ProductTeaser: React.FC<{ productId: string }> = ({ productId }) => {
  // this component would live in your frontend
  // you won't load data from admin here, but from the public frontend api
  // for this example, we use the dataprovider, but in real-live-applications, that would not be the case
  const [product, setProduct] = useState<RaRecord | null>(null);
  useEffect(() => {
    dataProvider
      .getOne('Page', { id: productId })
      .then((r) =>
        setProduct({ ...r.data.record.params, id: r.data.record.params._id })
      );
  }, [productId]);
  return product ? (
    <Card>
      <CardHeader title={product.title} />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {product.content}
        </Typography>
      </CardContent>
    </Card>
  ) : null;
};
const recommendedProducts: CellPlugin<{
  productIds: string[];
  title: string;
}> = {
  id: 'recommendedProducts',
  title: 'Recommended Products',
  Renderer: (props: any) => (
    <div>
      <h3>{props.data.title}</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 10,
        }}
      >
        {props.data.productIds?.map((id: string) => (
          <ProductTeaser productId={id} key={id} />
        ))}
      </div>
    </div>
  ),
  version: 1,
  controls: {
    type: 'autoform',
    columnCount: 1,
    schema: {
      required: ['title', 'productIds'],
      properties: {
        title: {
          type: 'string',
          default: 'Our recommended products',
        },
        productIds: {
          type: 'array',
          items: {
            type: 'string',
            uniforms: {
              component: ProductIdSelector,
            },
          },
        },
      },
    },
  },
};
const ourCellPlugins = [
  // customSlate,
  recommendedProducts,
  ...cellPlugins,
];

const PostList = (props: any) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source="id" />
        <TextField source="title" />
        <EditButton />
        <ShowButton />
      </Datagrid>
    </List>
  );
};

export const PostCreate = (props: any) => (
  <Create title="Create a Post" {...props}>
    <SimpleForm>
      <TextInput source="id" />
      <TextInput source="title" />
    </SimpleForm>
  </Create>
);

const posts = {
  list: PostList,
  create: PostCreate,
  // edit: PostEdit,
};

const PageList = (props: any) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source="id" />
        <TextField source="title" />
        <EditButton />
        <ShowButton />
      </Datagrid>
    </List>
  );
};

export const PageCreate = (props: any) => (
  <Create title="Create a Product" {...props}>
    <SimpleForm>
      <TextInput source="title" />
      <TextInput multiline source="content" />
    </SimpleForm>
  </Create>
);

export const PageEdit = (props: any) => (
  <Edit title="Edit a Post" {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <TextInput source="title" />
      <RaReactPageInput
        source="content"
        label="Content"
        cellPlugins={ourCellPlugins}
      />
    </SimpleForm>
  </Edit>
);

const pages = {
  list: PageList,
  create: PageCreate,
  edit: PageEdit,
};

const CROSS_DOMAIN_SECRET = 'hjkjgFGU7r5d%$7gvfes|ukhsdfuihb8-&RTF_76frffcv';

const encodeAdmin = async (admin: string) => {
  const [pre, post] = CROSS_DOMAIN_SECRET.split('|');
  const stringForSign = `${pre}${admin}${post}`;
  const msgBuffer = new TextEncoder().encode(stringForSign);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

  return Buffer.from(hashBuffer).toString('base64');
};

const decodeAndCheckAdmin = async (token: string) => {
  try {
    const [objString, sign] = Buffer.from(token, 'base64')
      .toString('utf-8')
      .split('|');
    const admin = JSON.parse(objString);
    const signForCheck = await encodeAdmin(objString);
    if (signForCheck === sign) return admin;
  } catch (e) {
    return null;
  }
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  if (!context.req.cookies['constructorPage']) {
    console.log('no cookie');
    const token = context.query.token;
    if (!token)
      return {
        notFound: true,
      };

    const admin = await decodeAndCheckAdmin(token as string);
    if (!admin)
      return {
        notFound: true,
      };

    // context.res.cookies.set('constructorPage', token);
    // context.res.setHeader(
    //   'Set-Cookie',
    //   cookies.set('constructorPage', token as string)
    // );
  }

  return { props: {} };
};

export default function ReactAdminExample() {
  return (
    <StylesProvider generateClassName={generateClassName}>
      <Admin dataProvider={dataProvider} title="Constructor Admin">
        {/*<Resource name="posts" {...posts} />*/}
        <Resource name="Page" {...pages} />
      </Admin>
    </StylesProvider>
  );
}
