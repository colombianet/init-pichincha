export interface Book {
  id?:           string;
  title:        string;
  author:       string;
  resume:       string;
  image:        string;
  url:          string;
  userRegister: string;
  category:     number[];
  public:       boolean;
  isbn13:       number;
  price:        string;
  categoriesSelectedAllData: AllData[]
}

export interface AllData {
  id:          number;
  description: string;
}

