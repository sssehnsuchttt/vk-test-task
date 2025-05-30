import {
  useInfiniteQuery,
  type QueryFunctionContext,
} from "@tanstack/react-query";
import { getData } from "../features/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useInView } from "react-intersection-observer";
import type { DataPage } from "../features/types";
import { useMemo } from "react";
import React from "react";

const PAGE_SIZE = 50;

//мемоизация строк чтобы не уронить ререндерами производительность
const MemoizedRow = React.memo(function MemoizedRow({
  record,
  columns,
}: {
  record: Record<string, unknown>;
  columns: [string, any][];
}) {
  return (
    <TableRow key={record.id} className="min-h-9">
      {columns.map(([colKey]) => (
        <TableCell key={`${record.id}-${colKey}`}>
          {record[colKey]}
        </TableCell>
      ))}
    </TableRow>
  );
});


export function DynamicTable({ metaData }: any) {
  
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<DataPage<Record<string, unknown>>>({
      queryKey: ["data"],
      queryFn: ({ pageParam = 1 }: QueryFunctionContext) =>
        getData(pageParam as number, PAGE_SIZE),
      getNextPageParam: (lastPage) => lastPage.next,
      initialPageParam: 1,
    });

  const { ref } = useInView({
    threshold: 0.1,
    triggerOnce: false,
    onChange: (inView) => {
       if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
    },
  });

  const columns = useMemo(() => Object.entries(metaData), [metaData]);

  const records = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data]);

  
  if (data)
    return (
      <ScrollArea className="h-full w-full rounded-md border overflow-visible">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            <TableRow>
              {columns.map(([key, { label }]) => (
                <TableHead key={key} className="text-muted-foreground">
                  {label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <MemoizedRow key={record.id} record={record} columns={columns} />
            ))}

            {/* строка для отлавливания прокрутки */}
            <TableRow ref={ref}/>

            {/* скелет */}
            {(isFetchingNextPage) &&
              Array.from({length: PAGE_SIZE}).map((_, index) => (
                <TableRow key={`skeleton-${index}`} className="h-9">
                  {Array.from({length: columns.length}).map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <div className="w-full h-3 bg-muted rounded-md animate-pulse"></div>
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
