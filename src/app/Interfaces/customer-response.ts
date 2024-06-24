import { Customer } from './customer';
import { PaginationInfo } from './pagination-info';

export interface CustomerResponse {
  data: Customer[];
  message: string;
  succeeded: boolean;
  errors: any;
  paginationInfo: PaginationInfo;
}
