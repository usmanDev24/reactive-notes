import { Search } from "lucide-react";
import { InputGroup, InputGroupInput, InputGroupAddon } from "./ui/input-group";

export default function SearchBar() {
  return (
    <InputGroup className="h-9">
      <InputGroupInput className="" placeholder="Search..."/>
        <InputGroupAddon>
          <Search/>
        </InputGroupAddon>
      
    </InputGroup>
  )
}