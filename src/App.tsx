import { Button } from "./components/ui/button";
import { Card, CardHeader, CardContent } from "./components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getMeta } from "./features/api";
import { DynamicTable } from "./components/DynamicTable";
import type { MetaSchema } from "./features/types";

function App() {
  const { data, isLoading } = useQuery<MetaSchema>({
    queryKey: ["meta"],
    queryFn: getMeta
  })

  if (data)
    return (
    <div className="w-svw h-svh flex p-6 items-center justify-center">
      <Card className="w-full max-h-[2000px] max-w-7xl h-full">
        <CardHeader className="flex justify-between">
          <h1 className="font-semibold">Тестовое задание</h1>
          <Button size="sm">Добавить запись</Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <DynamicTable metaData={data}/>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
