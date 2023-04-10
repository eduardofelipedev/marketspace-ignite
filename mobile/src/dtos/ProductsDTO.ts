export type ProductsDTO = {
    accept_trade: boolean;
    description: string;
    id: string;
    is_new: boolean;
    is_active: boolean;
    name: string;
    payment_methods: [
      {
        key: string;
        name: string;
      }
    ],
    price: number;
    product_images: [
        {
            id: string;
            path: string;
        }
    ];
    user: {
      avatar: string,
      name: string,
      tel: string
    }
  
}



