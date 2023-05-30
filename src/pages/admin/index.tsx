import { useState } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { IconButton } from '@/legos/Button/IconButton';
import { getToken } from 'next-auth/jwt';
import { GetServerSideProps } from 'next/types';
import Image from 'next/legacy/image';
import Link from 'next/link';

import { AddProductForm } from '@/components';
import { Icon, Plus, Table, TableBody, TableCell, TableHead, TableRow } from '@/legos';
import { ProductsDocument, useProductsQuery } from '@/graphql/queries/__generated__/products';
import { useDeleteProductMutation } from '@/graphql/mutations/__generated__/deleteProduct';
import { Scalars } from '@/__generated__/types';

const columns = ['ID', 'Фото', 'Назва', 'Ціна, грн.', 'Знижка, %', ''];

export default function AdminPage() {
  const [isOpen, setIsOpen] = useState(false);

  const [start, setStart] = useState(0);
  const [limit, setLimit] = useState(5);

  const { data } = useProductsQuery({
    variables: {
      start,
      limit,
    },
  });
  const [deleteProductMutation] = useDeleteProductMutation();

  const toggleAddProductForm = () => {
    setIsOpen(open => !open);
  };

  const handleDeleteProduct = (id: Scalars['ID']) => {
    const confirmed = confirm(`Ви справді хочете видалити цей продукт? ID продукту: ${id}`);

    if (confirmed) {
      deleteProductMutation({
        variables: { id },
        refetchQueries: [ProductsDocument],
        update: cache => {
          cache.evict({ fieldName: 'products' });
          cache.gc();
        },
      }).then(() => setStart(0));
    }
  };

  const handlePreviousPage = () => {
    const previousPageStart = Math.max(start - limit, 0);
    setStart(previousPageStart);
  };

  const handleNextPage = () => {
    const nextPageStart = start + limit;
    setStart(nextPageStart);
  };

  return (
    <AdminLayout>
      <section className="flex flex-col justify-between gap-8 h-full">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center gap-5">
            <h1 className="font-bold text-3xl">Продукти</h1>
            <button
              onClick={toggleAddProductForm}
              className="flex items-center gap-3 rounded-full border border-[#7613B5] font-semibold mt-2 p-4"
            >
              <Plus />
              <span className="hidden sm:block">Додати новий продукт</span>
            </button>
          </div>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map(col => (
                  <TableCell key={col} head>
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.products?.data.length ? (
                data?.products?.data.map(({ id, attributes }) => (
                  <TableRow key={id}>
                    <TableCell>{id}</TableCell>
                    <TableCell>
                      {attributes?.imagePreview?.data ? (
                        <Image
                          width={60}
                          height={60}
                          objectFit="cover"
                          alt="Product photo"
                          className="rounded-full overflow-hidden"
                          src={
                            process.env.BASE_URL +
                            attributes?.imagePreview?.data?.attributes?.formats.thumbnail.url
                          }
                        />
                      ) : (
                        <Link
                          href={`admin/product/${id}`}
                          className="inline-flex justify-center items-center border w-[60px] h-[60px] rounded-full transition-all duration-150 hover:border-violet-500"
                          title="Додати фото"
                        >
                          <Icon icon="Plus" />
                        </Link>
                      )}
                    </TableCell>
                    <TableCell>{attributes?.title}</TableCell>
                    <TableCell>{attributes?.price}</TableCell>
                    <TableCell>{attributes?.discount}</TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-around">
                        <Link href={`admin/product/${id}`}>
                          <IconButton
                            icon="Edit"
                            className="flex justify-center items-center w-10 h-10 transition-all duration-100 hover:text-purple-700"
                          />
                        </Link>
                        <IconButton
                          icon="Delete"
                          className="flex justify-center items-center w-10 h-10 transition-all duration-100 hover:text-red-500"
                          onClick={() => handleDeleteProduct(id ?? '')}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length}>Немає жодного продукта</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-row justify-between items-center">
          <p>
            Cторінка: {data?.products?.meta.pagination.page}/
            {data?.products?.meta.pagination.pageCount}
          </p>
          <p>Закальна кількість продуктів: {data?.products?.meta.pagination.total}</p>
          <div className="flex gap-3">
            <IconButton
              icon="ArrowCircleLeft"
              onClick={handlePreviousPage}
              disabled={data?.products?.meta.pagination.page === 1}
              className={data?.products?.meta.pagination.page === 1 ? 'opacity-20' : ''}
            />
            <IconButton
              icon="ArrowCircleRight"
              onClick={handleNextPage}
              disabled={
                data?.products?.meta.pagination.page === data?.products?.meta.pagination.pageCount
              }
              className={
                data?.products?.meta.pagination.page === data?.products?.meta.pagination.pageCount
                  ? 'opacity-20'
                  : ''
              }
            />
          </div>
        </div>
      </section>

      <AddProductForm isOpen={isOpen} toggleForm={toggleAddProductForm} />
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};