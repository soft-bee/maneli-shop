import { FC, ReactNode } from 'react';

type TableCellProps = {
  head?: boolean;
  colSpan?: number;
  children?: ReactNode;
};

export const TableCell: FC<TableCellProps> = ({ head, colSpan, children }) => {
  if (head) {
    return (
      <th colSpan={colSpan} className="p-2 text-center ">
        {children}
      </th>
    );
  } else {
    return (
      <td colSpan={colSpan} className="p-2 text-center max-w-[100px] overflow-hidden text-ellipsis">
        {children}
      </td>
    );
  }
};
