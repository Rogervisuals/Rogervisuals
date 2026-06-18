export interface Client {
  id: string;
  name: string;
  /** Replace with `/public/logos/red-bull.svg` etc. when assets are ready */
  logo?: string;
}

export const clients: Client[] = [
  { id: "red-bull", name: "Red Bull" },
  { id: "van-mossel", name: "Van Mossel" },
  { id: "sandro-silva", name: "Sandro Silva" },
  { id: "kai-vertigoh", name: "Kai Vertigoh" },
  { id: "dji", name: "DJI" },
];
