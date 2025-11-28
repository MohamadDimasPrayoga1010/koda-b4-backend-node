import prisma from "../src/libs/prisma.js";

async function main() {
  console.log('Start seeding...');

  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Favorite Product' } }),
    prisma.category.create({ data: { name: 'Coffee' } }),
    prisma.category.create({ data: { name: 'Non Coffe' } }),
    prisma.category.create({ data: { name: 'Foods' } }),
    prisma.category.create({ data: { name: 'Add-on' } }),
  ]);

  const variants = await Promise.all([
    prisma.variant.create({ data: { name: 'Ice', additional_price: 7000 } }),
    prisma.variant.create({ data: { name: 'Hot', additional_price: 0 } }),
    prisma.variant.create({ data: { name: 'Food', additional_price: 0 } }),
  ]);

  const sizes = await Promise.all([
    prisma.size.create({ data: { name: 'R', additional_price: 0 } }),
    prisma.size.create({ data: { name: 'L', additional_price: 5000 } }),
    prisma.size.create({ data: { name: 'XL', additional_price: 10000 } }),
    prisma.size.create({ data: { name: '250 gr', additional_price: 50000 } }),
    prisma.size.create({ data: { name: '500 gr', additional_price: 75000 } }),
  ]);

  const productsData = [
    { title: 'Espresso Shot', description: 'Strong and concentrated espresso, perfect to energize your day', base_price: 15000, category_id: 1, stock: 40, is_favorite: true, rating: 4.3 },
    { title: 'Caramel Macchiato', description: 'Espresso with steamed milk, topped with caramel drizzle', base_price: 35000, category_id: 1, stock: 25, is_favorite: false, rating: 4.7 },
    { title: 'Mocha Coffee', description: 'Rich espresso blended with chocolate and milk', base_price: 30000, category_id: 1, stock: 20, is_favorite: true, rating: 4.5 },
    { title: 'Iced Coffee Blend', description: 'Iced coffee blended with ice and milk for a smooth taste', base_price: 35000, category_id: 1, stock: 25, is_favorite: false, rating: 4.2 },
    { title: 'Vanilla Latte', description: 'Espresso with steamed milk and vanilla syrup', base_price: 30000, category_id: 1, stock: 20, is_favorite: true, rating: 4.8 },
    { title: 'Iced Americano', description: 'Cold espresso diluted with water for a refreshing taste', base_price: 25000, category_id: 1, stock: 30, is_favorite: false, rating: 4.4 },
    { title: 'Affogato', description: 'Vanilla ice cream topped with hot espresso', base_price: 35000, category_id: 1, stock: 15, is_favorite: true, rating: 4.6 },
    { title: 'Avocado Coffee', description: 'Unique coffee with creamy avocado blended in', base_price: 35000, category_id: 1, stock: 15, is_favorite: false, rating: 4.9 },
    { title: 'Iced Coffee with Milk', description: 'Smooth iced coffee blended with fresh milk, lightly sweetened', base_price: 25000, category_id: 2, stock: 50, is_favorite: true, rating: 4.1 },
    { title: 'Traditional Black Coffee', description: 'Authentic Indonesian coffee brewed strong and bold, served hot', base_price: 20000, category_id: 2, stock: 40, is_favorite: false, rating: 4.5 },
    { title: 'Cappuccino', description: 'Espresso topped with rich frothed milk and a hint of cocoa', base_price: 30000, category_id: 2, stock: 30, is_favorite: true, rating: 4.2 },
    { title: 'Latte', description: 'Creamy espresso latte with silky steamed milk', base_price: 30000, category_id: 2, stock: 25, is_favorite: false, rating: 4.7 },
    { title: 'Matcha Latte', description: 'Smooth green tea latte made from premium matcha powder', base_price: 30000, category_id: 2, stock: 20, is_favorite: true, rating: 4.3 },
    { title: 'Milo Dinosaur', description: 'Iced Milo drink with extra Milo powder on top', base_price: 25000, category_id: 2, stock: 20, is_favorite: false, rating: 4.6 },
    { title: 'Civet Coffee', description: 'Premium Indonesian Luwak coffee, rich and aromatic', base_price: 100000, category_id: 2, stock: 10, is_favorite: true, rating: 4.9 },
    { title: 'Iced Coffee with Jelly', description: 'Iced coffee served with sweet coffee jelly', base_price: 30000, category_id: 2, stock: 20, is_favorite: false, rating: 4.4 },
    { title: 'Iced Sweet Tea', description: 'Refreshing iced tea lightly sweetened for a cool thirst-quencher', base_price: 15000, category_id: 3, stock: 40, is_favorite: true, rating: 4.5 },
    { title: 'Hot Tea', description: 'Premium hot tea brewed to perfection', base_price: 12000, category_id: 3, stock: 50, is_favorite: false, rating: 4.8 },
    { title: 'Chocolate Milk', description: 'Rich chocolate blended with fresh cold milk', base_price: 20000, category_id: 3, stock: 30, is_favorite: true, rating: 4.2 },
    { title: 'Vanilla Milkshake', description: 'Creamy vanilla milkshake topped with whipped cream', base_price: 25000, category_id: 3, stock: 25, is_favorite: false, rating: 4.5 },
    { title: 'Banana Smoothie', description: 'Fresh bananas blended with milk for a naturally sweet drink', base_price: 25000, category_id: 3, stock: 30, is_favorite: true, rating: 4.3 },
    { title: 'Fresh Mango Juice', description: 'Pure mango juice made from ripe, sweet mangoes', base_price: 20000, category_id: 3, stock: 25, is_favorite: false, rating: 4.8 },
    { title: 'Honey Lemon Drink', description: 'Refreshing lemon drink sweetened with natural honey', base_price: 20000, category_id: 3, stock: 25, is_favorite: true, rating: 4.4 },
    { title: 'Iced Orange Juice', description: 'Freshly squeezed orange juice served over ice', base_price: 18000, category_id: 3, stock: 35, is_favorite: false, rating: 4.7 },
    { title: 'Oreo Milkshake', description: 'Chocolate milkshake blended with Oreo cookies', base_price: 30000, category_id: 3, stock: 20, is_favorite: true, rating: 4.5 },
    { title: 'Iced Chocolate', description: 'Cold chocolate drink with milk and chocolate syrup', base_price: 25000, category_id: 3, stock: 30, is_favorite: false, rating: 4.9 },
    { title: 'Pulled Tea', description: 'Traditional Malaysian pulled tea with creamy froth', base_price: 22000, category_id: 3, stock: 30, is_favorite: true, rating: 4.3 },
    { title: 'Grilled Chicken Sandwich', description: 'Toasted sandwich with grilled chicken, fresh lettuce, and mayo', base_price: 35000, category_id: 4, stock: 20, is_favorite: false, rating: 4.6 },
    { title: 'Beef Burger', description: 'Juicy beef patty with fresh vegetables, cheese, and sauce', base_price: 45000, category_id: 4, stock: 20, is_favorite: true, rating: 4.9 },
    { title: 'French Fries', description: 'Crispy golden fries, lightly salted', base_price: 20000, category_id: 4, stock: 50, is_favorite: false, rating: 4.2 },
    { title: 'Cinnamon Roll', description: 'Soft pastry rolled with cinnamon and sugar, drizzled with icing', base_price: 15000, category_id: 4, stock: 30, is_favorite: true, rating: 4.5 },
    { title: 'Cheesecake', description: 'Creamy baked cheesecake with a buttery crust', base_price: 25000, category_id: 4, stock: 15, is_favorite: false, rating: 4.3 },
    { title: 'Butter Croissant', description: 'Flaky and buttery croissant, perfect for breakfast', base_price: 20000, category_id: 4, stock: 30, is_favorite: true, rating: 4.8 },
    { title: 'Egg Tart', description: 'Sweet egg custard in a flaky pastry shell', base_price: 15000, category_id: 4, stock: 25, is_favorite: false, rating: 4.4 },
    { title: 'Glazed Donut', description: 'Soft donut coated with sweet sugar glaze', base_price: 12000, category_id: 4, stock: 40, is_favorite: true, rating: 4.7 },
    { title: 'Spicy Chicken Wings', description: 'Crispy chicken wings tossed in spicy sauce', base_price: 40000, category_id: 4, stock: 20, is_favorite: false, rating: 4.5 },
    { title: 'Tuna Sandwich', description: 'Fresh tuna salad with vegetables in toasted bread', base_price: 35000, category_id: 4, stock: 25, is_favorite: true, rating: 4.9 },
    { title: 'Soup of the Day', description: 'Chef\'s special soup, freshly made daily', base_price: 30000, category_id: 4, stock: 15, is_favorite: false, rating: 4.4 },
    { title: 'Chocolate Brownies', description: 'Rich chocolate brownies, soft and fudgy', base_price: 20000, category_id: 4, stock: 25, is_favorite: true, rating: 4.6 },
    { title: 'Mixed Fruit Salad', description: 'Fresh seasonal fruits served in a light syrup', base_price: 25000, category_id: 4, stock: 20, is_favorite: false, rating: 4.8 },
    { title: 'Extra Espresso Shot', description: 'Add an extra shot of strong espresso to your drink', base_price: 10000, category_id: 5, stock: 50, is_favorite: true, rating: 4.6 },
    { title: 'Whipped Cream Topping', description: 'Light and fluffy whipped cream topping', base_price: 5000, category_id: 5, stock: 50, is_favorite: false, rating: 4.2 },
    { title: 'Caramel Syrup', description: 'Sweet caramel syrup to enhance your drink', base_price: 5000, category_id: 5, stock: 50, is_favorite: true, rating: 4.8 },
    { title: 'Vanilla Syrup', description: 'Smooth vanilla syrup to add flavor', base_price: 5000, category_id: 5, stock: 50, is_favorite: false, rating: 4.5 },
    { title: 'Chocolate Syrup', description: 'Rich chocolate syrup to top your drink', base_price: 5000, category_id: 5, stock: 50, is_favorite: true, rating: 4.7 },
    { title: 'Extra Ice', description: 'Add extra ice cubes to your drink', base_price: 2000, category_id: 5, stock: 100, is_favorite: false, rating: 4.3 },
    { title: 'Brown Sugar Boba', description: 'Chewy brown sugar boba pearls for your drink', base_price: 20000, category_id: 5, stock: 30, is_favorite: true, rating: 4.9 },
    { title: 'Cheese Topping', description: 'Add creamy cheese topping', base_price: 20000, category_id: 5, stock: 30, is_favorite: false, rating: 4.4 },
    { title: 'Hazelnut Syrup', description: 'Add hazelnut flavor syrup to your drink', base_price: 20000, category_id: 5, stock: 50, is_favorite: true, rating: 4.6 },
    { title: 'Chocolate Chips', description: 'Add chocolate chips for extra sweetness', base_price: 21000, category_id: 5, stock: 50, is_favorite: false, rating: 4.8 },
  ];

  const products = [];
  for (const productData of productsData) {
    const product = await prisma.product.create({ data: productData });
    products.push(product);
  }

  const productImagesData = [
    { product_id: 1, image: 'https://images.unsplash.com/photo-1646257861487-60fa89bef25f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fEVzcHJlc3NvJTIwU2hvdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 1, image: 'https://images.unsplash.com/photo-1601390483714-955fd3066695?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8RXNwcmVzc28lMjBTaG90fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500' },
    { product_id: 1, image: 'https://images.unsplash.com/photo-1705952285570-113e76f63fb0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8RXNwcmVzc28lMjBTaG90fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500' },
    { product_id: 1, image: 'https://cdn.pixabay.com/photo/2020/09/13/04/13/coffee-5567269_1280.jpg' }, 
    { product_id: 2, image: 'https://cdn.pixabay.com/photo/2016/11/02/05/17/coffee-1790576_640.jpg' },
    { product_id: 2, image: 'https://images.unsplash.com/photo-1570517130750-10c67ffdde09?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Q2FyYW1lbCUyME1hY2NoaWF0b3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 2, image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Q2FyYW1lbCUyME1hY2NoaWF0b3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 2, image: 'https://images.unsplash.com/photo-1579888071069-c107a6f79d82?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Q2FyYW1lbCUyME1hY2NoaWF0b3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 3, image: 'https://cdn.pixabay.com/photo/2020/03/07/05/18/coffee-4908764_640.jpg' },
    { product_id: 3, image: 'https://cdn.pixabay.com/photo/2023/08/07/03/59/coffee-8174279_640.jpg' },
    { product_id: 3, image: 'https://cdn.pixabay.com/photo/2016/08/09/13/21/coffee-1580595_640.jpg' },
    { product_id: 3, image: 'https://cdn.pixabay.com/photo/2017/03/17/10/29/coffee-2151200_640.jpg' },
    { product_id: 4, image: 'https://cdn.pixabay.com/photo/2021/12/17/09/13/iced-coffee-6876063_640.jpg' },
    { product_id: 4, image: 'https://cdn.pixabay.com/photo/2018/10/19/16/45/coffee-3759003_640.jpg' },
    { product_id: 4, image: 'https://cdn.pixabay.com/photo/2020/09/07/13/41/cappuccino-5551909_640.jpg' },
    { product_id: 4, image: 'https://cdn.pixabay.com/photo/2023/01/28/11/58/iced-coffee-7750749_640.jpg' },
    { product_id: 5, image: 'https://images.unsplash.com/photo-1504194472231-5a5294eddc43?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8VmFuaWxsYSUyMExhdHRlfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500' },
    { product_id: 5, image: 'https://images.unsplash.com/photo-1504194472231-5a5294eddc43?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8VmFuaWxsYSUyMExhdHRlfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500' },
    { product_id: 6, image: 'https://cdn.pixabay.com/photo/2020/05/28/21/25/coffee-5232766_640.jpg' },
    { product_id: 6, image: 'https://cdn.pixabay.com/photo/2022/04/05/07/46/iced-coffee-7113044_640.jpg' },
    { product_id: 6, image: 'https://cdn.pixabay.com/photo/2021/08/24/04/52/coffee-6569483_640.jpg' },
    { product_id: 6, image: 'https://cdn.pixabay.com/photo/2019/04/14/17/09/americano-4127162_640.jpg' },
    { product_id: 7, image: 'https://cdn.pixabay.com/photo/2015/02/04/09/06/affogato-623516_640.jpg' },
    { product_id: 7, image: 'https://cdn.pixabay.com/photo/2017/08/05/17/02/espresso-2584668_640.jpg' },
    { product_id: 8, image: 'https://www.nescafe.com/id/sites/default/files/2025-08/Hero%20banner%20desktop.jpg' },
    { product_id: 9, image: 'https://images.unsplash.com/photo-1721466810960-e6a5b252d9a4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8SWNlZCUyMENvZmZlZSUyMHdpdGglMjBNaWxrfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500' },
    { product_id: 9, image: 'https://images.unsplash.com/photo-1629688825560-917b9727c15b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8SWNlZCUyMENvZmZlZSUyMHdpdGglMjBNaWxrfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500' },
    { product_id: 9, image: 'https://images.unsplash.com/photo-1709689242523-c6d8027c7499?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8SWNlZCUyMENvZmZlZSUyMHdpdGglMjBNaWxrfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500' },
    { product_id: 9, image: 'https://images.unsplash.com/photo-1586551199331-91872af420c9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8SWNlZCUyMENvZmZlZSUyMHdpdGglMjBNaWxrfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500' },
    { product_id: 10, image: 'https://cdn.pixabay.com/photo/2017/10/27/11/19/coffee-2893970_640.jpg' },
    { product_id: 10, image: 'https://cdn.pixabay.com/photo/2015/01/03/22/03/cup-of-coffee-587873_640.jpg' },
    { product_id: 10, image: 'https://images.unsplash.com/photo-1642257980462-f720b2c01346?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dHJhZGl0aW9uYWwlMjBibGFjayUyMGNvZmZlZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 10, image: 'https://images.unsplash.com/photo-1677327109315-04debf6c5f21?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dHJhZGl0aW9uYWwlMjBibGFjayUyMGNvZmZlZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 11, image: 'https://images.unsplash.com/photo-1534687941688-651ccaafbff8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fENhcHB1Y2Npbm98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 11, image: 'https://images.unsplash.com/photo-1503240778100-fd245e17a273?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fENhcHB1Y2Npbm98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 11, image: 'https://images.unsplash.com/photo-1529892485617-25f63cd7b1e9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fENhcHB1Y2Npbm98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 11, image: 'https://images.unsplash.com/photo-1486122151631-4b5aaa3ac70d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fENhcHB1Y2Npbm98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500' },   
    { product_id: 12, image: 'https://cdn.pixabay.com/photo/2015/06/11/07/31/latte-805538_640.jpg' },
    { product_id: 12, image: 'https://cdn.pixabay.com/photo/2021/01/31/06/36/coffee-5965985_640.jpg' },
    { product_id: 12, image: 'https://images.unsplash.com/photo-1550948309-0d8983dbdcc3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGxhdHRlfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500' },
    { product_id: 12, image: 'https://images.unsplash.com/photo-1585671582673-66144d229f22?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGxhdHRlfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500' },
    { product_id: 13, image: 'https://images.unsplash.com/photo-1582785513054-8d1bf9d69c1a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TWF0Y2hhJTIwTGF0dGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 13, image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8TWF0Y2hhJTIwTGF0dGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 13, image: 'https://images.unsplash.com/photo-1749280447307-31a68eb38673?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8TWF0Y2hhJTIwTGF0dGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 13, image: 'https://images.unsplash.com/photo-1727850005779-1e24cac382d4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fE1hdGNoYSUyMExhdHRlfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500' },
    { product_id: 14, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYpVbR5Su5bzZeDE2o2KMUzESvQqoTIt-khg&s' },
    { product_id: 14, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQH9bYmAVc4Z42F9Ks0ueLt8LLz_Z6kuy5qg&s' },
    { product_id: 14, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq_E5RjjWXDs9QBDrLO02pV1A_aE1FQLeSYw&s' },
    { product_id: 14, image: 'https://images.unsplash.com/photo-1595326202845-d11d23db401b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8TWlsb3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 15, image: 'https://images.unsplash.com/photo-1597983187002-35a3e1c896d6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fENpdmV0JTIwQ29mZmVlfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500' },
    { product_id: 15, image: 'https://images.unsplash.com/photo-1545341122-64b73393fa64?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Q2l2ZXQlMjBDb2ZmZWV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 15, image: 'https://cdn.pixabay.com/photo/2017/09/04/18/39/coffee-2714970_640.jpg' },
    { product_id: 15, image: 'https://cdn.pixabay.com/photo/2017/03/13/12/34/coffee-2139592_640.jpg' },
    { product_id: 16, image: 'https://images.unsplash.com/photo-1629991964567-3107a9202778?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8SWNlZCUyMENvZmZlZSUyMHdpdGglMjBKZWxseXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 16, image: 'https://images.unsplash.com/photo-1637378591514-67a2419660fe?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fEljZWQlMjBDb2ZmZWUlMjB3aXRoJTIwSmVsbHl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 16, image: 'https://images.unsplash.com/photo-1545136894-70b1ed7cedf6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fEljZWQlMjBDb2ZmZWUlMjB3aXRoJTIwSmVsbHl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 16, image: 'https://images.unsplash.com/photo-1637378367058-968619b1635c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fEljZWQlMjBDb2ZmZWUlMjB3aXRoJTIwSmVsbHl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 17, image: 'https://cdn.pixabay.com/photo/2022/04/11/08/52/iced-tea-7125271_640.jpg' },
    { product_id: 17, image: 'https://cdn.pixabay.com/photo/2022/04/11/08/53/iced-tea-7125274_1280.jpg' },
    { product_id: 17, image: 'https://cdn.pixabay.com/photo/2015/05/03/07/37/tea-750850_640.jpg' },
    { product_id: 17, image: 'https://cdn.pixabay.com/photo/2016/10/09/17/06/ice-lemon-tea-1726270_640.jpg' },
    { product_id: 18, image: 'https://cdn.pixabay.com/photo/2016/10/14/18/21/tee-1740871_640.jpg' },
    { product_id: 18, image: 'https://cdn.pixabay.com/photo/2016/09/21/22/00/tea-1685847_1280.jpg' },
    { product_id: 18, image: 'https://cdn.pixabay.com/photo/2016/12/19/12/08/ginger-1918107_640.jpg' },
    { product_id: 18, image: 'https://cdn.pixabay.com/photo/2017/03/01/05/12/tea-cup-2107599_640.jpg' },
    { product_id: 19, image: 'https://images.unsplash.com/photo-1586195831800-24f14c992cea?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Q2hvY29sYXRlJTIwTWlsa3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 19, image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Q2hvY29sYXRlJTIwTWlsa3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 19, image: 'https://images.unsplash.com/photo-1517578239113-b03992dcdd25?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fENob2NvbGF0ZSUyME1pbGt8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 19, image: 'https://images.unsplash.com/photo-1591864384134-8a21ffb51cb5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fENob2NvbGF0ZSUyME1pbGt8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 20, image: 'https://images.unsplash.com/photo-1740103639723-87c39575b2c1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8VmFuaWxsYSUyME1pbGtzaGFrZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 20, image: 'https://images.unsplash.com/photo-1583152329931-9a3c0c8a91a1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8VmFuaWxsYSUyME1pbGtzaGFrZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 20, image: 'https://images.unsplash.com/photo-1447195047884-0f014b0d9288?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fFZhbmlsbGElMjBNaWxrc2hha2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 20, image: 'https://images.unsplash.com/photo-1755835070338-6049da75951e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8VmFuaWxsYSUyME1pbGtzaGFrZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 21, image: 'https://images.unsplash.com/photo-1685967836529-b0e8d6938227?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8QmFuYW5hJTIwU21vb3RoaWV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 21, image: 'https://images.unsplash.com/photo-1707219811295-0f283760668b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8QmFuYW5hJTIwU21vb3RoaWV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 21, image: 'https://images.unsplash.com/photo-1542444592-e6880e286bb9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8QmFuYW5hJTIwU21vb3RoaWV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 22, image: 'https://cdn.pixabay.com/photo/2018/05/07/11/22/mango-3380631_640.jpg' },
    { product_id: 22, image: 'https://cdn.pixabay.com/photo/2018/05/07/11/22/mango-3380630_640.jpg' },
    { product_id: 22, image: 'https://plus.unsplash.com/premium_photo-1695055513621-0fecc05fbe38?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGZyZXNoJTIwbWFuZ28lMjBqdWljZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 23, image: 'https://cdn.pixabay.com/photo/2021/11/05/14/54/tea-6771589_640.jpg' },
    { product_id: 23, image: 'https://cdn.pixabay.com/photo/2016/11/16/21/35/infused-water-1830120_640.jpg' },
    { product_id: 23, image: 'https://cdn.pixabay.com/photo/2019/12/19/00/21/ginger-4705132_640.jpg' },
    { product_id: 23, image: 'https://cdn.pixabay.com/photo/2021/02/01/11/45/food-5970320_640.jpg' },
    { product_id: 24, image: 'https://cdn.pixabay.com/photo/2023/11/22/20/30/ai-generated-8406387_640.png' },
    { product_id: 24, image: 'https://cdn.pixabay.com/photo/2017/08/05/22/29/wine-2586196_640.jpg' },
    { product_id: 24, image: 'https://cdn.pixabay.com/photo/2024/01/23/09/16/ai-generated-8527256_640.jpg' },
    { product_id: 24, image: 'https://cdn.pixabay.com/photo/2018/05/17/15/33/cocktail-3408834_640.jpg' },
    { product_id: 25, image: 'https://cdn.pixabay.com/photo/2020/03/07/05/18/beverage-4908765_1280.jpg' },
    { product_id: 25, image: 'https://images.unsplash.com/photo-1641665271888-575e46923776?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b3JlbyUyMG1pbGtzaGFrZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 25, image: 'https://images.unsplash.com/photo-1619158401201-8fa932695178?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8b3JlbyUyMG1pbGtzaGFrZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 25, image: 'https://images.unsplash.com/photo-1653852883277-c4b4b9e020e5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8b3JlbyUyMG1pbGtzaGFrZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 26, image: 'https://images.unsplash.com/photo-1515316416554-1af1fbca57a2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8SWNlZCUyMENob2NvbGF0ZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 26, image: 'https://cdn.pixabay.com/photo/2024/08/06/06/52/ai-generated-8948543_640.jpg' },
    { product_id: 27, image: 'https://images.unsplash.com/photo-1539122144704-71b13a5c0fc7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8UHVsbGVkJTIwVGVhfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500' },
    { product_id: 28, image: 'https://images.unsplash.com/photo-1597579018905-8c807adfbed4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8R3JpbGxlZCUyMENoaWNrZW4lMjBTYW5kd2ljaHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 28, image: 'https://images.unsplash.com/photo-1642442928984-b18c2c86b9c2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8R3JpbGxlZCUyMENoaWNrZW4lMjBTYW5kd2ljaHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 28, image: 'https://images.unsplash.com/photo-1757961048411-73703e333d25?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fEdyaWxsZWQlMjBDaGlja2VuJTIwU2FuZHdpY2h8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 28, image: 'https://images.unsplash.com/photo-1728774283140-7b28a5045502?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8R3JpbGxlZCUyMENoaWNrZW4lMjBTYW5kd2ljaHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 29, image: 'https://cdn.pixabay.com/photo/2022/06/14/18/58/beef-burger-7262651_1280.jpg' },
    { product_id: 29, image: 'https://cdn.pixabay.com/photo/2020/01/28/12/52/burger-4799767_640.jpg' },
    { product_id: 29, image: 'https://cdn.pixabay.com/photo/2023/10/25/04/27/burger-8339491_640.jpg' },
    { product_id: 29, image: 'https://cdn.pixabay.com/photo/2022/07/15/18/17/spicy-burger-7323694_640.jpg' },
    { product_id: 30, image: 'https://cdn.pixabay.com/photo/2019/04/13/02/39/potato-chips-4123734_640.jpg' },
    { product_id: 30, image: 'https://cdn.pixabay.com/photo/2017/03/23/04/04/macro-2167281_640.jpg' },
    { product_id: 30, image: 'https://cdn.pixabay.com/photo/2024/01/23/08/11/ai-generated-8527044_640.jpg' },
    { product_id: 30, image: 'https://cdn.pixabay.com/photo/2016/11/20/09/06/bowl-1842294_640.jpg' },
    { product_id: 31, image: 'https://cdn.pixabay.com/photo/2016/05/26/16/27/cinnamon-rolls-1417494_640.jpg' },
    { product_id: 31, image: 'https://cdn.pixabay.com/photo/2023/11/13/13/19/food-8385524_640.jpg' },
    { product_id: 31, image: 'https://cdn.pixabay.com/photo/2022/09/11/21/56/pastries-7448102_640.jpg' },
    { product_id: 31, image: 'https://cdn.pixabay.com/photo/2023/09/09/09/18/cinnamon-rolls-8242739_640.jpg' },
    { product_id: 32, image: 'https://cdn.pixabay.com/photo/2023/03/22/11/08/ai-generated-7869200_640.jpg' },
    { product_id: 32, image: 'https://cdn.pixabay.com/photo/2024/08/29/11/37/ai-generated-9006672_640.jpg' },
    { product_id: 32, image: 'https://cdn.pixabay.com/photo/2015/04/28/14/32/cheesecake-743754_640.jpg' },
    { product_id: 32, image: 'https://cdn.pixabay.com/photo/2017/09/10/11/56/pastries-2735349_640.jpg' },
    { product_id: 33, image: 'https://cdn.pixabay.com/photo/2024/11/15/08/40/ai-generated-9198827_640.jpg' },
    { product_id: 33, image: 'https://cdn.pixabay.com/photo/2022/06/23/14/40/bread-7279975_640.jpg' },
    { product_id: 33, image: 'https://cdn.pixabay.com/photo/2018/09/03/22/43/croissants-3652582_640.jpg' },
    { product_id: 33, image: 'https://cdn.pixabay.com/photo/2020/01/05/07/32/breakfast-4742465_640.jpg' },
    { product_id: 34, image: 'https://cdn.pixabay.com/photo/2017/10/12/17/31/apple-tart-2845186_640.jpg' },
    { product_id: 34, image: 'https://cdn.pixabay.com/photo/2020/06/19/05/17/egg-tart-5315723_640.jpg' },
    { product_id: 34, image: 'https://cdn.pixabay.com/photo/2017/08/22/17/55/egg-tart-2669935_1280.jpg' },
    { product_id: 34, image: 'https://cdn.pixabay.com/photo/2020/03/17/00/39/food-4938704_640.jpg' },
    { product_id: 35, image: 'https://cdn.pixabay.com/photo/2023/08/17/18/16/ai-generated-8197129_640.jpg' },
    { product_id: 35, image: 'https://cdn.pixabay.com/photo/2024/09/06/21/44/ai-generated-9028590_640.jpg' },
    { product_id: 35, image: 'https://cdn.pixabay.com/photo/2023/08/17/19/43/ai-generated-8197292_640.jpg' },
    { product_id: 35, image: 'https://cdn.pixabay.com/photo/2021/03/31/17/44/donut-6140150_640.jpg' },
    { product_id: 36, image: 'https://cdn.pixabay.com/photo/2016/07/31/17/51/chicken-1559548_1280.jpg' },
    { product_id: 36, image: 'https://cdn.pixabay.com/photo/2024/02/02/02/32/ai-generated-8547127_640.jpg' },
    { product_id: 36, image: 'https://cdn.pixabay.com/photo/2019/02/18/03/10/wings-4003652_640.jpg' },
    { product_id: 36, image: 'https://cdn.pixabay.com/photo/2019/10/21/17/12/wings-4566612_640.jpg' },
    { product_id: 37, image: 'https://cdn.pixabay.com/photo/2024/04/29/08/19/ai-generated-8727162_640.jpg' },
    { product_id: 37, image: 'https://cdn.pixabay.com/photo/2016/08/09/11/24/sandwich-1580348_1280.jpg' },
    { product_id: 37, image: 'https://cdn.pixabay.com/photo/2023/05/29/17/01/hamburger-8026582_640.jpg' },
    { product_id: 37, image: 'https://cdn.pixabay.com/photo/2020/06/06/05/31/juicy-sandwich-5265292_640.jpg' },
    { product_id: 38, image: 'https://cdn.pixabay.com/photo/2024/05/03/15/55/zoni-8737326_640.jpg' },
    { product_id: 38, image: 'https://cdn.pixabay.com/photo/2015/05/02/01/04/miso-soup-749368_640.jpg' },
    { product_id: 38, image: 'https://cdn.pixabay.com/photo/2017/10/22/16/04/fish-soup-2878191_640.jpg' },
    { product_id: 38, image: 'https://cdn.pixabay.com/photo/2023/05/27/13/49/soup-8021570_640.jpg' },
    { product_id: 39, image: 'https://cdn.pixabay.com/photo/2018/04/24/20/12/dessert-3347905_640.jpg' },
    { product_id: 39, image: 'https://cdn.pixabay.com/photo/2019/03/18/09/39/brownies-4062740_640.jpg' },
    { product_id: 39, image: 'https://cdn.pixabay.com/photo/2018/09/19/17/54/chocolate-cake-3689092_640.jpg' },
    { product_id: 39, image: 'https://cdn.pixabay.com/photo/2024/02/16/16/48/ai-generated-8577991_640.png' },
    { product_id: 40, image: 'https://cdn.pixabay.com/photo/2017/03/14/19/07/watermelon-2144111_640.jpg' },
    { product_id: 40, image: 'https://cdn.pixabay.com/photo/2024/09/10/12/38/ai-generated-9037066_640.jpg' },
    { product_id: 40, image: 'https://cdn.pixabay.com/photo/2024/02/23/12/02/ai-generated-8591923_640.jpg' },
    { product_id: 40, image: 'https://cdn.pixabay.com/photo/2021/06/13/12/34/fruit-salad-6333173_640.jpg' },
    { product_id: 41, image: 'https://images.unsplash.com/photo-1648867134727-0b868ba73eb4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8RXh0cmElMjBFc3ByZXNzbyUyMFNob3R8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 41, image: 'https://images.unsplash.com/photo-1689164255885-d172a4f5fc4c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8RXh0cmElMjBFc3ByZXNzbyUyMFNob3R8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 42, image: 'https://cdn.pixabay.com/photo/2020/03/07/17/30/cake-4910417_640.jpg' },
    { product_id: 42, image: 'https://cdn.pixabay.com/photo/2017/08/06/04/16/cupcake-2588646_640.jpg' },
    { product_id: 42, image: 'https://cdn.pixabay.com/photo/2015/04/02/10/44/cream-703653_640.jpg' },
    { product_id: 42, image: 'https://cdn.pixabay.com/photo/2017/01/09/11/32/chocolate-hazelnut-1966278_640.jpg' },
    { product_id: 43, image: 'https://cdn.pixabay.com/photo/2018/04/12/09/17/mat-3312885_640.jpg' },
    { product_id: 44, image: 'https://cdn.pixabay.com/photo/2016/11/19/15/29/food-1839858_640.jpg' },
    { product_id: 45, image: 'https://cdn.pixabay.com/photo/2019/02/13/16/28/waffle-3994630_640.jpg' },
    { product_id: 46, image: 'https://images.unsplash.com/photo-1753095290171-c68a203705f7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fEV4dHJhJTIwaWNlfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500' },
    { product_id: 47, image: 'https://cdn.pixabay.com/photo/2019/08/12/20/01/boba-4402053_640.jpg' },
    { product_id: 47, image: 'https://images.unsplash.com/photo-1734770580735-796a00e42cb2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YnJvd24lMjBzdWdhciUyMGJvYmF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 47, image: 'https://images.unsplash.com/photo-1741244133076-afcdda4befae?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YnJvd24lMjBzdWdhciUyMGJvYmF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500' },
    { product_id: 48, image: 'https://cdn.pixabay.com/photo/2016/02/28/21/38/cheese-bread-1227623_640.jpg' },
    { product_id: 49, image: 'https://cdn.pixabay.com/photo/2025/10/26/16/46/pancakes-9918402_640.png' },
    { product_id: 49, image: 'https://cdn.pixabay.com/photo/2017/03/13/13/39/pancakes-2139844_640.jpg' },
    { product_id: 49, image: 'https://cdn.pixabay.com/photo/2017/09/19/08/52/pancake-2764589_640.jpg' },
    { product_id: 49, image: 'https://cdn.pixabay.com/photo/2016/11/29/04/49/blueberries-1867398_640.jpg' },
    { product_id: 50, image: 'https://cdn.pixabay.com/photo/2020/08/06/19/39/cookies-5469009_640.jpg' },
    { product_id: 50, image: 'https://cdn.pixabay.com/photo/2023/11/17/19/07/cookies-8394894_640.jpg' },
    { product_id: 50, image: 'https://cdn.pixabay.com/photo/2017/06/26/18/14/cookie-dough-2444628_640.jpg' },
    { product_id: 50, image: 'https://cdn.pixabay.com/photo/2020/03/04/20/35/cookies-4902717_640.jpg' }
  ];

  for (const imgData of productImagesData) {
    await prisma.productImage.create({
      data: {
        productId: imgData.product_id,
        image: imgData.image
      }
    });
  }
  console.log('Product images seeded successfully');

  const productVariantsData = [
    { product_id: 1, variant_id: 1 }, { product_id: 1, variant_id: 2 },   
    { product_id: 2, variant_id: 1 }, { product_id: 2, variant_id: 2 }, 
    { product_id: 3, variant_id: 1 }, { product_id: 3, variant_id: 2 },   
    { product_id: 4, variant_id: 1 }, { product_id: 4, variant_id: 2 }, 
    { product_id: 5, variant_id: 1 }, { product_id: 5, variant_id: 2 },   
    { product_id: 6, variant_id: 1 }, { product_id: 6, variant_id: 2 },  
    { product_id: 7, variant_id: 1 }, { product_id: 7, variant_id: 2 },   
    { product_id: 8, variant_id: 1 }, { product_id: 8, variant_id: 2 },  
    { product_id: 9, variant_id: 1 }, { product_id: 9, variant_id: 2 },
    { product_id: 10, variant_id: 1 }, { product_id: 10, variant_id: 2 }, 
    { product_id: 11, variant_id: 1 }, { product_id: 11, variant_id: 2 }, 
    { product_id: 12, variant_id: 1 }, { product_id: 12, variant_id: 2 }, 
    { product_id: 13, variant_id: 1 }, { product_id: 13, variant_id: 2 }, 
    { product_id: 14, variant_id: 1 }, { product_id: 14, variant_id: 2 }, 
    { product_id: 15, variant_id: 1 }, { product_id: 15, variant_id: 2 }, 
    { product_id: 16, variant_id: 1 }, { product_id: 16, variant_id: 2 }, 
    { product_id: 17, variant_id: 1 }, { product_id: 17, variant_id: 2 },
    { product_id: 18, variant_id: 1 }, { product_id: 18, variant_id: 2 }, 
    { product_id: 19, variant_id: 1 }, { product_id: 19, variant_id: 2 }, 
    { product_id: 20, variant_id: 1 }, { product_id: 20, variant_id: 2 },
    { product_id: 21, variant_id: 1 }, { product_id: 21, variant_id: 2 },
    { product_id: 22, variant_id: 1 }, { product_id: 22, variant_id: 2 },
    { product_id: 23, variant_id: 1 }, { product_id: 23, variant_id: 2 },
    { product_id: 24, variant_id: 1 }, { product_id: 24, variant_id: 2 },
    { product_id: 25, variant_id: 1 }, { product_id: 25, variant_id: 2 },
    { product_id: 26, variant_id: 1 }, { product_id: 26, variant_id: 2 },
    { product_id: 27, variant_id: 1 }, { product_id: 27, variant_id: 2 }, 
    { product_id: 41, variant_id: 1 }, { product_id: 41, variant_id: 2 },
    { product_id: 42, variant_id: 1 }, { product_id: 42, variant_id: 2 },
    { product_id: 43, variant_id: 1 }, { product_id: 43, variant_id: 2 }, 
    { product_id: 44, variant_id: 1 }, { product_id: 44, variant_id: 2 }, 
    { product_id: 45, variant_id: 1 }, { product_id: 45, variant_id: 2 },
    { product_id: 46, variant_id: 1 }, { product_id: 46, variant_id: 2 }, 
    { product_id: 49, variant_id: 1 }, { product_id: 49, variant_id: 2 },
    { product_id: 50, variant_id: 1 }, { product_id: 50, variant_id: 2 },
    

    { product_id: 28, variant_id: 3 },  
    { product_id: 29, variant_id: 3 },  
    { product_id: 30, variant_id: 3 },  
    { product_id: 31, variant_id: 3 },  
    { product_id: 32, variant_id: 3 },  
    { product_id: 33, variant_id: 3 },  
    { product_id: 34, variant_id: 3 },  
    { product_id: 35, variant_id: 3 },  
    { product_id: 36, variant_id: 3 },  
    { product_id: 37, variant_id: 3 },  
    { product_id: 38, variant_id: 3 },  
    { product_id: 39, variant_id: 3 },  
    { product_id: 40, variant_id: 3 },  
    { product_id: 47, variant_id: 3 },  
    { product_id: 48, variant_id: 3 }   
  ];

  for (const pvData of productVariantsData) {
    await prisma.productVariant.create({
      data: {
        productId: pvData.product_id,
        variantId: pvData.variant_id
      }
    });
  }
  console.log('Product variants seeded successfully');

  const productSizesData = [
    { product_id: 1, size_id: 1 }, { product_id: 1, size_id: 2 }, { product_id: 1, size_id: 3 },
    { product_id: 2, size_id: 1 }, { product_id: 2, size_id: 2 }, { product_id: 2, size_id: 3 },
    { product_id: 3, size_id: 1 }, { product_id: 3, size_id: 2 }, { product_id: 3, size_id: 3 },
    { product_id: 4, size_id: 1 }, { product_id: 4, size_id: 2 }, { product_id: 4, size_id: 3 },
    { product_id: 5, size_id: 1 }, { product_id: 5, size_id: 2 }, { product_id: 5, size_id: 3 },
    { product_id: 6, size_id: 1 }, { product_id: 6, size_id: 2 }, { product_id: 6, size_id: 3 },
    { product_id: 7, size_id: 1 }, { product_id: 7, size_id: 2 }, { product_id: 7, size_id: 3 },
    { product_id: 8, size_id: 1 }, { product_id: 8, size_id: 2 }, { product_id: 8, size_id: 3 },
    { product_id: 9, size_id: 1 }, { product_id: 9, size_id: 2 }, { product_id: 9, size_id: 3 },
    { product_id: 10, size_id: 4 }, { product_id: 10, size_id: 5 },
    { product_id: 11, size_id: 1 }, { product_id: 11, size_id: 2 }, { product_id: 11, size_id: 3 },
    { product_id: 12, size_id: 1 }, { product_id: 12, size_id: 2 }, { product_id: 12, size_id: 3 },
    { product_id: 13, size_id: 1 }, { product_id: 13, size_id: 2 }, { product_id: 13, size_id: 3 },
    { product_id: 14, size_id: 1 }, { product_id: 14, size_id: 2 }, { product_id: 14, size_id: 3 },
    { product_id: 15, size_id: 4 }, { product_id: 15, size_id: 5 },
    { product_id: 16, size_id: 1 }, { product_id: 16, size_id: 2 }, { product_id: 16, size_id: 3 },
    { product_id: 17, size_id: 1 }, { product_id: 17, size_id: 2 }, { product_id: 17, size_id: 3 },
    { product_id: 18, size_id: 1 }, { product_id: 18, size_id: 2 }, { product_id: 18, size_id: 3 },
    { product_id: 19, size_id: 1 }, { product_id: 19, size_id: 2 }, { product_id: 19, size_id: 3 },
    { product_id: 20, size_id: 1 }, { product_id: 20, size_id: 2 }, { product_id: 20, size_id: 3 },
    { product_id: 21, size_id: 1 }, { product_id: 21, size_id: 2 }, { product_id: 21, size_id: 3 },
    { product_id: 22, size_id: 1 }, { product_id: 22, size_id: 2 }, { product_id: 22, size_id: 3 },
    { product_id: 23, size_id: 1 }, { product_id: 23, size_id: 2 }, { product_id: 23, size_id: 3 },
    { product_id: 24, size_id: 1 }, { product_id: 24, size_id: 2 }, { product_id: 24, size_id: 3 },
    { product_id: 25, size_id: 1 }, { product_id: 25, size_id: 2 }, { product_id: 25, size_id: 3 },
    { product_id: 26, size_id: 1 }, { product_id: 26, size_id: 2 }, { product_id: 26, size_id: 3 },
    { product_id: 27, size_id: 1 }, { product_id: 27, size_id: 2 }, { product_id: 27, size_id: 3 }
  ];

  for (const psData of productSizesData) {
    await prisma.productSize.create({
      data: {
        productId: psData.product_id,
        sizeId: psData.size_id
      }
    });
  }
  console.log('Product sizes seeded successfully');

  const productsCategoriesData = [
    { product_id: 1, category_id: 1 }, { product_id: 1, category_id: 2 }, { product_id: 1, category_id: 5 },
    { product_id: 2, category_id: 1 }, { product_id: 2, category_id: 2 },
    { product_id: 3, category_id: 1 }, { product_id: 3, category_id: 2 },
    { product_id: 4, category_id: 1 }, { product_id: 4, category_id: 2 },
    { product_id: 5, category_id: 1 }, { product_id: 5, category_id: 2 },
    { product_id: 6, category_id: 1 }, { product_id: 6, category_id: 2 },
    { product_id: 7, category_id: 1 }, { product_id: 7, category_id: 2 }, { product_id: 7, category_id: 5 },
    { product_id: 8, category_id: 1 }, { product_id: 8, category_id: 2 }, { product_id: 8, category_id: 5 },
    { product_id: 9, category_id: 2 },
    { product_id: 10, category_id: 2 },
    { product_id: 11, category_id: 2 },
    { product_id: 12, category_id: 2 }, { product_id: 12, category_id: 5 },
    { product_id: 13, category_id: 2 }, { product_id: 13, category_id: 3 },
    { product_id: 14, category_id: 3 },
    { product_id: 15, category_id: 2 }, { product_id: 15, category_id: 5 },
    { product_id: 16, category_id: 2 },
    { product_id: 17, category_id: 3 }, { product_id: 17, category_id: 5 },
    { product_id: 18, category_id: 3 },
    { product_id: 19, category_id: 3 }, { product_id: 19, category_id: 5 },
    { product_id: 20, category_id: 3 },
    { product_id: 21, category_id: 3 },
    { product_id: 22, category_id: 3 }, { product_id: 22, category_id: 5 },
    { product_id: 23, category_id: 3 },
    { product_id: 24, category_id: 3 },
    { product_id: 25, category_id: 3 }, { product_id: 25, category_id: 5 },
    { product_id: 26, category_id: 3 },
    { product_id: 27, category_id: 3 }, { product_id: 27, category_id: 5 },
    { product_id: 28, category_id: 4 },
    { product_id: 29, category_id: 4 },
    { product_id: 30, category_id: 4 }, { product_id: 30, category_id: 5 },
    { product_id: 31, category_id: 4 }, { product_id: 31, category_id: 5 },
    { product_id: 32, category_id: 4 }, { product_id: 32, category_id: 5 },
    { product_id: 33, category_id: 4 }, { product_id: 33, category_id: 5 },
    { product_id: 34, category_id: 4 }, { product_id: 34, category_id: 5 },
    { product_id: 35, category_id: 4 },
    { product_id: 36, category_id: 4 }, { product_id: 36, category_id: 5 },
    { product_id: 37, category_id: 4 },
    { product_id: 38, category_id: 4 },
    { product_id: 39, category_id: 4 }, { product_id: 39, category_id: 5 },
    { product_id: 40, category_id: 4 },
    { product_id: 41, category_id: 5 },
    { product_id: 42, category_id: 5 },
    { product_id: 43, category_id: 5 },
    { product_id: 44, category_id: 5 },
    { product_id: 45, category_id: 5 },
    { product_id: 46, category_id: 5 },
    { product_id: 47, category_id: 5 },
    { product_id: 48, category_id: 5 },
    { product_id: 49, category_id: 5 },
    { product_id: 50, category_id: 5 }
  ];

  for (const pcData of productsCategoriesData) {
    await prisma.productCategory.create({
      data: {
        productId: pcData.product_id,
        categoryId: pcData.category_id
      }
    });
  }
  console.log('Products categories seeded successfully');

  const paymentMethods = await Promise.all([
    prisma.paymentMethod.create({ data: { name: 'BRI', image: 'https://cdn3.iconfinder.com/data/icons/banks-in-indonesia-logo-badge/100/BRI-512.png' } }),
    prisma.paymentMethod.create({ data: { name: 'BCA', image: 'https://cdn3.iconfinder.com/data/icons/banks-in-indonesia-logo-badge/100/BCA-512.png' } }),
    prisma.paymentMethod.create({ data: { name: 'MANDIRI', image: 'https://cdn3.iconfinder.com/data/icons/banks-in-indonesia-logo-badge/100/Mandiri-512.png' } }),
    prisma.paymentMethod.create({ data: { name: 'BTN', image: 'https://cdn3.iconfinder.com/data/icons/banks-in-indonesia-logo-badge/100/Bank_BTN-128.png' } }),
    prisma.paymentMethod.create({ data: { name: 'OVO', image: 'https://bloguna.com/wp-content/uploads/2025/06/Logo-OVO-Format-PNG-CDR-EPS-SVG-Kualitas-HD-768x615.png' } }),
    prisma.paymentMethod.create({ data: { name: 'DANA', image: 'https://bloguna.com/wp-content/uploads/2025/05/Logo-DANA-Format-PNG-CDR-AI-EPS-SVG-768x420.png' } }),
    prisma.paymentMethod.create({ data: { name: 'PAYPAL', image: 'https://images.seeklogo.com/logo-png/39/1/paypal-logo-png_seeklogo-390894.png' } })
  ]);
  console.log('Payment methods seeded successfully');

  const statuses = await Promise.all([
    prisma.status.create({ data: { name: 'Done' } }),
    prisma.status.create({ data: { name: 'Pending' } }),
    prisma.status.create({ data: { name: 'OnProgress' } }),
    prisma.status.create({ data: { name: 'Waiting' } })
  ]);
  console.log('Statuses seeded successfully');

  const shippings = await Promise.all([
    prisma.shipping.create({ data: { name: 'DineIn', additional_price: 0 } }),
    prisma.shipping.create({ data: { name: 'DoorDelivery', additional_price: 10000 } }),
    prisma.shipping.create({ data: { name: 'PickUp', additional_price: 0 } })
  ]);
  console.log('Shippings seeded successfully');

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });