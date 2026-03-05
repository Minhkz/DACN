export interface CreateModel {
  visible: boolean;
  onCreate: () => void;
  disabled?: boolean;
}
