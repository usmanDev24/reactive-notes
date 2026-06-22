import { useRouteError } from "react-router";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle, EmptyHeader } from "@/components/ui/empty";
import { WrenchOff } from "lucide-react";
export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant={"icon"}>
          <WrenchOff/>
        </EmptyMedia>
        <EmptyTitle>Error {error.statusText}</EmptyTitle>
        <EmptyDescription>{error.message}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
