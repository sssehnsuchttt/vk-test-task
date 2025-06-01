import React, { useMemo } from 'react';
import {
  useInfiniteQuery,
  type QueryFunctionContext,
} from '@tanstack/react-query';
import { getData } from '../features/api';
import type { DataPage, MetaSchema } from '../features/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useInView } from 'react-intersection-observer';

const PAGE_SIZE = 50;

type RowProps<MS extends MetaSchema> = {
  record: Record<keyof MS, unknown>;
  columns: Array<keyof MS>;
};

function Row<MS extends MetaSchema>({ record, columns }: RowProps<MS>) {
  return (
    <TableRow className="min-h-9">
      {columns.map((colKey) => (
        <TableCell key={`${String(record.id)}-${String(colKey)}`}>
          {record[colKey] !== "" ? (record[colKey] as React.ReactNode) : "—" }
        </TableCell>
      ))}
    </TableRow>
  );
}
const MemoizedRow = React.memo(Row) as typeof Row;

export function DynamicTable<
  TData extends Record<string, unknown>,
  MS extends MetaSchema
>({ metaData }: { metaData: MS }) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<DataPage<TData>>({
    queryKey: ['data'],
    queryFn: ({ pageParam = 1 }: QueryFunctionContext) =>
      getData<TData>(pageParam as number, PAGE_SIZE),
    getNextPageParam: (lastPage) => lastPage.next,
    initialPageParam: 1,
  });

  const { ref } = useInView({
    threshold: 0.1,
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  const columns = useMemo(
    () => Object.keys(metaData) as Array<keyof MS>,
    [metaData]
  );

  const records = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );

  if (!data) return null;

  return (
    <ScrollArea className="h-full w-full rounded-md border overflow-visible">
      <Table>
        <TableHeader className="bg-muted sticky top-0 z-10">
          <TableRow>
            {columns.map((key) => (
              <TableHead key={String(key)} className="text-muted-foreground">
                {metaData[key].label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {records.map((record) => (
            <MemoizedRow
              key={String(record.id)}
              record={record as Record<keyof MS, unknown>}
              columns={columns}
            />
          ))}

          {/* ловим нижний край для загрузки новой страницы */}
          <TableRow ref={ref} />

          {/* скелет */}
          {isFetchingNextPage &&
            Array.from({ length: PAGE_SIZE }).map((_, idx) => (
              <TableRow key={`skeleton-${idx}`} className="h-9 animate-pulse">
                {columns.map((_, cidx) => (
                  <TableCell key={cidx}>
                    <div className="w-full h-3 bg-muted rounded-md" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
