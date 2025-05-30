import { useQuery } from "@tanstack/react-query";
import { getData } from "../features/api";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"


export function DynamicTable({ metaData }: any) {
  const { data, isLoading } = useQuery({
    queryKey: ["data", 1, 50],
    queryFn: getData,
    placeholderData: (prev) => prev
  });

  const entries = Object.entries(metaData);

  
  if (data)
    return (
      <ScrollArea className="h-full w-full rounded-md border overflow-visible">
      <Table>
        
        <TableHeader className="bg-muted sticky top-0 z-10">
          <TableRow>
            {entries.map((item, index) => (
              <TableHead key={index} className="text-muted-foreground">
                {item[1].label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((item, index) => (
            <TableRow key={index} className="min-h-9">
              {
                Object.entries(item).map((cell, cellIndex) => (
                  <TableCell key={cellIndex}>{cell[1]}</TableCell>  
                ))
              }
                          
            </TableRow>
          ))}
          {data.data.map((item, index) => (
            <TableRow key={index} className="h-9">
              {
                Object.entries(item).map((_, cellIndex) => (
                  <TableCell key={cellIndex}><div className="w-full h-3 bg-muted rounded-md animate-pulse"></div></TableCell>  
                ))
              }
                          
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
      </ScrollArea>
    );
}
