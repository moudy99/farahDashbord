import { Owner } from './owner';
import { PaginationInfo } from './pagination-info';

export interface OwnerResponse {
  data: Owner[];
  message: string;
  succeeded: boolean;
  errors: any;
  paginationInfo: PaginationInfo;
}
