import {
  DropdownMenu as ShadcnDropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { ChevronDown } from 'lucide-react';

const radioItemClassName =
  'focus:bg-secondary focus:text-[#F1F2F9] data-[state=checked]:bg-secondary data-[state=checked]:text-[#F1F2F9] py-2';

type Option = {
  value: string;
  label: string;
};

type Props = {
  label: string;
  options: Option[];
  value: string;
  onValueChange: (value: string) => void;
  triggerClassName?: string;
  contentClassName?: string;
};

const DropDownMenu: React.FC<Props> = ({
  label,
  options,
  value,
  onValueChange,
  triggerClassName,
  contentClassName,
}) => {
  const selectedLabel =
    options.find((option) => option.value === value)?.label || value;

  return (
    <div>
      <div className="text-dark text-xs mb-1">{label}</div>
      <ShadcnDropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={`bg-secondary justify-between px-3 py-5 ${triggerClassName}`}
          >
            <span className="capitalize">{selectedLabel}</span>
            <ChevronDown size={16} className="text-dark" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={`bg-[#0f1121] border-[#434554] text-dark p-0 ${contentClassName}`}
        >
          <DropdownMenuRadioGroup value={value} onValueChange={onValueChange}>
            {options.map((option) => (
              <DropdownMenuRadioItem
                key={option.value}
                value={option.value}
                className={radioItemClassName}
              >
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </ShadcnDropdownMenu>
    </div>
  );
};

export default DropDownMenu;
