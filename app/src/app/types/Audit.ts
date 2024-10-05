export interface Audit {
  id: string;
  owner: string;
  bounty_id: string;
  title: string;
  content: string;
  severity: string;
  len: number;
  votes: number;
  time_issued: number;
  has_poa: boolean;
  total_score: number;
}
