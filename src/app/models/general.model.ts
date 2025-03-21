export interface General {
  id: number;
  name: string;
  surname?: string;
}

export interface Priority extends General {
  icon: string;
}

export interface Employee {
  id: number;
  name: string;
  surname: string;
  avatar: string;
  department: General;
}

export interface Dropdown {
  label: string;
  key: string;
  options: General[];
  selected: General[];
  tempSelected: General[];
}
