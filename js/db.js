export const categories = [
  "Tất cả",
  "Cơm",
  "Phở/Bún",
  "Bánh mì",
  "Gà",
  "Đồ uống",
  "Ăn vặt",
];

const restaurants = [
  {
    id: "com-tam-phuc-loc-tho",
    name: "Cơm tấm Phúc Lộc Thọ",
    area: "Le Van Viet",
    category: "com",
    price_range: { min: 20000, max: 50000 },
    status: "needs_verification",
  },
  {
    id: "com-tam-dem",
    name: "Cơm tấm Đêm",
    area: "Le Van Viet",
    category: "com",
    price_range: { min: 10000, max: 100000 },
    status: "confirmed",
  },
  {
    id: "quan-com-que",
    name: "Quán Cơm Quê",
    area: "Duong Dinh Hoi",
    category: "com",
    price_range: { min: 30000, max: 50000 },
    status: "confirmed",
  },
  {
    id: "com-tam-bun-mam-nem",
    name: "Cơm Tấm & Bún Mắm Nêm",
    area: "La Xuan Oai",
    category: "com",
    price_range: { min: 27000, max: 42000 },
    status: "confirmed",
  },
  {
    id: "mi-cay-naga",
    name: "Mì Cay Naga",
    area: "Han Thuyen",
    category: "pho_bun",
    price_range: { min: 40000, max: 59000 },
    status: "confirmed",
  },
  {
    id: "bun-quay-tam-quan",
    name: "Bún Quậy Tâm Quán",
    area: "Vo Van Ngan",
    category: "pho_bun",
    price_range: { min: 10000, max: 100000 },
    status: "confirmed",
  },
  {
    id: "de-nhat-mi-keo",
    name: "Đệ Nhất Mì Kéo",
    area: "Thong Nhat",
    category: "pho_bun",
    price_range: { min: 35000, max: 80000 },
    status: "confirmed",
  },
  {
    id: "lau-ga-3-vi",
    name: "Lẩu Gà 3 Vị",
    area: "Man Thien",
    category: "pho_bun",
    price_range: { min: 100000, max: 200000 },
    status: "confirmed",
  },
  {
    id: "quynh-bun-dau-mam-tom",
    name: "Quỳnh Bún Đậu Mắm Tôm",
    area: "Dang Van Bi",
    category: "pho_bun",
    price_range: { min: 22000, max: 110000 },
    status: "confirmed",
  },
  {
    id: "bun-bo-gia-han",
    name: "Bún Bò Gia Hân",
    area: "Duong 36",
    category: "pho_bun",
    price_range: { min: 10000, max: 100000 },
    status: "confirmed",
  },
  {
    id: "jollibee-vincom",
    name: "Jollibee Vincom",
    area: "Le Van Viet",
    category: "ga",
    price_range: { min: 30000, max: 179000 },
    status: "confirmed",
  },
  {
    id: "tiem-ga-ran-bum-ggomi",
    name: "Tiệm Gà Rán Bum Ggomi",
    area: "Chu Manh Trinh",
    category: "ga",
    price_range: { min: 100000, max: 200000 },
    status: "confirmed",
  },
  {
    id: "tra-sua-hokkaido",
    name: "Trà Sữa Hokkaido",
    area: "Duong Dinh Hoi",
    category: "do_uong",
    price_range: { min: 32000, max: 48000 },
    status: "confirmed",
  },
  {
    id: "an-vat-nguyen-duy",
    name: "Ăn Vặt Nguyễn Duy",
    area: "Dan Chu",
    category: "an_vat",
    price_range: { min: 5000, max: 45000 },
    status: "confirmed",
  },
  {
    id: "an-vat-ngon-ngon-since-2015",
    name: "Ăn Vặt Ngon Ngon Since 2015",
    area: "Linh Xuan",
    category: "an_vat",
    price_range: { min: 5000, max: 220000 },
    status: "confirmed",
  },
  {
    id: "bo-ne-hem-2",
    name: "Bò Né Hẻm 2",
    area: "171 Ngô Quyền, Tăng Nhơn Phú, TP.HCM",
    category: "banh_mi",
    price_range: { min: 4000, max: 40000 },
    status: "confirmed",
  },
  {
    id: "com-tam-ngo-quyen-thu-duc",
    name: "Cơm tấm Ngô Quyền Thủ Đức",
    area: "Ngô Quyền, TP. Thủ Đức, TP.HCM",
    category: "com",
    price_range: { min: 30000, max: 40000 },
    status: "confirmed",
  },
  {
    id: "hu-tieu-muc-cho-lach",
    name: "Hủ Tiếu Mực Chợ Lách",
    area: "462 Đ. Lê Văn Việt, Tăng Nhơn Phú, TP.HCM",
    category: "pho_bun",
    price_range: { min: 30000, max: 40000 },
    status: "confirmed",
  },
  {
    id: "pho-tuan-ha-noi",
    name: "Phở Tuấn Hà Nội",
    area: "Tăng Nhơn Phú, TP. Thủ Đức, TP.HCM",
    category: "pho_bun",
    price_range: { min: 5000, max: 40000 },
    status: "confirmed",
  },
  {
    id: "neo-coffee-tea",
    name: "NEO Coffee & Tea",
    area: "102 Man Thiện, Tăng Nhơn Phú, TP. Thủ Đức",
    category: "do_uong",
    price_range: { min: 25000, max: 38000 },
    status: "confirmed",
  },
  {
    id: "quan-com-co-thanh",
    name: "Quán Cơm Cô Thanh",
    area: "H3 Man Thiện, Khu phố 1, Tăng Nhơn Phú, TP.HCM",
    category: "com",
    price_range: { min: 25000, max: 30000 },
    status: "confirmed",
  },
];

const categoryMap = {
  com: "Cơm",
  pho_bun: "Phở/Bún",
  ga: "Gà",
  do_uong: "Đồ uống",
  an_vat: "Ăn vặt",
  banh_mi: "Bánh mì",
};

const productImages = [
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=900&q=80",
];

export const products = restaurants.map((restaurant, index) => {
  const category = categoryMap[restaurant.category] || "Cơm";
  const minPrice = Number(restaurant.price_range?.min ?? 20000);
  const maxPrice = Number(restaurant.price_range?.max ?? 50000);
  const price = Math.round((minPrice + maxPrice) / 2);

  // Generate options based on restaurant ID
  let options = [];
  
  if (restaurant.id === "bo-ne-hem-2") {
    options = [
      { id: "bo-ne-1", name: "Bò Né Hẻm 2 - Bò + Trứng + Pate", price: 38000 },
      { id: "banh-mi-chao-1", name: "Bánh mì chảo 1 – Trứng + Pate + Xíu mại + Phô mai", price: 28000 },
      { id: "banh-mi-chao-2", name: "Bánh mì chảo 2 – Trứng + Pate + Xíu mại + Chả lụa + Xúc xích", price: 31000 },
      { id: "banh-mi-chao-3", name: "Bánh mì chảo 3 – Trứng + Pate + Xíu mại + Cá mòi", price: 31000 },
      { id: "banh-mi-chao-4", name: "Bánh mì chảo 4 – Trứng + Pate + Xíu mại + Xúc xích + Cá mòi", price: 35000 },
      { id: "banh-mi-chao-5", name: "Bánh mì chảo 5 – Trứng + Pate + Xíu mại + Chả lụa + Cá mòi", price: 35000 },
      { id: "banh-mi-chao-6", name: "Bánh mì chảo 6 – Trứng + Pate + Xíu mại + Chả lụa + Xúc xích + Phô mai", price: 37000 },
      { id: "banh-mi-chao-7", name: "Bánh mì chảo 7 – Trứng + Pate + Xíu mại + Chả lụa + Xúc xích + Cá mòi", price: 40000 },
      { id: "nuoc-ngot", name: "Nước ngọt", price: 4000 },
      { id: "banh-mi-them", name: "Bánh mì thêm", price: 4000 },
      { id: "trung-them", name: "Trứng thêm", price: 7000 },
      { id: "xiu-mai-them", name: "Xíu mại thêm", price: 7000 },
      { id: "cha-lua-them", name: "Chả lụa thêm", price: 7000 },
      { id: "pho-mai-them", name: "Phô mai thêm", price: 7000 },
      { id: "ca-moi-them", name: "Cá mòi thêm", price: 10000 },
      { id: "xuc-xich-them", name: "Xúc xích thêm", price: 7000 },
    ];
  } else if (restaurant.id === "com-tam-ngo-quyen-thu-duc") {
    options = [
      { id: "com-suon", name: "Cơm sườn", price: 30000 },
      { id: "com-suon-trung", name: "Cơm sườn trứng", price: 35000 },
      { id: "com-suon-cha", name: "Cơm sườn chả", price: 35000 },
      { id: "com-suon-bi", name: "Cơm sườn bì", price: 35000 },
      { id: "com-suon-bi-cha-trung", name: "Cơm sườn bì chả/trứng", price: 40000 },
      { id: "com-ba-roi", name: "Cơm ba rọi", price: 30000 },
      { id: "com-ba-roi-trung", name: "Cơm ba rọi trứng", price: 35000 },
      { id: "com-ba-roi-cha", name: "Cơm ba rọi chả", price: 35000 },
      { id: "com-ba-roi-bi", name: "Cơm ba rọi bì", price: 35000 },
      { id: "com-ba-roi-bi-cha-trung", name: "Cơm ba rọi chả/trứng", price: 40000 },
      { id: "com-xien-que", name: "Cơm xiên que", price: 30000 },
      { id: "com-xien-que-suon", name: "Cơm xiên que sườn", price: 35000 },
      { id: "com-xien-que-cha", name: "Cơm xiên que chả", price: 35000 },
      { id: "com-xien-que-bi", name: "Cơm xiên que bì", price: 35000 },
      { id: "com-xien-que-bi-cha-trung", name: "Cơm xiên que chả/trứng", price: 40000 },
      { id: "com-ga", name: "Cơm gà", price: 30000 },
      { id: "com-ga-trung", name: "Cơm gà trứng", price: 35000 },
      { id: "com-ga-cha", name: "Cơm gà chả", price: 35000 },
      { id: "com-ga-bi", name: "Cơm gà bì", price: 35000 },
      { id: "com-ga-bi-cha-trung", name: "Cơm gà bì chả/trứng", price: 40000 },
    ];
  } else if (restaurant.id === "hu-tieu-muc-cho-lach") {
    options = [
      { id: "hu-tieu-muc", name: "Hủ tiếu mực", price: 40000 },
      { id: "hu-tieu-thai", name: "Hủ tiếu Thái", price: 40000 },
      { id: "banh-canh-muc", name: "Bánh canh mực", price: 40000 },
      { id: "bun-thai-muc", name: "Bún Thái mực", price: 40000 },
      { id: "bun-muc", name: "Bún mực", price: 40000 },
      { id: "bun-rieu-muc", name: "Bún riêu mực", price: 40000 },
      { id: "muc-them", name: "Mực thêm", price: 30000 },
    ];
  } else if (restaurant.id === "pho-tuan-ha-noi") {
    options = [
      { id: "tai-gan", name: "Tái – Gân", price: 25000 },
      { id: "tai-nam-gan", name: "Tái – Nam – Gân", price: 30000 },
      { id: "tai-vien", name: "Tái – Viên", price: 25000 },
      { id: "bo-vien", name: "Bò viên", price: 25000 },
      { id: "pho-ga", name: "Phở gà", price: 25000 },
      { id: "mien-ga", name: "Miến gà", price: 28000 },
      { id: "thap-cam", name: "Thập cẩm", price: 35000 },
      { id: "dac-biet", name: "Đặc biệt", price: 40000 },
      { id: "chen-thit", name: "Chén thịt", price: 20000 },
      { id: "chen-trung", name: "Chén trứng", price: 5000 },
      { id: "chen-tai", name: "Chén tái", price: 25000 },
      { id: "chen-chin", name: "Chén chín", price: 25000 },
      { id: "chen-tai-nam", name: "Chén tái – nam", price: 25000 },
      { id: "chen-tai-nam-gan", name: "Chén tái – nam – gân", price: 30000 },
      { id: "chen-tai-vien", name: "Chén tái – viên", price: 25000 },
      { id: "chen-bo-vien", name: "Bò viên", price: 25000 },
      { id: "chen-thit-2", name: "Chén thịt", price: 20000 },
      { id: "chen-trung-2", name: "Chén trứng", price: 5000 },
      { id: "chen-thit-them", name: "Chén thịt thêm", price: 20000 },
      { id: "chen-trung-them", name: "Chén trứng thêm", price: 5000 },
    ];
  } else if (restaurant.id === "neo-coffee-tea") {
    options = [
      { id: "ca-phe-den-da", name: "Cà phê đen đá", price: 25000 },
      { id: "ca-phe-phin-sua-da", name: "Cà phê phin sữa đá", price: 27000 },
      { id: "bac-xiu", name: "Bạc xỉu", price: 30000 },
      { id: "ca-phe-sua-dua", name: "Cà phê sữa dừa", price: 35000 },
      { id: "ca-phe-phin-kem-trung", name: "Cà phê phin kem trứng", price: 35000 },
      { id: "ca-phe-phin-muoi-hong", name: "Cà phê phin muối hồng", price: 35000 },
      { id: "cafe-dua-kem-khoai-tim", name: "Cafe dừa kem khoai tím", price: 38000 },
      { id: "choco-nguyen-vi", name: "Choco nguyên vị", price: 34000 },
      { id: "choco-latte", name: "Choco latte", price: 35000 },
      { id: "choco-latte-sua-dua", name: "Choco latte sữa dừa", price: 36000 },
      { id: "choco-kem-cheese", name: "Choco kem cheese", price: 36000 },
      { id: "matcha-latte", name: "Matcha latte", price: 35000 },
      { id: "matcha-kem-cheese", name: "Matcha kem cheese", price: 36000 },
      { id: "matcha-dua-kem-khoai-tim", name: "Matcha dừa kem khoai tím", price: 38000 },
      { id: "tra-chanh-vang-mat-ong", name: "Trà chanh vàng mật ong", price: 35000 },
      { id: "tra-chanh-vang-chanh-day", name: "Trà chanh vàng chanh dây", price: 35000 },
      { id: "tra-nhan-thailand", name: "Trà nhãn Thailand", price: 35000 },
      { id: "tra-vai-chanh-vang", name: "Trà vải chanh vàng", price: 36000 },
      { id: "tra-nhan-khuc-bach", name: "Trà nhãn khúc bạch", price: 36000 },
      { id: "tra-vai-khuc-bach", name: "Trà vải khúc bạch", price: 36000 },
      { id: "tra-dao", name: "Trà đào", price: 35000 },
      { id: "tra-thach-xoai", name: "Trà thạch xoài", price: 35000 },
      { id: "tra-thao-moc", name: "Trà thảo mộc", price: 35000 },
      { id: "tra-xoai-chanh-day", name: "Trà xoài chanh dây", price: 36000 },
      { id: "tra-dau-hat-dac", name: "Trà dâu hạt đác", price: 36000 },
      { id: "tra-nho-hat-dac", name: "Trà nho hạt đác", price: 36000 },
      { id: "tra-xa-cam-dao", name: "Trà xạ cam đào", price: 36000 },
      { id: "olong-sua", name: "Olong sữa", price: 32000 },
      { id: "hong-tra-sua", name: "Hồng trà sữa", price: 32000 },
      { id: "olong-lai-sua-nhan-tuoi", name: "Olong lài sữa nhãn tươi", price: 35000 },
      { id: "hong-tra-sua-kem-trung-kem-cheese", name: "Hồng trà sữa kem trứng, kem cheese", price: 36000 },
      { id: "sinh-to-bo-dau-xoai", name: "Sinh tố bơ – dâu – xoài", price: 35000 },
      { id: "bo-sua-dua", name: "Bơ sữa dừa", price: 37000 },
      { id: "yaourt-sua", name: "Yaourt sữa", price: 35000 },
      { id: "yaourt-sua-dau", name: "Yaourt sữa dâu", price: 37000 },
      { id: "yaourt-sua-xoai", name: "Yaourt sữa xoài", price: 37000 },
      { id: "lipton-chanh", name: "Lipton chanh", price: 30000 },
      { id: "gung-mat-ong-nong", name: "Gừng mật ong nóng", price: 36000 },
      { id: "chanh-da", name: "Chanh đá", price: 30000 },
      { id: "chanh-gung-mat-ong", name: "Chanh gừng mật ong", price: 35000 },
      { id: "dua-lanh", name: "Dừa lạnh", price: 35000 },
    ];
  } else if (restaurant.id === "quan-com-co-thanh") {
    options = [
      { id: "com-thit-kho", name: "Cơm thịt kho", price: 25000 },
      { id: "com-suon-2", name: "Cơm sườn", price: 30000 },
      { id: "com-ga-2", name: "Cơm gà", price: 30000 },
    ];
  } else if (restaurant.category === "pho_bun") {
    options = [
      { id: "tho-nuoc-dui", name: "Thòi nước đùi", price: 0 },
      { id: "tho-nuoc-gau", name: "Thòi nước gầu", price: 5000 },
      { id: "tho-nuoc-nam-long", name: "Thòi nước nạm lông", price: 5000 },
      { id: "tho-tai", name: "Thòi tái", price: 0 },
      { id: "tho-nam", name: "Thòi nạm", price: 5000 },
    ];
  } else if (restaurant.category === "com") {
    options = [
      { id: "com-tam-suon", name: "Cơm tấm sườn", price: 0 },
      { id: "com-tam-ga", name: "Cơm tấm gà", price: 5000 },
      { id: "com-tam-ca", name: "Cơm tấm cá", price: 8000 },
      { id: "com-tam-trung", name: "Cơm tấm trứng", price: 3000 },
    ];
  } else if (restaurant.category === "ga") {
    options = [
      { id: "ga-roti", name: "Gà rôti truyền thống", price: 0 },
      { id: "ga-quay", name: "Gà quay mật ong", price: 5000 },
      { id: "ga-hap", name: "Gà hấp gừng", price: 5000 },
      { id: "ga-xoi", name: "Gà xối mỡ", price: 3000 },
    ];
  } else if (restaurant.category === "banh_mi" && restaurant.id !== "bo-ne-hem-2") {
    options = [
      { id: "banh-mi-pate", name: "Bánh mì pâté", price: 0 },
      { id: "banh-mi-thit", name: "Bánh mì thịt", price: 3000 },
      { id: "banh-mi-gan", name: "Bánh mì gan", price: 5000 },
      { id: "banh-mi-dac-biet", name: "Bánh mì đặc biệt", price: 8000 },
    ];
  } else {
    options = [{ id: "mac-dinh", name: "Mặc định", price: 0 }];
  }

  return {
    id: restaurant.id,
    name: restaurant.name,
    description: `${restaurant.name} ở ${restaurant.area} phục vụ món ${category.toLowerCase()} với mức giá phù hợp và phong cách ăn nhanh, tiện lợi cho sinh viên và người làm việc.`,
    price,
    image: productImages[index % productImages.length],
    category,
    rating:
      restaurant.status === "confirmed"
        ? Number((4.6 + (index % 4) * 0.1).toFixed(1))
        : 4.4,
    reviewCount: 30 + index * 18,
    restaurant: restaurant.area,
    preparationTime: 15 + (index % 6) * 5,
    options,
  };
});

const reviewTemplates = [
  "Món ăn rất ngon, đậm vị và giao hàng nhanh.",
  "Hương vị dễ ăn, phần ăn đầy đủ và có chất lượng ổn.",
  "Ngon, tươi và đáng để đặt thêm lần nữa.",
  "Thực đơn sạch sẽ, món còn nóng và phục vụ rất tốt.",
  "Chất lượng tốt, phù hợp khẩu vị và giá hợp lý.",
  "Món ăn thơm ngon, vị vừa miệng và đáng mua.",
  "Dùng rất hài lòng, giao hàng đúng giờ và món ăn tươi.",
  "Vị rất ổn, lần sau sẽ quay lại đặt tiếp.",
  "Phần ăn đầy đặn, hương vị chắc chắn và đáng tin cậy.",
  "Thích vì món ngon, sạch sẽ và đậm chất nhà làm.",
];

const reviewNames = ["An", "Bảo", "Chi", "Duy", "Hà", "Lan", "Minh", "Nhi"];

function buildProductReviews(product, index) {
  const targetRating = Number(product.rating || 4.5);
  const rounded = Math.round(targetRating * 10) / 10;

  const ratingMap = {
    4.4: [4, 4, 5],
    4.5: [4, 5, 5],
    4.6: [5, 4, 5],
    4.7: [5, 5, 4],
    4.8: [5, 5, 5],
    4.9: [5, 5, 5],
    5.0: [5, 5, 5],
    4.3: [4, 4, 4],
  };

  const ratings = ratingMap[rounded] || [4, 5, 4];

  return ratings.map((rating, reviewIndex) => ({
    id: `review-${product.id}-${index + 1}-${reviewIndex + 1}`,
    productId: product.id,
    userName: `${reviewNames[(index + reviewIndex) % reviewNames.length]}`,
    rating,
    comment: reviewTemplates[(index + reviewIndex) % reviewTemplates.length],
    date: new Date(2026, 7, 20 + index + reviewIndex).toISOString().slice(0, 10),
  }));
}

export const reviews = products.flatMap((product, index) =>
  buildProductReviews(product, index),
);
