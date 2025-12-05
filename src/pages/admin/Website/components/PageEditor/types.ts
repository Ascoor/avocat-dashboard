export interface BlockFormValue {
  id?: string;
  key: string;
  type: string | null;
  value_en: string;
  value_ar: string;
}

export interface PageFormValues {
  title_en: string;
  title_ar: string;
  blocks: BlockFormValue[];
}
