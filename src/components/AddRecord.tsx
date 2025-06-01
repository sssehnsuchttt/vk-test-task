import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, type ZodTypeAny } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import type { MetaSchema } from "@/features/types";
import { Badge } from "@/components/ui/badge";
import { createRecord } from "@/features/api";
import { toast } from "sonner";

const zodSchema = (meta: MetaSchema) =>
  z.object(
    Object.fromEntries(
      Object.entries(meta).map(([key, def]) => {
        let base = z.string();

        if (def.pattern) base = base.regex(new RegExp(def.pattern));
        if (def.minLength) base = base.min(def.minLength);
        if (def.maxLength) base = base.max(def.maxLength);

        const field: ZodTypeAny = def.required ? base.min(1) : base;

        return [key, field];
      })
    )
  );

export function AddRecord({ meta }: { meta: MetaSchema }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const schema = useMemo(() => zodSchema(meta), [meta]);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: Object.fromEntries(
      Object.keys(meta).map((k) => [k, ""])
    ) as Record<string, string>,
  });

  const mutation = useMutation({
    mutationFn: createRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["data"] });
      form.reset();
      setOpen(false);
      toast.success("Добавлена новая запись");
    },
  });

  /* read-only поля в форму не выводим */
  const editableEntries = useMemo(
    () => Object.entries(meta).filter(([, def]) => !def.readOnly),
    [meta]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Добавить запись</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[1024px] sm:w-[calc(100%-3rem)] max-w-full sm:max-h-10/12 h-full sm:h-fit flex flex-col rounded-none sm:rounded-lg border-none sm:border-solid">
        <DialogHeader className="text-left">
          <DialogTitle>Добавить запись</DialogTitle>
          <DialogDescription>Заполните обязательные поля</DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-hidden">
          <Form {...form}>
            <form className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              {editableEntries.map(([key, def]) => (
                <FormField
                  key={key}
                  control={form.control}
                  name={key}
                  render={({ field }) => (
                    <FormItem className="last:col-span-full">
                      <FormLabel>
                        {def.label}
                        {def.required && (
                          <Badge variant="destructive">Обязательное</Badge>
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input placeholder={def.label} {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </form>
          </Form>
        </ScrollArea>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Отмена</Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={mutation.isPending}
            onClick={form.handleSubmit((vals) => {
              const cleaned = Object.fromEntries(
                Object.entries(vals).filter(([key]) => !meta[key]?.readOnly)
              );
              mutation.mutate(cleaned);
            })}
          >
            Добавить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
