import { Button } from "./components/ui/button";
import { Card, CardHeader, CardContent } from "./components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getMeta } from "./features/api";
import { DynamicTable } from "./components/DynamicTable";
import { AddRecord } from "./components/AddRecord";
import type { MetaSchema } from "./features/types";

function App() {
  const { data } = useQuery<MetaSchema>({
    queryKey: ["meta"],
    queryFn: getMeta
  })

  if (data)
    return (
    <div className="w-svw h-svh flex p-6 items-center justify-center">
      <Card className="w-full max-h-[2000px] max-w-[1920px] h-full">
        <CardHeader className="flex justify-between">
          <h1 className="font-semibold">Тестовое задание</h1>
          <AddRecord meta={data}/>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <DynamicTable metaData={data}/>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
